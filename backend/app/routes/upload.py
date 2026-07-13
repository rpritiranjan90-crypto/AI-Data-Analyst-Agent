from fastapi import APIRouter, UploadFile, File
import pandas as pd
import os
import shutil
router = APIRouter()
UPLOAD_FOLDER = "uploads"
@router.post("/upload")
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