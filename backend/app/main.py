from fastapi import FastAPI, UploadFile, File
import pandas as pd
import os
import shutil
import matplotlib.pyplot as plt
import seaborn as sns
from app.routes.home import router as home_router
from app.routes.upload import router as upload_router
from app.routes.analysis import router as analysis_router
from app.routes.cleaning import router as cleaning_router
from app.routes.visualization import router as visualization_router
app = FastAPI(
    title="AI Data Analyst Agent",
    description="An AI-powered Data Analytics Platform",
    version="1.0.0"
)
app.include_router(home_router)
app.include_router(upload_router)
app.include_router(analysis_router)
app.include_router(cleaning_router)
app.include_router(visualization_router)
UPLOAD_FOLDER = "uploads"
CLEANED_FOLDER = "cleaned_data"
CHART_FOLDER = "charts"
os.makedirs(CHART_FOLDER, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLEANED_FOLDER, exist_ok=True)
