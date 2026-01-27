from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, List
import joblib
import pandas as pd
import os
from fastapi.middleware.cors import CORSMiddleware
from google import genai 
from google.genai.errors import ClientError
from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception_type

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ML Model Setup ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'nutrition_model1.pkl')
model = joblib.load(MODEL_PATH)

# --- Gemini AI Setup ---
# Switch to the async-enabled client configuration
client = genai.Client(api_key="AIzaSyDjasFaK2iRdP7NAffZui2X0pszif0qz6s")
MODEL_ID = "gemini-2.0-flash-lite"

@retry(
    stop=stop_after_attempt(5),
    wait=wait_random_exponential(multiplier=1, max=60),
    retry=retry_if_exception_type(ClientError),
    reraise=True # This ensures the final error is raised so you can see it
)
async def generate_gemini_content(system_instruction, message):
    """
    CRITICAL FIX: Use 'client.aio' for asynchronous calls in FastAPI.
    """
    return await client.aio.models.generate_content(
        model=MODEL_ID,
        contents=message,
        config={'system_instruction': system_instruction}
    )

class PredictionRequest(BaseModel):
    age: float = Field(..., ge=0, le=120)
    gender: Literal[1, 2]
    iron_intake: float = Field(..., ge=0)
    vit_d_intake: float = Field(..., ge=0)
    bmi: float = Field(..., ge=10, le=60)
    muac: float = Field(..., ge=5, le=50)
    proteins: float = Field(..., ge=0)
    zinc: float = Field(..., ge=0)

class ChatRequest(BaseModel):
    message: str
    context: str 

@app.get("/")
def home():
    return {"status": "Online", "system": "NutriPredict AI CDSS", "version": "2.0.0"}

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        input_data = pd.DataFrame([{
            'RIDAGEYR': data.age, 'RIAGENDR': data.gender,
            'DR1TIRON': data.iron_intake, 'DR1TVD': data.vit_d_intake,
            'BMXBMI': data.bmi, 'BMXARMC': data.muac,
            'DR1TPROT': data.proteins, 'DR1TZINC': data.zinc
        }])
        prediction = int(model.predict(input_data)[0])
        probability = model.predict_proba(input_data).tolist()[0]
        confidence = round(max(probability) * 100, 2)
        
        recs = ["High Risk Detected" if prediction == 1 else "Low Risk Detected"]
        # (Your recommendation logic remains the same here...)
        
        return {
            "deficiency_risk": "High" if prediction == 1 else "Low",
            "confidence": confidence,
            "recommendations": recs
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat_with_ai(data: ChatRequest):
    try:
        system_instruction = f"""
        You are 'NutriPredict Assistant', a specialized AI for clinical nutritional support.
        Only discuss nutrition and the provided patient data.
        
        PATIENT CONTEXT:
        {data.context}
        """
        
        # Use the await keyword with our retry-wrapped async helper
        response = await generate_gemini_content(system_instruction, data.message)
        return {"reply": response.text}
        
    except ClientError as e:
        # Check specifically for Quota/Rate Limit issues
        print(f"Gemini API Error: {e}")
        if "429" in str(e):
             raise HTTPException(status_code=429, detail="API Quota Exceeded. Please wait 60 seconds.")
        raise HTTPException(status_code=500, detail=f"Gemini AI Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected Chat Error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error: AI core failed to respond.")