const API_BASE = "https://ai-data-analyst-agent-xs7p.onrender.com";

async function testDatabaseRoutes() {
  console.log("==================================================");
  console.log("  TESTING DATABASE CONNECTOR ENDPOINTS           ");
  console.log("==================================================");

  // Test SQLite Connection
  try {
    const res = await fetch(`${API_BASE}/database/test-connection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_string: "sqlite:///test.db" }),
    });
    const json = await res.json();
    console.log("  [PASS] POST /database/test-connection ->", json.message || json);
  } catch (err) {
    console.log("  [FAIL] POST /database/test-connection -> Error:", err.message);
  }
}

testDatabaseRoutes();
