from fastapi import FastAPI, UploadFile, File
import pandas as pd
import os
app = FastAPI(
    title="AI Data Analyst Agent",
    description="AI-powered Data Analytics Platform",
    version="1.0.0"
)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
@app.get("/analyze")
def analyze_dataset():
    upload_folder = "uploads"

    files = [f for f in os.listdir(upload_folder) if f.endswith(".csv")]

    if not files:
        return {"error": "No dataset uploaded"}

    latest_file = os.path.join(upload_folder, files[-1])

    df = pd.read_csv(latest_file)

    return {
        "filename": files[-1],
        "shape": {
            "rows": df.shape[0],
            "columns": df.shape[1]
        },
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_usage_kb": round(df.memory_usage(deep=True).sum()/1024,2)
    }
@app.post("/upload")
async def upload_csv(file: UploadFile = File(...)):
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())
    df = pd.read_csv(file_path)
    return {
    "filename": file.filename,
    "rows": len(df),
    "columns": len(df.columns),
    "column_names": list(df.columns),
    "data_types": df.dtypes.astype(str).to_dict(),
    "missing_values": df.isnull().sum().to_dict(),
    "preview": df.head().to_dict(orient="records")
}