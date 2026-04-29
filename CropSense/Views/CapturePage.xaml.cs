using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace CropSense.Views;

public partial class CapturePage : ContentPage
{
	public CapturePage()
		: this(ResolveRequired<CaptureViewModel>())
	{
	}

	public CapturePage(CaptureViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}

	private async void OnCropCameraClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("crop-camera");
	}

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
