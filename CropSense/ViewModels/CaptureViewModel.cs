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
		IsBusy = true;
		try
		{
			LastResult = await _runDiagnosisUseCase.ExecuteAsync(ImagePath);
			_diagnosisSession.LastResult = LastResult;
			await Shell.Current.GoToAsync("//result");
		}
		finally
		{
			IsBusy = false;
		}
	}
}
