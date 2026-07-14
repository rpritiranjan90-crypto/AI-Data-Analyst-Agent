from app.services.dataset_service import get_latest_dataset
def analyze_dataset():
    df = get_latest_dataset()
    if df is None:
        return {"error": "No dataset uploaded"}
    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "memory_usage_kb": round(df.memory_usage(deep=True).sum()/1024,2)
    }
def dataset_summary():
    df = get_latest_dataset()
    if df is None:
        return {"error": "No dataset uploaded"}
    return {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": list(df.columns),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "summary_statistics": df.describe(include="all").fillna("").to_dict()
    }