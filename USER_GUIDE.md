# 📘 AIFlow Enterprise: Step-by-Step User Guide

Welcome to the **AI Data Analyst Agent (AIFlow Enterprise)**. This guide provides a complete, non-technical, step-by-step walkthrough to help any user analyze data, build predictive machine learning models, generate executive visualizations, and export presentation-ready reports in minutes.

---

## 📑 Table of Contents

1. [Step 1: Accessing the Platform & Logging In](#step-1-accessing-the-platform--logging-in)
2. [Step 2: Uploading Your Dataset (or Using Demo Data)](#step-2-uploading-your-dataset-or-using-demo-data)
3. [Step 3: Executive Dashboard & Health Overview](#step-3-executive-dashboard--health-overview)
4. [Step 4: 1-Click Data Cleaning & Quality Studio](#step-4-1-click-data-cleaning--quality-studio)
5. [Step 5: Statistical Analysis & Plain-English SQL Queries](#step-5-statistical-analysis--plain-english-sql-queries)
6. [Step 6: Creating 35+ Interactive Charts & Visualizations](#step-6-creating-35-interactive-charts--visualizations)
7. [Step 7: Training Machine Learning Models (AutoML)](#step-7-training-machine-learning-models-automl)
8. [Step 8: Spotting Outliers with Anomaly Radar](#step-8-spotting-outliers-with-anomaly-radar)
9. [Step 9: Exporting PDF Reports & PowerPoint Slide Decks](#step-9-exporting-pdf-reports--powerpoint-slide-decks)
10. [Step 10: Scenario Simulator & AI Governance](#step-10-scenario-simulator--ai-governance)

---

## Step 1: Accessing the Platform & Logging In

1. Open your browser and navigate to the live website:
   👉 **`https://ai-data-analyst-agent-five.vercel.app`**
2. You will be greeted by the **Sign In** screen. Choose one of the following:
   * **Option A (Create an Account):** Click **`Create Workspace`** at the bottom, enter your name, work email, and password, then click **Create Workspace**.
   * **Option B (Sign In):** Enter your registered email and password, then click **Sign In to Workspace**.
   * **Option C (Instant Guest Mode):** Click the green **`Enter Guest Preview Mode`** button to instantly test the platform without creating an account.

---

## Step 2: Uploading Your Dataset (or Using Demo Data)

Once logged in, you can load your data in two ways:

### Option A: Uploading Your Own File
1. In the left sidebar, click **Upload Dataset** (or navigate to `/upload`).
2. Drag and drop your **CSV** or **Excel (`.xlsx`, `.xls`)** file into the drop zone (or click **Browse Files**).
3. The platform will automatically parse the columns, identify data types (numbers, text, dates), and display a preview table of your first 10 rows.
4. Click **Confirm & Ingest Dataset**.

### Option B: Using the Built-In Demo Dataset
* If you don't have a dataset ready, simply click the **`Load Demo Dataset`** button on the Dashboard.
* This will immediately load a 1,500-record **HR & Business Analytics** dataset with real-world salaries, ages, departments, and churn indicators.

---

## Step 3: Executive Dashboard & Health Overview

Navigate to **Dashboard** in the sidebar to view your high-level dataset metrics:

* **Total Rows & Columns:** Immediate scale indicator (e.g., 20,640 rows × 9 columns).
* **Data Health Score:** A 0–100 score indicating data quality, completeness, and cleanliness.
* **Missing Value Counter:** Shows exactly how many empty cells exist in your dataset.
* **Active Dataset Badge:** Displayed in the sidebar and top header to confirm which dataset is active across all tools.

---

## Step 4: 1-Click Data Cleaning & Quality Studio

Navigate to **Data Cleaning** (`/cleaning`) in the sidebar:

1. **Review Data Quality Scorecard:** See which columns have missing numbers, duplicate records, or extreme outliers.
2. **Missing Value Imputation:**
   * Select a column from the dropdown.
   * Choose an imputation strategy: **Mean** (average), **Median** (middle value), **Mode** (most frequent), or **Constant**.
   * Click **Fill Missing Values**.
3. **Outlier Filtering:**
   * Select a numerical column.
   * Choose **IQR Method** (Interquartile Range) or **Z-Score Method**.
   * Click **Remove Outliers** to filter extreme anomalies.
4. **Remove Duplicates:** Click **Drop Duplicate Rows** to ensure every record is unique.
5. **1-Click AutoClean:** Click the purple **`AutoClean Dataset`** button to perform all standard cleaning operations in one click.

---

## Step 5: Statistical Analysis & Plain-English SQL Queries

Navigate to **Analysis** (`/analysis`) in the sidebar:

1. **Descriptive Statistics:** View 8-number summaries (Mean, Median, Standard Deviation, Min, Max, 25th, 75th percentiles) for every numerical column.
2. **Correlation Matrix:** Inspect interactive heatmaps showing relationships between variables (e.g., *Income vs. Home Value*).
3. **Categorical Distributions:** View frequency counts and percentages for categorical variables (e.g., *Country*, *Department*, *Gender*).
4. **Natural Language / SQL Query Studio:**
   * In the query box, type a SQL query or analytical question (e.g., `SELECT department, AVG(salary) FROM dataset GROUP BY department`).
   * The **DuckDB in-memory OLAP engine** will execute your query in under **40 milliseconds** and render an interactive data table.

---

## Step 6: Creating 35+ Interactive Charts & Visualizations

Navigate to **Visualization** (`/visualization`) in the sidebar:

1. **Select Chart Type:** Choose from 35 supported charts:
   * *Bar Charts, Line Charts, Scatter Plots, Histograms, Boxplots, Heatmaps, Donut Charts, Radar Plots, Area Charts, and Violin Plots.*
2. **Configure Axes:**
   * **X-Axis:** Select your primary variable (e.g., `Age` or `Country`).
   * **Y-Axis:** Select your metric (e.g., `Salary` or `Balance`).
3. **Choose Color Theme:** Select from **Light**, **Dark**, **Minimal**, or **Vibrant**.
4. **Click Generate Chart:** Your high-resolution interactive visualization will render instantly.
5. **Export:** Click **Download PNG** or **Save to Pinboard** to embed the chart in executive summaries.

---

## Step 7: Training Machine Learning Models (AutoML)

Navigate to **Machine Learning** (`/machine-learning`) in the sidebar:

1. **Select Target Column:** Choose the outcome you want to predict (e.g., `churned` for classification or `salary` for continuous regression).
2. **Choose Algorithm:**
   * **Classification:** Random Forest, Decision Tree, Logistic Regression.
   * **Continuous Regression:** Gradient Boosting, Linear Regression.
3. **Set Train/Test Split:** Choose your validation ratio (default: 80% train / 20% test).
4. **Click Train Model:**
   * The AutoML engine automatically handles one-hot encoding, feature scaling, and model fitting.
5. **Inspect Performance Metrics:**
   * **Accuracy & ROC-AUC** for classification models.
   * **$R^2$ Score, MAE, and RMSE** for regression models.
   * **Feature Importance Chart:** See which factors most heavily influence the predicted outcome.

---

## Step 8: Spotting Outliers with Anomaly Radar

In the Machine Learning studio:

1. Click on the **Anomaly Detection** tab.
2. Set the expected **Contamination Rate** (e.g., `0.05` for 5% outliers).
3. Click **Run Isolation Forest Radar**.
4. The system will scan multidimensional feature spaces and highlight all anomalous transactions, suspicious values, and statistical outliers with a risk score.

---

## Step 9: Exporting PDF Reports & PowerPoint Slide Decks

Navigate to **Reports & AI Assistant** (`/reports`) in the sidebar:

1. **1-Click Executive PDF Report:**
   * Click **Generate PDF Report**.
   * A multi-page, formatted PDF containing dataset summaries, statistical matrices, key visualizations, and AI narratives will be compiled and made available for download.
2. **1-Click PowerPoint Presentation Deck (`.pptx`):**
   * Click **Export PowerPoint Deck**.
   * Downloads an editable `.pptx` presentation ready for executive boardroom presentations.
3. **AI Copilot Data Chat:**
   * Use the chat assistant at the bottom of the page to ask questions about your data (e.g., *"What is the main driver of customer churn?"*).

---

## Step 10: Scenario Simulator & AI Governance

### Scenario Simulator (`/simulator`)
* Adjust dynamic sliders (e.g., *"What happens if we increase marketing budget by 15%?"*) to view real-time projected outcomes and sensitivity analysis.

### AI Governance & GDPR (`/settings/gdpr`)
* **Download Full Data Export:** Click **Export All Workspace Data** to receive a structured JSON/CSV bundle of all your files and audit logs.
* **Permanent Account Erasure:** Click **Delete Account & Data** to permanently delete all data in compliance with GDPR Article 17 ("Right to be Forgotten").

---

## 🆘 Quick Troubleshooting

| Question / Symptom | Quick Fix |
|---|---|
| **Login button shows "Authenticating..."** | On Render's free tier, the server sleeps after 15 minutes of inactivity. Please allow **30–40 seconds** on the very first request for the container to wake up. |
| **"Invalid email or password"** | If you haven't registered yet, click **Create Workspace** at the bottom of the login form to create your credentials. |
| **"No dataset selected" banner** | Simply click **Upload Dataset** in the sidebar, or click **Load Demo Dataset** on the dashboard. |
| **Chart generation parameter notice** | For single-variable charts (like Histogram or Boxplot), only select a **Column** without selecting a second Y-axis. |

---

**🎉 Congratulations! You are now ready to analyze any dataset with AIFlow Enterprise.**
