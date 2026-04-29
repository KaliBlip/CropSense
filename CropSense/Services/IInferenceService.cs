using CropSense.Models;

namespace CropSense.Services;

public interface IInferenceService
{
	Task<DetectionResult> PredictAsync(string imagePath, CancellationToken cancellationToken = default);
}
