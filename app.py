from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import uvicorn
import pandas as pd
import numpy as np
import pickle
import os

app = FastAPI(title='Diamond Price Prediction API')

# Create static directory if not exists and mount static files FIRST
os.makedirs('static', exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load model and encoders
MODEL_PATH = 'artifacts/model.pkl'
ENCODERS_PATH = 'artifacts/encoders.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(ENCODERS_PATH):
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(ENCODERS_PATH, 'rb') as f:
        encoders = pickle.load(f)
else:
    model = None
    encoders = None

class DiamondInput(BaseModel):
    carat: float
    cut: str
    color: str
    clarity: str
    depth: float
    table: float
    x: float
    y: float
    z: float

@app.get('/')
def read_index():
    return FileResponse('static/index.html')

@app.post('/predict')
def predict(data: DiamondInput):
    if model is None or encoders is None:
        raise HTTPException(status_code=500, detail="Model storage not initialized.")
    
    try:
        # Prepare input data
        input_data = data.dict()
        
        # Encode categorical variables
        for col in ['cut', 'color', 'clarity']:
            le = encoders[col]
            # Handle unknown categories if any (though UI should prevent this)
            try:
                input_data[col] = le.transform([input_data[col]])[0]
            except ValueError:
                input_data[col] = le.transform([le.classes_[0]])[0] # Fallback
        
        # Convert to DataFrame to match training format
        df = pd.DataFrame([input_data])
        
        # Prediction
        prediction = model.predict(df)[0]
        
        return {
            'status': 'success',
            'prediction': round(float(prediction), 2)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)