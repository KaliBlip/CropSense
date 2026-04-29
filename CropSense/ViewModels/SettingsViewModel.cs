using CommunityToolkit.Mvvm.ComponentModel;

namespace CropSense.ViewModels;

public sealed partial class SettingsViewModel : BaseViewModel
{
	[ObservableProperty]
	private string selectedLanguage = "English";

	public SettingsViewModel()
	{
		Title = "Settings";
	}
}
