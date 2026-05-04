using CommunityToolkit.Maui.Core;
using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Maui.Media;

namespace CropSense.Views;

public partial class CapturePage : ContentPage
{
	private IReadOnlyList<CameraInfo>? _availableCameras;
	private CancellationTokenSource? _captureCts;
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

		Camera.MediaCaptured -= OnMediaCaptured;
		Camera.MediaCaptured += OnMediaCaptured;
		Camera.MediaCaptureFailed -= OnMediaCaptureFailed;
		Camera.MediaCaptureFailed += OnMediaCaptureFailed;

		var cameraStatus = await Permissions.RequestAsync<Permissions.Camera>();
		if (cameraStatus != PermissionStatus.Granted)
		{
			await DisplayAlert("Camera", "Camera permission is required to scan crop leaves.", "OK");
			return;
		}

		StartScanAnimation();
	}

	protected override void OnDisappearing()
	{
		base.OnDisappearing();
		StopScanAnimation();
		Camera.MediaCaptured -= OnMediaCaptured;
		Camera.MediaCaptureFailed -= OnMediaCaptureFailed;
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
				await DisplayAlert("Capture", ex.Message, "OK"));
		}
	}

	private async void OnMediaCaptureFailed(object? sender, MediaCaptureFailedEventArgs e)
	{
		await MainThread.InvokeOnMainThreadAsync(async () =>
			await DisplayAlert("Capture", e.FailureReason ?? "Capture failed.", "OK"));
	}

	private async void OnShutterClicked(object? sender, EventArgs e)
	{
		try
		{
			_captureCts?.Cancel();
			_captureCts = new CancellationTokenSource(TimeSpan.FromSeconds(12));
			await Camera.CaptureImage(_captureCts.Token);
		}
		catch (OperationCanceledException)
		{
			// ignored
		}
		catch (Exception ex)
		{
			await DisplayAlert("Capture", ex.Message, "OK");
		}
	}

	private async void OnGalleryClicked(object? sender, EventArgs e)
	{
		try
		{
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
		catch (Exception ex)
		{
			await DisplayAlert("Gallery", ex.Message, "OK");
		}
	}

	private async void OnSwitchCameraClicked(object? sender, EventArgs e)
	{
		try
		{
			_availableCameras ??= await Camera.GetAvailableCameras(CancellationToken.None);
			if (_availableCameras.Count < 2)
				return;

			var current = Camera.SelectedCamera;
			CameraInfo? next = null;

			if (current?.Position == CameraPosition.Rear)
				next = _availableCameras.FirstOrDefault(c => c.Position == CameraPosition.Front);
			else if (current?.Position == CameraPosition.Front)
				next = _availableCameras.FirstOrDefault(c => c.Position == CameraPosition.Rear);

			if (next is not null)
			{
				Camera.SelectedCamera = next;
				return;
			}

			var list = _availableCameras.ToList();
			var idx = current is null ? 0 : Math.Max(0, list.IndexOf(current));
			Camera.SelectedCamera = list[(idx + 1) % list.Count];
		}
		catch (Exception ex)
		{
			await DisplayAlert("Camera", ex.Message, "OK");
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

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
