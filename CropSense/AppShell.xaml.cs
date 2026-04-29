namespace CropSense;

public partial class AppShell : Shell
{
	public AppShell()
	{
		InitializeComponent();
		Routing.RegisterRoute("home", typeof(Views.HomePage));
		Routing.RegisterRoute("crop-view", typeof(Views.CropViewPage));
		Routing.RegisterRoute("crop-camera", typeof(Views.CropCameraPage));
		Routing.RegisterRoute("crop-metrics", typeof(Views.CropMetricsPage));
		Routing.RegisterRoute("capture", typeof(Views.CapturePage));
		Routing.RegisterRoute("result", typeof(Views.ResultPage));
		Routing.RegisterRoute("disease-detail", typeof(Views.ResultPage));
		Routing.RegisterRoute("treatment", typeof(Views.TreatmentPage));
		Routing.RegisterRoute("prevention", typeof(Views.PreventionPage));
		Routing.RegisterRoute("settings", typeof(Views.SettingsPage));
	}
}
