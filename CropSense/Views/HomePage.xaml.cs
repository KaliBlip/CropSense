using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace CropSense.Views;

public partial class HomePage : ContentPage
{
	public HomePage()
		: this(ResolveRequired<HomeViewModel>())
	{
	}

	public HomePage(HomeViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}

	private async void OnCropViewsClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("//crop-view");
	}

	private async void OnScanClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("//capture");
	}

	private async void OnDiseaseClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("disease-detail");
	}

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
