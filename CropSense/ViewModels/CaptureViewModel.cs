using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CropSense.Models;
using CropSense.State;
using CropSense.UseCases;

namespace CropSense.ViewModels;

public sealed partial class CaptureViewModel : BaseViewModel
{
	private readonly IRunDiagnosisUseCase _runDiagnosisUseCase;
	private readonly DiagnosisSession _diagnosisSession;

	[ObservableProperty]
	private string imagePath = string.Empty;

	[ObservableProperty]
	private DetectionResult? lastResult;

	public CaptureViewModel(IRunDiagnosisUseCase runDiagnosisUseCase, DiagnosisSession diagnosisSession)
	{
		_runDiagnosisUseCase = runDiagnosisUseCase;
		_diagnosisSession = diagnosisSession;
		Title = "Capture";
	}

	[RelayCommand]
	private async Task RunInferenceAsync()
	{
		await AnalyzeImageAtAsync(ImagePath);
	}

	/// <summary>Runs diagnosis on an absolute file path (camera capture or gallery).</summary>
	public async Task AnalyzeImageAtAsync(string fullPath)
	{
		if (string.IsNullOrWhiteSpace(fullPath))
			return;

		IsBusy = true;
		try
		{
			ImagePath = fullPath;
			LastResult = await _runDiagnosisUseCase.ExecuteAsync(fullPath);
			_diagnosisSession.LastResult = LastResult;
			_diagnosisSession.LastAnalyzedImagePath = fullPath;
			await Shell.Current.GoToAsync("//result");
		}
		finally
		{
			IsBusy = false;
		}
	}
}
