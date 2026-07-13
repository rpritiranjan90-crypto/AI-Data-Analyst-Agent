import os
import pandas as pd
UPLOAD_FOLDER = "uploads"
CLEANED_FOLDER = "cleaned_data"
os.makedirs(CLEANED_FOLDER, exist_ok=True)
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
