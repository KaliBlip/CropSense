using CropSense.Models;

namespace CropSense.State;

public sealed class DiagnosisSession
{
	public DetectionResult? LastResult { get; set; }

	/// <summary>Filesystem path of the last analyzed image (camera/gallery), for result hero UI.</summary>
	public string? LastAnalyzedImagePath { get; set; }
}
