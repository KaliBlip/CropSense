using System.Collections.ObjectModel;

namespace CropSense.ViewModels;

public sealed class HeroSlideItem
{
	public string Title { get; init; } = string.Empty;
	public string Subtitle { get; init; } = string.Empty;
	public string Image { get; init; } = "lettuce.png";
}

public sealed class QuickAccessItem
{
	public string Label { get; init; } = string.Empty;
	/// <summary>Maui image filename (e.g. weather.png). Empty shows <see cref="IconGlyph"/>.</summary>
	public string IconImage { get; init; } = string.Empty;
	public string IconGlyph { get; init; } = string.Empty;
	public bool HasImageIcon => !string.IsNullOrEmpty(IconImage);
}

public sealed class RecommendedItem
{
	public string Title { get; init; } = string.Empty;
	public string Image { get; init; } = "lettuce.png";
}

public sealed partial class HomeViewModel : BaseViewModel
{
	public ObservableCollection<HeroSlideItem> HeroSlides { get; } = new();
	public ObservableCollection<QuickAccessItem> QuickAccessItems { get; } = new();
	public ObservableCollection<RecommendedItem> RecommendedItems { get; } = new();

	public HomeViewModel()
	{
		Title = "CropSense";

		HeroSlides.Add(new HeroSlideItem
		{
			Title = "How to Grow Lettuce Easily",
			Subtitle = "By Adrianno Bulla | Updated on August 30, 2023",
			Image = "lettuce.png"
		});
		HeroSlides.Add(new HeroSlideItem
		{
			Title = "Soil Health Essentials",
			Subtitle = "CropSense Editors | Updated recently",
			Image = "lettuce.png"
		});
		HeroSlides.Add(new HeroSlideItem
		{
			Title = "Watering Best Practices",
			Subtitle = "Field Notes | Updated this week",
			Image = "lettuce.png"
		});

		QuickAccessItems.Add(new QuickAccessItem { Label = "Weather", IconImage = "weather.png" });
		QuickAccessItems.Add(new QuickAccessItem { Label = "Monitor", IconImage = "monitorplant.png" });
		QuickAccessItems.Add(new QuickAccessItem { Label = "Market", IconGlyph = "🛒" });
		QuickAccessItems.Add(new QuickAccessItem { Label = "Community", IconGlyph = "💬" });
		QuickAccessItems.Add(new QuickAccessItem { Label = "Add crop", IconGlyph = "➕" });
		QuickAccessItems.Add(new QuickAccessItem { Label = "Supplies", IconGlyph = "🧺" });

		RecommendedItems.Add(new RecommendedItem
		{
			Title = "Increase Your Wheat Production",
			Image = "lettuce.png"
		});
		RecommendedItems.Add(new RecommendedItem
		{
			Title = "Grow Brinjals throughout the year",
			Image = "lettuce.png"
		});
	}
}
