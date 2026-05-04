using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.Input;

namespace CropSense.ViewModels;

public sealed class FeaturedCropItem
{
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
	public string Image { get; init; } = "lettuce.png";
	public string BadgeGlyph { get; init; } = "🌱";
}

public sealed class CropHeroActionItem
{
	public string IconGlyph { get; init; } = string.Empty;
	public string ActionId { get; init; } = string.Empty;
}

public sealed class CameraCardItem
{
	public string Title { get; init; } = string.Empty;
	public string Image { get; init; } = "lettuce.png";
}

public sealed partial class CropViewViewModel : BaseViewModel
{
	public FeaturedCropItem Featured { get; }

	public ObservableCollection<CropHeroActionItem> HeroActions { get; } = new();

	public ObservableCollection<CameraCardItem> CameraCards { get; } = new();

	public CropViewViewModel()
	{
		Title = "Crop View";

		Featured = new FeaturedCropItem
		{
			Title = "Tomato — Field A",
			Subtitle = "Last seen today · Green Valley Farm",
			Image = "lettuce.png",
			BadgeGlyph = "🌱"
		};

		HeroActions.Add(new CropHeroActionItem { IconGlyph = "📤", ActionId = "share" });
		HeroActions.Add(new CropHeroActionItem { IconGlyph = "🌙", ActionId = "night" });
		HeroActions.Add(new CropHeroActionItem { IconGlyph = "✓", ActionId = "status" });
		HeroActions.Add(new CropHeroActionItem { IconGlyph = "💡", ActionId = "light" });
		HeroActions.Add(new CropHeroActionItem { IconGlyph = "📶", ActionId = "signal" });

		CameraCards.Add(new CameraCardItem { Title = "North bed", Image = "lettuce.png" });
		CameraCards.Add(new CameraCardItem { Title = "South row", Image = "monitorplant.png" });
		CameraCards.Add(new CameraCardItem { Title = "Greenhouse", Image = "lettuce.png" });
		CameraCards.Add(new CameraCardItem { Title = "Irrigation cam", Image = "lettuce.png" });
	}

	[RelayCommand]
	private async Task GoBackAsync()
	{
		await Shell.Current.GoToAsync("//home");
	}

	[RelayCommand]
	private Task ExpandHeroAsync()
	{
		return Task.CompletedTask;
	}

	[RelayCommand]
	private Task HeroActionAsync(CropHeroActionItem? item)
	{
		_ = item;
		return Task.CompletedTask;
	}

	[RelayCommand]
	private Task ViewAllCamerasAsync()
	{
		return Task.CompletedTask;
	}

	[RelayCommand]
	private async Task OpenCropCameraAsync()
	{
		await Shell.Current.GoToAsync("crop-camera");
	}

	[RelayCommand]
	private async Task OpenCropMetricsAsync()
	{
		await Shell.Current.GoToAsync("crop-metrics");
	}
}
