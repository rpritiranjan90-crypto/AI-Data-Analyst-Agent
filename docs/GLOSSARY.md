# Glossary

Definitions of technical terms used throughout the project.

## A

**API (Application Programming Interface)**
A contract that lets two software components talk to each other. In this project, the FastAPI backend exposes a REST API that the React frontend consumes.

**AutoML (Automated Machine Learning)**
Automating the parts of building an ML model that a data scientist would normally do by hand — feature selection, hyperparameter tuning, model comparison.

**Audit Log**
A chronological record of system events. We use it to track who did what (uploads, deletions, etc.) for security and debugging.

## B

**Backend**
The server-side of the application (Python + FastAPI in this project).

**BERT**
A family of large language models by Google, useful for embeddings and semantic search. We use a variant for the RAG (Retrieval-Augmented Generation) knowledge base.

**BFF (Backend-for-Frontend)**
An API layer tailored to a specific frontend. Not used here — we expose a single general-purpose REST API.

## C

**CSP (Content Security Policy)**
An HTTP header that tells the browser which sources of scripts/styles are trusted. A core OWASP security control.

**CSV (Comma-Separated Values)**
A plain-text file format where each row is a record and columns are separated by commas. The most common upload format for this project.

**CORS (Cross-Origin Resource Sharing)**
A browser security feature that requires explicit opt-in when a frontend on one domain calls an API on another. We configure it in `app/main.py`.

## D

**DDE (Dynamic Data Exchange) Attack**
A Microsoft Office attack where a formula like `=cmd|...` in a cell is executed when the spreadsheet is opened. We sanitize against this in `dataset_validation.sanitize_csv_formula_injection`.

**Docker**
A containerization platform that packages an application with all its dependencies into a portable image.

**DuckDB**
An in-process analytical database, similar to SQLite but optimized for OLAP (columnar) workloads. Used in this project for fast in-memory SQL queries.

## E

**Embedding**
A dense numerical vector that represents the semantic meaning of text. Similar texts have similar embeddings. Used for RAG similarity search.

**Endpoint**
A specific URL that an API exposes (e.g. `POST /api/auth/login`).

## F

**FastAPI**
A modern Python web framework for building APIs with type hints and automatic OpenAPI docs.

**Frontend**
The client-side of the application (React + Vite in this project).

## G

**Gemini**
Google's family of large language models. We use Gemini 2.0 Flash as the default AI provider (configurable).

**GZip**
A compression algorithm used to reduce the size of HTTP responses.

## H

**HSTS (HTTP Strict Transport Security)**
An HTTP header that forces browsers to always use HTTPS, even if the user types `http://`.

## I

**Isolation Forest**
An unsupervised ML algorithm for detecting anomalies. It works by randomly selecting features and splitting values; anomalies are isolated quickly (short paths in the tree).

**IQR (Interquartile Range)**
A measure of statistical spread. Outliers are typically defined as values below Q1 − 1.5·IQR or above Q3 + 1.5·IQR.

## J

**JWT (JSON Web Token)**
A compact, signed token format used for stateless authentication. We sign with HS256 and a server-side secret.

## L

**Lazy Loading**
Loading code (or data) only when it's actually needed. In this app, every page is a separate bundle loaded on first navigation.

**LLM (Large Language Model)**
A neural network trained on huge text corpora that can generate and understand natural language. Gemini, GPT-4, Claude are all LLMs.

## M

**Magic Bytes**
The first few bytes of a file that uniquely identify its format (e.g. `PK\x03\x04` for ZIP, `\x89PNG` for PNG). We validate these to defeat mime-spoofing attacks.

**Middleware**
Code that runs between receiving a request and returning a response. We have middleware for security headers, rate limiting, and audit logging.

**MLOps**
Practices for deploying and maintaining ML systems in production. Out of scope for this v1.0 project.

## O

**OWASP (Open Web Application Security Project)**
A non-profit that publishes the "OWASP Top 10" list of the most critical web security risks. Our security architecture addresses the 2021 top 10.

## P

**Pydantic**
A Python library for data validation and settings management. We use it to define API request/response schemas.

**Prompt Injection**
An attack where a user crafts an input that overrides the system prompt of an LLM, causing it to behave in unintended ways. We use a prompt-injection shield to detect and block common patterns.

## R

**RAG (Retrieval-Augmented Generation)**
A pattern where an LLM is given relevant documents retrieved from a vector store, so it can answer questions using up-to-date or domain-specific knowledge.

**Rate Limiting**
A protection that caps the number of requests a single client can make in a given time window. We use a sliding-window per-IP limiter.

**RBAC (Role-Based Access Control)**
A permission model where access is granted based on the user's role. Currently all users have the same role; planned for v2.1.

**React**
A JavaScript library for building user interfaces, maintained by Meta.

## S

**SCA (Software Composition Analysis)**
Scanning third-party dependencies for known vulnerabilities. We run `pip-audit` and `npm audit` in CI.

**Skeleton**
A placeholder UI shown while real content is loading. Improves perceived performance.

**SQL Injection**
A code injection attack where user input is concatenated into a SQL query. We use parameterized DuckDB queries to prevent it.

**Suspense**
A React feature for handling async loading states. Used with `React.lazy` for code-split routes.

## T

**TPS (Transactions Per Second)**
A throughput metric. With the in-memory DuckDB setup, we achieve ~500 SQL queries per second on a single core.

**TTL (Time To Live)**
How long a cached value is valid before being recomputed.

## V

**Vite**
A modern frontend build tool that uses native ES modules for fast dev startup and Rollup for production builds.

## W

**WebSocket**
A persistent, full-duplex TCP connection used for real-time features. Used for live collaboration in this project.

**Webpack → Vite**
This project migrated from Webpack to Vite for ~10x faster cold start.

## Z

**Z-score**
The number of standard deviations a value is from the mean. Outliers are typically defined as |z| > 3.

**Zustand**
A minimal state-management library for React. We use it for the global dataset store.
