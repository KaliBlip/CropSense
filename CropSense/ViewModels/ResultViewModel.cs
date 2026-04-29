using CommunityToolkit.Mvvm.ComponentModel;
using CropSense.Services;
using CropSense.State;

namespace CropSense.ViewModels;

public sealed partial class ResultViewModel : BaseViewModel
{
	private readonly ITreatmentRecommendationService _recommendationService;
	private readonly DiagnosisSession _diagnosisSession;

	[ObservableProperty]
	private string predictionLabel = "No prediction yet";

	[ObservableProperty]
	private string treatmentRecommendation = "Capture an image to see recommendations.";

	[ObservableProperty]
	private string confidence = "Confidence: --";

	[ObservableProperty]
	private string severity = "Severity: --";

	public ResultViewModel(
		ITreatmentRecommendationService recommendationService,
		DiagnosisSession diagnosisSession)
	{
		_recommendationService = recommendationService;
		_diagnosisSession = diagnosisSession;
		Title = "Result";
	}

	public void RefreshFromSession()
	{
		if (_diagnosisSession.LastResult is null)
		{
			PredictionLabel = "No prediction yet";
			TreatmentRecommendation = "Capture an image to see recommendations.";
			Confidence = "Confidence: --";
			Severity = "Severity: --";
			return;
		}

		PredictionLabel = _diagnosisSession.LastResult.Label;
		TreatmentRecommendation = _recommendationService.GetRecommendation(PredictionLabel);
		Confidence = $"Confidence: {_diagnosisSession.LastResult.Confidence:P0}";
		Severity = $"Severity: {_diagnosisSession.LastResult.Severity}";
	}
}
