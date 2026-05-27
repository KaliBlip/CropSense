import React from "react";
import { ClassPrediction } from "@/lib/types";

interface PredictionResultsProps {
  predictions: ClassPrediction[];
}

export default function PredictionResults({ predictions }: PredictionResultsProps) {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="confidence-stack">
      {predictions.map((pred) => {
        const percentage = Math.round(pred.confidence * 100);
        
        let medal = `#${pred.rank}`;
        if (pred.rank === 1) medal = "🥇";
        else if (pred.rank === 2) medal = "🥈";
        else if (pred.rank === 3) medal = "🥉";

        const barClass = pred.rank === 1 ? "rank-1 animate-fill" : "rank-other animate-fill";

        return (
          <div className="confidence-row" key={pred.class_name}>
            <span>{medal} {pred.class_name}</span>
            <div>
              <i 
                className={barClass}
                style={{ width: `${percentage}%` }} 
              />
            </div>
            <b>{percentage}%</b>
          </div>
        );
      })}
    </div>
  );
}
