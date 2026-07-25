from __future__ import annotations
import sys
import time
from pathlib import Path
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient

# Ensure UTF-8 output encoding for stdout
sys.stdout.reconfigure(encoding='utf-8')

# Ensure app modules are importable
sys.path.insert(0, str(Path(__file__).parent))

from app.main import app
from app.services.dataset_cache import DatasetCache

client = TestClient(app)

def run_large_dataset_benchmark():
    print("=" * 75)
    print("⚡ LARGE DATASET BENCHMARK & STRESS TEST (100,000 ROWS)")
    print("=" * 75)

    # 1. Generate 100,000 Row Synthetic Dataset
    print("[1/6] Generating 100,000 row x 10 column synthetic benchmark dataset...")
    t_start_gen = time.time()
    
    np.random.seed(42)
    n_rows = 100000

    data = {
        "customer_id": [f"CUST_{i:06d}" for i in range(1, n_rows + 1)],
        "age": np.random.choice([np.nan, 18, 25, 35, 45, 55, 65, 85, 130], size=n_rows, p=[0.05, 0.15, 0.25, 0.25, 0.15, 0.1, 0.03, 0.01, 0.01]),
        "annual_income": np.random.normal(65000, 20000, n_rows),
        "credit_score": np.random.randint(300, 850, size=n_rows),
        "spending_score": np.random.uniform(1, 100, size=n_rows),
        "account_balance": np.random.exponential(15000, size=n_rows),
        "department": np.random.choice(["IT", "Sales", "Marketing", "HR", "Finance"], size=n_rows),
        "education": np.random.choice(["Bachelor", "Master", "PhD", "HighSchool"], size=n_rows),
        "is_churned": np.random.choice([0, 1], size=n_rows, p=[0.75, 0.25]),
        "transaction_date": pd.date_range("2024-01-01", periods=n_rows, freq="min").astype(str)
    }

    df = pd.DataFrame(data)
    gen_duration = time.time() - t_start_gen
    print(f"      Completed generation of 100,000 rows in {gen_duration:.2f} seconds.")

    # Save to disk to verify file upload size
    benchmark_file = Path("uploads/big_benchmark_100k.csv")
    benchmark_file.parent.mkdir(exist_ok=True)
    df.to_csv(benchmark_file, index=False)
    file_size_mb = benchmark_file.stat().st_size / (1024 * 1024)
    print(f"      Saved dataset to uploads/ ({file_size_mb:.2f} MB file size).")

    # Load dataset into memory cache
    DatasetCache.set_dataset(df, "big_benchmark_100k.csv")
    print("-" * 75)

    benchmarks = []

    # 2. Benchmark Profiling & Summary (100,000 rows)
    t0 = time.time()
    res = client.get("/analysis/summary")
    d0 = time.time() - t0
    benchmarks.append(("Dataset Profiling (/analysis/summary)", d0, res.status_code == 200))

    # 3. Benchmark Descriptive Statistics (100,000 rows)
    t1 = time.time()
    res = client.get("/analysis/descriptive")
    d1 = time.time() - t1
    benchmarks.append(("Descriptive Statistics (/analysis/descriptive)", d1, res.status_code == 200))

    # 4. Benchmark DuckDB Natural Language Querying (100,000 rows)
    t2 = time.time()
    res = client.post("/analysis/nl-query", json={"query": "Show top 10 customers sorted by highest annual_income"})
    d2 = time.time() - t2
    benchmarks.append(("DuckDB In-Memory SQL Query (/analysis/nl-query)", d2, res.status_code == 200))

    # 5. Benchmark Data Cleaning Imputation (100,000 rows)
    t3 = time.time()
    res = client.post("/clean/missing-values?column=age&method=median")
    d3 = time.time() - t3
    benchmarks.append(("Data Cleaning Imputation (/clean/missing-values)", d3, res.status_code == 200))

    # 6. Benchmark Data Cleaning Outlier Removal (100,000 rows)
    t4 = time.time()
    res = client.post("/clean/outliers/iqr?column=annual_income")
    d4 = time.time() - t4
    benchmarks.append(("Outlier Removal Filter (/clean/outliers/iqr)", d4, res.status_code == 200))

    # 7. Benchmark PDF Report Generation (100,000 rows)
    t5 = time.time()
    res = client.get("/generate-report")
    d5 = time.time() - t5
    benchmarks.append(("PDF Report Compiler (/generate-report)", d5, res.status_code == 200))

    # Output Benchmark Results Table
    print("📊 100,000 ROW STRESS TEST BENCHMARK RESULTS:")
    print("-" * 75)
    print(f" {'Feature Operation':<48} | {'Execution Time':<12} | Status")
    print("-" * 75)
    for op_name, duration, success in benchmarks:
        status_str = "PASSED [OK]" if success else "FAILED [X]"
        print(f" * {op_name:<47} | {duration*1000:7.1f} ms  | {status_str}")
    print("=" * 75)
    total_pipeline_ms = sum(b[1] for b in benchmarks) * 1000
    print(f"⚡ TOTAL FULL-PIPELINE STRESS TEST LATENCY: {total_pipeline_ms:.1f} ms ({total_pipeline_ms/1000:.2f} seconds)")
    print("=" * 75)

if __name__ == "__main__":
    run_large_dataset_benchmark()
