using System.Collections.ObjectModel;
using System.IO;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CropSense.Models;
using CropSense.Services;
using CropSense.State;

namespace CropSense.ViewModels;

public sealed class ResultHeroSlideItem
{
	public ImageSource Photo { get; init; } = null!;
}

public sealed class KeyFactItem
{
	public string Key { get; init; } = string.Empty;
	public string Value { get; init; } = string.Empty;
}

public sealed partial class ResultViewModel : BaseViewModel
{
	private readonly ITreatmentRecommendationService _recommendationService;
	private readonly DiagnosisSession _diagnosisSession;

	[ObservableProperty]
	private string predictionLabel = "Septoria";

	[ObservableProperty]
	private string diseaseSubtitle = "A leaf spot fungus";

	[ObservableProperty]
	private string descriptionBody =
		"Septoria leaf spot is a fungal disease caused by Septoria species. It appears as small, circular to angular spots with dark margins and lighter centers on leaves. Severe infections reduce photosynthesis, cause premature leaf drop, and can weaken plants during fruit or grain fill.";

	[ObservableProperty]
	private string treatmentRecommendation = "Capture an image to see recommendations.";

	[ObservableProperty]
	private string confidence = "Confidence: --";

	[ObservableProperty]
	private string severity = "Severity: --";

	public ObservableCollection<ResultHeroSlideItem> HeroSlides { get; } = new();

	public ObservableCollection<KeyFactItem> KeyFacts { get; } = new();

	public ResultViewModel(
		ITreatmentRecommendationService recommendationService,
		DiagnosisSession diagnosisSession)
	{
		_recommendationService = recommendationService;
		_diagnosisSession = diagnosisSession;
		Title = "Result";
		FillSeptoriaStubContent();
	}

	public void RefreshFromSession()
	{
		if (_diagnosisSession.LastResult is null)
		{
			PredictionLabel = "No prediction yet";
			DiseaseSubtitle = "Capture a leaf image to diagnose.";
			DescriptionBody =
				"Once you scan a crop image, CropSense will show the likely condition, evidence photos, and practical next steps.";
			TreatmentRecommendation = "Capture an image to see recommendations.";
			Confidence = "Confidence: --";
			Severity = "Severity: --";
			RebuildHeroSlides(null);
			KeyFacts.Clear();
			KeyFacts.Add(new KeyFactItem { Key = "Status", Value = "Awaiting diagnosis" });
			return;
		}

		var result = _diagnosisSession.LastResult;
		PredictionLabel = result.Label;
		TreatmentRecommendation = _recommendationService.GetRecommendation(result.Label);
		Confidence = $"Confidence: {result.Confidence:P0}";
		Severity = $"Severity: {result.Severity}";

		RebuildHeroSlides(_diagnosisSession.LastAnalyzedImagePath);

		if (result.Label.Contains("Septoria", StringComparison.OrdinalIgnoreCase))
			FillSeptoriaStubContent();
		else
			FillGenericContent(result);
	}

	private void RebuildHeroSlides(string? lastAnalyzedAbsolutePath)
	{
		HeroSlides.Clear();
		HeroSlides.Add(new ResultHeroSlideItem { Photo = ResolveHeroPhoto(lastAnalyzedAbsolutePath) });
		HeroSlides.Add(new ResultHeroSlideItem { Photo = ImageSource.FromFile("monitorplant.png") });
	}

	private static ImageSource ResolveHeroPhoto(string? absolutePath)
	{
		if (!string.IsNullOrWhiteSpace(absolutePath) && File.Exists(absolutePath))
			return ImageSource.FromFile(absolutePath);
		return ImageSource.FromFile("lettuce.png");
	}

	private void FillSeptoriaStubContent()
	{
		DiseaseSubtitle = "A leaf spot fungus";
		DescriptionBody =
			"Septoria leaf spot is a fungal disease caused by Septoria species. It appears as small, circular to angular spots with dark margins and lighter centers on leaves. Severe infections reduce photosynthesis, cause premature leaf drop, and can weaken plants during fruit or grain fill.";
		KeyFacts.Clear();
		KeyFacts.Add(new KeyFactItem { Key = "Name", Value = "Septoria species" });
		KeyFacts.Add(new KeyFactItem { Key = "Common names", Value = "Leaf spot" });
		KeyFacts.Add(new KeyFactItem { Key = "Typical symptoms", Value = "Tan spots with dark borders on leaves" });
		KeyFacts.Add(new KeyFactItem { Key = "Spread", Value = "Splashing water, wind-driven rain, tools" });
	}

	private void FillGenericContent(DetectionResult result)
	{
		DiseaseSubtitle = "Assessment summary";
		DescriptionBody = TreatmentRecommendation;
		KeyFacts.Clear();
		KeyFacts.Add(new KeyFactItem { Key = "Detected label", Value = result.Label });
		KeyFacts.Add(new KeyFactItem { Key = "Confidence", Value = $"{result.Confidence:P0}" });
		KeyFacts.Add(new KeyFactItem { Key = "Severity", Value = result.Severity });
	}

	[RelayCommand]
	private static async Task GoBackAsync()
	{
		await Shell.Current.GoToAsync("..");
	}

	[RelayCommand]
	private static Task ToggleBookmarkAsync()
	{
		return Task.CompletedTask;
	}

	[RelayCommand]
	private static Task ShareAsync()
	{
		return Task.CompletedTask;
	}
}
