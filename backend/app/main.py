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
@app.get("/")
def home():
    return {
        "project": "AI Data Analyst Agent",
        "developer": "Pritiranjan Rout",
        "status": "Running Successfully"
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