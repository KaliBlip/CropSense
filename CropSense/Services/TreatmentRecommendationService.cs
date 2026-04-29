namespace CropSense.Services;

public sealed class TreatmentRecommendationService : ITreatmentRecommendationService
{
	public string GetRecommendation(string label)
	{
		return label switch
		{
			"Maize Leaf Blight" => "Remove affected leaves and apply a recommended fungicide early.",
			_ => "Monitor crop daily and consult a local extension officer if symptoms worsen."
		};
	}
}
