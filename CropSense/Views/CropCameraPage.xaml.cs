namespace CropSense.Views;

public partial class CropCameraPage : ContentPage
{
	public CropCameraPage()
	{
		InitializeComponent();
	}

	private async void OnViewMetricsClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("crop-metrics");
	}
}
