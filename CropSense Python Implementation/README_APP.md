# 🌿 Crop Pest & Disease Detection Streamlit App

A web-based application for detecting crop pests and diseases using a trained ResNet50 deep learning model.

## Features

✨ **User-Friendly Interface**
- 📸 Upload crop leaf images (JPG, PNG)
- 🎯 Real-time predictions with confidence scores
- 📊 Top-5 predictions ranked by probability
- 📷 Sample image testing from validation set

🤖 **Model Capabilities**
- **Architecture**: ResNet50 (ImageNet pre-trained)
- **Classes**: 18 crop diseases + healthy class
- **Accuracy**: Trained on 96,000+ augmented images
- **Input**: 224×224 RGB images

## Prerequisites

- Python 3.8+
- Virtual environment (recommended)
- Trained model weights: `~/CropSense_Output/resnet50_final.weights.h5`

## Installation

### 1. Install Streamlit and Dependencies

```bash
# From the workspace folder
pip install -r requirements.txt
```

Or install individually:
```bash
pip install streamlit tensorflow pillow numpy
```

### 2. Verify Model Weights

The app expects trained model weights at:
```
~/CropSense_Output/resnet50_final.weights.h5
```

Check that the files exist:
```bash
ls ~/CropSense_Output/
```

You should see:
- `resnet50_final.weights.h5` (model weights)
- `CCMT_unified/train/` (training data)
- `CCMT_unified/test/` (test data)

## Running the App

### Option 1: From Terminal (Recommended)

```bash
cd "e:\New Firfox Downloads\CropSence Python"
streamlit run app.py
```

The app will open automatically at `http://localhost:8501`

### Option 2: Using Python

```bash
python -m streamlit run app.py
```

## Usage

### Upload & Predict
1. **Upload Image**: Click "Browse files" to select a crop leaf image
2. **Or Use Sample**: Check "Or use sample from test set?" to use a random test image
3. **Get Results**: The model generates predictions automatically
4. **View Predictions**: See top-5 predictions with confidence scores

### Understanding Results

- 🟢 **High Confidence (>70%)**: Reliable prediction
- 🟡 **Moderate Confidence (50-70%)**: Probably correct, but verify
- 🔴 **Low Confidence (<50%)**: Uncertain, expert review recommended

### Classes Detected

- Fungal Diseases: anthracnose, gummosis, leaf spot, leaf blight, verticillium wilt
- Viral Diseases: mosaic, streak virus, leaf curl
- Bacterial: bacterial blight, brown spot
- Pest Damage: leaf miner, red rust, green mite, fall armyworm, grasshopper, leaf beetle
- Health: healthy crops

## File Structure

```
CropSence Python/
├── Crop Pests Diseases Colab.ipynb  # Training notebook
├── app.py                           # Streamlit app (this file)
├── requirements.txt                 # Dependencies
├── Kaggle Settings.json             # (Your Kaggle credentials)
└── ~/CropSense_Output/
    ├── resnet50_final.weights.h5   # Model weights
    ├── CCMT_unified/
    │   ├── train/                  # Training images
    │   └── test/                   # Test images
    └── *.png                        # Generated visualizations
```

## Troubleshooting

### Model weights not found
```
❌ Model weights not found at: ~/CropSense_Output/resnet50_final.weights.h5
```
**Solution**: Run the training notebook (Step 11: Save Final Model Weights) to generate weights.

### Out of memory error
- Reduce batch size in the notebook
- Close other applications
- For Colab: Use GPU runtime

### Image upload not working
- Supported formats: JPG, JPEG, PNG
- Maximum size: ~10 MB (streamlit default)
- Ensure image is readable and not corrupted

### Model loading is slow
- First run takes longer (model caching)
- Subsequent runs are faster (cached in memory)

## Performance Tips

⚡ **Speed Optimization**
- Model is cached after first load (~2-3 seconds)
- Predictions take ~1 second on GPU, ~2-5 seconds on CPU
- Sample images load instantly

## API Reference

### Key Functions

```python
load_model()
  → (model, num_classes, preprocess_input)
  
get_class_names()
  → list of 18 class names

# Prediction pipeline
img_array = preprocess_input(img_array)
predictions = model.predict(img_array)
```

## Model Architecture

```
Input (224×224×3)
    ↓
ResNet50 (ImageNet pre-trained, frozen)
    ↓
GlobalAveragePooling2D
    ↓
Dropout(0.3)
    ↓
Dense(18, softmax) ← Output layer
```

## Training Details

- **Dataset**: Crop Pest & Disease Detection (Mendeley DOI: 10.17632/bwh3zbpkpv.1)
- **Train/Test Split**: 80/20 stratified
- **Data Augmentation**: Random flip, rotation, zoom, translation
- **Epochs**: 30 (10 head training + 20 fine-tuning)
- **Optimizer**: Adam (initial lr=1e-3, fine-tune lr=1e-4)
- **Loss**: Categorical Crossentropy

## Deployment

### Streamlit Cloud
1. Push to GitHub
2. Go to `share.streamlit.io`
3. Connect repository
4. Deploy

### Local Network
```bash
streamlit run app.py --server.address=0.0.0.0
```
Then access from any device on your network at: `http://YOUR_IP:8501`

## Citation

If you use this model/app in research, cite:

```bibtex
@dataset{crop_pest_disease_2023,
  title={Dataset for Crop Pest and Disease Detection},
  author={Mensah Kwabena, Patrick and others},
  doi={10.17632/bwh3zbpkpv.1},
  url={https://data.mendeley.com/datasets/bwh3zbpkpv/1}
}
```

## License

Same as original dataset (Mendeley Data)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Verify model weights exist and are uncorrupted
3. Run training notebook again to regenerate weights
4. Check Streamlit documentation: https://docs.streamlit.io/

---

**Made with ❤️ for crop health monitoring**
