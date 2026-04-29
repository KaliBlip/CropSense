namespace CropSense.Views;

public partial class CropViewPage : ContentPage
{
	public CropViewPage()
	{
		InitializeComponent();
	}

	private async void OnOpenCropCameraClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("crop-camera");
	}

	private async void OnOpenCropMetricsClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("crop-metrics");
	}
}
