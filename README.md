# 🤖 AI Data Analyst Agent — Enterprise Intelligence Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-06B6D4.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![DuckDB](https://img.shields.io/badge/DuckDB-In--Memory-FFF000.svg?style=flat&logo=duckdb)](https://duckdb.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg?style=flat&logo=docker)](https://www.docker.com/)

An enterprise-grade, AI-powered Data Analytics & Machine Learning platform built with **FastAPI**, **Pandas**, **DuckDB**, **Seaborn**, **Scikit-Learn**, and **React 19**. It features executive glassmorphism styling, automated dataset cleaning, interactive 19+ chart visualization engines, automated ML training pipelines, and executive AI insights.

---

## 🎬 Platform Overview & Live Demo

> **Live Demo**: [https://ai-data-analyst-agent-five.vercel.app](https://ai-data-analyst-agent-five.vercel.app) *(Active Live App)*

```
 📊 Dataset Profiling ──► 🧹 1-Click Data Cleaning ──► 📈 19+ Chart Engine ──► 🤖 AutoML & Reports
```

---

## 🌟 Key Platform Modules

### 1. 📊 Executive Dashboard & Profiling
- Real-time KPI summary (Row count, attribute count, missing value analysis, memory usage).
- Glassmorphic dataset overview charts with Framer Motion animations.
- Active dataset status persistence across session reloads.

### 2. 💬 Talk to CSV / Natural Language Data Querying (`/analysis`)
- Ask plain English questions (*"Show top 10 records sorted by salary"*) and instantly view DuckDB SQL query execution & table results.

### 3. 🧹 Data Cleaning Studio (`/cleaning`)
- **1-Click Auto Clean**: Automated imputation of missing data & duplicate purging.
- **Missing Value Imputer**: Impute via Mean, Median, Mode, Constant, Forward Fill, or Backward Fill.
- **Outlier Detection**: Filter numerical extremes using Interquartile Range (IQR 1.5x) or Z-Score thresholding.
- **Deduplication & Type Casting**: Instant duplicate purging and type conversion (`int64`, `float64`, `datetime64`, `object`).

### 4. 📈 Visualization & Chart Engine (`/visualization`)
- **19+ Interactive Chart Types**: Histograms, Bar, Line, Scatter, Boxplots, Violin plots, Countplots, Correlation Heatmaps, and Pie charts.
- **Customizable Controls**: X/Y column selectors, title customization, and theme styling (`Default`, `Dark`, `Seaborn`, `GGPlot`).
- **High-Res PNG Exports**: Instant rendering with 1-click PNG image download links.

### 5. 🤖 Machine Learning Studio (`/machine-learning`)
- **Automated ML Pipelines**: Train Random Forest, Linear/Logistic Regression, Decision Trees, Gradient Boosting, KNN, and SVM models.
- **Interactive Train/Test Split & Random Seeds**: Test ratio slider (10% to 40%) with cross-validated evaluation.
- **Live Metrics Dashboard**: Displays Accuracy, R² Score, Mean Squared Error (MSE), and target breakdowns.

### 6. 📄 Reports & AI Data Assistant (`/reports`)
- **Automated AI Insights**: Synthesizes executive dataset interpretations.
- **PDF Report Generation**: Compiles server-side PDF analytical report decks.
- **Interactive AI Data Assistant**: Natural language query interface to ask questions about active datasets.

---

## 🛡️ Security Hardening (OWASP 5-Pillar Architecture)

1. **Server-Side Validation**: Pydantic models with format regex checks and HTML tag sanitization.
2. **Rate Limiting & Lockout**: Max 10 requests/minute per IP, 15-minute account lockout after 5 failed attempts, and progressive response delays.
3. **Password Hashing**: Salted PBKDF2 SHA-256 (100,000 iterations) with constant-time comparison to prevent timing attacks.
4. **Generic Error Messages**: Identical response `"Incorrect email or password."` to eliminate account enumeration vectors.
5. **Token Authentication**: Tokenized HS256 JWT authorization headers with Axios request interceptor.

---

## 🏗 System Architecture

```
AI Data Analyst Platform
├── backend/ (FastAPI + Pandas + DuckDB + Scikit-Learn)
│   ├── app/
│   │   ├── routes/        # FastAPI API Endpoints (/clean, /visualization, /ml, /report, /auth)
│   │   ├── services/      # Business Logic (DuckDB Engine, Cleaning, ML Pipeline, Auth)
│   │   ├── common/        # Logger, Timing decorators, Config
│   │   └── main.py        # FastAPI Application Entry
│   ├── Dockerfile
│   └── render.yaml        # Render Cloud Deployment Spec
│
├── frontend/ (React 19 + TypeScript + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/    # Reusable UI Glass Cards, Badges, Buttons, Navbar, Sidebar
│   │   ├── features/      # Analysis Feature Modules & Talk to CSV Widget
│   │   ├── pages/         # Dashboard, Upload, Cleaning, Visualization, ML, Reports, Legal
│   │   ├── services/      # Axios API Services Layer
│   │   └── store/         # Zustand Persistent Dataset State
│   ├── Dockerfile
│   └── vercel.json        # Vercel SPA Routing Configuration
│
└── docker-compose.yml     # Multi-Container Deployment Specification
```

---

## ⚡ Quick Start Guide

### Option A: Local Development

#### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend runs on `http://127.0.0.1:8000` (Swagger docs at `/docs`)*

#### 2. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173` or `http://localhost:5174`*

---

### Option B: 1-Click Cloud Deployment

- **Frontend Deployment (Vercel)**: Import `frontend/` directory into [Vercel](https://vercel.com). Uses pre-configured `vercel.json`.
- **Backend Deployment (Render)**: Import `backend/` directory into [Render](https://render.com). Uses pre-configured `render.yaml`.

---

## 👨‍💻 Author

**Pritiranjan Rout**  
*B.Tech CSE | Data Analyst & AI Architect*  
*Specializing in Full-Stack Web Development, Data Science, & Machine Learning Solutions.*