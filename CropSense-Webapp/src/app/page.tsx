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
} from "lucide-react";
import {
  careCards,
  fieldMetrics,
  quickActions,
} from "@/lib/cropsense-data";
import { predictImage, predictFromUrl, getSamples } from "@/lib/api";
import { ClassPrediction, PredictionResult } from "@/lib/types";

// Dynamic components
import LoadingSpinner from "@/components/LoadingSpinner";
import PredictionResults from "@/components/PredictionResults";
import TreatmentCard from "@/components/TreatmentCard";
import ModelInfoPanel from "@/components/ModelInfoPanel";

type Tab = "home" | "scan" | "care";

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
            />
          )}
        </div>

        <nav className="tab-bar" aria-label="Primary">
          <TabButton active={activeTab === "home"} label="Home" onClick={() => setActiveTab("home")}>
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
  onOpenSpecs
}: {
  history: ScanHistoryItem[];
  onScan: () => void;
  onSelectHistory: (item: ScanHistoryItem) => void;
  onOpenSpecs: () => void;
}) {
  return (
    <div className="view home-view space-y-5">
      <header className="top-row">
        <button className="weather-pill" aria-label="Current farm weather">
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
          {quickActions.map((action) => (
            <button className="quick-action" key={action.label} aria-label={action.label}>
              <action.icon size={23} />
            </button>
          ))}
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
            <img src={preview} alt="Selected crop preview" className="absolute inset-0 w-full h-full object-cover" />
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
  severity
}: {
  topPrediction: PredictionResult["top"] | null;
  preview: string | null;
  crop: string;
  severity: "Healthy" | "Watch" | "Treat";
}) {
  return (
    <div className="view care-view space-y-4">
      {topPrediction ? (
        <>
          <header className="care-header">
            <button className="circle-button" aria-label="Search care library">
              <Search size={19} />
            </button>
            <button className="circle-button" aria-label="Share plan">
              <Share2 size={20} />
            </button>
          </header>

          <section className="disease-hero">
            <div className="flex-1 min-w-0">
              <span className="eyebrow block">{crop} Care Plan</span>
              <h1 className="text-2xl font-bold font-outfit text-slate-100 capitalize truncate">{topPrediction.class_name}</h1>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                Confidence: {Math.round(topPrediction.confidence * 100)}% · Classification status active.
              </p>
            </div>
            <span className={`result-icon large ${severity.toLowerCase()} shrink-0`}>
              <Sprout size={30} />
            </span>
          </section>

          <section className="image-report">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Diagnosed leaf" className="w-full h-full object-cover" />
            ) : (
              <Image src="/assets/screens3.png" alt="Disease detail reference" fill sizes="360px" priority />
            )}
            <div className="report-badge shadow-md">
              <Sparkles size={14} className="text-green-400" />
              AI confidence {Math.round(topPrediction.confidence * 100)}%
            </div>
          </section>

          <section className="field-grid">
            {fieldMetrics.map((metric) => (
              <div className="metric-tile" key={metric.label}>
                <span>
                  <metric.icon size={18} />
                </span>
                <small>{metric.label}</small>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </section>

          {/* Real treatment card from model inference */}
          <TreatmentCard
            title={topPrediction.advice_title}
            steps={topPrediction.advice_steps}
          />

          <section className="section care-tips">
            <div className="section-heading">
              <h2>Prevention Guidelines</h2>
            </div>
            {careCards.map((card) => (
              <article className="care-tip" key={card.title}>
                <span>
                  <card.icon size={20} />
                </span>
                <div>
                  <h3>{card.title}</h3>
                  <p>{card.text}</p>
                </div>
              </article>
            ))}
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[500px]">
          <Sprout className="w-16 h-16 text-slate-600 animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-slate-300">No Active Diagnosis</h3>
            <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed">
              Please scan a leaf using the camera tab first to generate a care plan.
            </p>
          </div>
        </div>
      )}
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
