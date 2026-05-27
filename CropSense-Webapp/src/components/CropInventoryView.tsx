"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  Sprout, 
  Calendar,
  Layers,
  Camera
} from "lucide-react";

interface CropDetails {
  id: string;
  name: string;
  scientific: string;
  health: number;
  stage: string;
  planted: string;
  threats: string[];
  status: "excellent" | "warning" | "critical";
  description: string;
}

export default function CropInventoryView({ 
  onBack, 
  onScan 
}: { 
  onBack: () => void; 
  onScan: () => void;
}) {
  const [selectedCropId, setSelectedCropId] = useState<string>("cassava");

  const crops: CropDetails[] = [
    {
      id: "cassava",
      name: "Cassava",
      scientific: "Manihot esculenta",
      health: 89,
      stage: "Root Bulking",
      planted: "Oct 12, 2025",
      threats: ["Cassava Green Mite", "Cassava Mosaic Disease", "Brown Leaf Spot"],
      status: "excellent",
      description: "Tubers are filling steadily. Soil aerated well. Keep monitoring the lower leaves for green mite speckling."
    },
    {
      id: "maize",
      name: "Maize",
      scientific: "Zea mays",
      health: 68,
      stage: "Tasseling",
      planted: "Feb 05, 2026",
      threats: ["Fall Armyworm", "Maize Streak Virus", "Blight"],
      status: "warning",
      description: "Early larval damage spotted on block B. Increased scout frequency to daily checks. Whorls are vulnerable."
    },
    {
      id: "tomato",
      name: "Tomato",
      scientific: "Solanum lycopersicum",
      health: 94,
      stage: "Fruit Set",
      planted: "Mar 10, 2026",
      threats: ["Septoria Leaf Spot", "Leaf Mold", "Yellow Leaf Curl"],
      status: "excellent",
      description: "Blossom set looks great. High ventilation is slowing fungal spore progress. Mulching has been completed."
    },
    {
      id: "cashew",
      name: "Cashew",
      scientific: "Anacardium occidentale",
      health: 54,
      stage: "Vegetative Flush",
      planted: "June 2023",
      threats: ["Anthracnose", "Gummosis / Gumosis", "Red Rust"],
      status: "critical",
      description: "High leaf anthracnose pressure. Bark gummosis detected on 3 test blocks. Copper fungicide application scheduled."
    }
  ];

  const current = crops.find(c => c.id === selectedCropId) || crops[0];

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
          <span className="eyebrow" style={{ marginBottom: "2px" }}>Ejura Field Inventory</span>
          <h1 className="font-outfit">My Crops</h1>
        </div>
      </header>

      {/* Grid of Crops */}
      <section className="grid-2">
        {crops.map((crop) => (
          <button
            key={crop.id}
            onClick={() => setSelectedCropId(crop.id)}
            className={`pill-toggle-button-outline ${selectedCropId === crop.id ? "active" : ""}`}
            style={{
              padding: "16px",
              minHeight: "112px",
              borderRadius: "24px",
              alignItems: "stretch",
              justifyContent: "space-between",
              textAlign: "left"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className={`icon-badge ${
                crop.status === "excellent" ? "green" :
                crop.status === "warning" ? "amber" : "danger"
              }`} style={{ width: "30px", height: "30px", borderRadius: "10px" }}>
                <Sprout size={15} />
              </span>
              <span style={{ 
                fontSize: "11px", 
                fontWeight: "800", 
                padding: "2px 6px", 
                borderRadius: "8px", 
                background: "rgba(255,255,255,0.06)",
                color: "var(--text)"
              }}>
                {crop.health}%
              </span>
            </div>

            <div style={{ marginTop: "12px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "800", margin: 0, color: "var(--text)" }}>{crop.name}</h3>
              <span style={{ fontSize: "10px", color: "var(--muted)", fontStyle: "italic", marginTop: "2px", display: "block" }}>
                {crop.scientific}
              </span>
            </div>
          </button>
        ))}
      </section>

      {/* Selected Crop Profile Card */}
      <section className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <span className="glass-card-title">Active Crop Analysis</span>
          <h2 className="glass-card-header" style={{ textTransform: "capitalize", margin: "4px 0 0 0" }}>{current.name}</h2>
        </div>

        <p className="detail-body">
          {current.description}
        </p>

        {/* Growth Stats Strip */}
        <div className="grid-2" style={{ background: "rgba(255,255,255,0.04)", padding: "12px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Calendar size={14} style={{ color: "var(--muted)" }} />
            <div>
              <span style={{ fontSize: "9px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "800", display: "block" }}>Planted</span>
              <strong style={{ fontSize: "11.5px", color: "var(--text)", fontWeight: "800" }}>{current.planted}</strong>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={14} style={{ color: "var(--muted)" }} />
            <div>
              <span style={{ fontSize: "9px", color: "var(--muted)", textTransform: "uppercase", fontWeight: "800", display: "block" }}>Stage</span>
              <strong style={{ fontSize: "11.5px", color: "var(--text)", fontWeight: "800" }}>{current.stage}</strong>
            </div>
          </div>
        </div>

        {/* Threat Checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <h4 className="detail-title">Key Target Pathogens</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {current.threats.map((threat, i) => (
              <div key={i} className="bullet-item">
                <span className="bullet-dot danger" />
                <span>{threat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Action Link to Scan */}
        <button onClick={onScan} className="action-button" style={{ marginTop: "8px" }}>
          <Camera size={16} />
          <span>Scan {current.name} Leaves</span>
        </button>
      </section>
    </div>
  );
}
