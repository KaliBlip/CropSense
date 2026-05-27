import {
  Leaf,
  Bug,
  Droplets,
  Scissors,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Activity,
  Wind,
  SunMedium,
  CheckCircle,
  HelpCircle,
  LucideIcon
} from "lucide-react";

export interface DiseaseInfo {
  name: string;
  crop: string;
  category: "fungal" | "bacterial" | "viral" | "insect" | "healthy" | "algal";
  risk: "low" | "medium" | "high";
  symptoms: string;
  treatment: {
    organic: {
      title: string;
      summary: string;
      materials: string[];
      steps: string[];
      safety: string;
    };
    chemical: {
      title: string;
      summary: string;
      materials: string[];
      steps: string[];
      safety: string;
    };
    cultural: {
      title: string;
      summary: string;
      materials: string[];
      steps: string[];
      safety: string;
    };
  };
  prevention: {
    title: string;
    text: string;
    iconName: "Droplets" | "Scissors" | "ShieldCheck" | "Wind" | "SunMedium" | "Flame" | "Activity";
  }[];
}

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  "anthracnose": {
    name: "Anthracnose",
    crop: "Cashew, Mango",
    category: "fungal",
    risk: "high",
    symptoms: "Sunken black lesions on leaf flush, flowers, twigs, and developing nuts; rapid leaf drop and flower shriveling.",
    treatment: {
      organic: {
        title: "Neem Oil & Potassium Bicarbonate Spray",
        summary: "An organic antifungal blend that disrupts fungal spore cell walls and prevents further infestation.",
        materials: ["10ml Pure cold-pressed Neem Oil", "5g Potassium bicarbonate", "5ml Organic liquid soap", "1 Liter Warm water"],
        steps: [
          "Dissolve potassium bicarbonate and soap in the warm water completely.",
          "Add neem oil slowly while continuously shaking the solution to create an emulsion.",
          "Thoroughly spray the leaf flush, twigs, and flower panicles.",
          "Apply early morning or late evening every 7 days until new growth hardens."
        ],
        safety: "Safe for non-target organisms; avoid applying during hot, direct sunlight to prevent foliage leaf burn."
      },
      chemical: {
        title: "Copper-Oxychloride Foliar Application",
        summary: "A protective, contact fungicide application designed to form a barrier against fungal spore germination.",
        materials: ["Copper Oxychloride 50% WP powder", "Water", "Pressure sprayer with fine mist nozzle", "Full PPE (gloves, mask, goggles)"],
        steps: [
          "Mix 3g copper oxychloride per Liter of water in the spray tank.",
          "Agitate thoroughly to keep the powder suspended in the liquid.",
          "Coarsely spray all parts of the tree canopy, ensuring complete wetting of leaves and flower shoots.",
          "Re-apply at 14-day intervals during periods of high humidity and rainfall."
        ],
        safety: "Extremely toxic to aquatic systems. Wear full protective clothing and wash hands thoroughly after application."
      },
      cultural: {
        title: "Sanitation and Canopy Thinning",
        summary: "Mechanical removal of infected material and canopy management to drastically reduce humidity within the tree crown.",
        materials: ["Sharp pruning shears or tree saw", "70% Isopropyl alcohol (disinfectant)", "Heavy-duty collection bags"],
        steps: [
          "Locate and prune all infected twigs, dried panicles, and cankered branches 10cm below the lesion.",
          "Disinfect pruning blades with alcohol between every cut to prevent spreading spores.",
          "Gather all pruned debris, carry it completely out of the orchard, and burn or deeply bury it.",
          "Thin out dense inner branches to maximize sunlight entry and wind flow."
        ],
        safety: "Wear safety gloves and protective eyewear when pruning and handling debris."
      }
    },
    prevention: [
      {
        title: "Sanitize Orchard Floor",
        text: "Clear fallen leaves and mummified nuts around the tree base to remove primary overwintering spore reservoirs.",
        iconName: "Flame"
      },
      {
        title: "Dry Canopy Pruning",
        text: "Prune dense canopy branches during the dry season to maximize internal sunlight penetration and accelerate leaf drying.",
        iconName: "Wind"
      },
      {
        title: "Resistant Varieties",
        text: "Select and plant high-yielding cashew clones certified for genetic resistance to Anthracnose.",
        iconName: "ShieldCheck"
      }
    ]
  },
  "bacterial blight": {
    name: "Bacterial Blight",
    crop: "Cassava, Tomato, Cashew",
    category: "bacterial",
    risk: "high",
    symptoms: "Angular, water-soaked leaf spots that turn brown; leaf wilting, twig dieback, and white/yellow sticky bacterial gum oozing on stems.",
    treatment: {
      organic: {
        title: "Fermented Compost Tea & Microbial Spray",
        summary: "A biological spray containing beneficial microbes to colonize leaf surfaces and outcompete blight bacteria.",
        materials: ["1 Liter Well-aerated fermented compost tea", "5ml Molasses (microbe food)", "Fine strainer", "Hand sprayer"],
        steps: [
          "Strain the fermented compost tea through a fine mesh to prevent clogging sprayer nozzles.",
          "Stir in molasses and mix thoroughly.",
          "Spray the foliage until completely dripping, targeting both upper and lower surfaces.",
          "Re-apply weekly, especially after heavy rains, to replenish the beneficial leaf microbiome."
        ],
        safety: "Completely organic and non-toxic. Ensure the compost used was completely cured to avoid introducing pathogens."
      },
      chemical: {
        title: "Fixed Copper & Streptomycin Application",
        summary: "A chemical bactericide application used in severe cases to limit cell division of bacterial pathogens.",
        materials: ["Streptomycin sulfate powder", "Fixed copper hydroxide fungicide", "Water", "Sprayer", "PPE"],
        steps: [
          "Mix 1g streptomycin and 2g copper hydroxide per Liter of water.",
          "Agitate continuously during mixing to ensure homogeneous dissolution.",
          "Spray early in the morning when wind speeds are below 5 km/h to prevent chemical drift.",
          "Apply maximum 2-3 times per season to prevent bacteria from developing chemical resistance."
        ],
        safety: "Bactericide. Avoid inhalation. Strictly respect the pre-harvest interval (PHI) indicated on the label."
      },
      cultural: {
        title: "Eradication and Systemic Sanitization",
        summary: "Immediate removal of host vectors and strict mechanical sanitization to stop transmission in the field.",
        materials: ["Large disposal bags or burning pit", "Surgical gloves", "Pruning shears", "Bleach solution (1 part bleach to 9 parts water)"],
        steps: [
          "Identify and mark plants displaying angular water spots or oozing gum.",
          "Carefully uproot the entire infected plant, including roots, minimizing contact with neighboring crops.",
          "Place infected plants directly into disposal bags on-site, transport out of the field, and burn.",
          "Soak tools in the bleach solution for 5 minutes after handling infected crops."
        ],
        safety: "Wear gloves to prevent handling wet bacterial gum. Wash hands thoroughly with antibacterial soap."
      }
    },
    prevention: [
      {
        title: "Certified Planting Stakes",
        text: "Only source cassava stakes or tomato seeds from registered, disease-free certification programs.",
        iconName: "ShieldCheck"
      },
      {
        title: "Dry Harvesting Practices",
        text: "Never harvest stakes, prune leaves, or work in the fields when crops are wet with dew or rain to prevent bacterial transmission.",
        iconName: "Droplets"
      },
      {
        title: "Field Rotation",
        text: "Rotate fields with non-host crops (e.g. maize or groundnuts) for at least two years to break the bacterial cycle.",
        iconName: "Activity"
      }
    ]
  },
  "brown spot": {
    name: "Brown Spot",
    crop: "Cassava, Rice",
    category: "fungal",
    risk: "medium",
    symptoms: "Circular, dark brown spots on older leaves, often with faint yellow halos. In severe cases, spots merge, leaves turn yellow and drop off.",
    treatment: {
      organic: {
        title: "Baking Soda & Canola Oil Spray",
        summary: "A natural spray that changes the pH of the leaf surface, making it uninhabitable for fungal spores.",
        materials: ["5g Sodium bicarbonate (baking soda)", "5ml Canola oil", "2ml Mild liquid soap", "1 Liter Lukewarm water"],
        steps: [
          "Mix baking soda and liquid soap into the lukewarm water until dissolved.",
          "Slowly add the canola oil and shake vigorously to keep the oil emulsified.",
          "Spray all infected foliage, especially the lower canopy leaves.",
          "Apply on overcast days or late in the afternoon to prevent leaf scorching."
        ],
        safety: "Test on a single branch first. Keep out of direct sunlight immediately after spraying."
      },
      chemical: {
        title: "Chlorothalonil Broad-Spectrum Treatment",
        summary: "A highly effective contact chemical fungicide that prevents the germination and penetration of fungal spores.",
        materials: ["Chlorothalonil liquid concentrate", "Water", "Backpack sprayer", "Protective gloves and respirator mask"],
        steps: [
          "Dilute 2.5ml of chlorothalonil concentrate per Liter of clean water.",
          "Fill sprayer tank and shake to ensure uniform mixing.",
          "Spray the entire crop canopy thoroughly, paying close attention to older lower leaves.",
          "Repeat application every 10-14 days if wet, humid weather persists."
        ],
        safety: "Respirator mask is mandatory. Do not spray near water sources. Strictly keep livestock away from treated fields."
      },
      cultural: {
        title: "Lower Canopy Pruning & Leaf Raking",
        summary: "Mechanical removal of infected leaves and improved soil coverage to halt fungal life cycles.",
        materials: ["Pruning shears", "Rake", "Wheelbarrow", "Sanitizing wipes"],
        steps: [
          "Prune off the lowest 3-4 leaves of all plants, removing them from contact with the ground.",
          "Rake up all dry, fallen brown leaves from the soil surface under the plants.",
          "Transport all infected leaves away from fields and burn or bury them deep under 30cm of soil.",
          "Disinfect tools with sanitizing wipes before moving to adjacent rows."
        ],
        safety: "Wear gloves to prevent skin contact with fungal spores and pruning sap."
      }
    },
    prevention: [
      {
        title: "Wide Row Spacing",
        text: "Maintain a generous planting spacing (at least 1m x 1m) to enable strong air flow and rapid drying of leaves.",
        iconName: "Wind"
      },
      {
        title: "Deep Mulch Layer",
        text: "Apply a 5cm layer of dry grass or straw mulch to block fungal spores in the soil from splashing onto lower leaves.",
        iconName: "ShieldCheck"
      },
      {
        title: "Potassium Soil Enrichment",
        text: "Apply potassium-rich organic fertilizers like wood ash or potassium sulfate to strengthen leaf cell wall resistance.",
        iconName: "Activity"
      }
    ]
  },
  "fall armyworm": {
    name: "Fall Armyworm",
    crop: "Maize",
    category: "insect",
    risk: "high",
    symptoms: "Ragged, irregular chewing holes on leaves; sawdust-like yellow-brown larval droppings (frass) packed inside the whorl; chewed ears.",
    treatment: {
      organic: {
        title: "Bt (Bacillus thuringiensis) Targeted Spray",
        summary: "A biological control containing soil bacteria that produces crystalline proteins toxic specifically to armyworm caterpillars.",
        materials: ["Bt (Bacillus thuringiensis var. kurstaki) wettable powder", "Clean water (non-chlorinated preferred)", "Hand sprayer"],
        steps: [
          "Dissolve 2g of Bt powder in 1 Liter of clean water.",
          "Shake vigorously and let stand for 5 minutes.",
          "Spray directly inside the leaf whorl (funnel) where armyworms feed.",
          "Apply late in the afternoon or dusk to prevent UV rays from breaking down the Bt proteins."
        ],
        safety: "Harmless to humans, pets, bees, and other beneficial predators. Do not mix with copper fungicides."
      },
      chemical: {
        title: "Chlorantraniliprole Whorl Application",
        summary: "A highly effective systemic insecticide that targets the insect muscle system, causing rapid feeding cessation.",
        materials: ["Chlorantraniliprole insecticide (e.g., Coragen)", "Water", "Knapsack sprayer with narrow cone nozzle", "Full chemical PPE"],
        steps: [
          "Mix 0.5ml chlorantraniliprole per Liter of water according to manufacturer guidelines.",
          "Adjust the spray nozzle to a concentrated spray stream.",
          "Direct the nozzle tip directly into the leaf whorl of each maize plant, giving a quick 2-second blast.",
          "Re-apply in 14 days if scouting shows active young larvae hatching."
        ],
        safety: "Wear gloves, protective suit, and goggles. Highly toxic if swallowed. Keep out of aquatic environments."
      },
      cultural: {
        title: "Scouting, Handpicking & Ash Suffocation",
        summary: "Physical removal of pests combined with localized dry-material application to suffocate hiding caterpillars.",
        materials: ["Dry, sifted wood ash or fine river sand", "Bucket of soapy water", "Heavy gloves"],
        steps: [
          "Walk through the fields twice a week in early morning. Manually crush golden egg masses on leaves.",
          "Hand-pick active caterpillars and drop them into the soapy water bucket to kill them.",
          "Take a small pinch of wood ash or sand and drop it directly into the center leaf whorl of affected plants.",
          "The ash dehydrates and physically suffocates larvae hiding deep inside the crop funnel."
        ],
        safety: "Wear gloves to prevent skin irritation from highly alkaline wood ash."
      }
    },
    prevention: [
      {
        title: "Intercrop Push-Pull",
        text: "Plant Desmodium between rows to repel moths (Push) and Napier grass on borders to trap them (Pull).",
        iconName: "ShieldCheck"
      },
      {
        title: "Early Season Planting",
        text: "Plant maize as early as possible to allow the crop to pass the vulnerable young stage before pest populations peak.",
        iconName: "Activity"
      },
      {
        title: "Encourage Bird Predators",
        text: "Install simple bird perches around the field borders to attract insectivorous birds that feed on armyworm larvae.",
        iconName: "Wind"
      }
    ]
  },
  "grasshopper": {
    name: "Grasshopper",
    crop: "Cassava, Maize, Tomato",
    category: "insect",
    risk: "medium",
    symptoms: "Large, clean chewing wounds on leaf margins; severe infestations lead to stripped stalks and defoliation of young seedlings.",
    treatment: {
      organic: {
        title: "Garlic & Chili Insect Repellent Spray",
        summary: "A homemade hot botanical spray that acts as a strong feeding deterrent and repellent for grasshoppers.",
        materials: ["50g Crushed hot red chilies", "50g Crushed garlic cloves", "1 Liter Water", "2ml Liquid soap", "Strainer", "Sprayer"],
        steps: [
          "Boil the crushed garlic and chili in water for 15 minutes.",
          "Allow the mixture to cool completely and steep for 24 hours.",
          "Strain the liquid thoroughly through a fine cloth and mix in the liquid soap.",
          "Spray the mixture thoroughly onto the leaves of all vulnerable crops every 4-5 days."
        ],
        safety: "Extremely irritating to eyes. Wear safety goggles and gloves when mixing and spraying."
      },
      chemical: {
        title: "Cypermethrin Boundary Treatment",
        summary: "A fast-acting synthetic pyrethroid insecticide spray applied to field borders to create an insect barrier.",
        materials: ["Cypermethrin concentrate", "Water", "Compression sprayer", "Respirator and gloves"],
        steps: [
          "Dilute cypermethrin at 1.5ml per Liter of water.",
          "Spray a 2-meter wide buffer strip of grass and weeds around the cash crop field.",
          "Spray directly on any dense hopper swarms visible during early morning.",
          "Avoid direct application to flowering crops to protect beneficial pollinators."
        ],
        safety: "Highly toxic to honeybees, butterflies, and fish. Never apply near water bodies or blooming flowers."
      },
      cultural: {
        title: "Early Morning Catching & Buffer Strips",
        summary: "Physical collection when insects are lethargic, combined with vegetation barriers.",
        materials: ["Fine butterfly nets or plastic bags", "Soapy water bucket", "Weed-whacker or scythe"],
        steps: [
          "Scout fields at dawn when grasshoppers are stiff and slow due to cold temperatures.",
          "Manually sweep them into nets or shake them off plants directly into soapy water.",
          "Cut down grass and weeds for 2 meters surrounding the crop fields to deny hoppers staging grounds.",
          "Leave a small perimeter patch of wild grass as a decoy, then spray that patch to neutralize incoming hoppers."
        ],
        safety: "None. Safe and completely chemical-free process."
      }
    },
    prevention: [
      {
        title: "Tilled Field Borders",
        text: "Till the soil around field borders in late autumn or dry season to expose and destroy grasshopper egg pods buried in the ground.",
        iconName: "Flame"
      },
      {
        title: "Decoy Perimeter Crops",
        text: "Plant borders of tall sunflowers or sorghum around primary fields to serve as barrier crops that grasshoppers feed on first.",
        iconName: "ShieldCheck"
      },
      {
        title: "Poultry Integration",
        text: "Allow ducks or chickens to forage in field borders; they are highly efficient at consuming grasshopper nymphs.",
        iconName: "Activity"
      }
    ]
  },
  "grasshoper": {
    // Alias to handle model spelling variation
    name: "Grasshopper",
    crop: "Cassava, Maize, Tomato",
    category: "insect",
    risk: "medium",
    symptoms: "Large, clean chewing wounds on leaf margins; severe infestations lead to stripped stalks and defoliation of young seedlings.",
    treatment: {
      organic: {
        title: "Garlic & Chili Insect Repellent Spray",
        summary: "A homemade hot botanical spray that acts as a strong feeding deterrent and repellent for grasshoppers.",
        materials: ["50g Crushed hot red chilies", "50g Crushed garlic cloves", "1 Liter Water", "2ml Liquid soap", "Strainer", "Sprayer"],
        steps: [
          "Boil the crushed garlic and chili in water for 15 minutes.",
          "Allow the mixture to cool completely and steep for 24 hours.",
          "Strain the liquid thoroughly through a fine cloth and mix in the liquid soap.",
          "Spray the mixture thoroughly onto the leaves of all vulnerable crops every 4-5 days."
        ],
        safety: "Extremely irritating to eyes. Wear safety goggles and gloves when mixing and spraying."
      },
      chemical: {
        title: "Cypermethrin Boundary Treatment",
        summary: "A fast-acting synthetic pyrethroid insecticide spray applied to field borders to create an insect barrier.",
        materials: ["Cypermethrin concentrate", "Water", "Compression sprayer", "Respirator and gloves"],
        steps: [
          "Dilute cypermethrin at 1.5ml per Liter of water.",
          "Spray a 2-meter wide buffer strip of grass and weeds around the cash crop field.",
          "Spray directly on any dense hopper swarms visible during early morning.",
          "Avoid direct application to flowering crops to protect beneficial pollinators."
        ],
        safety: "Highly toxic to honeybees, butterflies, and fish. Never apply near water bodies or blooming flowers."
      },
      cultural: {
        title: "Early Morning Catching & Buffer Strips",
        summary: "Physical collection when insects are lethargic, combined with vegetation barriers.",
        materials: ["Fine butterfly nets or plastic bags", "Soapy water bucket", "Weed-whacker or scythe"],
        steps: [
          "Scout fields at dawn when grasshoppers are stiff and slow due to cold temperatures.",
          "Manually sweep them into nets or shake them off plants directly into soapy water.",
          "Cut down grass and weeds for 2 meters surrounding the crop fields to deny hoppers staging grounds.",
          "Leave a small perimeter patch of wild grass as a decoy, then spray that patch to neutralize incoming hoppers."
        ],
        safety: "None. Safe and completely chemical-free process."
      }
    },
    prevention: [
      {
        title: "Tilled Field Borders",
        text: "Till the soil around field borders in late autumn or dry season to expose and destroy grasshopper egg pods buried in the ground.",
        iconName: "Flame"
      },
      {
        title: "Decoy Perimeter Crops",
        text: "Plant borders of tall sunflowers or sorghum around primary fields to serve as barrier crops that grasshoppers feed on first.",
        iconName: "ShieldCheck"
      },
      {
        title: "Poultry Integration",
        text: "Allow ducks or chickens to forage in field borders; they are highly efficient at consuming grasshopper nymphs.",
        iconName: "Activity"
      }
    ]
  },
  "green mite": {
    name: "Cassava Green Mite",
    crop: "Cassava",
    category: "insect",
    risk: "high",
    symptoms: "Yellow speckling, mottling, and shrinking of new terminal leaves; stunted shoot tips and early leaf drop starting from the top.",
    treatment: {
      organic: {
        title: "Rosemary Oil & Insecticidal Soap Spray",
        summary: "A contact botanical acaricide that suffocates adult mites and dissolves the protective coating of mite eggs.",
        materials: ["10ml Organic Rosemary essential oil", "15ml Potassium salts of fatty acids (insecticidal soap)", "1 Liter Warm water"],
        steps: [
          "Mix the insecticidal soap thoroughly into the warm water to create an emulsifying base.",
          "Add the rosemary oil and shake vigorously for 2 minutes.",
          "Spray the mixture, focusing heavily on the undersides of the top leaves where green mites colonize.",
          "Repeat spraying every 5 days for 3 cycles to disrupt egg hatchings."
        ],
        safety: "Avoid spraying during peak heat hours. Safe for mammals and birds."
      },
      chemical: {
        title: "Abamectin Systemic Miticide",
        summary: "A systemic acaricide that penetrates leaves, killing mites as they suck sap from the leaf tissues.",
        materials: ["Abamectin 1.8% EC liquid concentrate", "Water", "Hose-end or compression sprayer", "Full chemical PPE"],
        steps: [
          "Dilute abamectin at 0.5ml per Liter of clean water.",
          "Spray the top canopy of the cassava crop thoroughly, ensuring spray mist coats leaf undersides.",
          "Apply early in the morning when dew has evaporated.",
          "Limit use to twice a year to prevent mites from establishing resistance."
        ],
        safety: "Highly toxic. Observe a strict 21-day pre-harvest interval. Extremely toxic to bees; do not spray near blooming weeds."
      },
      cultural: {
        title: "High-Pressure Canopy Wash & Pruning",
        summary: "Mechanical removal of mites through overhead watering and targeted pruning of high-density infected tips.",
        materials: ["High-pressure water hose or pump", "Pruning shears", "Disposal bag"],
        steps: [
          "Prune off heavily stunted and curled terminal leaf tips showing dense mottling.",
          "Place pruned tips immediately into plastic bags to prevent mites from transferring to healthy plants.",
          "Blast the remaining canopy leaves from below with high-pressure water sprays in early morning.",
          "Apply wood ash to the soil surface under the crop to prevent dislodged mites from climbing back up."
        ],
        safety: "Wear eye protection to prevent water splash and plant sap from entering eyes."
      }
    },
    prevention: [
      {
        title: "Predatory Mite Release",
        text: "Introduce predatory mites (Typhlodromalus aripo), which feed exclusively on cassava green mites as a natural biological control.",
        iconName: "ShieldCheck"
      },
      {
        title: "Early Season Planting",
        text: "Plant cassava early in the rainy season to allow plants to grow strong and vigorous before dry conditions boost mite numbers.",
        iconName: "Activity"
      },
      {
        title: "Deterrent Cultivars",
        text: "Select cassava cultivars characterized by high densities of hair on terminal leaves, which physically blocks mite feeding.",
        iconName: "Wind"
      }
    ]
  },
  "gummosis": {
    name: "Gummosis",
    crop: "Cashew",
    category: "fungal",
    risk: "high",
    symptoms: "Oozing of sticky, amber-colored resin or gum from cracks in trunk and bark; dark, sunken bark cankers; progressive branch dieback.",
    treatment: {
      organic: {
        title: "Bordeaux Paste Trunk Coating",
        summary: "An organic copper-lime slurry applied to the bark to dehydrate fungal structures and sanitize oozing wounds.",
        materials: ["100g Copper sulfate", "200g Hydrated lime", "1 Liter Water (to make a thick paste)", "Paintbrush", "Scraper"],
        steps: [
          "Gently scrape away the sticky oozing gum and dead bark from lesions using the scraper.",
          "Dissolve copper sulfate and lime separately in water, then mix together to form a thick blue paint-like paste.",
          "Paint the paste directly over and 5cm around the scraped lesions on the trunk.",
          "Apply during a dry spell to allow the paste to cure and adhere properly to the bark."
        ],
        safety: "Highly corrosive to skin and eyes. Wear thick rubber gloves and safety goggles during preparation and painting."
      },
      chemical: {
        title: "Foliar Phosphonate & Trunk Injection",
        summary: "A systemic fungicide treatment that moves throughout the vascular system to combat active Phytophthora infections.",
        materials: ["Fosetyl-aluminum wettable powder or Potassium phosphonate liquid", "Water", "Syringe injectors (for trunk injection)", "PPE"],
        steps: [
          "Mix 2.5g of fosetyl-aluminum per Liter of water for foliar application.",
          "Spray the foliar canopy until runoff to provide systemic preventative protection.",
          "For infected trunks: drill small 5mm holes into active cankers at a 45-degree angle and inject concentrated phosphonate.",
          "Seal the drill holes with tree grafting wax after injection."
        ],
        safety: "Observe chemical safety labeling. Drill holes must be sterilized to avoid secondary wood-boring pest entry."
      },
      cultural: {
        title: "Canker Excision and Soil Grading",
        summary: "Surgical removal of diseased cambium and soil management to prevent moisture retention around root crowns.",
        materials: ["Sharp wood chisel and mallet", "70% Alcohol (for tools)", "Tree wound dressing compound", "Shovel"],
        steps: [
          "Chisel out infected bark and dark-stained wood tissue until clean, bright white healthy wood is exposed.",
          "Sterilize the chisel blade with alcohol after every scrape.",
          "Coat the exposed clean wood with tree wound dressing compound to prevent rot and pest access.",
          "Shovel soil away from the base of the trunk to ensure the root flare is exposed and dry."
        ],
        safety: "Wear heavy leather gloves and safety glasses. Avoid deep chiseling that girdles more than 30% of the trunk circumference."
      }
    },
    prevention: [
      {
        title: "Prevent Mechanical Injury",
        text: "Train field workers to avoid hitting tree trunks with weeding hoes, machetes, or mowing equipment.",
        iconName: "ShieldCheck"
      },
      {
        title: "Trunk Painting Whitewash",
        text: "Paint the lower 1m of tree trunks with white latex paint mixed with copper fungicide before the wet season to deter insects and fungi.",
        iconName: "SunMedium"
      },
      {
        title: "Improve Base Drainage",
        text: "Grade the soil surrounding tree trunks to slope downward, preventing water from pooling at the base.",
        iconName: "Activity"
      }
    ]
  },
  "gumosis": {
    // Alias to handle model spelling variation
    name: "Gummosis",
    crop: "Cashew",
    category: "fungal",
    risk: "high",
    symptoms: "Oozing of sticky, amber-colored resin or gum from cracks in trunk and bark; dark, sunken bark cankers; progressive branch dieback.",
    treatment: {
      organic: {
        title: "Bordeaux Paste Trunk Coating",
        summary: "An organic copper-lime slurry applied to the bark to dehydrate fungal structures and sanitize oozing wounds.",
        materials: ["100g Copper sulfate", "200g Hydrated lime", "1 Liter Water (to make a thick paste)", "Paintbrush", "Scraper"],
        steps: [
          "Gently scrape away the sticky oozing gum and dead bark from lesions using the scraper.",
          "Dissolve copper sulfate and lime separately in water, then mix together to form a thick blue paint-like paste.",
          "Paint the paste directly over and 5cm around the scraped lesions on the trunk.",
          "Apply during a dry spell to allow the paste to cure and adhere properly to the bark."
        ],
        safety: "Highly corrosive to skin and eyes. Wear thick rubber gloves and safety goggles during preparation and painting."
      },
      chemical: {
        title: "Foliar Phosphonate & Trunk Injection",
        summary: "A systemic fungicide treatment that moves throughout the vascular system to combat active Phytophthora infections.",
        materials: ["Fosetyl-aluminum wettable powder or Potassium phosphonate liquid", "Water", "Syringe injectors (for trunk injection)", "PPE"],
        steps: [
          "Mix 2.5g of fosetyl-aluminum per Liter of water for foliar application.",
          "Spray the foliar canopy until runoff to provide systemic preventative protection.",
          "For infected trunks: drill small 5mm holes into active cankers at a 45-degree angle and inject concentrated phosphonate.",
          "Seal the drill holes with tree grafting wax after injection."
        ],
        safety: "Observe chemical safety labeling. Drill holes must be sterilized to avoid secondary wood-boring pest entry."
      },
      cultural: {
        title: "Canker Excision and Soil Grading",
        summary: "Surgical removal of diseased cambium and soil management to prevent moisture retention around root crowns.",
        materials: ["Sharp wood chisel and mallet", "70% Alcohol (for tools)", "Tree wound dressing compound", "Shovel"],
        steps: [
          "Chisel out infected bark and dark-stained wood tissue until clean, bright white healthy wood is exposed.",
          "Sterilize the chisel blade with alcohol after every scrape.",
          "Coat the exposed clean wood with tree wound dressing compound to prevent rot and pest access.",
          "Shovel soil away from the base of the trunk to ensure the root flare is exposed and dry."
        ],
        safety: "Wear heavy leather gloves and safety glasses. Avoid deep chiseling that girdles more than 30% of the trunk circumference."
      }
    },
    prevention: [
      {
        title: "Prevent Mechanical Injury",
        text: "Train field workers to avoid hitting tree trunks with weeding hoes, machetes, or mowing equipment.",
        iconName: "ShieldCheck"
      },
      {
        title: "Trunk Painting Whitewash",
        text: "Paint the lower 1m of tree trunks with white latex paint mixed with copper fungicide before the wet season to deter insects and fungi.",
        iconName: "SunMedium"
      },
      {
        title: "Improve Base Drainage",
        text: "Grade the soil surrounding tree trunks to slope downward, preventing water from pooling at the base.",
        iconName: "Activity"
      }
    ]
  },
  "healthy": {
    name: "Healthy Leaf",
    crop: "Cashew, Cassava, Maize, Tomato",
    category: "healthy",
    risk: "low",
    symptoms: "Leaves display rich, uniform color, strong vascular structural turgor, free of spots, pest chewing, or viral mottling.",
    treatment: {
      organic: {
        title: "Seaweed Foliar Nutrient Boost",
        summary: "Apply organic seaweed extract to provide vital trace micronutrients and strengthen plant immunity against stress.",
        materials: ["5ml Liquid seaweed extract", "1 Liter Clean rainwater", "Hand mister bottle"],
        steps: [
          "Dilute the seaweed extract in the rainwater.",
          "Pour into the mister and shake thoroughly.",
          "Lightly mist the leaves early in the morning.",
          "Apply once every 3 weeks to support strong cellular growth."
        ],
        safety: "100% safe, non-toxic, and beneficial to all crop types."
      },
      chemical: {
        title: "No Chemical Action Required",
        summary: "A healthy plant requires zero chemical pesticide or fungicide applications. Avoid chemical applications to protect the soil ecosystem.",
        materials: ["None"],
        steps: [
          "Refrain from applying synthetic chemical fungicides or insecticides.",
          "Rely on organic fertility maintenance to support root microbes."
        ],
        safety: "Saves chemical input costs and protects beneficial pollinators."
      },
      cultural: {
        title: "Standard Companion Planting & Soil Aeration",
        summary: "Cultural habits to preserve plant health, including soil aeration and biodiversity companion planting.",
        materials: ["Hand hand-cultivator fork", "Organic compost mulch", "Companion seeds (e.g. marigolds, basil)"],
        steps: [
          "Gently loosen the top 2cm of soil around the root zone, taking care not to disturb roots.",
          "Spread a 3cm layer of organic compost to nourish the soil.",
          "Plant insect-repelling companions like marigolds or basil nearby.",
          "Maintain a steady, deep watering schedule based on weather requirements."
        ],
        safety: "Ensure compost is well-aged to avoid damaging plant roots."
      }
    },
    prevention: [
      {
        title: "Proactive Scouting",
        text: "Maintain a routine of inspecting leaves twice weekly, examining undersides and new shoots for any early warning signs.",
        iconName: "SunMedium"
      },
      {
        title: "Drip Irrigation Use",
        text: "Utilize ground-level drip irrigation rather than overhead sprinklers to keep leaf surfaces dry and free of fungal activity.",
        iconName: "Droplets"
      },
      {
        title: "Soil Quality Monitoring",
        text: "Test your farm's soil pH and key N-P-K nutrient levels annually to maintain a balanced, healthy root environment.",
        iconName: "Activity"
      }
    ]
  },
  "leaf beetle": {
    name: "Leaf Beetle",
    crop: "Cashew, Maize, Tomato",
    category: "insect",
    risk: "medium",
    symptoms: "Numerous small, circular chewed holes (shot-holes) scattered across leaves, leaving a lacy skeleton-like leaf appearance.",
    treatment: {
      organic: {
        title: "Diatomaceous Earth & Neem Foliar Powder",
        summary: "A mechanical and botanical control method that lacerates beetle exoskeletons and deters feeding behavior.",
        materials: ["Food-grade Diatomaceous Earth (DE) powder", "Hand duster or powder bellows", "Dust mask"],
        steps: [
          "Wait for a dry morning when leaves are dry or have very light dew.",
          "Put on the dust mask to avoid inhaling fine powder.",
          "Load the hand duster with food-grade diatomaceous earth powder.",
          "Dust a fine, uniform layer of powder over all foliage, targeting leaf tops."
        ],
        safety: "Avoid inhaling DE dust. Powder must be re-applied after heavy rains as it becomes ineffective when wet."
      },
      chemical: {
        title: "Spinosad Contact Insecticide",
        summary: "A chemical insecticide derived from soil bacteria that targets the central nervous system of leaf beetles upon contact.",
        materials: ["Spinosad concentrate", "Water", "Hand sprayer", "Protective gloves"],
        steps: [
          "Mix 4ml of spinosad concentrate per Liter of water.",
          "Shake sprayer well to achieve full mixture dispersion.",
          "Spray the foliage thoroughly, targeting areas where active beetles are congregating.",
          "Apply late in the evening when bees are inactive to prevent pollinator contact."
        ],
        safety: "Toxic to bees when wet; safe once dry. Do not apply near water bodies."
      },
      cultural: {
        title: "Manual Trap Crops & Jar Shaking",
        summary: "Mechanical removal of beetles and decoy plants to attract beetles away from cash crops.",
        materials: ["Bucket filled with water and 20ml dish soap", "Row cover mesh", "Decoy mustard plants"],
        steps: [
          "Inspecting fields at dusk or dawn, gently shake infested branches directly over the soapy water bucket.",
          "Beetles will drop into the soapy water and drown immediately.",
          "Cover young seedlings with protective floating row covers until they are strong enough to withstand feeding.",
          "Plant decoy mustard or radish crops on field borders to attract and contain beetles."
        ],
        safety: "None. Completely safe and physical method."
      }
    },
    prevention: [
      {
        title: "Crop Rotation Cycle",
        text: "Rotate nightshade and grass family crops out of the affected plot for at least one year to break beetle pupae cycles in the soil.",
        iconName: "Activity"
      },
      {
        title: "Thick Straw Mulch",
        text: "Spread a heavy layer of straw mulch under crops to disrupt emerging beetle larvae climbing from soil to leaves.",
        iconName: "ShieldCheck"
      },
      {
        title: "Maintain Buffer Zones",
        text: "Maintain a weed-free 1-meter buffer zone around cash crops to reduce egg-laying opportunities.",
        iconName: "Wind"
      }
    ]
  },
  "leaf blight": {
    name: "Leaf Blight",
    crop: "Maize, Tomato, Cassava",
    category: "fungal",
    risk: "high",
    symptoms: "Large, long grayish-green or tan lesions running parallel to leaf veins; rapid drying and death of leaves in humid conditions.",
    treatment: {
      organic: {
        title: "Liquid Copper Octanoate Spray",
        summary: "An organic copper soap fungicide that binds to fungal protein structures, preventing spore germination.",
        materials: ["Liquid Copper Octanoate concentrate", "Clean water", "Pressure sprayer"],
        steps: [
          "Dilute 10ml copper octanoate per Liter of water in the sprayer.",
          "Mix thoroughly by shaking the tank for 1 minute.",
          "Spray the leaves thoroughly, ensuring coverage of stems and base soil.",
          "Apply early morning before temperature exceeds 28°C to prevent phytotoxicity."
        ],
        safety: "Wash hands thoroughly after use. Re-entry to sprayed fields allowed once the spray has dried."
      },
      chemical: {
        title: "Azoxystrobin Systemic Fungicide",
        summary: "A systemic chemical fungicide that enters plant tissue, providing long-lasting control of leaf blight.",
        materials: ["Azoxystrobin liquid fungicide", "Water", "Knapsack sprayer with flat fan nozzle", "Full chemical PPE"],
        steps: [
          "Mix 1.5ml of azoxystrobin concentrate per Liter of clean water.",
          "Adjust nozzle to spray a uniform, fine mist over the crop.",
          "Spray the leaves, concentrating on areas where blight lesions are starting to appear.",
          "Apply once every 14 days, up to a maximum of 3 applications per season."
        ],
        safety: "Wear goggles, gloves, and chemical-resistant clothing. Do not harvest crops for 7 days after application."
      },
      cultural: {
        title: "Foliage Removal & Tillage sanitation",
        summary: "Mechanical removal of infected leaves and soil tillage to bury fungal spore residue.",
        materials: ["Pruning shears", "Tiller or hoe", "Alcohol wipes", "Burying shovel"],
        steps: [
          "Prune off heavily blighted lower leaves showing large lesions.",
          "Wipe pruning shears with alcohol between plants to prevent crossing pathogens.",
          "Deeply till the soil around affected plants to bury infected residues, depriving spores of oxygen.",
          "Ensure water is applied only at root base, never splashing leaves."
        ],
        safety: "Wear gloves to prevent skin irritation. Do not leave pruned debris lying on the field surface."
      }
    },
    prevention: [
      {
        title: "Optimal Row Spacing",
        text: "Spacing crops at least 75cm apart to allow high wind flow and quick drying of morning dew.",
        iconName: "Wind"
      },
      {
        title: "Blight-Resistant Seed",
        text: "Source and plant only certified hybrid seeds bred with genetic resistance to Northern/Southern Leaf Blight.",
        iconName: "ShieldCheck"
      },
      {
        title: "Drip Irrigation Ditching",
        text: "Replace overhead irrigation with ground drip lines or direct furrow watering to keep crop foliage dry.",
        iconName: "Droplets"
      }
    ]
  },
  "leaf curl": {
    name: "Tomato Leaf Curl",
    crop: "Tomato",
    category: "viral",
    risk: "high",
    symptoms: "Upward curling and puckering of leaves, yellowing along leaf margins, severe flower dropping, and stunted plant growth.",
    treatment: {
      organic: {
        title: "Silver Reflective Mulch & Soap Sprays",
        summary: "A preventative and insecticidal approach targeting the insect vectors to halt virus transmission.",
        materials: ["Silver reflective mulch film", "Potassium insecticidal soap", "Water", "Sprayer"],
        steps: [
          "Lay silver reflective mulch film on nursery and planting beds to disorient flying whitefly vectors.",
          "Dilute insecticidal soap at 15ml per Liter of water.",
          "Spray the undersides of tomato leaves where whiteflies gather to feed and breed.",
          "Apply spray early morning every 3-4 days to keep vector numbers low."
        ],
        safety: "Organic soap is safe for users and environment. Avoid spraying under hot midday sun."
      },
      chemical: {
        title: "Imidacloprid Vector Control Spray",
        summary: "A systemic neonicotinoid insecticide targeting sap-sucking insects to stop them from spreading the virus.",
        materials: ["Imidacloprid liquid concentrate", "Water", "Sprayer with cone nozzle", "Protective chemical suit"],
        steps: [
          "Dilute 0.5ml imidacloprid per Liter of clean water.",
          "Spray the entire foliage of the tomato crop thoroughly, ensuring complete coverage.",
          "Target application during early vegetative stages when vector populations are rising.",
          "Apply maximum twice per crop cycle to prevent whiteflies from developing resistance."
        ],
        safety: "Highly toxic to bees and aquatic life. Never apply during crop flowering stage."
      },
      cultural: {
        title: "Immediate Roguing & Weed Isolation",
        summary: "Immediate eradication of infected plants to protect remaining healthy tomato rows.",
        materials: ["Uprooting shovel", "Disposal bags", "Weeding tool"],
        steps: [
          "Inspect rows daily. Uproot leaf-curl symptomatic plants immediately, including root balls.",
          "Place uprooted plants directly into plastic bags to avoid shaking insects onto healthy neighbors.",
          "Seal and burn the bagged plants far away from the farm fields.",
          "Thoroughly weed a 3-meter zone around the tomato beds to remove alternative host weeds."
        ],
        safety: "Wash hands and change clothes after handling infected virus-carrying plants."
      }
    },
    prevention: [
      {
        title: "Insect-Proof Netting",
        text: "Grow seedlings under 32-mesh or higher insect-proof netting in the nursery stage to prevent early infection.",
        iconName: "ShieldCheck"
      },
      {
        title: "Yellow Sticky Traps",
        text: "Install yellow sticky traps every 5 meters to capture adult whiteflies and monitor vector pressure.",
        iconName: "SunMedium"
      },
      {
        title: "Resistant Cultivars",
        text: "Ensure you plant certified TYLCV (Tomato Yellow Leaf Curl Virus) resistant hybrid tomato seeds.",
        iconName: "Activity"
      }
    ]
  },
  "leaf miner": {
    name: "Leaf Miner",
    crop: "Tomato",
    category: "insect",
    risk: "medium",
    symptoms: "Winding white or yellowish serpentine trails (mines) tunneled within leaves; leaf drying and reduced photosynthesis.",
    treatment: {
      organic: {
        title: "Parasitic Wasp Release & Neem Spray",
        summary: "Biological parasite release combined with organic foliar sprays to kill leaf miner larvae inside the leaf.",
        materials: ["Beneficial Diglyphus isaea parasitic wasps", "Cold-pressed Neem oil (10ml/L)", "Soap emulsifier", "Water"],
        steps: [
          "Release adult Diglyphus isaea wasps in the greenhouse or field near infested tomato zones.",
          "Mix neem oil and soap in warm water and agitate until fully emulsified.",
          "Spray the tomato leaves, focusing on the mines to disrupt larval development.",
          "Re-apply neem spray every 5 days for 3 cycles."
        ],
        safety: "Safe for environment. Parasitic wasps are target-specific and do not bite humans."
      },
      chemical: {
        title: "Abamectin Translaminar Treatment",
        summary: "A translaminar insecticide that passes through the leaf surface to kill mining larvae feeding inside the leaf.",
        materials: ["Abamectin 1.8% EC concentrate", "Water", "Sprayer", "Respirator and gloves"],
        steps: [
          "Dilute abamectin at 0.6ml per Liter of clean water.",
          "Spray the foliage thoroughly, ensuring a fine mist covers both sides of the leaves.",
          "Spray early morning when wind is low and humidity is higher for better leaf absorption.",
          "Do not exceed two applications per season to prevent rapid insect resistance."
        ],
        safety: "Wear protective respirator and gloves. Observe 7-day pre-harvest interval for tomatoes."
      },
      cultural: {
        title: "Mine Squeezing & Soil Cultivation",
        summary: "Physical destruction of larvae inside the leaves and mechanical tillage to destroy soil pupae.",
        materials: ["Gloves", "Tiller or rake", "Row cover fabrics"],
        steps: [
          "Locate active mines with small visible larvae, and squeeze the leaf between fingers to crush the larva.",
          "Prune and safely discard heavily mined leaves to prevent larvae from completing their lifecycle.",
          "Till the soil between planting rows to disturb and destroy leaf miner pupae wintering in the topsoil.",
          "Place fine row cover meshes over young crops to block adult flies from laying eggs."
        ],
        safety: "None. Completely safe manual cultural control method."
      }
    },
    prevention: [
      {
        title: "Yellow Sticky Cards",
        text: "Hang yellow sticky cards at canopy height to capture adult leaf miner flies before they lay eggs.",
        iconName: "SunMedium"
      },
      {
        title: "Remove Nightshade Weeds",
        text: "Remove wild nightshade weeds around fields, which serve as alternate breeding reservoirs for leaf miners.",
        iconName: "Scissors"
      },
      {
        title: "Post-Harvest Tillage",
        text: "Till the soil deeply immediately after harvest to bury pupae and prevent next season's adult fly emergence.",
        iconName: "Activity"
      }
    ]
  },
  "leaf spot": {
    name: "Leaf Spot",
    crop: "Cassava, Tomato",
    category: "fungal",
    risk: "medium",
    symptoms: "Small circular brown spots with dark margins and gray centers; leaves turn yellow and drop from base upward.",
    treatment: {
      organic: {
        title: "Baking Soda & Potassium Bicarbonate Solution",
        summary: "A mild, organic foliar spray that alters leaf surface pH to inhibit fungal spot spore germination.",
        materials: ["5g Baking soda", "5g Potassium bicarbonate", "5ml Horticultural oil", "1 Liter Lukewarm water"],
        steps: [
          "Mix the dry ingredients into the lukewarm water until completely dissolved.",
          "Stir in the horticultural oil and mix thoroughly by shaking.",
          "Spray the upper and lower surfaces of leaves showing early spots.",
          "Apply late afternoon once a week or after major rain events."
        ],
        safety: "Test on a few leaves first. Do not spray during temperatures above 30°C."
      },
      chemical: {
        title: "Chlorothalonil Fungal Spot Treatment",
        summary: "A highly effective contact chemical fungicide that halts the spread of leaf spot fungal pathogens.",
        materials: ["Chlorothalonil concentrate", "Water", "Sprayer", "Chemical goggles and gloves"],
        steps: [
          "Mix 2ml of chlorothalonil concentrate per Liter of clean water.",
          "Spray the crop foliage thoroughly, ensuring a complete coating of stems and leaf surfaces.",
          "Re-apply every 10 days if humid, wet weather conditions continue.",
          "Wash sprayer thoroughly after application."
        ],
        safety: "Respirator and protective gloves are mandatory. Highly toxic to fish; keep spray runoff away from water."
      },
      cultural: {
        title: "Lower Leaf Pruning & Ground Sanitation",
        summary: "Sanitation steps to starve fungal pathogens and prevent spores splashing up from the soil.",
        materials: ["Pruning shears", "Rake", "Sanitizing wipes", "Disposal bag"],
        steps: [
          "Prune off the lower 30cm of leaves to eliminate soil-contact splash-zones.",
          "Sanitize pruning blades with sanitizing wipes between plants.",
          "Rake up and remove all fallen infected leaves under the crop base.",
          "Burn or bury all collected infected leaf material; do not add to compost pile."
        ],
        safety: "Wear gloves when handling diseased leaves to prevent spore transfer."
      }
    },
    prevention: [
      {
        title: "Base Irrigation Drip",
        text: "Always irrigate plants directly at the base of the soil using drip lines, keeping foliage dry.",
        iconName: "Droplets"
      },
      {
        title: "Dry Grass Mulch",
        text: "Apply a 5cm layer of dry straw mulch around the root base to block soil-borne spores from splashing up.",
        iconName: "ShieldCheck"
      },
      {
        title: "Maximize Wind Flow",
        text: "Space plants generously and prune overlapping branches to maximize ventilation and dry foliage quickly.",
        iconName: "Wind"
      }
    ]
  },
  "mosaic": {
    name: "Mosaic Virus",
    crop: "Cassava, Tomato, Cashew",
    category: "viral",
    risk: "high",
    symptoms: "Green and yellow mottled patterns on leaves, puckered/distorted leaf structure, leaf narrowing, and stunted growth.",
    treatment: {
      organic: {
        title: "Insecticidal Soap Vector Management",
        summary: "Targeting vector insects organically to prevent the mechanical transmission of the virus between plants.",
        materials: ["20ml Pure insecticidal liquid soap", "1 Liter Lukewarm water", "Hand sprayer"],
        steps: [
          "Mix insecticidal soap into lukewarm water thoroughly.",
          "Spray the entire canopy of adjacent, healthy crops to repel and kill vectors like aphids and whiteflies.",
          "Apply late evening every 3 days during vector outbreaks.",
          "Remove any wild host weeds from the field borders."
        ],
        safety: "100% biodegradable and organic. Safe for soil microbes."
      },
      chemical: {
        title: "Imidacloprid Vector Suppression",
        summary: "Systemic chemical insecticide application to manage sap-sucking insects and stop virus spread.",
        materials: ["Imidacloprid insecticide", "Water", "Sprayer", "PPE suit"],
        steps: [
          "Dilute imidacloprid at 0.5ml per Liter of water.",
          "Spray the crop foliage thoroughly, ensuring a complete coating of leaf undersides.",
          "Target early vegetative stage when vector numbers are beginning to rise.",
          "Avoid spraying during flowering to protect pollinators."
        ],
        safety: "Highly toxic to bees. Observe strict pre-harvest intervals for food crops."
      },
      cultural: {
        title: "Immediate Roguing & Hand Washing",
        summary: "Immediate eradication of infected plants to protect remaining healthy cassava or tomato rows.",
        materials: ["Uprooting hoe", "Disposal bags", "Powdered milk or soap solution"],
        steps: [
          "Identify symptomatic plants with yellow mottling and uproot them immediately.",
          "Place infected crops directly into plastic bags, carry out of field, and burn.",
          "Wash hands and tools with powdered milk or a soap solution after handling infected crops before touching healthy ones.",
          "Strictly enforce tool sanitation to prevent mechanical virus transfer through sap."
        ],
        safety: "Wear gloves. Do not drag infected plants across healthy rows to prevent vector transfer."
      }
    },
    prevention: [
      {
        title: "Certified Clean Stakes",
        text: "Always plant certified virus-free cassava cuttings or purchase disease-resistant tomato seeds.",
        iconName: "ShieldCheck"
      },
      {
        title: "Reflective Mulches",
        text: "Use silver reflective mulches in tomato beds to disorient and deter whiteflies and aphids from landing.",
        iconName: "SunMedium"
      },
      {
        title: "Tool Sanitation",
        text: "Sanitize knives, pruning shears, and garden tools in a 10% bleach solution when moving between different blocks.",
        iconName: "Scissors"
      }
    ]
  },
  "red rust": {
    name: "Red Rust",
    crop: "Cashew",
    category: "algal",
    risk: "medium",
    symptoms: "Orange-brown velvety spots or pustules on leaves, twigs, and young bark; leaves turn yellow and drop off under heavy pressure.",
    treatment: {
      organic: {
        title: "Potassium Silicate Strengthening Spray",
        summary: "An organic foliar spray that deposits silica in leaf tissue, physically strengthening cells against algal entry.",
        materials: ["5ml Potassium silicate liquid", "1 Liter Rainwater", "Sprayer"],
        steps: [
          "Dilute the potassium silicate in clean rainwater.",
          "Shake vigorously and spray the leaves until wet.",
          "Apply early morning to allow the protective silica layer to dry in the sun.",
          "Re-apply every 14 days during high-humidity seasons."
        ],
        safety: "Avoid eye contact with concentrated potassium silicate. Safe for environment."
      },
      chemical: {
        title: "Copper Oxychloride Preventative Application",
        summary: "A broad-spectrum chemical algicide/fungicide that controls and suppresses red rust algal colonies.",
        materials: ["Copper Oxychloride 50% WP powder", "Water", "Sprayer", "PPE"],
        steps: [
          "Mix 3g copper oxychloride per Liter of water.",
          "Agitate thoroughly to keep the powder fully suspended.",
          "Spray the foliage, branches, and twigs thoroughly, paying special attention to lower branches.",
          "Re-apply at 14-day intervals during warm, wet periods."
        ],
        safety: "Wear gloves, goggles, and respirator mask. Toxic to aquatic life. Do not spray near ponds."
      },
      cultural: {
        title: "Twig Pruning and Ventilation Increase",
        summary: "Mechanical pruning to increase internal canopy airflow and allow sunlight to dry leaves.",
        materials: ["Pruning saw", "Alcohol wipes", "Tree wound sealant"],
        steps: [
          "Locate and prune out crowded twigs and low-hanging branches under the tree canopy.",
          "Sterilize saw blades with alcohol wipes between different trees.",
          "Apply sealant to large cuts (>2cm diameter) to prevent rot.",
          "Clear tall weeds around the tree base to improve air circulation."
        ],
        safety: "Wear heavy leather gloves. Be careful of falling branches."
      }
    },
    prevention: [
      {
        title: "Generous Tree Spacing",
        text: "Ensure trees are spaced at least 8 meters apart to allow optimal sunlight penetration and wind circulation.",
        iconName: "Wind"
      },
      {
        title: "Low Canopy Pruning",
        text: "Prune off branches that hang below 1 meter from the ground to prevent moisture-trapping microclimates.",
        iconName: "Scissors"
      },
      {
        title: "NPK Balanced Fertilization",
        text: "Apply balanced N-P-K fertilizer along with secondary trace minerals to keep tree vigor high and resistant.",
        iconName: "Activity"
      }
    ]
  },
  "septoria leaf spot": {
    name: "Septoria Leaf Spot",
    crop: "Tomato",
    category: "fungal",
    risk: "high",
    symptoms: "Numerous small circular spots on lower leaves with dark borders and grey/tan centers. Disease spreads rapidly upward.",
    treatment: {
      organic: {
        title: "Copper Octanoate Soap Foliar Spray",
        summary: "An organic copper fungicide soap that halts spore replication without building fungal resistance.",
        materials: ["Liquid Copper Octanoate concentrate", "Clean water", "Hand sprayer"],
        steps: [
          "Mix 8ml of copper octanoate concentrate per Liter of clean water.",
          "Agitate the spray bottle vigorously until fully blended.",
          "Spray both sides of all tomato leaves thoroughly, focusing on lower leaves.",
          "Apply every 7 days during warm, wet, and humid weather."
        ],
        safety: "Observe label guidelines. Wash hands thoroughly with soap after use. Safe for beneficial pollinators."
      },
      chemical: {
        title: "Chlorothalonil Systemic Preventative",
        summary: "A high-potency synthetic fungicide that stops fungal spore respiration and halts leaf spot expansion.",
        materials: ["Chlorothalonil liquid fungicide", "Water", "Sprayer", "Chemical safety goggles and gloves"],
        steps: [
          "Dilute 2ml of chlorothalonil fungicide per Liter of water.",
          "Spray the entire tomato plant, ensuring complete coverage of leaves, stems, and soil base.",
          "Apply early morning before sun is high to prevent leaf scorch.",
          "Repeat spraying every 7-10 days if high moisture and rainfall persist."
        ],
        safety: "Mandatory protective goggles and gloves. Observe pre-harvest intervals. Toxic to fish."
      },
      cultural: {
        title: "Lower Branch Pruning & Soil Mulching",
        summary: "Mechanical pruning of base foliage to block fungal splash-up from the soil.",
        materials: ["Sterilized pruning shears", "Alcohol wipes", "Dry straw or wood chip mulch"],
        steps: [
          "Prune off the lowest 30cm of tomato leaves showing spot symptoms.",
          "Disinfect pruning blades with alcohol wipes between plants.",
          "Rake up and discard all infected plant material away from the garden.",
          "Lay a 5cm layer of dry straw mulch around the base of the tomato stems to block soil splash."
        ],
        safety: "Wear gloves to prevent skin irritation. Do not compost pruned diseased leaves."
      }
    },
    prevention: [
      {
        title: "Secure Staking and Caging",
        text: "Always stake and cage tomato plants to keep all leaves elevated off the damp soil surface.",
        iconName: "ShieldCheck"
      },
      {
        title: "Ground Drip Irrigation",
        text: "Utilize ground-level drip lines or direct soil watering to ensure leaf foliage stays completely dry.",
        iconName: "Droplets"
      },
      {
        title: "3-Year Crop Rotation",
        text: "Rotate nightshade crops (tomatoes, peppers, potatoes) out of the field block on a strict 3-year schedule.",
        iconName: "Activity"
      }
    ]
  },
  "streak virus": {
    name: "Maize Streak Virus",
    crop: "Maize",
    category: "viral",
    risk: "high",
    symptoms: "Narrow, elongated, translucent yellowish streaks parallel to leaf veins; severe plant stunting and small empty ears.",
    treatment: {
      organic: {
        title: "Neem Oil & Soap Leafhopper Control",
        summary: "An organic spray targeting the leafhopper vectors to halt virus transmission between maize rows.",
        materials: ["12ml Pure cold-pressed Neem oil", "6ml Organic liquid soap", "1 Liter Warm water", "Sprayer"],
        steps: [
          "Stir liquid soap into warm water until fully mixed.",
          "Add neem oil slowly, shaking vigorously to emulsify the mixture.",
          "Spray maize leaves thoroughly, targeting undersides and whorls where leafhoppers feed.",
          "Apply late afternoon every 4-5 days during active leafhopper flights."
        ],
        safety: "Safe for non-target organisms. Spray at dusk to protect bees."
      },
      chemical: {
        title: "Deltamethrin Vector Eradication",
        summary: "A highly active synthetic pyrethroid insecticide designed to eradicate leafhoppers and stop virus spread.",
        materials: ["Deltamethrin insecticide concentrate", "Clean water", "Knapsack sprayer", "Chemical PPE"],
        steps: [
          "Dilute deltamethrin concentrate at 1.2ml per Liter of clean water.",
          "Spray maize rows, focusing on leaf coverage and field margins where hoppers harbor.",
          "Apply during early morning when leafhoppers are less active.",
          "Do not apply more than twice per growing season."
        ],
        safety: "Highly toxic to bees, aquatic life, and beneficial predators. Wear full protective suit."
      },
      cultural: {
        title: "Field Cleans & Barrier Strips",
        summary: "Eradication of host weeds and establishing non-host crop barriers to stop hopper migration.",
        materials: ["Weed hoe or string trimmer", "Legume seeds (e.g. cowpea)"],
        steps: [
          "Clear all wild grasses and weeds inside and for 5 meters around the maize field.",
          "Identify and uproot maize plants displaying translucent yellow streaks; bury them deep.",
          "Plant a 2-meter wide barrier strip of cowpeas or beans around the maize field perimeter.",
          "The non-host barrier strip slows leafhopper migration into the maize plot."
        ],
        safety: "Ensure uprooted plants are buried or burned, not composted."
      }
    },
    prevention: [
      {
        title: "Resistant Seed Varieties",
        text: "Plant only certified maize hybrids genetically bred with high resistance to Maize Streak Virus (MSV).",
        iconName: "ShieldCheck"
      },
      {
        title: "Weed-Free Planting Zones",
        text: "Ensure planting beds are cleared of all wild grasses 2 weeks prior to sowing maize seeds.",
        iconName: "Scissors"
      },
      {
        title: "Early Sowing Practice",
        text: "Plant seeds at the very onset of rains to allow maize plants to mature before leafhopper vector numbers rise.",
        iconName: "Activity"
      }
    ]
  },
  "verticillium wilt": {
    name: "Verticillium Wilt",
    crop: "Tomato, Cashew",
    category: "fungal",
    risk: "high",
    symptoms: "V-shaped yellowing of lower leaf tips, wilting during hot afternoons, and dark brown staining of inner stem vascular tissue.",
    treatment: {
      organic: {
        title: "Trichoderma Beneficial Inoculation",
        summary: "An organic biological soil treatment using beneficial fungi that colonize roots and suppress wilt pathogens.",
        materials: ["Trichoderma harzianum bio-fungicide powder", "Water", "Watering can or root drench sprayer"],
        steps: [
          "Mix 5g of Trichoderma powder per Liter of water.",
          "Stir thoroughly to create a homogeneous suspension.",
          "Pour the mixture as a root drench directly onto the soil surrounding plant bases.",
          "Apply in early morning or overcast days to protect beneficial fungal spores from heat."
        ],
        safety: "100% natural and safe for soil, humans, and wildlife."
      },
      chemical: {
        title: "Soil Solarization & Disinfection",
        summary: "No effective chemical cure exists once inside the plant tissue. Focus is on soil disinfection before planting.",
        materials: ["Heavy-duty clear plastic tarp sheeting", "Shovel", "Water"],
        steps: [
          "Remove and safely dispose of all wilted crops, including roots.",
          "Till the empty soil bed and water deeply until saturated.",
          "Lay the clear plastic tarp sheeting over the soil bed, sealing the borders with soil to trap heat.",
          "Leave the plastic in place under direct summer sun for 6-8 weeks to steam-kill soil-borne pathogens."
        ],
        safety: "Observe precautions when working in hot sun. Allows natural, chemical-free soil sterilization."
      },
      cultural: {
        title: "Strict Crop Roguing & Raising Beds",
        summary: "Immediate removal of affected plants and growing in raised beds to control water logs.",
        materials: ["Shovel", "Raised bed wood frames", "Clean soil-compost mix"],
        steps: [
          "Uproot and burn symptomatic plants immediately. Do not leave roots in the ground.",
          "Avoid planting nightshade family crops in the same plot for at least 5 years.",
          "Construct raised beds (25cm high) to improve drainage and prevent root rot.",
          "Fill beds with clean, pasteurized soil mixed with well-aged organic compost."
        ],
        safety: "Wear gloves when handling infected soil. Disinfect tools before moving to clean beds."
      }
    },
    prevention: [
      {
        title: "Beds with Excellent Drainage",
        text: "Grow crops in elevated raised beds with organic compost to prevent water-logging which favors wilt fungi.",
        iconName: "Droplets"
      },
      {
        title: "Certified Resistant Seeds",
        text: "Purchase seed varieties certified resistant to Verticillium wilt (look for the letter 'V' on seed packets).",
        iconName: "ShieldCheck"
      },
      {
        title: "Strict Tool Disinfection",
        text: "Sanitize boots, tillers, trowels, and stakes with 70% alcohol to avoid carrying infected soil to clean fields.",
        iconName: "Scissors"
      }
    ]
  },
  "verticulium wilt": {
    // Alias to handle model spelling variation
    name: "Verticillium Wilt",
    crop: "Tomato, Cashew",
    category: "fungal",
    risk: "high",
    symptoms: "V-shaped yellowing of lower leaf tips, wilting during hot afternoons, and dark brown staining of inner stem vascular tissue.",
    treatment: {
      organic: {
        title: "Trichoderma Beneficial Inoculation",
        summary: "An organic biological soil treatment using beneficial fungi that colonize roots and suppress wilt pathogens.",
        materials: ["Trichoderma harzianum bio-fungicide powder", "Water", "Watering can or root drench sprayer"],
        steps: [
          "Mix 5g of Trichoderma powder per Liter of water.",
          "Stir thoroughly to create a homogeneous suspension.",
          "Pour the mixture as a root drench directly onto the soil surrounding plant bases.",
          "Apply in early morning or overcast days to protect beneficial fungal spores from heat."
        ],
        safety: "100% natural and safe for soil, humans, and wildlife."
      },
      chemical: {
        title: "Soil Solarization & Disinfection",
        summary: "No effective chemical cure exists once inside the plant tissue. Focus is on soil disinfection before planting.",
        materials: ["Heavy-duty clear plastic tarp sheeting", "Shovel", "Water"],
        steps: [
          "Remove and safely dispose of all wilted crops, including roots.",
          "Till the empty soil bed and water deeply until saturated.",
          "Lay the clear plastic tarp sheeting over the soil bed, sealing the borders with soil to trap heat.",
          "Leave the plastic in place under direct summer sun for 6-8 weeks to steam-kill soil-borne pathogens."
        ],
        safety: "Observe precautions when working in hot sun. Allows natural, chemical-free soil sterilization."
      },
      cultural: {
        title: "Strict Crop Roguing & Raising Beds",
        summary: "Immediate removal of affected plants and growing in raised beds to control water logs.",
        materials: ["Shovel", "Raised bed wood frames", "Clean soil-compost mix"],
        steps: [
          "Uproot and burn symptomatic plants immediately. Do not leave roots in the ground.",
          "Avoid planting nightshade family crops in the same plot for at least 5 years.",
          "Construct raised beds (25cm high) to improve drainage and prevent root rot.",
          "Fill beds with clean, pasteurized soil mixed with well-aged organic compost."
        ],
        safety: "Wear gloves when handling infected soil. Disinfect tools before moving to clean beds."
      }
    },
    prevention: [
      {
        title: "Beds with Excellent Drainage",
        text: "Grow crops in elevated raised beds with organic compost to prevent water-logging which favors wilt fungi.",
        iconName: "Droplets"
      },
      {
        title: "Certified Resistant Seeds",
        text: "Purchase seed varieties certified resistant to Verticillium wilt (look for the letter 'V' on seed packets).",
        iconName: "ShieldCheck"
      },
      {
        title: "Strict Tool Disinfection",
        text: "Sanitize boots, tillers, trowels, and stakes with 70% alcohol to avoid carrying infected soil to clean fields.",
        iconName: "Scissors"
      }
    ]
  }
};
