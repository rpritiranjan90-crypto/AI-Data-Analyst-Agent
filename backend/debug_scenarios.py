from app.main import app
from app.services.dataset_cache import DatasetCache
from fastapi.testclient import TestClient
import pandas as pd
import numpy as np

client = TestClient(app)

# Scenario 2 debug
n = 1500
df_health = pd.DataFrame({
    "age": np.random.randint(18, 90, size=n),
    "bmi": np.random.normal(26.5, 5.0, size=n).round(1),
    "glucose": np.random.normal(110, 30, size=n).round(1),
    "blood_pressure": np.random.normal(125, 15, size=n).round(0),
    "smoker": np.random.choice(["Yes", "No"], size=n),
    "outcome": np.random.choice([0, 1], p=[0.7, 0.3], size=n)
})
DatasetCache.set_dataset(df_health, "clinical_patients.csv")
r_sum = client.get("/analysis/descriptive")
r_cat = client.get("/analysis/categorical")
r_outlier = client.post("/clean/outliers/iqr?column=glucose")
r_chart = client.post("/visualization/generate", json={"chart_type": "scatter", "x_column": "bmi", "y_column": "glucose"})
r_ml = client.post("/ml/train", json={"target": "outcome", "algorithm": "logistic_regression", "test_size": 0.25})

print("Scenario 2 responses:")
print("descriptive:", r_sum.status_code)
print("categorical:", r_cat.status_code)
print("outlier:", r_outlier.status_code)
print("chart:", r_chart.status_code, r_chart.text[:100])
print("ml:", r_ml.status_code, r_ml.text[:100])

# Scenario 4 debug
dates = pd.date_range("2026-01-01", periods=n, freq="min")
df_iot = pd.DataFrame({
    "timestamp": dates,
    "temperature": (25.0 + 5.0 * np.sin(np.linspace(0, 50, n)) + np.random.normal(0, 0.5, n)).round(2),
    "vibration_hz": (50.0 + np.random.normal(0, 2.0, n)).round(2),
    "pressure_psi": (100.0 + np.random.normal(0, 3.0, n)).round(2),
})
DatasetCache.set_dataset(df_iot, "sensor_telemetry.csv")
r_ts = client.get("/analysis/timeseries")
r_dist = client.get("/analysis/distribution")
r_chart = client.post("/visualization/generate", json={"chart_type": "line", "x_column": "timestamp", "y_column": "temperature"})
r_anomaly = client.post("/ml/detect-anomalies?contamination=0.05")

print("\nScenario 4 responses:")
print("timeseries:", r_ts.status_code, r_ts.text[:100])
print("dist:", r_dist.status_code)
print("chart:", r_chart.status_code, r_chart.text[:100])
print("anomaly:", r_anomaly.status_code, r_anomaly.text[:100])

# Scenario 5 debug
df_hr = pd.DataFrame({
    "experience_years": np.random.randint(1, 30, size=n),
    "education_level": np.random.choice(["Bachelors", "Masters", "PhD"], p=[0.6, 0.3, 0.1], size=n),
    "department": np.random.choice(["Engineering", "Sales", "HR", "Marketing", "Finance"], size=n),
    "performance_rating": np.random.choice([1, 2, 3, 4, 5], p=[0.05, 0.15, 0.5, 0.2, 0.1], size=n),
})
df_hr["salary"] = (40000 + df_hr["experience_years"] * 3500 + df_hr["performance_rating"] * 4000 + np.random.normal(0, 5000, n)).round(2)
DatasetCache.set_dataset(df_hr, "workforce_salary.csv")
r_corr = client.get("/analysis/strong-correlations")
r_chart = client.post("/visualization/generate", json={"chart_type": "boxplot", "x_column": "department", "y_column": "salary"})
r_ml = client.post("/ml/train", json={"target": "salary", "algorithm": "linear_regression", "test_size": 0.2})

print("\nScenario 5 responses:")
print("corr:", r_corr.status_code)
print("chart:", r_chart.status_code, r_chart.text[:100])
print("ml:", r_ml.status_code, r_ml.text[:100])
