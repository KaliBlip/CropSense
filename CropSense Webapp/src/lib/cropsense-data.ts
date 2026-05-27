import {
  Activity,
  Biohazard,
  Bug,
  Droplets,
  Leaf,
  ShieldCheck,
  Sprout,
  SunMedium,
  ThermometerSun,
  Wind
} from "lucide-react";

export type Diagnosis = {
  label: string;
  crop: string;
  confidence: number;
  severity: "Healthy" | "Watch" | "Treat";
  summary: string;
  advice: string;
  icon: typeof Leaf;
};

export const modelClasses = [
  "anthracnose",
  "bacterial blight",
  "brown spot",
  "fall armyworm",
  "grasshopper",
  "green mite",
  "gummosis",
  "healthy",
  "leaf beetle",
  "leaf blight",
  "leaf curl",
  "leaf miner",
  "leaf spot",
  "mosaic",
  "red rust",
  "septoria leaf spot",
  "streak virus",
  "verticillium wilt"
];

export const diagnoses: Diagnosis[] = [
  {
    label: "Septoria leaf spot",
    crop: "Tomato",
    confidence: 92,
    severity: "Treat",
    summary: "Leaf spot fungus detected around lower foliage.",
    advice: "Remove infected lower leaves, mulch soil to reduce splash-up spores, and apply copper or chlorothalonil fungicide when conditions stay wet.",
    icon: Biohazard
  },
  {
    label: "Healthy",
    crop: "Cassava",
    confidence: 96,
    severity: "Healthy",
    summary: "No obvious pest or disease markers found.",
    advice: "Keep routine monitoring, balanced irrigation, organic mulch, and field notes for any new leaf color changes.",
    icon: ShieldCheck
  },
  {
    label: "Fall armyworm",
    crop: "Maize",
    confidence: 88,
    severity: "Treat",
    summary: "Chewing damage pattern suggests early larval pressure.",
    advice: "Scout leaf whorls in the morning, remove larvae where possible, then use neem or Bacillus thuringiensis for targeted control.",
    icon: Bug
  },
  {
    label: "Brown spot",
    crop: "Cassava",
    confidence: 83,
    severity: "Watch",
    summary: "Small necrotic spots detected on older leaves.",
    advice: "Improve airflow, avoid overhead irrigation, and remove badly affected leaves before the infection spreads.",
    icon: Leaf
  }
];

export const careCards = [
  {
    title: "Water at the soil",
    text: "Keep leaves dry to slow fungal spread. Morning watering helps foliage dry faster.",
    icon: Droplets
  },
  {
    title: "Open the canopy",
    text: "Prune low leaves and keep spacing generous so wind can move through the crop.",
    icon: Wind
  },
  {
    title: "Scout in daylight",
    text: "Check the underside of leaves, new shoots, and soil splash zones twice each week.",
    icon: SunMedium
  }
];

export const fieldMetrics = [
  { label: "Temp.", value: "25°C", icon: ThermometerSun, tone: "amber" },
  { label: "Humidity", value: "40%", icon: Droplets, tone: "green" },
  { label: "Light", value: "8000 lux", icon: SunMedium, tone: "amber" },
  { label: "Soil", value: "35%", icon: Activity, tone: "green" }
];

export const quickActions = [
  { label: "Weather", icon: SunMedium },
  { label: "Crops", icon: Sprout },
  { label: "Treat", icon: ShieldCheck },
  { label: "Pests", icon: Bug }
];
