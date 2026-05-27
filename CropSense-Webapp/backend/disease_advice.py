"""
Disease-specific treatment and management advice.
Ported from the Streamlit app.py DISEASE_ADVICE dictionary.
"""

DISEASE_ADVICE: dict[str, dict[str, str]] = {
    "anthracnose": {
        "title": "Anthracnose Management",
        "steps": (
            "Remove and destroy infected plant parts. Apply copper-based "
            "fungicides during wet weather. Enhance air circulation by "
            "spacing plants appropriately."
        ),
    },
    "bacterial blight": {
        "title": "Bacterial Blight Treatment",
        "steps": (
            "Prune infected stems 3-4 inches below the visible canker. "
            "Apply bactericides/streptomycin during active infection "
            "periods. Clean pruning tools with alcohol between cuts."
        ),
    },
    "brown spot": {
        "title": "Brown Spot Management",
        "steps": (
            "Ensure proper nitrogen fertilization to keep plants healthy. "
            "Keep foliage dry using drip irrigation. Apply chemical "
            "treatments like Mancozeb if infestation is severe."
        ),
    },
    "fall armyworm": {
        "title": "Fall Armyworm Control",
        "steps": (
            "Monitor crop leaves early for eggs/larvae. Apply botanical "
            "insecticides like Neem oil or biological controls (Bacillus "
            "thuringiensis). In severe cases, use registered chemical sprays."
        ),
    },
    "grasshoper": {
        "title": "Grasshopper Control",
        "steps": (
            "Introduce natural predators like birds/chickens. Apply organic "
            "pesticide sprays (Nosema locustae). Till soil in fall to "
            "destroy grasshopper eggs laid in the ground."
        ),
    },
    "grasshopper": {
        "title": "Grasshopper Control",
        "steps": (
            "Introduce natural predators like birds/chickens. Apply organic "
            "pesticide sprays (Nosema locustae). Till soil in fall to "
            "destroy grasshopper eggs laid in the ground."
        ),
    },
    "green mite": {
        "title": "Green Mite Control",
        "steps": (
            "Spray foliage with strong streams of water to dislodge mites. "
            "Apply insecticidal soap, Neem oil, or predatory mites "
            "(biological control)."
        ),
    },
    "gumosis": {
        "title": "Gummosis Care",
        "steps": (
            "Improve soil drainage to prevent fungal root/bark rot. Clean "
            "bark wounds and apply copper fungicide. Avoid wounding the "
            "trunk during cultivation."
        ),
    },
    "gummosis": {
        "title": "Gummosis Care",
        "steps": (
            "Improve soil drainage to prevent fungal root/bark rot. Clean "
            "bark wounds and apply copper fungicide. Avoid wounding the "
            "trunk during cultivation."
        ),
    },
    "healthy": {
        "title": "Healthy Crop Maintenance",
        "steps": (
            "Excellent! No pest or disease detected. Continue standard crop "
            "care: balanced irrigation, regular monitoring, and organic "
            "mulching to protect the root system."
        ),
    },
    "leaf beetle": {
        "title": "Leaf Beetle Control",
        "steps": (
            "Handpick beetles off the leaves. Apply insecticidal soaps or "
            "organic pyrethrin-based treatments. Row covers can protect "
            "young crops."
        ),
    },
    "leaf blight": {
        "title": "Leaf Blight Treatment",
        "steps": (
            "Avoid overhead watering to minimize leaf wetness. Apply "
            "protective fungicides containing chlorothalonil. Remove "
            "fallen leaves around the crop base."
        ),
    },
    "leaf curl": {
        "title": "Leaf Curl Management",
        "steps": (
            "Apply sulfur or copper fungicides in late winter before buds "
            "open. Prune and destroy affected leaves immediately. Avoid "
            "wetting crop foliage."
        ),
    },
    "leaf miner": {
        "title": "Leaf Miner Prevention",
        "steps": (
            "Place yellow sticky traps to catch adult flies. Introduce "
            "parasitic wasps. Prune leaves containing visible silver/white "
            "tunnels."
        ),
    },
    "leaf spot": {
        "title": "Leaf Spot Control",
        "steps": (
            "Space plants out to allow fast drying. Water from below. "
            "Apply fungicide sprays early in the season or whenever "
            "symptoms first appear."
        ),
    },
    "mosaic": {
        "title": "Mosaic Virus Prevention",
        "steps": (
            "No chemical cure exists for viral diseases. Remove and "
            "destroy infected plants immediately to prevent spread. "
            "Control vector insects like aphids."
        ),
    },
    "red rust": {
        "title": "Red Rust Treatment",
        "steps": (
            "Avoid over-fertilizing with nitrogen which encourages soft "
            "green growth. Apply sulfur-based fungicides. Prune affected "
            "branches to improve sunlight penetration."
        ),
    },
    "septoria leaf spot": {
        "title": "Septoria Spot Management",
        "steps": (
            "Mulch around the base to prevent spores splashing up from "
            "the soil. Remove infected bottom leaves. Apply copper or "
            "chlorothalonil fungicide."
        ),
    },
    "streak virus": {
        "title": "Streak Virus Prevention",
        "steps": (
            "Control the leafhopper vectors that transmit the virus. "
            "Cultivate virus-resistant crop varieties. Immediately remove "
            "and burn infected plants."
        ),
    },
    "verticulium wilt": {
        "title": "Verticillium Wilt Action",
        "steps": (
            "No chemical control is highly effective once established. Dig "
            "up infected plants including root zones. Solarize the soil "
            "and rotate crops with non-hosts."
        ),
    },
    "verticillium wilt": {
        "title": "Verticillium Wilt Action",
        "steps": (
            "No chemical control is highly effective once established. Dig "
            "up infected plants including root zones. Solarize the soil "
            "and rotate crops with non-hosts."
        ),
    },
}

DEFAULT_ADVICE: dict[str, str] = {
    "title": "Botanical Health Advice",
    "steps": (
        "General guidance: Maintain balanced crop watering, ensure adequate "
        "soil nutrition, and consult local agricultural extension officers "
        "if symptoms worsen."
    ),
}


def get_advice(class_name: str) -> dict[str, str]:
    """Return treatment advice for a predicted class name."""
    return DISEASE_ADVICE.get(class_name, DEFAULT_ADVICE)
