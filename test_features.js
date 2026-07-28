const fs = require('fs');

const API_BASE = "https://ai-data-analyst-agent-xs7p.onrender.com";

console.log("==================================================");
console.log("  PRODUCTION BACKEND INTEGRATION TEST SUITE       ");
console.log("  URL:", API_BASE);
console.log("==================================================");

async function runTests() {
  let passed = 0;
  let failed = 0;

  // 1. Health Check
  try {
    const res = await fetch(`${API_BASE}/health`);
    const json = await res.json();
    if (res.ok && json.success) {
      console.log("  [PASS] GET /health -> Status:", json.status);
      passed++;
    } else {
      console.log("  [FAIL] GET /health ->", res.status);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] GET /health -> Error:", err.message);
    failed++;
  }

  // 2. Upload CSV
  const csvContent = "id,name,age,salary,churned\n1,Alice,25,50000,0\n2,Bob,30,92000,0\n3,Charlie,22,35000,1\n4,David,35,95000,0\n5,Eve,28,64000,1\n6,Frank,40,110000,0";
  const formData = new FormData();
  formData.append("file", new Blob([csvContent], { type: "text/csv" }), "test_employees.csv");

  try {
    const uploadRes = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const uploadJson = await uploadRes.json();

    if (uploadRes.ok && uploadJson.success) {
      console.log("  [PASS] POST /upload -> Rows:", uploadJson.metadata.rows, "Cols:", uploadJson.metadata.columns);
      passed++;
    } else {
      console.log("  [FAIL] POST /upload ->", uploadRes.status, uploadJson);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] POST /upload -> Error:", err.message);
    failed++;
  }

  // 3. Test Analysis Endpoints
  const endpoints = [
    "/analysis/summary",
    "/analysis/descriptive",
    "/analysis/correlation",
    "/analysis/strong-correlations",
    "/analysis/categorical",
    "/analysis/distribution",
    "/analysis/timeseries",
    "/analysis/insights",
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(`${API_BASE}${ep}`);
      const json = await res.json();
      if (res.ok) {
        console.log(`  [PASS] GET ${ep}`);
        passed++;
      } else {
        console.log(`  [FAIL] GET ${ep} ->`, res.status, json);
        failed++;
      }
    } catch (err) {
      console.log(`  [FAIL] GET ${ep} -> Error:`, err.message);
      failed++;
    }
  }

  // 4. Test Visualization Endpoints
  try {
    const res = await fetch(`${API_BASE}/visualization/supported`);
    const json = await res.json();
    if (res.ok && json.supported_charts) {
      console.log("  [PASS] GET /visualization/supported ->", json.supported_charts.length, "chart types");
      passed++;
    } else {
      console.log("  [FAIL] GET /visualization/supported ->", res.status);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] GET /visualization/supported -> Error:", err.message);
    failed++;
  }

  try {
    const res = await fetch(`${API_BASE}/visualization/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chart_type: "histogram", x_column: "age" }),
    });
    const json = await res.json();
    if (res.ok && json.success) {
      console.log("  [PASS] POST /visualization/generate (histogram)");
      passed++;
    } else {
      console.log("  [FAIL] POST /visualization/generate ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] POST /visualization/generate -> Error:", err.message);
    failed++;
  }

  // 5. Test Chart Recommendations & Auto Recommendations
  try {
    const res = await fetch(`${API_BASE}/chart-recommendation`);
    const json = await res.json();
    if (res.ok) {
      console.log("  [PASS] GET /chart-recommendation");
      passed++;
    } else {
      console.log("  [FAIL] GET /chart-recommendation ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] GET /chart-recommendation -> Error:", err.message);
    failed++;
  }

  try {
    const res = await fetch(`${API_BASE}/recommendation/auto-recommend`, { method: "POST" });
    const json = await res.json();
    if (res.ok) {
      console.log("  [PASS] POST /recommendation/auto-recommend");
      passed++;
    } else {
      console.log("  [FAIL] POST /recommendation/auto-recommend ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] POST /recommendation/auto-recommend -> Error:", err.message);
    failed++;
  }

  // 6. Test Machine Learning Endpoints
  try {
    const res = await fetch(`${API_BASE}/ml/status`);
    const json = await res.json();
    if (res.ok) {
      console.log("  [PASS] GET /ml/status -> Status:", json.status);
      passed++;
    } else {
      console.log("  [FAIL] GET /ml/status ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] GET /ml/status -> Error:", err.message);
    failed++;
  }

  try {
    const res = await fetch(`${API_BASE}/ml/train`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "churned", algorithm: "rf_classification" }),
    });
    const json = await res.json();
    if (res.ok) {
      console.log("  [PASS] POST /ml/train");
      passed++;
    } else {
      console.log("  [FAIL] POST /ml/train ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] POST /ml/train -> Error:", err.message);
    failed++;
  }

  // 7. Test Reports Endpoint
  try {
    const res = await fetch(`${API_BASE}/reports`);
    const json = await res.json();
    if (res.ok) {
      console.log("  [PASS] GET /reports");
      passed++;
    } else {
      console.log("  [FAIL] GET /reports ->", res.status, json);
      failed++;
    }
  } catch (err) {
    console.log("  [FAIL] GET /reports -> Error:", err.message);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`TOTAL RESULT: PASSED=${passed}, FAILED=${failed}`);
  console.log("==================================================");
}

runTests();
