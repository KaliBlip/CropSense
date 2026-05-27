import React from "react";
import { Sparkles } from "lucide-react";

interface TreatmentCardProps {
  title: string;
  steps: string;
}

export default function TreatmentCard({ title, steps }: TreatmentCardProps) {
  return (
    <div className="treatment-advice-card animate-fade-in">
      <div className="treatment-advice-title">
        <Sparkles size={16} />
        <span>Treatment & Management: {title}</span>
      </div>
      <p className="treatment-advice-content">
        {steps}
      </p>
    </div>
  );
}
