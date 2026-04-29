using CropSense.Contracts;
using CropSense.Models;

namespace CropSense.Inference;

public sealed class TfliteInferenceEngine : IInferenceEngine
{
	public Task<DetectionResult> PredictAsync(string imagePath, CancellationToken cancellationToken = default)
	{
		// Placeholder scaffold until the TensorFlow Lite runtime is wired in.
		var result = new DetectionResult
		{
			Label = "Maize Leaf Blight",
			Confidence = 0.93,
			Severity = "Warning"
		};

		return Task.FromResult(result);
	}
}
