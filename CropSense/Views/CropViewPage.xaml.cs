using CropSense.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace CropSense.Views;

public partial class CropViewPage : ContentPage
{
	public CropViewPage()
		: this(ResolveRequired<CropViewViewModel>())
	{
	}

	public CropViewPage(CropViewViewModel viewModel)
	{
		InitializeComponent();
		BindingContext = viewModel;
	}

	private static T ResolveRequired<T>() where T : class
	{
		return Application.Current?.Handler?.MauiContext?.Services.GetService<T>()
			?? throw new InvalidOperationException($"Service {typeof(T).Name} is not registered.");
	}
}
