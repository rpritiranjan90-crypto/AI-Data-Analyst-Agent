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

## 🌟 Key Platform Modules

### 1. 📊 Executive Dashboard & Profiling
- Real-time KPI summary (Row count, attribute count, missing value analysis, memory usage).
- Glassmorphic dataset overview charts with Framer Motion animations.
- Active dataset status persistence across session reloads.

### 2. 🧹 Data Cleaning Studio (`/cleaning`)
- **1-Click Auto Clean**: Automated imputation of missing data & duplicate purging.
- **Missing Value Imputer**: Impute via Mean, Median, Mode, Constant, Forward Fill, or Backward Fill.
- **Outlier Detection**: Filter numerical extremes using Interquartile Range (IQR 1.5x) or Z-Score thresholding.
- **Deduplication & Type Casting**: Instant duplicate purging and type conversion (`int64`, `float64`, `datetime64`, `object`).

### 3. 📈 Visualization & Chart Engine (`/visualization`)
- **19+ Interactive Chart Types**: Histograms, Bar, Line, Scatter, Boxplots, Violin plots, Countplots, Correlation Heatmaps, and Pie charts.
- **Customizable Controls**: X/Y column selectors, title customization, and theme styling (`Default`, `Dark`, `Seaborn`, `GGPlot`).
- **High-Res PNG Exports**: Instant rendering with 1-click PNG image download links.

### 4. 🤖 Machine Learning Studio (`/machine-learning`)
- **Automated ML Pipelines**: Train Random Forest, Linear/Logistic Regression, Decision Trees, Gradient Boosting, KNN, and SVM models.
- **Interactive Train/Test Split & Random Seeds**: Test ratio slider (10% to 40%) with cross-validated evaluation.
- **Live Metrics Dashboard**: Displays Accuracy, R² Score, Mean Squared Error (MSE), and target breakdowns.

### 5. 📄 Reports & AI Data Assistant (`/reports`)
- **Automated AI Insights**: Synthesizes executive dataset interpretations.
- **PDF Report Generation**: Compiles server-side PDF analytical report decks.
- **Interactive AI Data Assistant**: Natural language query interface to ask questions about active datasets.

---

## 🏗 System Architecture

```
AI Data Analyst Platform
├── backend/ (FastAPI + Pandas + DuckDB + Scikit-Learn)
│   ├── app/
│   │   ├── routes/        # FastAPI API Endpoints (/clean, /visualization, /ml, /report)
│   │   ├── services/      # Business Logic (DuckDB Engine, Cleaning, ML Pipeline, Reports)
│   │   ├── common/        # Logger, Timing decorators, Config
│   │   └── main.py        # FastAPI Application Entry
│   └── Dockerfile
│
├── frontend/ (React 19 + TypeScript + Vite + Tailwind CSS v4)
│   ├── src/
│   │   ├── components/    # Reusable UI Glass Cards, Badges, Buttons, Navbar, Sidebar
│   │   ├── features/      # Analysis Feature Modules
│   │   ├── pages/         # Dashboard, Upload, Cleaning, Visualization, ML, Reports
│   │   ├── services/      # Axios API Services Layer
│   │   └── store/         # Zustand Persistent Dataset State
│   └── Dockerfile
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

### Option B: Docker Container Deployment

Run both frontend & backend with a single command:
```bash
docker-compose up --build
```
- **Web App UI**: `http://localhost/`
- **FastAPI API**: `http://localhost:8000/docs`

---

## 👨‍💻 Author

**Pritiranjan Rout**  
*B.Tech CSE | Data Analyst & AI Architect*  
*Specializing in Full-Stack Web Development, Data Science, & Machine Learning Solutions.*