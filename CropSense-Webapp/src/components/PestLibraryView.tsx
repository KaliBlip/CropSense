"use client";

import React, { useState } from "react";
import { 
  ChevronLeft, 
  Search, 
  Bug, 
  Biohazard, 
  ShieldAlert
} from "lucide-react";

interface EncyclopediaItem {
  name: string;
  category: "fungal" | "viral" | "insect" | "healthy";
  crops: string[];
  symptoms: string;
  prevention: string;
  risk: "low" | "medium" | "high";
}

export default function PestLibraryView({ onBack }: { onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "fungal" | "viral" | "insect">("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const library: EncyclopediaItem[] = [
    {
      name: "Fall Armyworm",
      category: "insect",
      crops: ["Maize"],
      symptoms: "Ragged leaves, chewed whorls, and sawdust-like frass on the stalks.",
      prevention: "Early planting, handpick larvae, support beneficial predatory beetles, spray Bt or neem oil.",
      risk: "high"
    },
    {
      name: "Septoria Leaf Spot",
      category: "fungal",
      crops: ["Tomato"],
      symptoms: "Small circular spots on lower leaves with dark borders and grey centers.",
      prevention: "Remove infected base foliage, water soil directly, avoid overwatering, apply copper fungicide.",
      risk: "medium"
    },
    {
      name: "Cassava Mosaic Disease",
      category: "viral",
      crops: ["Cassava"],
      symptoms: "Pale green, yellow mosaic patterns on distorted, curled leaves, stunting.",
      prevention: "Plant virus-free cuttings, isolate diseased plants immediately, control vector whiteflies.",
      risk: "high"
    },
    {
      name: "Cassava Green Mite",
      category: "insect",
      crops: ["Cassava"],
      symptoms: "Yellow speckling, mottling, and shrinking of new terminal leaves.",
      prevention: "Introduce predatory phytoseiid mites, plant early in the season, select resistant cultivars.",
      risk: "medium"
    },
    {
      name: "Gummosis / Gumosis",
      category: "fungal",
      crops: ["Cashew"],
      symptoms: "Exudation of sticky amber-colored gum from bark wounds and stem cankers.",
      prevention: "Avoid mechanical stem damage, paint trunk with Bordeaux mixture paste, improve soil drainage.",
      risk: "high"
    },
    {
      name: "Anthracnose",
      category: "fungal",
      crops: ["Cashew", "Mango"],
      symptoms: "Sunken black lesions on leaf flush, flowers, twigs, and developing nuts.",
      prevention: "Prune dead wood before rains begin, spray protective copper or triazole fungicide during early vegetative flush.",
      risk: "high"
    },
    {
      name: "Tomato Leaf Curl",
      category: "viral",
      crops: ["Tomato"],
      symptoms: "Upward curling and yellowing of leaf margins, severe flower dropping, stunting.",
      prevention: "Use insect netting, control whitefly vectors, plant resistant seeds, keep fields weed-free.",
      risk: "high"
    }
  ];

  const filteredItems = library.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.crops.some(c => c.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === "all" || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="view space-y-4">
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
          <span className="eyebrow" style={{ marginBottom: "2px" }}>Diagnostic Directory</span>
          <h1 className="font-outfit">Pests & Diseases</h1>
        </div>
      </header>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search disease, pest, or crop..."
          className="search-input"
        />
        <Search size={16} className="search-icon-inside" />
      </div>

      {/* Categories Filter Scroll */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
        {(["all", "fungal", "viral", "insect"] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setFilter(cat);
              setExpandedIndex(null);
            }}
            className={`pill-toggle-button ${filter === cat ? "active" : ""}`}
            style={{
              padding: "6px 14px",
              borderRadius: "14px",
              background: filter === cat ? "var(--green)" : "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.06)",
              flexShrink: 0
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filteredItems.map((item, index) => {
          const isExpanded = expandedIndex === index;
          return (
            <div 
              key={index} 
              className="glass-card"
              style={{ 
                padding: 0,
                overflow: "hidden",
                borderColor: isExpanded ? "rgba(34, 223, 102, 0.2)" : "rgba(247, 251, 245, 0.14)"
              }}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="card-row-button"
                style={{ 
                  background: "transparent", 
                  border: 0, 
                  borderRadius: 0,
                  padding: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`icon-badge ${
                    item.category === "insect" ? "amber" :
                    item.category === "viral" ? "danger" : "sky"
                  }`} style={{ width: "34px", height: "34px", borderRadius: "12px" }}>
                    {item.category === "insect" ? <Bug size={16} /> : <Biohazard size={16} />}
                  </span>
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: "800", margin: 0, color: "var(--text)" }}>{item.name}</h3>
                    <span style={{ fontSize: "10px", color: "var(--muted)", display: "block", marginTop: "2px", textTransform: "capitalize" }}>
                      {item.crops.join(", ")} · {item.category}
                    </span>
                  </div>
                </div>

                <span style={{ 
                  fontSize: "9px", 
                  fontWeight: "800", 
                  padding: "2px 6px", 
                  borderRadius: "6px",
                  textTransform: "uppercase",
                  background: item.risk === "high" ? "rgba(255, 107, 74, 0.16)" : "rgba(240, 163, 50, 0.16)",
                  color: item.risk === "high" ? "var(--danger)" : "var(--amber)"
                }}>
                  {item.risk}
                </span>
              </button>

              {isExpanded && (
                <div 
                  className="detail-section"
                  style={{ 
                    padding: "14px 16px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                  }}
                >
                  <div>
                    <span className="detail-title">Symptoms</span>
                    <p className="detail-body">{item.symptoms}</p>
                  </div>
                  <div>
                    <span className="detail-title" style={{ color: "var(--green)" }}>Remedies & Prevention</span>
                    <p className="detail-body">{item.prevention}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--muted)" }}>
            <ShieldAlert size={36} style={{ margin: "0 auto 12px auto", opacity: 0.5 }} />
            <p style={{ fontSize: "13px", margin: 0 }}>No matching items found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
