from fastapi import FastAPI, UploadFile, File
import pandas as pd
import os
import shutil

app = FastAPI(
    title="AI Data Analyst Agent",
    description="An AI-powered Data Analytics Platform",
    version="1.0.0"
)

UPLOAD_FOLDER = "uploads"
CLEANED_FOLDER = "cleaned_data"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CLEANED_FOLDER, exist_ok=True)

# Home API
@app.get("/")
def home():
    return {
        "project": "AI Data Analyst Agent",
        "developer": "Pritiranjan Rout",
        "version": "1.0.0",
        "status": "Backend Running Successfully"
    }

# Upload CSV API
@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    df = pd.read_csv(file_path)

    return {
        "filename": file.filename,
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns)
    }

# Analyze Dataset API
@app.get("/analyze")
def analyze_dataset():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".csv")]

    if not files:
        return {"error": "No dataset uploaded"}

    latest_file = os.path.join(UPLOAD_FOLDER, files[-1])
    df = pd.read_csv(latest_file)

    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_usage_kb": round(df.memory_usage(deep=True).sum() / 1024, 2)
    }

# Dataset Summary API
@app.get("/summary")
def dataset_summary():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".csv")]

    if not files:
        return {"error": "No dataset uploaded"}

    latest_file = os.path.join(UPLOAD_FOLDER, files[-1])
    df = pd.read_csv(latest_file)

    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "summary_statistics": df.describe(include="all").fillna("").to_dict()
    }

# Clean Dataset API
@app.post("/clean")
def clean_dataset():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".csv")]

    if not files:
        return {"error": "No dataset uploaded"}

    latest_file = os.path.join(UPLOAD_FOLDER, files[-1])
    df = pd.read_csv(latest_file)

    rows_before = len(df)
    duplicates_before = int(df.duplicated().sum())

    df = df.drop_duplicates()

    numeric_columns = df.select_dtypes(include="number").columns
    for column in numeric_columns:
        df[column] = df[column].fillna(df[column].mean())

    text_columns = df.select_dtypes(include="object").columns
    for column in text_columns:
        if not df[column].mode().empty:
            df[column] = df[column].fillna(df[column].mode()[0])

    rows_after = len(df)

    cleaned_file = os.path.join(CLEANED_FOLDER, "cleaned_dataset.csv")
    df.to_csv(cleaned_file, index=False)

    return {
        "rows_before": rows_before,
        "rows_after": rows_after,
        "duplicates_removed": duplicates_before,
        "missing_values_remaining": int(df.isnull().sum().sum()),
        "cleaned_file": "cleaned_dataset.csv"
    }