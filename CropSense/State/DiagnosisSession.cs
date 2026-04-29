using CropSense.Models;

namespace CropSense.State;

public sealed class DiagnosisSession
{
	public DetectionResult? LastResult { get; set; }
}
