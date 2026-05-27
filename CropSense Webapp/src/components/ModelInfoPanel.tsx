import React from "react";
import { Info, X, Sliders, Database, Layers } from "lucide-react";
import { modelClasses } from "@/lib/cropsense-data";

interface ModelInfoPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModelInfoPanel({ isOpen, onClose }: ModelInfoPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="model-panel-overlay">
      {/* Tap out area */}
      <div className="model-panel-tapout" onClick={onClose} />
      
      {/* Sliding Sheet */}
      <div className="model-panel-sheet">
        
        {/* Header */}
        <div className="model-panel-header">
          <div className="model-panel-title">
            <Info size={20} />
            <h2>Model Specifications</h2>
          </div>
          <button onClick={onClose} className="model-panel-close">
            <X size={20} />
          </button>
        </div>

        {/* Content Specs Grid */}
        <div className="model-specs-grid">
          <div className="model-spec-tile">
            <Layers size={16} />
            <div className="model-spec-label">Architecture</div>
            <div className="model-spec-value">ResNet50</div>
          </div>
          
          <div className="model-spec-tile">
            <Database size={16} />
            <div className="model-spec-label">Input size</div>
            <div className="model-spec-value">224 × 224 px</div>
          </div>
          
          <div className="model-spec-tile">
            <Sliders size={16} />
            <div className="model-spec-label">Classes</div>
            <div className="model-spec-value">{modelClasses.length} distinct</div>
          </div>
          
          <div className="model-spec-tile">
            <Sliders size={16} />
            <div className="model-spec-label">Accuracy</div>
            <div className="model-spec-value">96.0% Top-1</div>
          </div>
        </div>

        {/* Unified Dataset Details */}
        <div className="model-info-block">
          <div className="model-info-desc">
            <Database size={16} />
            <span>Training Context</span>
          </div>
          <p>
            Trained using Transfer Learning and fine-tuning on a unified dataset of over <strong>96,000+ augmented crop leaf images</strong>, validated by botanical pathologists in Ghana.
          </p>
        </div>

        {/* Scrollable Classes list */}
        <div className="model-classes-section">
          <h3 className="model-classes-title">Detectable Classes ({modelClasses.length})</h3>
          <div className="model-classes-grid">
            {modelClasses.map((cls) => (
              <div key={cls} className="model-class-item">
                <span className="model-class-dot" />
                <span className="model-class-text">{cls}</span>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}
