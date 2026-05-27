"use client";

import React, { useState } from "react";
import { 
  Sun, 
  CloudRain, 
  Cloud, 
  Thermometer, 
  Droplets, 
  Wind, 
  ChevronLeft, 
  Sparkles
} from "lucide-react";

interface WeatherData {
  temp: string;
  humidity: string;
  wind: string;
  moisture: string;
  condition: "sunny" | "rainy" | "cloudy";
  advisory: string;
}

export default function FarmWeatherView({ onBack }: { onBack: () => void }) {
  const [selectedCondition, setSelectedCondition] = useState<"sunny" | "rainy" | "cloudy">("cloudy");

  const conditionConfigs: Record<"sunny" | "rainy" | "cloudy", WeatherData> = {
    sunny: {
      temp: "32°C",
      humidity: "28%",
      wind: "14 km/h",
      moisture: "22% (Dry)",
      condition: "sunny",
      advisory: "Soil moisture is dipping. Schedule standard irrigation for Cassava and Tomato. High solar radiation: avoid mid-day pruning."
    },
    rainy: {
      temp: "23°C",
      humidity: "92%",
      wind: "28 km/h",
      moisture: "85% (Wet)",
      condition: "rainy",
      advisory: "Fungal hazard is elevated. Spores spread rapidly in rain splash. Do not apply foliar sprays today. Inspect Tomato for Septoria."
    },
    cloudy: {
      temp: "26°C",
      humidity: "65%",
      wind: "8 km/h",
      moisture: "48% (Optimal)",
      condition: "cloudy",
      advisory: "Optimal microclimate conditions. Soil retention is steady. Good window for organic compost application or early morning scanning."
    }
  };

  const current = conditionConfigs[selectedCondition];

  return (
    <div className="view space-y-5">
      <header className="subview-header">
        <button 
          onClick={onBack} 
          className="circle-button" 
          style={{ width: "42px", height: "42px", flex: "0 0 42px" }}
          aria-label="Back to home"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <span className="eyebrow" style={{ marginBottom: "2px" }}>Ejura Farm Hub</span>
          <h1 className="font-outfit">Weather Analytics</h1>
        </div>
      </header>

      {/* Interactive condition toggle */}
      <section className="glass-card" style={{ padding: "14px" }}>
        <h3 className="glass-card-title">Simulate Forecast Condition</h3>
        <div className="grid-3" style={{ marginTop: "10px" }}>
          {(["sunny", "cloudy", "rainy"] as const).map((cond) => (
            <button
              key={cond}
              onClick={() => setSelectedCondition(cond)}
              className={`pill-toggle-button ${selectedCondition === cond ? "active" : ""}`}
              style={{
                border: "1px solid rgba(255,255,255,0.06)",
                background: selectedCondition === cond ? "var(--green)" : "rgba(255,255,255,0.04)"
              }}
            >
              {cond === "sunny" && <Sun size={14} />}
              {cond === "cloudy" && <Cloud size={14} />}
              {cond === "rainy" && <CloudRain size={14} />}
              <span style={{ textTransform: "capitalize" }}>{cond}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Stats Display */}
      <section className="glass-card" style={{ background: "linear-gradient(135deg, rgba(34, 223, 102, 0.05), rgba(0, 0, 0, 0.3))" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "var(--green)", display: "block" }}>Live Readings</span>
            <div style={{ fontSize: "44px", fontWeight: "800", fontFamily: "var(--font-outfit)", margin: "4px 0 0 0", color: "var(--text)" }}>
              {current.temp}
            </div>
            <span style={{ fontSize: "11px", color: "var(--muted)", display: "block", marginTop: "4px", textTransform: "capitalize" }}>
              {selectedCondition === "sunny" && "☀️ Clear Sky"}
              {selectedCondition === "cloudy" && "☁️ Moderate Overcast"}
              {selectedCondition === "rainy" && "🌧️ Heavy Precipitation"}
            </span>
          </div>
          <div className="icon-badge green" style={{ width: "48px", height: "48px", borderRadius: "16px" }}>
            {selectedCondition === "sunny" && <Sun size={24} className="animate-spin" />}
            {selectedCondition === "cloudy" && <Cloud size={24} className="animate-pulse" />}
            {selectedCondition === "rainy" && <CloudRain size={24} className="animate-bounce" />}
          </div>
        </div>

        {/* Advisory banner */}
        <div className="warn-banner" style={{ marginTop: "16px", background: "rgba(34, 223, 102, 0.06)", border: "1px solid rgba(34, 223, 102, 0.1)" }}>
          <Sparkles size={16} style={{ color: "var(--green)", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.45", color: "var(--text)" }}>
            <strong style={{ color: "var(--green)" }}>Crop AI Alert: </strong>{current.advisory}
          </p>
        </div>
      </section>

      {/* Secondary Metrics Grid */}
      <section className="grid-2">
        <div className="glass-tile">
          <div className="glass-tile-header">
            <span>Humidity</span>
            <Droplets size={16} style={{ color: "#38bdf8" }} />
          </div>
          <div>
            <strong className="glass-tile-value">{current.humidity}</strong>
            <span className="glass-tile-desc">Stable atmospheric index</span>
          </div>
        </div>

        <div className="glass-tile">
          <div className="glass-tile-header">
            <span>Soil Moisture</span>
            <Thermometer size={16} style={{ color: "var(--green)" }} />
          </div>
          <div>
            <strong className="glass-tile-value">{current.moisture}</strong>
            <span className="glass-tile-desc">Sensor active at 10cm</span>
          </div>
        </div>

        <div className="glass-tile">
          <div className="glass-tile-header">
            <span>Wind Speed</span>
            <Wind size={16} style={{ color: "#a855f7" }} />
          </div>
          <div>
            <strong className="glass-tile-value">{current.wind}</strong>
            <span className="glass-tile-desc">Direction: South-West</span>
          </div>
        </div>

        <div className="glass-tile">
          <div className="glass-tile-header">
            <span>Solar Rad.</span>
            <Sun size={16} style={{ color: "var(--amber)" }} />
          </div>
          <div>
            <strong className="glass-tile-value">
              {selectedCondition === "sunny" ? "820 W/m²" : selectedCondition === "cloudy" ? "320 W/m²" : "80 W/m²"}
            </strong>
            <span className="glass-tile-desc">UV Level: {selectedCondition === "sunny" ? "High" : "Low"}</span>
          </div>
        </div>
      </section>

      {/* Hourly Forecast */}
      <section className="glass-card" style={{ padding: "14px" }}>
        <h3 className="glass-card-title">Next 4 Hours Forecast</h3>
        <div className="grid-4" style={{ marginTop: "10px" }}>
          {[
            { hour: "12:00", temp: "27°C", icon: Sun, color: "var(--amber)" },
            { hour: "13:00", temp: "29°C", icon: Cloud, color: "var(--muted)" },
            { hour: "14:00", temp: "26°C", icon: CloudRain, color: "#38bdf8" },
            { hour: "15:00", temp: "24°C", icon: Sun, color: "var(--amber)" }
          ].map((h, i) => (
            <div key={i} style={{ 
              background: "rgba(255,255,255,0.04)", 
              border: "1px solid rgba(255,255,255,0.06)", 
              borderRadius: "16px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px"
            }}>
              <span style={{ fontSize: "10px", color: "var(--muted)" }}>{h.hour}</span>
              <h.icon size={16} style={{ color: h.color }} />
              <span style={{ fontSize: "12px", fontWeight: "800", color: "var(--text)" }}>{h.temp}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
