using CommunityToolkit.Maui.Core;
using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Maui.Media;

namespace CropSense.Views;

public partial class CapturePage : ContentPage
{
	private IReadOnlyList<CameraInfo>? _availableCameras;
	private CancellationTokenSource? _captureCts;
	private CancellationTokenSource? _previewCts;
	private bool _isCameraPreviewRunning;
	private bool _isCapturing;
	private bool _isPickingGalleryImage;
	private IDispatcherTimer? _scanTimer;
	private double _scanVelocity = 2.8;
	private EventHandler? _scanTickHandler;

	public CapturePage()
		: this(ResolveRequired<CaptureViewModel>())
	{
	}

	public CapturePage(CaptureViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}

	protected override async void OnAppearing()
	{
		base.OnAppearing();

		try
		{
			Camera.MediaCaptured -= OnMediaCaptured;
			Camera.MediaCaptured += OnMediaCaptured;
			Camera.MediaCaptureFailed -= OnMediaCaptureFailed;
			Camera.MediaCaptureFailed += OnMediaCaptureFailed;

			var cameraStatus = await Permissions.RequestAsync<Permissions.Camera>();
			if (cameraStatus != PermissionStatus.Granted)
			{
				await DisplayAlertAsync("Camera", "Camera permission is required to scan crop leaves.", "OK");
				return;
			}

			var previewReady = await InitializeCameraPreviewAsync();
			if (!previewReady)
			{
				await DisplayAlertAsync("Camera", "Unable to start camera preview.", "OK");
				return;
			}

			StartScanAnimation();
		}
		catch (Exception ex)
		{
			await DisplayAlertAsync("Camera", ex.Message, "OK");
		}
	}

	protected override async void OnDisappearing()
	{
		base.OnDisappearing();
		try
		{
			StopScanAnimation();
			Camera.MediaCaptured -= OnMediaCaptured;
			Camera.MediaCaptureFailed -= OnMediaCaptureFailed;
			await StopCameraPreviewSafeAsync();
		}
		catch
		{
			// Avoid teardown exceptions crashing navigation on platform-specific handler disposal.
		}
	}

	private void StartScanAnimation()
	{
		StopScanAnimation();
		ScanBar.TranslationY = -110;
		_scanVelocity = 2.8;
		_scanTickHandler ??= OnScanTick;
		_scanTimer = Dispatcher.CreateTimer();
		_scanTimer.Interval = TimeSpan.FromMilliseconds(16);
		_scanTimer.Tick += _scanTickHandler;
		_scanTimer.Start();
	}

	private void OnScanTick(object? sender, EventArgs e)
	{
		ScanBar.TranslationY += _scanVelocity;
		if (ScanBar.TranslationY > 110)
			_scanVelocity = -Math.Abs(_scanVelocity);
		if (ScanBar.TranslationY < -110)
			_scanVelocity = Math.Abs(_scanVelocity);
	}

	private void StopScanAnimation()
	{
		if (_scanTimer is not null && _scanTickHandler is not null)
			_scanTimer.Tick -= _scanTickHandler;
		_scanTimer?.Stop();
		_scanTimer = null;
	}

	private async void OnMediaCaptured(object? sender, MediaCapturedEventArgs e)
	{
		try
		{
			var path = Path.Combine(FileSystem.CacheDirectory, $"capture_{Guid.NewGuid():N}.jpg");
			using (e.Media)
			{
				await using var fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.Read);
				await e.Media.CopyToAsync(fs);
				await fs.FlushAsync();
			}

			await MainThread.InvokeOnMainThreadAsync(() =>
			{
				GalleryThumbnail.Source = ImageSource.FromFile(path);
			});

			if (BindingContext is CaptureViewModel vm)
				await vm.AnalyzeImageAtAsync(path);
		}
		catch (Exception ex)
		{
			await MainThread.InvokeOnMainThreadAsync(async () =>
				await DisplayAlertAsync("Capture", ex.Message, "OK"));
		}
	}

	private async void OnMediaCaptureFailed(object? sender, MediaCaptureFailedEventArgs e)
	{
		await MainThread.InvokeOnMainThreadAsync(async () =>
			await DisplayAlertAsync("Capture", e.FailureReason ?? "Capture failed.", "OK"));
	}

	private async void OnShutterClicked(object? sender, EventArgs e)
	{
		if (_isCapturing)
			return;

		try
		{
			_isCapturing = true;

			var previewReady = _isCameraPreviewRunning || await InitializeCameraPreviewAsync();
			if (!previewReady)
			{
				await DisplayAlertAsync("Camera", "Camera is not ready yet. Please try again.", "OK");
				return;
			}

			_captureCts?.Cancel();
			_captureCts?.Dispose();
			_captureCts = new CancellationTokenSource(TimeSpan.FromSeconds(12));
			await Camera.CaptureImage(_captureCts.Token);
		}
		catch (OperationCanceledException)
		{
			// ignored
		}
		catch (Exception ex)
		{
			await DisplayAlertAsync("Capture", ex.Message, "OK");
		}
		finally
		{
			_isCapturing = false;
		}
	}

	private async void OnGalleryClicked(object? sender, EventArgs e)
	{
		if (_isPickingGalleryImage)
			return;

		try
		{
			_isPickingGalleryImage = true;
			var hasPermission = await EnsureGalleryPermissionAsync();
			if (!hasPermission)
			{
				await DisplayAlertAsync("Gallery", "Photo access permission is required.", "OK");
				return;
			}

			var photo = await MediaPicker.Default.PickPhotoAsync(new MediaPickerOptions
			{
				Title = "Choose a leaf photo"
			});

			if (photo is null)
				return;

			var path = await ResolvePickedPhotoPathAsync(photo);
			if (string.IsNullOrEmpty(path))
				return;

			GalleryThumbnail.Source = ImageSource.FromFile(path);

			if (BindingContext is CaptureViewModel vm)
				await vm.AnalyzeImageAtAsync(path);
		}
		catch (FeatureNotSupportedException)
		{
			await DisplayAlertAsync("Gallery", "Photo picking is not supported on this device.", "OK");
		}
		catch (PermissionException)
		{
			await DisplayAlertAsync("Gallery", "Photo access permission is required.", "OK");
		}
		catch (Exception ex)
		{
			await DisplayAlertAsync("Gallery", ex.Message, "OK");
		}
		finally
		{
			_isPickingGalleryImage = false;
		}
	}

	private async void OnSwitchCameraClicked(object? sender, EventArgs e)
	{
		try
		{
			var cameras = (await Camera.GetAvailableCameras(CancellationToken.None)).ToList();
			_availableCameras = cameras;
			if (cameras.Count < 2)
				return;

			var current = Camera.SelectedCamera;
			var currentIndex = current is null ? -1 : cameras.IndexOf(current);

			// Some platforms return a new CameraInfo instance each query, so IndexOf can fail.
			if (currentIndex < 0 && current is not null && current.Position != CameraPosition.Unknown)
				currentIndex = cameras.FindIndex(c => c.Position == current.Position);

			var nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % cameras.Count;

			// Prefer true front/rear flips when the current position is known.
			if (current is not null && current.Position != CameraPosition.Unknown)
			{
				var oppositeIndex = cameras.FindIndex(c => c.Position != CameraPosition.Unknown && c.Position != current.Position);
				if (oppositeIndex >= 0)
					nextIndex = oppositeIndex;
			}

			Camera.SelectedCamera = cameras[nextIndex];
			await RestartCameraPreviewAsync();
		}
		catch (Exception ex)
		{
			await DisplayAlertAsync("Camera", ex.Message, "OK");
		}
	}

	private async void OnBackClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("//home");
	}

	private static async Task<string> ResolvePickedPhotoPathAsync(FileResult photo)
	{
		if (!string.IsNullOrEmpty(photo.FullPath) && File.Exists(photo.FullPath))
			return photo.FullPath;

		var path = Path.Combine(FileSystem.CacheDirectory, $"picked_{Guid.NewGuid():N}.jpg");
		await using var read = await photo.OpenReadAsync();
		await using var write = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.Read);
		await read.CopyToAsync(write);
		await write.FlushAsync();
		return path;
	}

	private static async Task<bool> EnsureGalleryPermissionAsync()
	{
		if (DeviceInfo.Platform == DevicePlatform.iOS || DeviceInfo.Platform == DevicePlatform.MacCatalyst)
		{
			var status = await Permissions.CheckStatusAsync<Permissions.Photos>();
			if (status != PermissionStatus.Granted)
				status = await Permissions.RequestAsync<Permissions.Photos>();
			return status == PermissionStatus.Granted || status == PermissionStatus.Limited;
		}

		if (DeviceInfo.Platform == DevicePlatform.Android)
		{
			var storageStatus = await Permissions.CheckStatusAsync<Permissions.StorageRead>();
			if (storageStatus != PermissionStatus.Granted)
				storageStatus = await Permissions.RequestAsync<Permissions.StorageRead>();
			return storageStatus == PermissionStatus.Granted;
		}

		return true;
	}

	private async Task<bool> EnsureCameraReadyAsync()
	{
		var hasHandler = await WaitForCameraHandlerAsync();
		if (!hasHandler)
			return false;

		_availableCameras = await Camera.GetAvailableCameras(CancellationToken.None);
		if (_availableCameras.Count == 0)
			return false;

		if (Camera.SelectedCamera is null)
		{
			var preferredRear = _availableCameras.FirstOrDefault(c => c.Position == CameraPosition.Rear);
			Camera.SelectedCamera = preferredRear ?? _availableCameras[0];
		}

		return Camera.SelectedCamera is not null;
	}

	private async Task<bool> InitializeCameraPreviewAsync()
	{
		var hasHandler = await WaitForCameraHandlerAsync();
		if (!hasHandler)
			return false;

		var cameraReady = await EnsureCameraReadyAsync();
		if (!cameraReady)
			return false;

		_previewCts?.Cancel();
		_previewCts?.Dispose();
		_previewCts = new CancellationTokenSource(TimeSpan.FromSeconds(15));

		try
		{
			await Camera.StartCameraPreview(_previewCts.Token);
			_isCameraPreviewRunning = true;
			return true;
		}
		catch (OperationCanceledException)
		{
			_isCameraPreviewRunning = false;
			return false;
		}
		catch
		{
			_isCameraPreviewRunning = false;
			throw;
		}
	}

	private async Task<bool> WaitForCameraHandlerAsync()
	{
		if (Camera.Handler is not null)
			return true;

		for (var i = 0; i < 20; i++)
		{
			await Task.Delay(50);
			if (Camera.Handler is not null)
				return true;
		}

		return false;
	}

	private async Task RestartCameraPreviewAsync()
	{
		await StopCameraPreviewSafeAsync();
		await InitializeCameraPreviewAsync();
	}

	private Task StopCameraPreviewSafeAsync()
	{
		try
		{
			Camera.StopCameraPreview();
		}
		catch
		{
			// Ignore platform-specific stop failures when page is disappearing.
		}

		_previewCts?.Cancel();
		_previewCts?.Dispose();
		_previewCts = null;
		_isCameraPreviewRunning = false;

		return Task.CompletedTask;
	}

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
