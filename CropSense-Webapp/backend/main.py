"""
CropSense FastAPI Inference Server
===================================
Loads the TensorFlow ResNet50 SavedModel and exposes a POST /predict endpoint
for crop pest & disease classification.
"""

import os
import logging
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from disease_advice import get_advice

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
IMG_SIZE = (224, 224)

# Model path — resolve relative to this file so it works from any CWD.
_THIS_DIR = Path(__file__).resolve().parent

def find_model_dir(start_path: Path) -> Path | None:
    # Look for the resnet50_saved_model dir, or any dir containing saved_model.pb
    for p in start_path.rglob("saved_model.pb"):
        return p.parent
    for p in start_path.rglob("resnet50_saved_model"):
        if p.is_dir():
            return p
    return None

# Check for model in current working directory recursively (for HF Spaces / Docker)
# Often HF clones to /home/user/app
_app_dir = Path("/home/user/app") if Path("/home/user/app").exists() else _THIS_DIR

_found_model = find_model_dir(_app_dir)

if _found_model:
    _default_model_path = _found_model
else:
    # Fallback to local dev structure
    _PROJECT_ROOT = _THIS_DIR.parent.parent  # CropSense/
    _default_model_path = _PROJECT_ROOT / "CropSense Python Implementation" / "CropSense_Output" / "resnet50_saved_model"

SAVED_MODEL_PATH = os.environ.get(
    "CROPSENSE_MODEL_PATH",
    str(_default_model_path),
)
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
    "verticillium wilt",
]

# ---------------------------------------------------------------------------
# Global model references (populated on startup)
# ---------------------------------------------------------------------------
_concrete_func = None
_preprocess_input = None
_class_names: list[str] = []

logger = logging.getLogger("cropsense")


def _load_model() -> None:
    """Load the TF SavedModel and cache its serving function."""
    global _concrete_func, _preprocess_input, _class_names

    model_path = Path(SAVED_MODEL_PATH)
    if not model_path.exists():
        import os
        try:
            contents = os.listdir(_app_dir)
            debug_info = f"Contents of {_app_dir}: {contents}"
        except Exception as e:
            debug_info = f"Could not list {_app_dir}: {e}"
        raise RuntimeError(f"Model not found at: {model_path}. {debug_info}")

    logger.info("Loading SavedModel from %s …", model_path)

    try:
        model = tf.keras.models.load_model(str(model_path))
        _concrete_func = model.signatures["serving_default"]
    except (ValueError, Exception):
        model = tf.saved_model.load(str(model_path))
        _concrete_func = model.signatures["serving_default"]

    _preprocess_input = tf.keras.applications.resnet50.preprocess_input

    # Attempt to resolve class names from training directory
    train_dir = model_path.parent / "CCMT_unified" / "train"
    if train_dir.exists():
        subdirs = sorted([d.name for d in train_dir.iterdir() if d.is_dir()])
        if len(subdirs) == len(HARDCODED_CLASSES):
            _class_names = subdirs
            logger.info("Loaded %d class names from training directory.", len(_class_names))
            return

    _class_names = HARDCODED_CLASSES
    logger.info("Using %d hardcoded class names.", len(_class_names))


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the model once on startup."""
    _load_model()
    yield


app = FastAPI(
    title="CropSense Inference API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok", "classes": len(_class_names)}


@app.get("/classes")
async def list_classes():
    return {"classes": _class_names}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Accept an image upload and return top-5 predictions with advice.

    Response shape:
    ```json
    {
      "predictions": [
        {"class_name": "...", "confidence": 0.92, "rank": 1}
      ],
      "top": {
        "class_name": "...",
        "confidence": 0.92,
        "advice_title": "...",
        "advice_steps": "..."
      }
    }
    ```
    """
    if _concrete_func is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Read and validate image --------------------------------------------------
    try:
        contents = await file.read()
        img = Image.open(__import__("io").BytesIO(contents)).convert("RGB")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid image: {exc}")

    # Preprocess ---------------------------------------------------------------
    img_resized = img.resize(IMG_SIZE)
    img_array = np.array(img_resized, dtype=np.float32)
    img_array = _preprocess_input(img_array)
    img_array = np.expand_dims(img_array, axis=0)

    # Predict ------------------------------------------------------------------
    input_tensor = tf.convert_to_tensor(img_array)
    output = _concrete_func(input_tensor)
    raw_predictions = list(output.values())[0].numpy()[0]

    # Build top-5 results ------------------------------------------------------
    top_indices = np.argsort(raw_predictions)[::-1][:5]
    predictions = []
    for rank, idx in enumerate(top_indices, 1):
        predictions.append(
            {
                "class_name": _class_names[idx],
                "confidence": round(float(raw_predictions[idx]), 4),
                "rank": rank,
            }
        )

    # Top prediction with advice -----------------------------------------------
    top_class = predictions[0]["class_name"]
    advice = get_advice(top_class)

    return {
        "predictions": predictions,
        "top": {
            "class_name": top_class,
            "confidence": predictions[0]["confidence"],
            "advice_title": advice["title"],
            "advice_steps": advice["steps"],
        },
    }
