using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace CropSense.Views;

public partial class ResultPage : ContentPage
{
	private readonly ResultViewModel _viewModel;

	public ResultPage()
		: this(ResolveRequired<ResultViewModel>())
	{
	}

	public ResultPage(ResultViewModel viewModel)
	{
		InitializeComponent();
		_viewModel = viewModel;
		BindingContext = _viewModel;
	}

	protected override void OnAppearing()
	{
		base.OnAppearing();
		_viewModel.RefreshFromSession();
	}

	private async void OnTreatmentClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("treatment");
	}

	private async void OnPreventionClicked(object? sender, EventArgs e)
	{
		await Shell.Current.GoToAsync("prevention");
	}

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
