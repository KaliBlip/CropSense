namespace CropSense.Views;

public partial class CropMetricsPage : ContentPage
{
	public CropMetricsPage()
	{
		InitializeComponent();
	}

	private async void OnBackTapped(object? sender, TappedEventArgs e)
	{
		if (Shell.Current is not null)
		{
			await Shell.Current.GoToAsync("..");
		}
	}
}
