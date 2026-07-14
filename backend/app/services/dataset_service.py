import os
import pandas as pd
UPLOAD_FOLDER = "uploads"
def get_latest_dataset():
    files = [f for f in os.listdir(UPLOAD_FOLDER) if f.endswith(".csv")]
    if not files:
        return None
    latest_file = os.path.join(UPLOAD_FOLDER, files[-1])
    return pd.read_csv(latest_file)
