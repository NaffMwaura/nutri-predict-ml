from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure this matches your newly trained model filename
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'nutrition_model1.pkl')
model = joblib.load(MODEL_PATH)

class PredictionRequest(BaseModel):
    age: float = Field(..., ge=0, le=120)
    gender: Literal[1, 2]
    iron_intake: float = Field(..., ge=0)
    vit_d_intake: float = Field(..., ge=0)
    bmi: float = Field(..., ge=10, le=60)
    muac: float = Field(..., ge=5, le=50)
    proteins: float = Field(..., ge=0)
    zinc: float = Field(..., ge=0)

@app.get("/")
def home():
    return {"status": "Online", "system": "NutriPredict AI CDSS", "version": "2.0.0"}

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        # Match the EXACT feature order used in train_model.py
        input_data = pd.DataFrame([{
            'RIDAGEYR': data.age,
            'RIAGENDR': data.gender,
            'DR1TIRON': data.iron_intake,
            'DR1TVD': data.vit_d_intake,
            'BMXBMI': data.bmi,
            'BMXARMC': data.muac,
            'DR1TPROT': data.proteins,
            'DR1TZINC': data.zinc
        }])

        prediction = int(model.predict(input_data)[0])
        probability = model.predict_proba(input_data).tolist()[0]
        confidence = round(max(probability) * 100, 2)

        recs = []
        
        # 1. Prediction-Based Logic
        if prediction == 1:
            recs.append("🚨 High Risk Detected: AI analysis suggests sub-clinical nutrient deficiencies.")
        else:
            recs.append("✅ Low Risk: Current metrics align with baseline nutritional stability.")

        # 2. Anthropometric Insights (BMI & MUAC)
        if data.bmi < 18.5:
            recs.append(f"Analysis: BMI of {data.bmi} indicates underweight status. Increase caloric density.")
        elif data.bmi > 25:
            recs.append(f"Analysis: BMI of {data.bmi} suggests overweight status. Review metabolic balance.")
            
        if data.muac < 23:
            recs.append("Alert: MUAC levels suggest potential muscle wasting or acute malnutrition.")

        # 3. Micronutrient Logic (Iron, Vit D, Zinc)
        if data.iron_intake < 8.0:
            recs.append("Dietary: Iron intake is below optimal thresholds. Prioritize heme-iron sources.")
        
        if data.vit_d_intake < 15.0:
            recs.append("Dietary: Vitamin D intake is critically low. Consider UV exposure and fortified foods.")
            
        if data.zinc < 11.0:
            recs.append("Dietary: Zinc levels are suboptimal. Incorporate seeds, nuts, or legumes.")

        # 4. Macronutrient Logic (Proteins)
        if data.proteins < 46:
            recs.append("Dietary: Protein intake is insufficient for cellular repair and enzyme function.")

        # 5. Clinical Action
        if confidence < 60:
            recs.append("Note: AI Confidence is borderline. Immediate Serum Ferritin and 25(OH)D lab tests required.")
        else:
            recs.append("Clinical Action: Schedule a routine nutritional consultation to review these findings.")

        return {
            "deficiency_risk": "High" if prediction == 1 else "Low",
            "confidence": confidence,
            "recommendations": recs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))