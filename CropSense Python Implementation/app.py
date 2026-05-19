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
import os
import pathlib

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
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "CropSense_Output")
SAVED_MODEL_PATH = os.path.join(OUTPUT_DIR, "resnet50_saved_model")
TRAIN_DIR = os.path.join(OUTPUT_DIR, "CCMT_unified", "train")

# Fallback class names used by the model
HARDCODED_CLASSES = [
    "anthracnose",
    "bacterial blight",
    "brown spot",
    "fall armyworm",
    "grasshoper",
    "green mite",
    "gumosis",
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
    "verticulium wilt"
]

# ─────────────────────────────────────────────────────────────────────────────
# Load Model (cached to avoid reloading)
# ─────────────────────────────────────────────────────────────────────────────
@st.cache_resource
def load_model():
    """Load the trained ResNet50 model from SavedModel format."""
    saved_model_path = os.path.join(OUTPUT_DIR, "resnet50_saved_model")
    
    if not os.path.exists(saved_model_path):
        st.error(f"❌ Model not found at: {saved_model_path}")
        st.stop()
    
    # Load model (includes architecture and weights)
    model = tf.keras.models.load_model(saved_model_path)
    
    # Convert to concrete function for proper inference
    concrete_func = model.signatures['serving_default']
    
    # Get number of classes
    if os.path.exists(TRAIN_DIR):
        all_subdirs = [d for d in pathlib.Path(TRAIN_DIR).iterdir() if d.is_dir()]
        num_classes = len(all_subdirs)
    else:
        num_classes = len(HARDCODED_CLASSES)
    
    # Preprocess function
    preprocess_input = tf.keras.applications.resnet50.preprocess_input
    
    return model, concrete_func, num_classes, preprocess_input

@st.cache_resource
def get_class_names():
    """Get class names - from training directory if available, otherwise from fallback list."""
    if os.path.exists(TRAIN_DIR):
        all_subdirs = [d for d in pathlib.Path(TRAIN_DIR).iterdir() if d.is_dir()]
        class_names = sorted([d.name for d in all_subdirs])
    else:
        class_names = HARDCODED_CLASSES
    return class_names

# ─────────────────────────────────────────────────────────────────────────────
# UI Layout
# ─────────────────────────────────────────────────────────────────────────────
st.title("🌿 Crop Pest & Disease Detector")
st.markdown("""
**Detect crop pests and diseases using AI-powered image classification**
- 📸 Upload a crop leaf image
- 🤖 Get instant predictions with confidence scores
- 📊 View detailed classification results
""")

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
    st.markdown("### 📸 Upload Image")
    uploaded_file = st.file_uploader(
        "Choose a crop leaf image",
        type=["jpg", "jpeg", "png"],
        help="JPG, PNG formats supported"
    )

with col2:
    st.markdown("### 📷 Sample Image")
    use_sample = st.checkbox("Or use sample from test set?")

# Process image
image_to_predict = None
display_image = None

if use_sample:
    # Load random image from test set
    test_dir = os.path.join(OUTPUT_DIR, "CCMT_unified", "test")
    if os.path.exists(test_dir):
        all_images = list(pathlib.Path(test_dir).rglob("*.jpg")) + \
                     list(pathlib.Path(test_dir).rglob("*.png")) + \
                     list(pathlib.Path(test_dir).rglob("*.jpeg"))
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
        st.markdown("#### 🎯 Top Predictions")
        
        # Get top 5 predictions
        top_indices = np.argsort(predictions[0])[::-1][:5]
        
        for rank, idx in enumerate(top_indices, 1):
            class_name = class_names[idx]
            confidence = predictions[0][idx] * 100
            
            # Color code by confidence
            if rank == 1:
                st.markdown(f"**🥇 #{rank} {class_name}**")
                st.metric("Confidence", f"{confidence:.1f}%", 
                         delta=f"{confidence - 50:.1f}%", 
                         delta_color="inverse" if confidence < 50 else "off")
            else:
                bar_pct = int(confidence / 100 * 20)  # Scale to 20 chars
                bar = "█" * bar_pct + "░" * (20 - bar_pct)
                st.markdown(f"#{rank} **{class_name}**  \n`{bar}` {confidence:.1f}%")
        
        # Recommendation
        st.markdown("---")
        if pred_confidence > 0.7:
            st.success(f"✅ **High Confidence Prediction**  \nLikely: **{class_names[pred_idx]}**")
        elif pred_confidence > 0.5:
            st.info(f"⚠️ **Moderate Confidence**  \nProbably: **{class_names[pred_idx]}**")
        else:
            st.warning(f"❓ **Low Confidence**  \nUncertain - consider expert review")

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
