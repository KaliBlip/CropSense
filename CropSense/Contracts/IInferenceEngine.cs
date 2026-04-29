using CropSense.Models;

namespace CropSense.Contracts;

public interface IInferenceEngine
{
	Task<DetectionResult> PredictAsync(string imagePath, CancellationToken cancellationToken = default);
}
