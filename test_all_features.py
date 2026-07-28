import io
import os
import sys
import pandas as pd
import numpy as np
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

print("==================================================")
print("     ENTERPRISE FEATURE & ROUTE SUITE TEST        ")
print("==================================================")

# 1. Create 3 different test datasets
csv_data = """id,age,salary,department,churned,joining_date
1,25,50000.5,Sales,0,2021-01-15
2,45,120000.0,Engineering,0,2018-05-20
3,31,,Engineering,1,2020-11-01
4,50,150000.0,Sales,0,2015-03-12
5,22,35000.0,Marketing,1,2022-07-04
6,22,35000.0,Marketing,1,2022-07-04
7,38,85000.0,HR,0,2019-09-30
8,60,250000.0,Executive,0,2010-02-01
"""

test_files = [
    ("test_mixed.csv", csv_data.encode("utf-8"), "text/csv"),
]

# Create Excel binary data
excel_io = io.BytesIO()
df_excel = pd.DataFrame({
    "Product": ["Laptop", "Phone", "Tablet", "Monitor", "Keyboard"],
    "Price": [1200, 800, 450, 300, 80],
    "Stock": [50, 120, 80, 40, 200],
    "Rating": [4.5, 4.7, 4.2, 4.6, 4.1]
})
df_excel.to_excel(excel_io, index=False, engine="openpyxl")
excel_bytes = excel_io.getvalue()
test_files.append(("test_inventory.xlsx", excel_bytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))

passed = 0
failed = 0

for filename, content, mime in test_files:
    print(f"\n---> TESTING DATASET: {filename}")
    
    # Test Upload
    res = client.post("/upload", files={"file": (filename, content, mime)})
    if res.status_code == 200:
        print(f"  [PASS] POST /upload ({filename})")
        passed += 1
    else:
        print(f"  [FAIL] POST /upload ({filename}) -> {res.status_code} {res.text}")
        failed += 1
        continue

    # Test Analysis Endpoints
    endpoints = [
        "/analysis/summary",
        "/analysis/descriptive",
        "/analysis/correlation",
        "/analysis/strong-correlations",
        "/analysis/categorical",
        "/analysis/distribution",
        "/analysis/timeseries",
        "/analysis/insights",
    ]

    for ep in endpoints:
        res = client.get(ep)
        if res.status_code == 200:
            print(f"  [PASS] GET {ep}")
            passed += 1
        else:
            print(f"  [FAIL] GET {ep} -> {res.status_code} {res.text}")
            failed += 1

    # Test Cleaning Endpoints
    res = client.post("/cleaning/auto")
    if res.status_code in [200, 400]:
        print(f"  [PASS] POST /cleaning/auto")
        passed += 1
    else:
        print(f"  [FAIL] POST /cleaning/auto -> {res.status_code} {res.text}")
        failed += 1

    # Test Visualization Endpoints
    res = client.get("/visualization/supported")
    if res.status_code == 200:
        print(f"  [PASS] GET /visualization/supported")
        passed += 1
    else:
        print(f"  [FAIL] GET /visualization/supported -> {res.status_code}")
        failed += 1

    res = client.post("/visualization/generate", json={"chart_type": "histogram", "x_column": "age" if "age" in filename else "Price"})
    if res.status_code == 200:
        print(f"  [PASS] POST /visualization/generate (histogram)")
        passed += 1
    else:
        print(f"  [FAIL] POST /visualization/generate (histogram) -> {res.status_code} {res.text}")
        failed += 1

    res = client.post("/visualization/auto")
    if res.status_code == 200:
        print(f"  [PASS] POST /visualization/auto")
        passed += 1
    else:
        print(f"  [FAIL] POST /visualization/auto -> {res.status_code} {res.text}")
        failed += 1

    # Test Recommendations
    res = client.post("/auto-recommend")
    if res.status_code == 200:
        print(f"  [PASS] POST /auto-recommend")
        passed += 1
    else:
        print(f"  [FAIL] POST /auto-recommend -> {res.status_code} {res.text}")
        failed += 1

print("\n==================================================")
print(f"TEST RESULTS: PASSED={passed}, FAILED={failed}")
print("==================================================")
