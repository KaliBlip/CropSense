"use client";

import Image from "next/image";
import { ChangeEvent, useMemo, useState } from "react";
import {
  Bell,
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
} from "lucide-react";
import {
  careCards,
  diagnoses,
  fieldMetrics,
  modelClasses,
  quickActions
} from "@/lib/cropsense-data";

type Tab = "home" | "scan" | "care";

const heroImage =
  "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=1000&q=80";

export default function CropSenseApp() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(0);

  const diagnosis = diagnoses[selectedDiagnosis];
  const confidenceRows = useMemo(
    () => [
      diagnosis,
      diagnoses[(selectedDiagnosis + 1) % diagnoses.length],
      diagnoses[(selectedDiagnosis + 2) % diagnoses.length]
    ],
    [diagnosis, selectedDiagnosis]
  );

  function handleImagePick(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setSelectedDiagnosis((current) => (current + 1) % diagnoses.length);
  }

  return (
    <main className="app-stage">
      <section className="phone-shell" aria-label="CropSense mobile app">
        <div className="status-bar" aria-hidden="true">
          <span>9:41</span>
          <span className="status-icons">●●● 5G ▰</span>
        </div>

        <div className="screen-scroll">
          {activeTab === "home" && (
            <HomeView
              onScan={() => setActiveTab("scan")}
              onSelectDiagnosis={(index) => {
                setSelectedDiagnosis(index);
                setActiveTab("care");
              }}
            />
          )}

          {activeTab === "scan" && (
            <ScanView
              preview={preview}
              diagnosis={diagnosis}
              confidenceRows={confidenceRows}
              onImagePick={handleImagePick}
              onRetake={() => setPreview(null)}
              onOpenCare={() => setActiveTab("care")}
            />
          )}

          {activeTab === "care" && <CareView diagnosis={diagnosis} />}
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
      </section>
    </main>
  );
}

function HomeView({
  onScan,
  onSelectDiagnosis
}: {
  onScan: () => void;
  onSelectDiagnosis: (index: number) => void;
}) {
  return (
    <div className="view home-view">
      <header className="top-row">
        <button className="weather-pill" aria-label="Current farm weather">
          <span className="weather-icon">☔</span>
          <span>
            <small>Ejura Farm</small>
            <strong>26°C, Cloudy</strong>
          </span>
          <ChevronRight size={16} />
        </button>
        <button className="circle-button" aria-label="Notifications">
          <Bell size={20} />
        </button>
        <button className="avatar-button" aria-label="Profile">
          <Image src="/assets/tomato.png" alt="" width={44} height={44} />
        </button>
      </header>

      <section className="hero-card">
        <Image src={heroImage} alt="Rows of healthy crop leaves" fill priority sizes="360px" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow">CropSense AI</span>
          <h1>Catch crop problems before they spread.</h1>
          <p>Photo diagnosis for pests, disease, and field care decisions.</p>
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
          <button>View all</button>
        </div>
        <div className="diagnosis-list">
          {diagnoses.slice(0, 3).map((item, index) => (
            <button className="diagnosis-card" key={item.label} onClick={() => onSelectDiagnosis(index)}>
              <span className={`status-dot ${item.severity.toLowerCase()}`} />
              <span>
                <strong>{item.crop}</strong>
                <small>{item.label} · {item.confidence}%</small>
              </span>
              <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function ScanView({
  preview,
  diagnosis,
  confidenceRows,
  onImagePick,
  onRetake,
  onOpenCare
}: {
  preview: string | null;
  diagnosis: (typeof diagnoses)[number];
  confidenceRows: typeof diagnoses;
  onImagePick: (event: ChangeEvent<HTMLInputElement>) => void;
  onRetake: () => void;
  onOpenCare: () => void;
}) {
  const ResultIcon = diagnosis.icon;

  return (
    <div className="view scan-view">
      <header className="capture-header">
        <button className="circle-button" aria-label="Share diagnosis">
          <Share2 size={20} />
        </button>
        <div>
          <span className="eyebrow">Camera capture</span>
          <h1>Scan a crop leaf</h1>
        </div>
      </header>

      <section className="camera-panel">
        <div className="camera-frame">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Selected crop preview" />
          ) : (
            <Image src="/assets/screens2.png" alt="Leaf scan reference" fill sizes="360px" />
          )}
          <div className="scan-corners" aria-hidden="true" />
          <button className="retake-button" onClick={onRetake} aria-label="Clear selected photo">
            <RotateCcw size={20} />
          </button>
        </div>

        <div className="capture-controls">
          <label className="picker-button">
            <ImagePlus size={20} />
            <span>Photo</span>
            <input type="file" accept="image/*" onChange={onImagePick} />
          </label>
          <label className="shutter-button" aria-label="Capture photo">
            <Camera size={30} />
            <input type="file" accept="image/*" capture="environment" onChange={onImagePick} />
          </label>
          <label className="picker-button">
            <Upload size={20} />
            <span>Files</span>
            <input type="file" accept="image/png,image/jpeg" onChange={onImagePick} />
          </label>
        </div>
      </section>

      <section className="result-card">
        <div className="result-title">
          <span className={`result-icon ${diagnosis.severity.toLowerCase()}`}>
            <ResultIcon size={23} />
          </span>
          <span>
            <small>Likely diagnosis</small>
            <strong>{diagnosis.label}</strong>
          </span>
          <b>{diagnosis.confidence}%</b>
        </div>

        <div className="confidence-stack">
          {confidenceRows.map((row) => (
            <div className="confidence-row" key={row.label}>
              <span>{row.label}</span>
              <div>
                <i style={{ width: `${row.confidence}%` }} />
              </div>
              <b>{row.confidence}%</b>
            </div>
          ))}
        </div>

        <button className="care-link" onClick={onOpenCare}>
          View treatment plan
          <ChevronRight size={18} />
        </button>
      </section>
    </div>
  );
}

function CareView({ diagnosis }: { diagnosis: (typeof diagnoses)[number] }) {
  const ResultIcon = diagnosis.icon;

  return (
    <div className="view care-view">
      <header className="care-header">
        <button className="circle-button" aria-label="Search care library">
          <Search size={19} />
        </button>
        <button className="circle-button" aria-label="Share plan">
          <Share2 size={20} />
        </button>
      </header>

      <section className="disease-hero">
        <div>
          <span className="eyebrow">{diagnosis.crop} care</span>
          <h1>{diagnosis.label}</h1>
          <p>{diagnosis.summary}</p>
        </div>
        <span className={`result-icon large ${diagnosis.severity.toLowerCase()}`}>
          <ResultIcon size={30} />
        </span>
      </section>

      <section className="image-report">
        <Image src="/assets/screens3.png" alt="Disease detail reference" fill sizes="360px" />
        <div className="report-badge">
          <Sparkles size={14} />
          AI confidence {diagnosis.confidence}%
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

      <section className="treatment-panel">
        <h2>Treatment</h2>
        <p>{diagnosis.advice}</p>
        <div className="model-strip">
          {modelClasses.slice(0, 8).map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </section>

      <section className="section care-tips">
        <div className="section-heading">
          <h2>Prevention</h2>
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
    </div>
  );
}

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
