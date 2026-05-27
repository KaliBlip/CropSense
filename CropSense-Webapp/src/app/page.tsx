"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Camera,
  ChevronRight,
  Home,
  ImagePlus,
  RotateCcw,
  Search,
  Share2,
  Sparkles,
  Sprout,
  Upload,
  Info,
  AlertTriangle,
  Droplets,
  Wind,
  SunMedium,
  Flame,
  CheckCircle,
  Scissors,
  Beaker,
  HelpCircle,
  Activity,
  Leaf,
  Bug,
  Biohazard,
  AlertOctagon,
  BookOpen,
  ShieldCheck
} from "lucide-react";
import {
  careCards,
  fieldMetrics,
  quickActions,
} from "@/lib/cropsense-data";
import { diseaseDatabase } from "@/lib/disease-db";
import { predictImage, predictFromUrl, getSamples } from "@/lib/api";
import { ClassPrediction, PredictionResult } from "@/lib/types";

// Dynamic components
import LoadingSpinner from "@/components/LoadingSpinner";
import PredictionResults from "@/components/PredictionResults";
import TreatmentCard from "@/components/TreatmentCard";
import ModelInfoPanel from "@/components/ModelInfoPanel";
import FarmWeatherView from "@/components/FarmWeatherView";
import CropInventoryView from "@/components/CropInventoryView";
import PestLibraryView from "@/components/PestLibraryView";
import TreatmentAssistantView from "@/components/TreatmentAssistantView";

type Tab = "home" | "scan" | "care" | "weather" | "crops" | "treat" | "pests";

interface SampleImage {
  category: string;
  path: string;
  filename: string;
}

interface ScanHistoryItem {
  id: string;
  crop: string;
  label: string;
  confidence: number;
  date: string;
  imagePath: string;
  severity: "Healthy" | "Watch" | "Treat";
  adviceTitle: string;
  adviceSteps: string;
}

const heroImage =
  "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80";

// Helper to map class to category crop
function getCropFromClass(className: string): string {
  const name = className.toLowerCase();
  if (name.includes("fall armyworm") || name.includes("streak virus")) return "Maize";
  if (name.includes("green mite") || name.includes("brown spot") || name.includes("mosaic")) return "Cassava";
  if (name.includes("septoria") || name.includes("leaf mold") || name.includes("yellow leaf curl")) return "Tomato";
  if (name.includes("anthracnose") || name.includes("gummosis") || name.includes("gumosis")) return "Cashew";
  return "Crop";
}

// Helper to determine severity based on class name
function getSeverityFromClass(className: string): "Healthy" | "Watch" | "Treat" {
  const name = className.toLowerCase();
  if (name === "healthy") return "Healthy";
  if (
    name.includes("spot") ||
    name.includes("beetle") ||
    name.includes("miner") ||
    name.includes("grasshopper") ||
    name.includes("grasshoper")
  ) {
    return "Watch";
  }
  return "Treat";
}

export default function CropSenseApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [preview, setPreview] = useState<string | null>(null);

  // Model state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topPrediction, setTopPrediction] = useState<PredictionResult["top"] | null>(null);
  const [predictions, setPredictions] = useState<ClassPrediction[]>([]);

  // History and Settings state
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [isModelPanelOpen, setIsModelPanelOpen] = useState(false);

  // Samples state
  const [samples, setSamples] = useState<SampleImage[]>([]);
  const [currentSample, setCurrentSample] = useState<SampleImage | null>(null);

  // Load samples and local history on mount
  useEffect(() => {
    async function loadSamplesData() {
      try {
        const sampleList = await getSamples();
        setSamples(sampleList);
      } catch (err) {
        console.error("Failed to load sample image list:", err);
      }
    }
    loadSamplesData();

    // Initial dummy history to make it look active
    setHistory([
      {
        id: "1",
        crop: "Tomato",
        label: "Septoria leaf spot",
        confidence: 92,
        date: "Today, 2:14 PM",
        imagePath: "/assets/screens3.png",
        severity: "Treat",
        adviceTitle: "Septoria Spot Management",
        adviceSteps: "Mulch around the base to prevent spores splashing up from the soil. Remove infected bottom leaves. Apply copper or chlorothalonil fungicide.",
      },
      {
        id: "2",
        crop: "Cassava",
        label: "Healthy",
        confidence: 96,
        date: "Yesterday, 10:30 AM",
        imagePath: "/assets/lettuce.png",
        severity: "Healthy",
        adviceTitle: "Healthy Crop Maintenance",
        adviceSteps: "Excellent! No pest or disease detected. Continue standard crop care: balanced irrigation, regular monitoring, and organic mulching to protect the root system.",
      }
    ]);
  }, []);

  // Handle uploading / capturing images
  async function handleImagePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setTopPrediction(null);
    setPredictions([]);
    setCurrentSample(null);

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    setIsLoading(true);
    try {
      const result = await predictImage(file);
      processPredictionResult(result, localUrl);
    } catch (err: any) {
      console.error(err);
      setError(`Prediction failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle loading sample images
  async function handleLoadSample() {
    if (samples.length === 0) {
      setError("No sample images loaded from public/samples.");
      return;
    }

    setError(null);
    setTopPrediction(null);
    setPredictions([]);

    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setCurrentSample(randomSample);
    setPreview(randomSample.path);

    setIsLoading(true);
    try {
      const result = await predictFromUrl(randomSample.path);
      processPredictionResult(result, randomSample.path);
    } catch (err: any) {
      console.error(err);
      setError(`Prediction failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Process the response and push to history
  function processPredictionResult(result: PredictionResult, imagePath: string) {
    setTopPrediction(result.top);
    setPredictions(result.predictions);

    const crop = getCropFromClass(result.top.class_name);
    const severity = getSeverityFromClass(result.top.class_name);

    // Add to history
    const newItem: ScanHistoryItem = {
      id: Date.now().toString(),
      crop,
      label: result.top.class_name,
      confidence: Math.round(result.top.confidence * 100),
      date: "Just now",
      imagePath: imagePath,
      severity,
      adviceTitle: result.top.advice_title,
      adviceSteps: result.top.advice_steps,
    };

    setHistory((prev) => [newItem, ...prev.filter(item => item.id !== "1" && item.id !== "2")]);
  }

  function handleHistoryItemSelect(item: ScanHistoryItem) {
    setPreview(item.imagePath);
    setTopPrediction({
      class_name: item.label,
      confidence: item.confidence / 100,
      advice_title: item.adviceTitle,
      advice_steps: item.adviceSteps,
    });
    setPredictions([
      { class_name: item.label, confidence: item.confidence / 100, rank: 1 }
    ]);
    setActiveTab("care");
  }

  return (
    <main className="app-stage">
      <section className="phone-shell relative flex flex-col" aria-label="CropSense mobile app">


        <div className="screen-scroll flex-1">
          {activeTab === "home" && (
            <HomeView
              history={history}
              onScan={() => setActiveTab("scan")}
              onSelectHistory={handleHistoryItemSelect}
              onOpenSpecs={() => setIsModelPanelOpen(true)}
              onNavigate={(route) => setActiveTab(route)}
            />
          )}

          {activeTab === "scan" && (
            <ScanView
              preview={preview}
              isLoading={isLoading}
              error={error}
              topPrediction={topPrediction}
              predictions={predictions}
              currentSample={currentSample}
              onImagePick={handleImagePick}
              onLoadSample={handleLoadSample}
              onRetake={() => {
                setPreview(null);
                setTopPrediction(null);
                setPredictions([]);
                setCurrentSample(null);
                setError(null);
              }}
              onOpenCare={() => setActiveTab("care")}
            />
          )}

          {activeTab === "care" && (
            <CareView
              topPrediction={topPrediction}
              preview={preview}
              crop={topPrediction ? getCropFromClass(topPrediction.class_name) : "Crop"}
              severity={topPrediction ? getSeverityFromClass(topPrediction.class_name) : "Watch"}
              samples={samples}
            />
          )}

          {activeTab === "weather" && (
            <FarmWeatherView onBack={() => setActiveTab("home")} />
          )}

          {activeTab === "crops" && (
            <CropInventoryView 
              onBack={() => setActiveTab("home")} 
              onScan={() => setActiveTab("scan")} 
            />
          )}

          {activeTab === "treat" && (
            <TreatmentAssistantView onBack={() => setActiveTab("home")} />
          )}

          {activeTab === "pests" && (
            <PestLibraryView onBack={() => setActiveTab("home")} />
          )}
        </div>

        <nav className="tab-bar" aria-label="Primary">
          <TabButton 
            active={["home", "weather", "crops", "treat", "pests"].includes(activeTab)} 
            label="Home" 
            onClick={() => setActiveTab("home")}
          >
            <Home size={22} />
          </TabButton>
          <button
            className={`scan-tab ${activeTab === "scan" ? "active" : ""}`}
            aria-label="Open scan"
            onClick={() => setActiveTab("scan")}
          >
            <Camera size={26} />
          </button>
          <TabButton active={activeTab === "care"} label="Care" onClick={() => setActiveTab("care")}>
            <Sprout size={22} />
          </TabButton>
        </nav>

        {/* Model specifications drawer sheet */}
        <ModelInfoPanel isOpen={isModelPanelOpen} onClose={() => setIsModelPanelOpen(false)} />
      </section>
    </main>
  );
}

// -----------------------------------------------------------------------------
// Home View Component
// -----------------------------------------------------------------------------
function HomeView({
  history,
  onScan,
  onSelectHistory,
  onOpenSpecs,
  onNavigate
}: {
  history: ScanHistoryItem[];
  onScan: () => void;
  onSelectHistory: (item: ScanHistoryItem) => void;
  onOpenSpecs: () => void;
  onNavigate: (route: Tab) => void;
}) {
  return (
    <div className="view home-view space-y-5">
      <header className="top-row">
        <button className="weather-pill" aria-label="Current farm weather" onClick={() => onNavigate("weather")}>
          <span className="weather-icon">☔</span>
          <span>
            <small>Ejura Farm</small>
            <strong>26°C, Cloudy</strong>
          </span>
          <ChevronRight size={16} />
        </button>
        <button className="circle-button" aria-label="Model info" onClick={onOpenSpecs}>
          <Info size={20} className="text-green-400" />
        </button>
        <button className="avatar-button" aria-label="Profile">
          <Image src="/assets/tomato.png" alt="" width={44} height={44} />
        </button>
      </header>

      <section className="hero-card">
        <Image src={heroImage} alt="Rows of healthy crop leaves" fill priority sizes="360px" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow flex items-center gap-1">
            <Sparkles size={12} />
            CropSense AI
          </span>
          <h1>Catch crop problems before they spread.</h1>
          <p>Instant visual diagnosis for cashews, cassavas, maize, and tomatoes.</p>
          <button className="primary-action" onClick={onScan}>
            <Camera size={18} />
            Scan leaf
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Quick access</h2>
        </div>
        <div className="quick-row">
          {quickActions.map((action) => {
            const routeMap: Record<string, Tab> = {
              Weather: "weather",
              Crops: "crops",
              Treat: "treat",
              Pests: "pests"
            };
            const route = routeMap[action.label];
            return (
              <button 
                className="quick-action" 
                key={action.label} 
                aria-label={action.label}
                onClick={() => route && onNavigate(route)}
              >
                <action.icon size={23} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Recent checks</h2>
          <button className="text-xs text-green-400 font-semibold" onClick={onOpenSpecs}>Model Specs</button>
        </div>
        <div className="diagnosis-list">
          {history.map((item) => (
            <button className="diagnosis-card hover:bg-white/15 transition-all duration-300" key={item.id} onClick={() => onSelectHistory(item)}>
              <span className={`status-dot ${item.severity.toLowerCase()}`} />
              <span className="flex-1 min-w-0">
                <strong className="text-slate-100 font-semibold text-sm capitalize">{item.crop} · {item.label}</strong>
                <small className="text-slate-400 text-xs mt-0.5 block">{item.date} · {item.confidence}% confidence</small>
              </span>
              <ChevronRight size={18} className="text-slate-400" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Scan View Component
// -----------------------------------------------------------------------------
function ScanView({
  preview,
  isLoading,
  error,
  topPrediction,
  predictions,
  currentSample,
  onImagePick,
  onLoadSample,
  onRetake,
  onOpenCare
}: {
  preview: string | null;
  isLoading: boolean;
  error: string | null;
  topPrediction: PredictionResult["top"] | null;
  predictions: ClassPrediction[];
  currentSample: SampleImage | null;
  onImagePick: (event: ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
  onRetake: () => void;
  onOpenCare: () => void;
}) {
  return (
    <div className="view scan-view space-y-4">
      <header className="capture-header">
        <button className="circle-button" aria-label="Retake / reset" onClick={onRetake}>
          <RotateCcw size={20} />
        </button>
        <div>
          <span className="eyebrow">CropSense AI</span>
          <h1>Leaf Diagnosis</h1>
        </div>
      </header>

      <section className="camera-panel">
        <div className="camera-frame" style={{ aspectRatio: '1 / 1' }}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected crop preview" className="w-full h-full object-cover" />
          ) : (
            <div style={{ position: "relative" }} className="w-full h-full">
              <Image src="/assets/screens2.png" alt="Leaf scan reference" fill sizes="360px" priority />
            </div>
          )}
          <div className="scan-corners" aria-hidden="true" />

          {preview && (
            <button className="retake-button" onClick={onRetake} aria-label="Clear photo">
              <RotateCcw size={20} className="text-slate-200" />
            </button>
          )}
        </div>

        <div className="capture-controls">
          <label className="picker-button hover:bg-white/20 transition-all duration-300">
            <ImagePlus size={20} />
            <span>Gallery</span>
            <input type="file" accept="image/*" onChange={onImagePick} />
          </label>

          <label
            className="shutter-button hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl"
            aria-label="Capture photo"
          >
            <Camera size={30} />
            <input type="file" accept="image/*" capture="environment" onChange={onImagePick} />
          </label>

          <label className="picker-button hover:bg-white/20 transition-all duration-300">
            <Upload size={20} />
            <span>Files</span>
            <input type="file" accept="image/png,image/jpeg" onChange={onImagePick} />
          </label>
        </div>
      </section>

      {/* Test Sample Trigger Button */}
      {!isLoading && (
        <button
          onClick={onLoadSample}
          className="care-link hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
          style={{ marginTop: "8px", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.06)" }}
        >
          <Sparkles size={16} className="text-green-400 animate-pulse" />
          <span>Test Random Sample Leaf</span>
        </button>
      )}

      {/* Info text when no image is loaded */}
      {!preview && !isLoading && (
        <div className="text-center p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
          <p className="text-xs text-slate-300 font-semibold">Ready to Diagnose</p>
          <p className="text-[10px] text-slate-400">
            Snap a leaf photo with the camera button, upload a file, or tap <strong>Test Random Sample Leaf</strong> to try with validation data.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="result-card p-6">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 space-y-2 flex flex-col items-center text-center">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">Inference Server Error</h4>
            <p className="text-[10px] text-slate-300 mt-1">{error}</p>
          </div>
          <button
            onClick={onLoadSample}
            className="text-[10px] bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-xl font-bold uppercase transition-colors"
          >
            Retry Scan
          </button>
        </div>
      )}

      {/* Successful Prediction State */}
      {topPrediction && !isLoading && !error && (
        <section className="result-card animate-fade-in">
          <div className="result-title">
            <span className={`result-icon ${getSeverityFromClass(topPrediction.class_name).toLowerCase()}`}>
              <Sprout size={23} />
            </span>
            <span className="flex-1 min-w-0">
              <small className="text-slate-400 text-xs">Likely diagnosis</small>
              <strong className="text-slate-100 font-bold text-lg capitalize truncate block">{topPrediction.class_name}</strong>
            </span>
            <b className="text-green-400 font-bold text-lg">
              {Math.round(topPrediction.confidence * 100)}%
            </b>
          </div>

          {currentSample && (
            <div className="mt-3 py-1.5 px-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-400 capitalize">
              📂 Test set sample: <strong>{currentSample.category}</strong>
            </div>
          )}

          <div className="border-t border-white/5 my-4" />

          {/* Top-5 predictions progress stack */}
          <PredictionResults predictions={predictions} />

          <button className="care-link hover:bg-white/20 transition-all duration-300" onClick={onOpenCare}>
            View Treatment Plan
            <ChevronRight size={18} />
          </button>
        </section>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Care View Component
// -----------------------------------------------------------------------------
function CareView({
  topPrediction,
  preview,
  crop,
  severity,
  samples
}: {
  topPrediction: PredictionResult["top"] | null;
  preview: string | null;
  crop: string;
  severity: "Healthy" | "Watch" | "Treat";
  samples: SampleImage[];
}) {
  const [selectedKey, setSelectedKey] = useState<string>(
    topPrediction ? topPrediction.class_name.toLowerCase() : "healthy"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTreatmentTab, setActiveTreatmentTab] = useState<"organic" | "chemical" | "cultural">("organic");

  // Keep selected disease in sync when a new prediction arrives
  useEffect(() => {
    if (topPrediction) {
      setSelectedKey(topPrediction.class_name.toLowerCase());
    }
  }, [topPrediction]);

  // Normalize key to handle spacing/typos
  const getNormalizedKey = (key: string) => {
    let k = key.toLowerCase().trim();
    if (k === "grasshoper") return "grasshopper";
    if (k === "gumosis") return "gummosis";
    if (k === "verticulium wilt") return "verticillium wilt";
    return k;
  };

  const currentDiseaseKey = getNormalizedKey(selectedKey);
  const disease = diseaseDatabase[currentDiseaseKey] || diseaseDatabase["healthy"];

  // Search filter list of all diseases from database
  const allDiseases = Object.keys(diseaseDatabase).filter(
    (key, index, self) => self.indexOf(getNormalizedKey(key)) === index // deduplicate aliases
  );

  const filteredDiseases = allDiseases.filter((key) => {
    const d = diseaseDatabase[key];
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const isActiveDiagnosis = topPrediction && getNormalizedKey(topPrediction.class_name) === getNormalizedKey(selectedKey);

  // Render icons dynamically
  function getPreventionIcon(iconName: string) {
    switch (iconName) {
      case "Droplets": return <Droplets size={18} className="text-sky-400" />;
      case "Scissors": return <Scissors size={18} className="text-amber-400" />;
      case "ShieldCheck": return <ShieldCheck size={18} className="text-green-400" />;
      case "Wind": return <Wind size={18} className="text-indigo-400" />;
      case "SunMedium": return <SunMedium size={18} className="text-amber-300" />;
      case "Flame": return <Flame size={18} className="text-red-400" />;
      case "Activity": return <Activity size={18} className="text-emerald-400" />;
      default: return <Sprout size={18} className="text-green-400" />;
    }
  }

  // Cover image mapper for diseases
  const getCoverImage = (key: string) => {
    const normalizedKey = getNormalizedKey(key);
    const matches = samples.filter(s => getNormalizedKey(s.category) === normalizedKey);
    if (matches.length > 0) {
      return matches[0].path;
    }

    switch (normalizedKey) {
      case "anthracnose":
        return "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80";
      case "bacterial blight":
        return "https://images.unsplash.com/photo-1592150621744-aca64f48394a?auto=format&fit=crop&w=600&q=80";
      case "brown spot":
        return "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80";
      case "fall armyworm":
        return "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=600&q=80";
      case "grasshopper":
      case "grasshoper":
        return "https://images.unsplash.com/photo-1576016770956-debb63d900ee?auto=format&fit=crop&w=600&q=80";
      case "green mite":
        return "https://images.unsplash.com/photo-1579613832125-5d34a13ff2a8?auto=format&fit=crop&w=600&q=80";
      case "gummosis":
      case "gumosis":
        return "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=600&q=80";
      case "leaf beetle":
        return "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=600&q=80";
      case "leaf blight":
        return "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80";
      case "leaf curl":
        return "https://images.unsplash.com/photo-1582281227099-7f4577f6b863?auto=format&fit=crop&w=600&q=80";
      case "leaf miner":
        return "https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=600&q=80";
      case "leaf spot":
        return "https://images.unsplash.com/photo-1587334206501-72ffecfb4b3e?auto=format&fit=crop&w=600&q=80";
      case "mosaic":
        return "https://images.unsplash.com/photo-1463123081488-72993af4d3d9?auto=format&fit=crop&w=600&q=80";
      case "red rust":
        return "https://images.unsplash.com/photo-1508595165512-7dec041aa26b?auto=format&fit=crop&w=600&q=80";
      case "septoria leaf spot":
        return "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?auto=format&fit=crop&w=600&q=80";
      case "streak virus":
        return "https://images.unsplash.com/photo-1532983330958-2f3557d767be?auto=format&fit=crop&w=600&q=80";
      case "verticillium wilt":
      case "verticulium wilt":
        return "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80";
      default:
        return "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&w=600&q=80";
    }
  };

  const currentRecipe = disease.treatment[activeTreatmentTab];

  return (
    <div className="view care-view space-y-4">
      {/* Header bar */}
      <header className="care-header flex items-center justify-between pb-1">
        <div>
          <span className="eyebrow block">Agronomy Hub</span>
          <h1 className="text-xl font-bold font-outfit text-slate-100">Care & Treatment</h1>
        </div>
        <div className="flex gap-2">
          {topPrediction && !isActiveDiagnosis && (
            <button
              onClick={() => setSelectedKey(topPrediction.class_name.toLowerCase())}
              className="circle-button text-green-400 border border-green-500/20"
              style={{ width: "36px", height: "36px" }}
              title="Show active scan result"
            >
              <RotateCcw size={16} />
            </button>
          )}
          <button className="circle-button" aria-label="Share plan" style={{ width: "36px", height: "36px" }}>
            <Share2 size={16} />
          </button>
        </div>
      </header>

      {/* Disease Search & Browse */}
      <section className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search disease (e.g. blight, armyworm)..."
          className="search-input text-xs"
        />
        <Search size={14} className="search-icon-inside" />
      </section>

      {/* Horizontal Disease Selector Row */}
      <div className="horizontal-scroll-container flex gap-2.5 pb-2" style={{ scrollbarWidth: "none" }}>
        {filteredDiseases.map((key) => {
          const d = diseaseDatabase[key];
          const isSel = getNormalizedKey(key) === getNormalizedKey(selectedKey);
          const isDiag = topPrediction && getNormalizedKey(topPrediction.class_name) === getNormalizedKey(key);
          return (
            <button
              key={key}
              onClick={() => setSelectedKey(key)}
              className={`disease-selector-card flex-shrink-0 text-left p-3 rounded-2xl border transition-all duration-300 ${
                isSel
                  ? "bg-white/10 border-green-400/50 shadow-md shadow-green-500/5 scale-105"
                  : "bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10"
              }`}
              style={{ width: "135px" }}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] text-slate-400 truncate font-semibold block capitalize">{d.crop.split(",")[0]}</span>
                {isDiag && (
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" title="Active diagnosis" />
                )}
              </div>
              <strong className="text-xs font-bold text-slate-100 block truncate capitalize mb-1">{d.name}</strong>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  d.category === "insect" ? "bg-amber-500/10 text-amber-400" :
                  d.category === "viral" ? "bg-red-500/10 text-red-400" :
                  d.category === "healthy" ? "bg-green-500/10 text-green-400" : "bg-sky-500/10 text-sky-400"
                }`}>
                  {d.category}
                </span>
                <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                  d.risk === "high" ? "bg-red-500/15 text-red-300" :
                  d.risk === "medium" ? "bg-amber-500/15 text-amber-300" : "bg-green-500/15 text-green-300"
                }`}>
                  {d.risk}
                </span>
              </div>
            </button>
          );
        })}
        {filteredDiseases.length === 0 && (
          <div className="text-[11px] text-slate-500 italic p-3">No matching diseases found.</div>
        )}
      </div>

      {/* Disease Detail Section */}
      <section className="disease-details-box space-y-4 animate-fade-in">
        {/* Hero Info */}
        <div className="disease-hero p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="eyebrow block flex items-center gap-1">
              <Sprout size={11} className="text-green-400" />
              {disease.crop} Care Plan
            </span>
            <h2 className="text-xl font-bold font-outfit text-slate-100 capitalize mt-0.5">{disease.name}</h2>
            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="capitalize">Category: <strong>{disease.category}</strong></span>
              <span>•</span>
              <span>Risk: <strong className={
                disease.risk === "high" ? "text-red-400" :
                disease.risk === "medium" ? "text-amber-400" : "text-green-400"
              }>{disease.risk}</strong></span>
            </p>
          </div>
          <span className={`result-icon large ${
            disease.risk === "high" ? "treat" :
            disease.risk === "medium" ? "watch" : "healthy"
          } shrink-0`}>
            {disease.category === "insect" ? <Bug size={24} /> :
             disease.category === "healthy" ? <ShieldCheck size={24} /> : <Biohazard size={24} />}
          </span>
        </div>

        {/* Diagnostic Leaf Image */}
        <section className="image-report relative rounded-2xl overflow-hidden shadow-lg border border-white/5" style={{ height: "160px" }}>
          {isActiveDiagnosis && preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Diagnosed leaf" className="w-full h-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={getCoverImage(currentDiseaseKey)} alt="Disease reference" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          
          <div className="report-badge absolute bottom-3 left-3 shadow-md flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-xl text-[10px] text-slate-100 font-bold border border-white/10">
            {isActiveDiagnosis ? (
              <>
                <Sparkles size={11} className="text-green-400" />
                <span>Active Leaf Scan Diagnosis ({Math.round(topPrediction!.confidence * 100)}%)</span>
              </>
            ) : (
              <>
                <BookOpen size={11} className="text-green-400" />
                <span>Standard Agronomic Reference</span>
              </>
            )}
          </div>
        </section>

        {/* Symptoms Section */}
        {disease.symptoms && (
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <h4 className="detail-title" style={{ display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
              <Info size={14} className="text-green-400" style={{ color: "var(--green)" }} />
              <span>Symptoms Identification</span>
            </h4>
            <p className="detail-body" style={{ margin: 0 }}>{disease.symptoms}</p>
          </div>
        )}

        {/* Treatment & Remediation Recipes */}
        <div className="space-y-3">
          <div className="section-heading">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Remediation & Treatments</h2>
          </div>

          {/* Treatment Tabs */}
          <section className="pill-toggle-container flex justify-between bg-white/5 border border-white/5 p-1 rounded-2xl">
            {[
              { type: "organic", icon: Leaf, label: "Organic" },
              { type: "chemical", icon: Beaker, label: "Chemical" },
              { type: "cultural", icon: Scissors, label: "Cultural" }
            ].map((item) => (
              <button
                key={item.type}
                onClick={() => setActiveTreatmentTab(item.type as any)}
                className={`pill-toggle-button flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-[11px] font-bold transition-all duration-300 ${
                  activeTreatmentTab === item.type
                    ? "active shadow-md shadow-green-500/10"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <item.icon size={12} />
                <span>{item.label}</span>
              </button>
            ))}
          </section>

          {/* Selected Treatment Recipe Card */}
          {currentRecipe && (
            <section className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Sparkles size={14} style={{ color: "var(--green)" }} />
                  <span className="glass-card-title" style={{ margin: 0, textTransform: "uppercase" }}>{activeTreatmentTab} formulated remedy</span>
                </div>
                <h2 className="glass-card-header" style={{ margin: "6px 0 0 0" }}>{currentRecipe.title}</h2>
                <p className="detail-body" style={{ marginTop: "4px" }}>{currentRecipe.summary}</p>
              </div>

              {/* Required Materials */}
              {currentRecipe.materials && currentRecipe.materials.length > 0 && currentRecipe.materials[0] !== "None" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <h4 className="detail-title">Required Materials</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {currentRecipe.materials.map((m, i) => (
                      <div key={i} className="bullet-item">
                        <CheckCircle size={14} style={{ color: "var(--green)", flexShrink: 0 }} />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              {currentRecipe.steps && currentRecipe.steps.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h4 className="detail-title">Step-by-Step Execution</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {currentRecipe.steps.map((step, i) => (
                      <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <span style={{ 
                          width: "20px", 
                          height: "20px", 
                          borderRadius: "50%", 
                          background: "rgba(255,255,255,0.08)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          fontWeight: "800",
                          color: "var(--text)",
                          flexShrink: 0
                        }}>
                          {i + 1}
                        </span>
                        <p className="detail-body" style={{ margin: 0 }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Safety Instructions */}
              {currentRecipe.safety && (
                <div className="warn-banner">
                  <Info size={16} style={{ color: "var(--amber)", flexShrink: 0, marginTop: "2px" }} />
                  <p>{currentRecipe.safety}</p>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Prevention Guidelines (Disease-Specific!) */}
        <div className="space-y-3 pt-1">
          <div className="section-heading">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Disease-Specific Prevention</h2>
          </div>
          <div className="space-y-2.5">
            {disease.prevention && disease.prevention.length > 0 ? (
              disease.prevention.map((item, idx) => (
                <article key={idx} className="care-tip flex gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/8 transition-colors duration-300">
                  <span className="p-2 rounded-xl bg-white/8 shrink-0 flex items-center justify-center" style={{ width: "36px", height: "36px" }}>
                    {getPreventionIcon(item.iconName)}
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-slate-100 leading-snug">{item.title}</h3>
                    <p className="text-[10.5px] text-slate-400 leading-relaxed">{item.text}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-[11px] text-slate-500 italic p-3">No specific prevention rules defined.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Tab button helper component
function TabButton({
  active,
  children,
  label,
  onClick
}: {
  active: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={`tab-button ${active ? "active" : ""}`} onClick={onClick} aria-label={label}>
      {children}
      <span>{label}</span>
    </button>
  );
}
