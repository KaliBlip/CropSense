using CropSense.Models;

namespace CropSense.UseCases;

public interface IRunDiagnosisUseCase
{
	Task<DetectionResult> ExecuteAsync(string imagePath, CancellationToken cancellationToken = default);
}
