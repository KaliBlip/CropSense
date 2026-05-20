try:
    import streamlit as st
except ModuleNotFoundError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "streamlit"])
    import streamlit as st

import tensorflow as tf
import numpy as np
from PIL import Image
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# Page Configuration
# ─────────────────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="🌿 Crop Pest & Disease Detector",
    page_icon="🌾",
    layout="centered",
    initial_sidebar_state="expanded"
)

# ─────────────────────────────────────────────────────────────────────────────
# Configuration
# ─────────────────────────────────────────────────────────────────────────────
IMG_SIZE = (224, 224)
APP_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = APP_DIR / "CropSense_Output"
SAVED_MODEL_PATH = OUTPUT_DIR / "resnet50_saved_model"
TRAIN_DIR = OUTPUT_DIR / "CCMT_unified" / "train"

# Fallback class names used by the model
HARDCODED_CLASSES = [
    "anthracnose",
    "bacterial blight",
    "brown spot",
    "fall armyworm",
    "grasshoper",
    "grasshopper",
    "green mite",
    "gumosis",
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
    "verticulium wilt",
    "verticillium wilt"
]

# ─────────────────────────────────────────────────────────────────────────────
# Load Model (cached to avoid reloading)
# ─────────────────────────────────────────────────────────────────────────────
@st.cache_resource
def load_model():
    """Load the trained ResNet50 model from SavedModel format."""
    saved_model_path = OUTPUT_DIR / "resnet50_saved_model"
    
    if not saved_model_path.exists():
        st.error(f"❌ Model not found at: {saved_model_path}")
        st.stop()
    
    try:
        # Try loading a Keras-compatible saved model first
        model = tf.keras.models.load_model(str(saved_model_path))
        concrete_func = model.signatures['serving_default']
    except ValueError as exc:
        # Keras 3 no longer supports legacy SavedModel format directly.
        # Fall back to loading the SavedModel as a TF SavedModel and use its serving_default signature.
        error_text = str(exc)
        if "legacy SavedModel format" not in error_text and "File format not supported" not in error_text:
            raise
        model = tf.saved_model.load(str(saved_model_path))
        try:
            concrete_func = model.signatures['serving_default']
        except Exception as err:
            st.error(f"❌ SavedModel loaded, but could not find 'serving_default' signature: {err}")
            st.stop()
    
    # Get number of classes
    has_classes = False
    if TRAIN_DIR.exists():
        all_subdirs = [d for d in TRAIN_DIR.iterdir() if d.is_dir()]
        if len(all_subdirs) == len(HARDCODED_CLASSES):
            has_classes = True
            num_classes = len(all_subdirs)
            
    if not has_classes:
        num_classes = len(HARDCODED_CLASSES)
    
    # Preprocess function
    preprocess_input = tf.keras.applications.resnet50.preprocess_input
    
    return model, concrete_func, num_classes, preprocess_input

@st.cache_resource
def get_class_names():
    """Get class names - from training directory if available and valid, otherwise from fallback list."""
    has_classes = False
    if TRAIN_DIR.exists():
        all_subdirs = [d for d in TRAIN_DIR.iterdir() if d.is_dir()]
        if len(all_subdirs) == len(HARDCODED_CLASSES):
            has_classes = True
            class_names = sorted([d.name for d in all_subdirs])
            
    if not has_classes:
        class_names = HARDCODED_CLASSES
    return class_names

# ─────────────────────────────────────────────────────────────────────────────
# UI Layout
# ─────────────────────────────────────────────────────────────────────────────
CSS_STYLES = """
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');

/* Main Body & Font Overrides */
html, body, [data-testid="stAppViewContainer"], .main {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #0d120e !important;
    color: #e2e8f0 !important;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif !important;
    font-weight: 700 !important;
    letter-spacing: -0.02em;
    color: #f8fafc !important;
}

/* Sidebar Custom Styling */
[data-testid="stSidebar"] {
    background-color: #0b0e0c !important;
    border-right: 1px solid rgba(129, 199, 132, 0.1) !important;
}

/* Glassmorphic Modern Card Container */
.modern-card {
    background: rgba(26, 36, 27, 0.6);
    border: 1px solid rgba(129, 199, 132, 0.15);
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    margin-bottom: 20px;
}
.modern-card:hover {
    transform: translateY(-2px);
    border-color: rgba(129, 199, 132, 0.3);
    box-shadow: 0 12px 40px 0 rgba(129, 199, 132, 0.1);
}

/* Elegant Hero Banner */
.hero-banner {
    background: linear-gradient(135deg, #1b5e20 0%, #004d40 100%);
    border-radius: 20px;
    padding: 35px 30px;
    margin-bottom: 30px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    border: 1px solid rgba(129, 199, 132, 0.2);
}
.hero-banner::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(129, 199, 132, 0.1) 0%, transparent 80%);
    pointer-events: none;
}
.hero-title {
    font-size: 2.2rem !important;
    margin-bottom: 8px !important;
    background: linear-gradient(to right, #ffffff, #a5d6a7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 800 !important;
}
.hero-subtitle {
    font-size: 1.05rem;
    color: #c8e6c9;
    opacity: 0.9;
    font-weight: 400;
}

/* Custom Badges */
.badge {
    background: rgba(129, 199, 132, 0.15);
    color: #81c784;
    border: 1px solid rgba(129, 199, 132, 0.3);
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 0.75rem;
    font-weight: 600;
    display: inline-block;
    margin-top: 10px;
    margin-right: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

/* Custom Prediction Results Styling */
.metric-container {
    background: rgba(13, 18, 14, 0.8);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-top: 15px;
}

/* Modern Visual Progress Bar */
.progress-wrapper {
    margin: 14px 0;
}
.progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}
.progress-label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #e2e8f0;
    text-transform: capitalize;
}
.progress-value {
    font-weight: 700;
    color: #81c784;
}
.progress-bar-bg {
    width: 100%;
    height: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
}
.progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #81c784);
    border-radius: 10px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.progress-bar-fill.rank-1 {
    background: linear-gradient(90deg, #2e7d32, #66bb6a);
}
.progress-bar-fill.rank-other {
    background: linear-gradient(90deg, #00796b, #26a69a);
}

/* Advice Card Styling */
.advice-card {
    background: rgba(46, 125, 50, 0.08);
    border-left: 4px solid #81c784;
    border-radius: 0 12px 12px 0;
    padding: 18px 20px;
    margin-top: 20px;
    border-top: 1px solid rgba(129, 199, 132, 0.1);
    border-right: 1px solid rgba(129, 199, 132, 0.1);
    border-bottom: 1px solid rgba(129, 199, 132, 0.1);
}
.advice-title {
    font-weight: 700 !important;
    color: #a5d6a7 !important;
    font-size: 1.05rem !important;
    margin-bottom: 8px !important;
    display: flex;
    align-items: center;
    gap: 8px;
}
.advice-content {
    font-size: 0.92rem;
    line-height: 1.5;
    color: #cbd5e1;
}

/* Streamlit widget modifications to blend with theme */
div[data-testid="stFileUploader"] {
    background: rgba(26, 36, 27, 0.4) !important;
    border: 1px dashed rgba(129, 199, 132, 0.3) !important;
    border-radius: 12px !important;
    padding: 10px !important;
    transition: all 0.3s ease !important;
}
div[data-testid="stFileUploader"]:hover {
    border-color: #81c784 !important;
    background: rgba(26, 36, 27, 0.6) !important;
}

/* Metric text alignment */
div[data-testid="stMetricValue"] {
    font-size: 2.2rem !important;
    font-weight: 800 !important;
    color: #81c784 !important;
}

</style>
"""

st.markdown(CSS_STYLES, unsafe_allow_html=True)

st.markdown("""
<div class="hero-banner">
    <div class="hero-title">🌿 Crop Pest & Disease Detector</div>
    <div class="hero-subtitle">
        Secure your harvest with instant, AI-driven botanical health diagnostics and classification.
    </div>
    <span class="badge">TensorFlow ResNet50</span>
    <span class="badge">96k+ Unified Dataset</span>
</div>
""", unsafe_allow_html=True)

# Load model and class names
with st.spinner("🔄 Loading model..."):
    model, concrete_func, num_classes, preprocess_input = load_model()
    class_names = get_class_names()

st.success(f"✅ Model ready! ({num_classes} classes)")

# ─────────────────────────────────────────────────────────────────────────────
# Sidebar Info
# ─────────────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("### 📋 Model Information")
    st.markdown(f"""
    - **Architecture**: ResNet50 (ImageNet pre-trained)
    - **Classes**: {num_classes}
    - **Input Size**: {IMG_SIZE[0]}×{IMG_SIZE[1]} pixels
    - **Training**: Transfer Learning + Fine-tuning
    - **Dataset**: Crop Pest & Disease Detection (96k+ images)
    """)
    
    st.markdown("### 🌾 Classes")
    cols = st.columns(2)
    for i, cls in enumerate(class_names):
        with cols[i % 2]:
            st.markdown(f"• {cls}")

# ─────────────────────────────────────────────────────────────────────────────
# Image Upload & Prediction
# ─────────────────────────────────────────────────────────────────────────────
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📸 Upload Custom Leaf")
    uploaded_file = st.file_uploader(
        "Choose a crop leaf image",
        type=["jpg", "jpeg", "png"],
        help="JPG, PNG formats supported"
    )

with col2:
    st.markdown("### 📷 Sample Dataset")
    st.markdown("<div style='height: 12px;'></div>", unsafe_allow_html=True)
    use_sample = st.checkbox("Or use sample from test set?", help="Click to load a random image from the test set")

# Process image
image_to_predict = None
display_image = None

if use_sample:
    # Load random image from test set
    test_dir = OUTPUT_DIR / "CCMT_unified" / "test"
    if test_dir.exists():
        # Scan for images case-insensitively
        image_extensions = {".jpg", ".jpeg", ".png"}
        all_images = [
            p for p in test_dir.rglob("*")
            if p.suffix.lower() in image_extensions
        ]
        if all_images:
            import random
            sample_path = random.choice(all_images)
            image_to_predict = Image.open(sample_path).convert("RGB")
            display_image = image_to_predict.copy()
            st.info(f"📂 Sample from: `{sample_path.parent.name}`")

if uploaded_file is not None:
    image_to_predict = Image.open(uploaded_file).convert("RGB")
    display_image = image_to_predict.copy()

# Display image and make prediction
if image_to_predict is not None:
    st.markdown("---")
    st.markdown("### 🔍 Analysis")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.image(display_image, caption="Input Image", use_container_width=True)
    
    with col2:
        # Preprocess and predict
        with st.spinner("🤖 Analyzing..."):
            # Resize image
            img_array = np.array(image_to_predict.resize(IMG_SIZE))
            img_array = img_array.astype(np.float32)
            img_array = preprocess_input(img_array)
            img_array = np.expand_dims(img_array, axis=0)
            
            # Make prediction using concrete function
            input_tensor = tf.convert_to_tensor(img_array)
            output = concrete_func(input_tensor)
            # Get the output values
            predictions = list(output.values())[0].numpy()
            pred_idx = np.argmax(predictions[0])
            pred_confidence = predictions[0][pred_idx]
        
        # Display top predictions
        st.markdown("### 📊 Classification Summary")
        
        # Metrics side by side
        m_col1, m_col2 = st.columns(2)
        with m_col1:
            st.metric("Detected Status", class_names[pred_idx].title())
        with m_col2:
            st.metric("Confidence", f"{pred_confidence*100:.1f}%")

        # Visual progress bars
        top_indices = np.argsort(predictions[0])[::-1][:5]
        results_html = '<div class="metric-container">'
        
        for rank, idx in enumerate(top_indices, 1):
            class_name = class_names[idx]
            confidence = predictions[0][idx] * 100
            
            rank_class = "rank-1" if rank == 1 else "rank-other"
            medal = "🥇" if rank == 1 else "🥈" if rank == 2 else "🥉" if rank == 3 else f"#{rank}"
            
            results_html += (
                f'<div class="progress-wrapper">'
                f'<div class="progress-header">'
                f'<span class="progress-label">{medal} {class_name}</span>'
                f'<span class="progress-value">{confidence:.1f}%</span>'
                f'</div>'
                f'<div class="progress-bar-bg">'
                f'<div class="progress-bar-fill {rank_class}" style="width: {confidence:.1f}%;"></div>'
                f'</div>'
                f'</div>'
            )
        results_html += '</div>'
        st.markdown(results_html, unsafe_allow_html=True)
        
        # Recommendation & Treatment Advice
        st.markdown("---")
        
        DISEASE_ADVICE = {
            "anthracnose": {
                "title": "Anthracnose Management",
                "steps": "Remove and destroy infected plant parts. Apply copper-based fungicides during wet weather. Enhance air circulation by spacing plants appropriately."
            },
            "bacterial blight": {
                "title": "Bacterial Blight Treatment",
                "steps": "Prune infected stems 3-4 inches below the visible canker. Apply bactericides/streptomycin during active infection periods. Clean pruning tools with alcohol between cuts."
            },
            "brown spot": {
                "title": "Brown Spot Management",
                "steps": "Ensure proper nitrogen fertilization to keep plants healthy. Keep foliage dry using drip irrigation. Apply chemical treatments like Mancozeb if infestation is severe."
            },
            "fall armyworm": {
                "title": "Fall Armyworm Control",
                "steps": "Monitor crop leaves early for eggs/larvae. Apply botanical insecticides like Neem oil or biological controls (Bacillus thuringiensis). In severe cases, use registered chemical sprays."
            },
            "grasshoper": {
                "title": "Grasshopper Control",
                "steps": "Introduce natural predators like birds/chickens. Apply organic pesticide sprays (Nosema locustae). Till soil in fall to destroy grasshopper eggs laid in the ground."
            },
            "grasshopper": {
                "title": "Grasshopper Control",
                "steps": "Introduce natural predators like birds/chickens. Apply organic pesticide sprays (Nosema locustae). Till soil in fall to destroy grasshopper eggs laid in the ground."
            },
            "green mite": {
                "title": "Green Mite Control",
                "steps": "Spray foliage with strong streams of water to dislodge mites. Apply insecticidal soap, Neem oil, or predatory mites (biological control)."
            },
            "gumosis": {
                "title": "Gummosis Care",
                "steps": "Improve soil drainage to prevent fungal root/bark rot. Clean bark wounds and apply copper fungicide. Avoid wounding the trunk during cultivation."
            },
            "gummosis": {
                "title": "Gummosis Care",
                "steps": "Improve soil drainage to prevent fungal root/bark rot. Clean bark wounds and apply copper fungicide. Avoid wounding the trunk during cultivation."
            },
            "healthy": {
                "title": "Healthy Crop Maintenance",
                "steps": "Excellent! No pest or disease detected. Continue standard crop care: balanced irrigation, regular monitoring, and organic mulching to protect the root system."
            },
            "leaf beetle": {
                "title": "Leaf Beetle Control",
                "steps": "Handpick beetles off the leaves. Apply insecticidal soaps or organic pyrethrin-based treatments. Row covers can protect young crops."
            },
            "leaf blight": {
                "title": "Leaf Blight Treatment",
                "steps": "Avoid overhead watering to minimize leaf wetness. Apply protective fungicides containing chlorothalonil. Remove fallen leaves around the crop base."
            },
            "leaf curl": {
                "title": "Leaf Curl Management",
                "steps": "Apply sulfur or copper fungicides in late winter before buds open. Prune and destroy affected leaves immediately. Avoid wetting crop foliage."
            },
            "leaf miner": {
                "title": "Leaf Miner Prevention",
                "steps": "Place yellow sticky traps to catch adult flies. Introduce parasitic wasps. Prune leaves containing visible silver/white tunnels."
            },
            "leaf spot": {
                "title": "Leaf Spot Control",
                "steps": "Space plants out to allow fast drying. Water from below. Apply fungicide sprays early in the season or whenever symptoms first appear."
            },
            "mosaic": {
                "title": "Mosaic Virus Prevention",
                "steps": "No chemical cure exists for viral diseases. Remove and destroy infected plants immediately to prevent spread. Control vector insects like aphids."
            },
            "red rust": {
                "title": "Red Rust Treatment",
                "steps": "Avoid over-fertilizing with nitrogen which encourages soft green growth. Apply sulfur-based fungicides. Prune affected branches to improve sunlight penetration."
            },
            "septoria leaf spot": {
                "title": "Septoria Spot Management",
                "steps": "Mulch around the base to prevent spores splashing up from the soil. Remove infected bottom leaves. Apply copper or chlorothalonil fungicide."
            },
            "streak virus": {
                "title": "Streak Virus Prevention",
                "steps": "Control the leafhopper vectors that transmit the virus. Cultivate virus-resistant crop varieties. Immediately remove and burn infected plants."
            },
            "verticulium wilt": {
                "title": "Verticillium Wilt Action",
                "steps": "No chemical control is highly effective once established. Dig up infected plants including root zones. Solarize the soil and rotate crops with non-hosts."
            },
            "verticillium wilt": {
                "title": "Verticillium Wilt Action",
                "steps": "No chemical control is highly effective once established. Dig up infected plants including root zones. Solarize the soil and rotate crops with non-hosts."
            }
        }
        
        pred_class_name = class_names[pred_idx]
        advice = DISEASE_ADVICE.get(pred_class_name, {
            "title": "Botanical Health Advice",
            "steps": "General guidance: Maintain balanced crop watering, ensure adequate soil nutrition, and consult local agricultural extension officers if symptoms worsen."
        })
        
        st.markdown(
            f'<div class="advice-card">'
            f'<div class="advice-title">💡 Treatment & Management: {advice["title"]}</div>'
            f'<div class="advice-content">{advice["steps"]}</div>'
            f'</div>',
            unsafe_allow_html=True
        )

# ─────────────────────────────────────────────────────────────────────────────
# Footer
# ─────────────────────────────────────────────────────────────────────────────
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: gray; font-size: 12px;">
    🌿 <b>Crop Pest & Disease Detection System</b><br>
    Powered by ResNet50 & TensorFlow | Dataset: Mendeley DOI 10.17632/bwh3zbpkpv.1
</div>
""", unsafe_allow_html=True)
