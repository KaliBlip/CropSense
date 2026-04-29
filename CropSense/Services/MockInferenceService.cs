using CropSense.Models;

namespace CropSense.Services;

public sealed class MockInferenceService : IInferenceService
{
	public Task<DetectionResult> PredictAsync(string imagePath, CancellationToken cancellationToken = default)
	{
		var result = new DetectionResult
		{
			Label = "Maize Leaf Blight",
			Confidence = 0.93,
			Severity = "Warning"
		};

		return Task.FromResult(result);
	}
}
