using CropSense.Contracts;
using CropSense.Models;

namespace CropSense.UseCases;

public sealed class RunDiagnosisUseCase : IRunDiagnosisUseCase
{
	private readonly IInferenceEngine _inferenceEngine;

	public RunDiagnosisUseCase(IInferenceEngine inferenceEngine)
	{
		_inferenceEngine = inferenceEngine;
	}

	public Task<DetectionResult> ExecuteAsync(string imagePath, CancellationToken cancellationToken = default)
	{
		return _inferenceEngine.PredictAsync(imagePath, cancellationToken);
	}
}
