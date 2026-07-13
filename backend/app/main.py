from fastapi import FastAPI

app = FastAPI(
    title="AI Data Analyst Agent",
    description="An AI-powered Data Analytics Platform",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "project": "AI Data Analyst Agent",
        "developer": "Pritiranjan Rout",
        "version": "1.0.0",
        "status": "Backend Running Successfully"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "server": "running"
    }

@app.get("/about")
def about():
    return {
        "application": "AI Data Analyst Agent",
        "framework": "FastAPI",
        "developer": "Pritiranjan Rout"
    }