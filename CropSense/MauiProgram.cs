using CommunityToolkit.Maui;
using CropSense.Contracts;
using CropSense.Inference;
using CropSense.Services;
using CropSense.State;
using CropSense.UseCases;
using CropSense.ViewModels;
using CropSense.Views;
using Microsoft.Extensions.Logging;

namespace CropSense;

public static class MauiProgram
{
	public static MauiApp CreateMauiApp()
	{
		var builder = MauiApp.CreateBuilder();
		builder
			.UseMauiApp<App>()
			.UseMauiCommunityToolkit()
			.ConfigureFonts(fonts =>
			{
				fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
				fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
			});

		builder.Services.AddSingleton<DiagnosisSession>();
		builder.Services.AddSingleton<IInferenceEngine, TfliteInferenceEngine>();
		builder.Services.AddTransient<IRunDiagnosisUseCase, RunDiagnosisUseCase>();

		builder.Services.AddSingleton<IInferenceService, MockInferenceService>();
		builder.Services.AddSingleton<ITreatmentRecommendationService, TreatmentRecommendationService>();

		builder.Services.AddTransient<HomeViewModel>();
		builder.Services.AddTransient<CaptureViewModel>();
		builder.Services.AddTransient<ResultViewModel>();
		builder.Services.AddTransient<SettingsViewModel>();

		builder.Services.AddTransient<HomePage>();
		builder.Services.AddTransient<CropViewPage>();
		builder.Services.AddTransient<CropCameraPage>();
		builder.Services.AddTransient<CropMetricsPage>();
		builder.Services.AddTransient<CapturePage>();
		builder.Services.AddTransient<ResultPage>();
		builder.Services.AddTransient<TreatmentPage>();
		builder.Services.AddTransient<PreventionPage>();
		builder.Services.AddTransient<SettingsPage>();

#if DEBUG
		builder.Logging.AddDebug();
#endif

		return builder.Build();
	}
}
