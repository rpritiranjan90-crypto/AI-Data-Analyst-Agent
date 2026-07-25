from __future__ import annotations
import os
from pathlib import Path
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, HRFlowable

def build_pdf():
    pdf_filename = "AI_Data_Analyst_Master_Presentation.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "DocTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0F172A"),
        alignment=0,
    )

    subtitle_style = ParagraphStyle(
        "DocSubTitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#475569"),
    )

    h1_style = ParagraphStyle(
        "H1Style",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=14,
        spaceAfter=6,
    )

    h2_style = ParagraphStyle(
        "H2Style",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#2563EB"),
        spaceBefore=8,
        spaceAfter=4,
    )

    body_style = ParagraphStyle(
        "BodyStyle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceBefore=3,
        spaceAfter=3,
    )

    script_style = ParagraphStyle(
        "ScriptStyle",
        parent=body_style,
        fontName="Helvetica-Oblique",
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1E293B"),
        backColor=colors.HexColor("#F8FAFC"),
        borderColor=colors.HexColor("#CBD5E1"),
        borderWidth=0.5,
        borderPadding=6,
        spaceBefore=4,
        spaceAfter=6,
    )

    bullet_style = ParagraphStyle(
        "BulletStyle",
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
    )

    elements = []

    # Banner Header
    elements.append(Paragraph("AI DATA ANALYST AGENT — MASTER PRESENTATION GUIDE", title_style))
    elements.append(Paragraph("Complete Technical Architecture, Feature Walkthrough, Speaking Scripts & Future Roadmap", subtitle_style))
    elements.append(Spacer(1, 8))
    elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563EB"), spaceAfter=12))

    # SECTION 1: EXECUTIVE OVERVIEW
    elements.append(Paragraph("1. Executive Overview & Value Proposition", h1_style))
    elements.append(Paragraph(
        "The <b>AI Data Analyst Agent</b> is an enterprise-grade, automated data science and analytics platform. It combines high-performance in-memory database engines (DuckDB), automated machine learning (Scikit-Learn), and natural language query interfaces (Talk to CSV) into a sleek, executive glassmorphism web application built with React 19 and FastAPI.",
        body_style
    ))
    elements.append(Paragraph("🎤 <b>Presenter Speaking Script:</b>", h2_style))
    elements.append(Paragraph(
        "<i>\"Welcome everyone. Today I am presenting the AI Data Analyst Agent — an enterprise platform designed to eliminate manual data preparation and analysis. Analysts routinely waste up to 80% of their working hours cleaning raw datasets and tweaking chart formatting. Our platform automates profiling, cleaning, modeling, and presentation-ready reporting in under 5 seconds.\"</i>",
        script_style
    ))
    elements.append(Spacer(1, 10))

    # SECTION 2: PROBLEM VS SOLUTION
    elements.append(Paragraph("2. Problem Statement vs. Platform Solution", h1_style))
    comp_table_data = [
        [Paragraph("<b>Traditional Analytics Challenge</b>", body_style), Paragraph("<b>AI Data Analyst Solution</b>", body_style)],
        [Paragraph("Manual Python/Pandas code required for basic data cleaning", body_style), Paragraph("1-Click Auto Clean (Mean/Median imputation & duplicate purging)", body_style)],
        [Paragraph("Slow chart rendering & manual Matplotlib formatting", body_style), Paragraph("19+ Interactive chart engine with high-res PNG export canvas", body_style)],
        [Paragraph("Complex SQL queries needed to extract business metrics", body_style), Paragraph("Natural Language 'Talk to CSV' engine powered by DuckDB SQL", body_style)],
        [Paragraph("Unsecured authentication prone to account takeover", body_style), Paragraph("OWASP 5-Pillar Security Hardening (JWT, Rate Limits, Lockouts)", body_style)],
    ]
    t_comp = Table(comp_table_data, colWidths=[270, 270])
    t_comp.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_comp)
    elements.append(Spacer(1, 10))

    # SECTION 3: CORE FEATURE MODULES
    elements.append(Paragraph("3. Deep-Dive Feature Walkthrough & Demonstrations", h1_style))
    
    features = [
        ("📊 Executive Dashboard", "Displays real-time KPI metrics (Row count, attribute count, missing values, memory usage) with an executive Hero Banner and Framer Motion entry animations.", "\"When you log in, the Executive Intelligence Center provides an instant quality summary of your active dataset.\""),
        ("🧹 Data Cleaning Studio", "Automates dataset sanitization with 1-Click Auto Clean, missing value imputation (Mean, Median, Mode, Constant, FFill, BFill), and outlier filters (IQR 1.5x & Z-Score).", "\"Instead of writing custom cleaning functions, analysts select an imputation rule or click 1-Click Auto Clean to obtain a clean dataset instantly.\""),
        ("📈 Interactive Visualization Studio", "Offers 19+ chart types (Histograms, Scatter, Boxplots, Violin plots, Heatmaps, Pie charts) with customizable control sliders and canvas PNG export links.", "\"Our chart engine provides high-resolution rendering and instant PNG downloads for executive reports.\""),
        ("💬 Talk to CSV (Natural Language Engine)", "Translates plain-English text questions into executed DuckDB SQL and Pandas DataFrame operations with interactive table outputs.", "\"Non-technical stakeholders can simply ask 'Show top 10 records by revenue' to get instant SQL query execution.\""),
        ("🤖 Machine Learning Studio", "Automated predictive modeling for classification and regression tasks using Random Forest, Decision Trees, KNN, and SVM with adjustable test ratio sliders.", "\"Our ML studio lets users train and evaluate predictive models without writing line of machine learning code.\""),
        ("📄 Reports & AI Data Assistant", "Synthesizes executive dataset interpretations, compiles server-side PDF analytical report decks, and provides interactive AI chat assistance.", "\"With one click, the platform generates a comprehensive multi-page PDF presentation deck.\""),
    ]

    for title, desc, script in features:
        elements.append(Paragraph(title, h2_style))
        elements.append(Paragraph(f"• <b>Technical Overview:</b> {desc}", body_style))
        elements.append(Paragraph(f"🎤 <b>Presenter Script:</b> {script}", script_style))
        elements.append(Spacer(1, 4))

    elements.append(PageBreak())

    # SECTION 4: OWASP SECURITY HARDENING
    elements.append(Paragraph("4. Technical Architecture & Security Audit", h1_style))
    elements.append(Paragraph(
        "Security is embedded into every layer of the platform following the <b>OWASP 5-Pillar Security Framework</b>:",
        body_style
    ))

    sec_pillars = [
        ("Pillar 1: Server-Side Input Validation", "Pydantic models strictly validate email structures, username whitelists (alphanumeric, underscore, hyphen), and strip HTML/script injection tags."),
        ("Pillar 2: Rate Limiting & Account Lockouts", "Tracks login attempts per IP/account. Limits requests to 10/min, triggers progressive delays (1s, 2s, 5s), and locks accounts for 15 minutes after 5 consecutive failures."),
        ("Pillar 3: Salted Password Hashing", "Passwords are hashed using PBKDF2 SHA-256 with 100,000 iterations and unique 16-byte random salts. Verification uses constant-time comparison (secrets.compare_digest) to eliminate timing attacks."),
        ("Pillar 4: Generic Error Messages & Equalized Timing", "Prevents account enumeration by returning the identical response ('Incorrect email or password.') and running dummy hash operations when an account is not found."),
        ("Pillar 5: Managed Auth & Token Hardening", "Tokenized HS256 JWT bearer authorization with automatic Axios request interceptors and persistent Zustand auth state management."),
    ]

    for p_title, p_desc in sec_pillars:
        elements.append(Paragraph(f"🔒 <b>{p_title}</b>", h2_style))
        elements.append(Paragraph(p_desc, body_style))
        elements.append(Spacer(1, 2))

    elements.append(Paragraph("🎤 <b>Presenter Speaking Script for Security:</b>", h2_style))
    elements.append(Paragraph(
        "<i>\"Security was designed from day one. Many AI-generated apps leak user emails or plain-text passwords. Our platform implements OWASP-compliant server-side validation, rate-limiting against brute force attacks, salted password hashing, and generic timing-equalized error responses to prevent account enumeration.\"</i>",
        script_style
    ))
    elements.append(Spacer(1, 10))

    # SECTION 5: REAL-WORLD FUTURE ROADMAP
    elements.append(Paragraph("5. Real-World Future Advancement Roadmap", h1_style))
    elements.append(Paragraph(
        "To scale the platform into a commercial SaaS business or enterprise product, the following 5-phase roadmap is planned:",
        body_style
    ))

    roadmap_phases = [
        ("Phase 1: Managed LLM RAG & Agentic Workflows", "Integrate Google Gemini / OpenAI API for multi-turn conversational agents capable of joining and analyzing multi-file CSV datasets."),
        ("Phase 2: Direct Enterprise Database Connectors", "Expand beyond static CSV files to live SQL database connections (PostgreSQL, Snowflake, Google BigQuery, Supabase) with real-time sync."),
        ("Phase 3: PowerPoint (.pptx) Deck Exporter", "Implement 1-click slide deck creation using python-pptx for board meeting presentations."),
        ("Phase 4: Drag-and-Drop Executive Pinboard Dashboards", "Allow analysts to pin favorite charts, metrics, and insights onto custom drag-and-drop dashboard grids."),
        ("Phase 5: Asynchronous Task Queues (Celery + Redis)", "Process multi-gigabyte datasets asynchronously with real-time WebSocket progress bars."),
    ]

    for r_title, r_desc in roadmap_phases:
        elements.append(Paragraph(f"🚀 <b>{r_title}</b>", h2_style))
        elements.append(Paragraph(r_desc, body_style))
        elements.append(Spacer(1, 2))

    elements.append(Spacer(1, 10))

    # SECTION 6: LIVE PRODUCTION METRICS & LINKS
    elements.append(Paragraph("6. Live Production Deployment & Links", h1_style))
    
    links_data = [
        [Paragraph("<b>Resource</b>", body_style), Paragraph("<b>Live URL / Location</b>", body_style)],
        [Paragraph("Frontend Application", body_style), Paragraph("https://ai-data-analyst-agent-five.vercel.app", body_style)],
        [Paragraph("Backend API Server", body_style), Paragraph("https://ai-data-analyst-agent-xs7p.onrender.com", body_style)],
        [Paragraph("Swagger API Docs", body_style), Paragraph("https://ai-data-analyst-agent-xs7p.onrender.com/docs", body_style)],
        [Paragraph("GitHub Repository", body_style), Paragraph("https://github.com/rpritiranjan90-crypto/AI-Data-Analyst-Agent", body_style)],
        [Paragraph("Author & Creator", body_style), Paragraph("Pritiranjan Rout (B.Tech CSE | Data Analyst & AI Architect)", body_style)],
    ]
    t_links = Table(links_data, colWidths=[180, 360])
    t_links.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#F1F5F9")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#CBD5E1")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
    ]))
    elements.append(t_links)

    doc.build(elements)
    print("Master PDF generated successfully: " + pdf_filename)

if __name__ == "__main__":
    build_pdf()
