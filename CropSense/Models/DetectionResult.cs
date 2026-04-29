namespace CropSense.Models;

public sealed class DetectionResult
{
	public string Label { get; init; } = string.Empty;
	public double Confidence { get; init; }
	public string Severity { get; init; } = "Unknown";
}
