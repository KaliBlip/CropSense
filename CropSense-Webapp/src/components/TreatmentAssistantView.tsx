"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  Leaf, 
  Beaker, 
  Scissors,
  Sparkles,
  Info,
  CheckCircle
} from "lucide-react";

interface Recipe {
  title: string;
  type: "organic" | "chemical" | "cultural";
  summary: string;
  steps: string[];
  materials: string[];
  safety: string;
}

export default function TreatmentAssistantView({ onBack }: { onBack: () => void }) {
  const [selectedDisease, setSelectedDisease] = useState("armyworm");
  const [treatmentType, setTreatmentType] = useState<"organic" | "chemical" | "cultural">("organic");

  const recipeDatabase: Record<string, Record<"organic" | "chemical" | "cultural", Recipe>> = {
    armyworm: {
      organic: {
        title: "Neem Oil & Soap Foliar Solution",
        type: "organic",
        summary: "An organic pesticide spray that disrupts the life cycle of the Fall Armyworm larvae.",
        materials: ["10ml Pure cold-pressed Neem Oil", "5ml Mild organic dish soap (emulsifier)", "1 Liter Warm water", "Hand sprayer bottle"],
        steps: [
          "Mix the warm water and organic dish soap thoroughly in the sprayer.",
          "Add the cold-pressed neem oil slowly while continuously shaking the mix.",
          "Spray the emulsified solution directly into the maize leaf whorls (funnel zone).",
          "Apply late in the afternoon/dusk when larvae are active and to avoid sun-burning leaves."
        ],
        safety: "Safe for pets and beneficial pollinators like honeybees when applied at dusk."
      },
      chemical: {
        title: "Synthetic Pyrethroid Application",
        type: "chemical",
        summary: "Targeted insecticide treatment for heavy/emergency infestations of armyworms.",
        materials: ["Permethrin / Deltamethrin concentrate", "Clean water (pH 6-7)", "Knapsack sprayer with cone nozzle", "Safety gloves, mask & goggles"],
        steps: [
          "Dilute chemical agent exactly to label instructions (typically 2-4ml/L).",
          "Adjust nozzle to a coarse mist to prevent drift.",
          "Apply directly inside leaf whorls where caterpillars harbor.",
          "Repeat scan in 7 days to check for remaining target pockets."
        ],
        safety: "Wear full PPE. Highly toxic to fish and aquatic life. Keep runoff out of drainage ditches."
      },
      cultural: {
        title: "Manual Whorl Scouting & Ash Coating",
        type: "cultural",
        summary: "Zero-cost cultural practice suitable for smallholder farms to suffocate young larvae.",
        materials: ["Dry wood ash or fine sand", "Scouting bucket", "Gloves"],
        steps: [
          "Scout rows twice weekly in early morning. Manually crush egg masses.",
          "Collect larger larvae in soapy water bucket.",
          "Drop a small pinch of dry wood ash directly into the center whorl.",
          "Ash dehydrates and suffocates tiny larvae hiding in the funnel."
        ],
        safety: "Wash hands after contact with wood ash to prevent alkaline skin irritation."
      }
    },
    spots: {
      organic: {
        title: "Baking Soda & Oil Spray",
        type: "organic",
        summary: "A mild anti-fungal spray that alters leaf surface pH to inhibit fungal spore germination.",
        materials: ["5g Sodium bicarbonate (baking soda)", "5ml Horticultural oil or canola oil", "1 Liter Lukewarm water"],
        steps: [
          "Stir baking soda and horticultural oil into the water until completely dissolved.",
          "Pour into sprayer and agitate thoroughly.",
          "Spray upper and lower surfaces of tomato leaves showing spot symptoms.",
          "Apply on a cloudy day to prevent leaf scorching."
        ],
        safety: "Test on a single leaf 24 hours prior to spraying the whole plant."
      },
      chemical: {
        title: "Copper Fungicide Application",
        type: "chemical",
        summary: "Broad spectrum copper-based fungicide spray that halts Septoria and Blight spore spread.",
        materials: ["Liquid Copper Octanoate concentrate", "Water", "Sprayer", "Safety gloves"],
        steps: [
          "Mix 10ml copper concentrate per Liter of clean water.",
          "Spray thoroughly, coating all leaves, stems, and base soil.",
          "Re-apply every 7-10 days during wet, humid weather cycles.",
          "Avoid spraying during hot sun to prevent phytotoxicity."
        ],
        safety: "Toxic if inhaled. Allow 24 hours before harvesting treated crops."
      },
      cultural: {
        title: "Sanitation, Pruning & Mulch",
        type: "cultural",
        summary: "Mechanical sanitation steps to starve fungal pathogens and prevent spore splash-up.",
        materials: ["Sharp pruning shears", "Alcohol wipes (disinfectant)", "Straw or dry grass mulch"],
        steps: [
          "Prune lower branches up to 30cm off the ground to eliminate soil contact.",
          "Wipe pruning shears with alcohol between plants to prevent crossing pathogens.",
          "Remove all infected leaves and safely burn or bury them off-site.",
          "Spread a 5cm layer of dry straw mulch around the root base to block soil splash-up."
        ],
        safety: "Do not compost diseased leaves as fungal spores can survive typical compost temperatures."
      }
    }
  };

  const currentRecipe = recipeDatabase[selectedDisease]?.[treatmentType];

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
          <span className="eyebrow" style={{ marginBottom: "2px" }}>AI Treatment Lab</span>
          <h1 className="font-outfit">Remedy Builder</h1>
        </div>
      </header>

      {/* Target Selector */}
      <section className="glass-card" style={{ padding: "14px" }}>
        <h3 className="glass-card-title">Select Target Issue</h3>
        <div className="grid-2" style={{ marginTop: "10px" }}>
          <button
            onClick={() => setSelectedDisease("armyworm")}
            className={`pill-toggle-button-outline ${selectedDisease === "armyworm" ? "active" : ""}`}
            style={{ padding: "12px", minHeight: "68px", borderRadius: "18px" }}
          >
            <strong style={{ fontSize: "12.5px", color: "var(--text)" }}>Fall Armyworm</strong>
            <span style={{ fontSize: "9px", color: "var(--muted)", textTransform: "capitalize", marginTop: "2px" }}>Maize Pest</span>
          </button>
          <button
            onClick={() => setSelectedDisease("spots")}
            className={`pill-toggle-button-outline ${selectedDisease === "spots" ? "active" : ""}`}
            style={{ padding: "12px", minHeight: "68px", borderRadius: "18px" }}
          >
            <strong style={{ fontSize: "12.5px", color: "var(--text)" }}>Leaf Spot</strong>
            <span style={{ fontSize: "9px", color: "var(--muted)", textTransform: "capitalize", marginTop: "2px" }}>Tomato Fungus</span>
          </button>
        </div>
      </section>

      {/* Treatment Type Selector */}
      <section className="pill-toggle-container">
        {[
          { type: "organic", icon: Leaf, label: "Organic" },
          { type: "chemical", icon: Beaker, label: "Chemical" },
          { type: "cultural", icon: Scissors, label: "Cultural" }
        ].map((item) => (
          <button
            key={item.type}
            onClick={() => setTreatmentType(item.type as any)}
            className={`pill-toggle-button ${treatmentType === item.type ? "active" : ""}`}
          >
            <item.icon size={12} />
            <span>{item.label}</span>
          </button>
        ))}
      </section>

      {/* Recipe Card */}
      {currentRecipe && (
        <section className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={14} style={{ color: "var(--green)" }} />
              <span className="glass-card-title" style={{ margin: 0 }}>Formulated Recipe</span>
            </div>
            <h2 className="glass-card-header" style={{ margin: "6px 0 0 0" }}>{currentRecipe.title}</h2>
            <p className="detail-body" style={{ marginTop: "4px" }}>{currentRecipe.summary}</p>
          </div>

          {/* Materials */}
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

          {/* Steps */}
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

          {/* Safety */}
          <div className="warn-banner">
            <Info size={16} style={{ color: "var(--amber)", flexShrink: 0, marginTop: "2px" }} />
            <p>{currentRecipe.safety}</p>
          </div>
        </section>
      )}
    </div>
  );
}
