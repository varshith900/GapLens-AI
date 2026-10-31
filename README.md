# GapLens AI - Digital Dark Spot
> **AI-Assisted Information Gap & Contradiction Detection Platform**  
> *Production-Ready Enterprise Research Intelligence Platform*

[![Python](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.14-3776AB?logo=python&logoColor=white)](https://fastapi.tiangolo.com)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20TypeScript%20%7C%20Vite%20%7C%20TailwindCSS-61DAFB?logo=react&logoColor=black)](https://vitejs.dev)
[![AI Engine](https://img.shields.io/badge/AI%20Engine-Google%20Gemini%202.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)
[![Database](https://img.shields.io/badge/Database-Cloud%20Firestore%20%7C%20Local%20Resilient%20Store-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![PDF Generation](https://img.shields.io/badge/Export-ReportLab%20PDF-E11D48)](https://www.reportlab.com)

---

## 1. Executive Summary & Problem Solved

When researching critical decisions in education, government benefits, corporate compliance, medical procedures, or career transitions, people collect information across scattered websites and documents.

However:
- **Critical Information is Missing**: Vital conditions (e.g., renewal criteria, minimum GPA, dispute channels) remain unstated.
- **Conflicting Claims**: Different websites state incompatible deadlines, document requirements, or rules.
- **Outdated Data**: Archival notices from previous years mislead applicants.
- **Uncertainty & Hallucination**: Generic AI chatbots compress text and hallucinate missing details.

### The Solution: Digital Dark Spot
**Digital Dark Spot** is not a generic chatbot or summary tool. It is an **evidence-backed research intelligence platform** that analyzes multiple web sources together to detect:
1. **Information Gaps**: Exactly what essential questions remain unanswered (*"Not found in the sources reviewed."*).
2. **Contradictory Claims**: Direct side-by-side claim comparisons with traceable source quotes.
3. **Outdated Information Warnings**: 4-tier freshness classification (Potentially Outdated, Date Unavailable, Current Cycle Not Confirmed, Clean).
4. **Traceable Evidence Grounding**: Verbatim quotes linking directly to live URLs.
5. **Interactive Verification Checklist**: Prioritized tasks with suggested authoritative escalation bodies.
6. **Executive PDF Export**: One-click downloadable report for decision-makers.

---

## 2. Technology Stack & Architecture

### Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark/Light Design Tokens + Glassmorphism
- **Iconography**: Lucide React
- **Authentication**: Firebase Authentication + Resilient Demo Access Mode
- **State Management**: Reactive Hooks with URL-based view routing

### Backend
- **Framework**: FastAPI (Asynchronous Python)
- **Validation**: Pydantic v2 (Strict Schema Enforcement)
- **HTML Extraction & Cleaning**: BeautifulSoup4 + Requests + SSRF Guardrails
- **AI Integration**: Google GenAI SDK (`gemini-2.5-flash`)
- **Report Generation**: ReportLab (Vector PDF Generation)
- **Storage & Database**: Google Cloud Firestore + Resilient Local JSON Store fallback

```text
               +-------------------------------------------+
               |        React 19 + Vite Dashboard          |
               | (Landing, Workspace, Results, Audit Trail)|
               +---------------------+---------------------+
                                     |  REST API / CORS
                                     v
               +-------------------------------------------+
               |          FastAPI Backend Service          |
               +---------------------+---------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+------------------+       +-------------------+            +--------------------+
| Source Extractor |       | Multi-Stage AI    |            | Database & Export  |
| - SSRF Filter    |       | Analysis Pipeline |            | - Cloud Firestore  |
| - HTML Parsing   |       | - Stage 1: Claims |            | - Resilient Cache  |
| - Date Metadata  |       | - Stage 2: Compare|            | - ReportLab PDF    |
+------------------+       | - Stage 3: Gaps   |            +--------------------+
                           | - Stage 4: Cycles |
                           | - Stage 5: Plan   |
                           +---------+---------+
                                     |
                                     v
                           +-------------------+
                           | Google Gemini API |
                           | (gemini-2.5-flash)|
                           +-------------------+
```

---

## 3. The 5-Stage Analytical Pipeline

Rather than throwing multiple documents into a single generic prompt, Digital Dark Spot breaks research analysis into structured, auditable stages:

1. **Stage 1: Individual Source Extraction & Grounding**  
   Cleans boilerplate navigation/ads, isolates substantive text, detects publication dates, and extracts conditions, deadlines, and eligibility rules.
2. **Stage 2: Cross-Source Contradiction Detection**  
   Compares claims across distinct sources to detect discrepancies in submission cutoffs, physical vs. digital certificate verification, or income ceilings.
3. **Stage 3: Information Gap Detection**  
   Evaluates the user's research query against the collective claim matrix to surface missing questions. Explicitly labeled: *"Not found in the sources reviewed."*
4. **Stage 4: Freshness & Cycle Checker**  
   Audits dates against academic and policy cycles (e.g. flagging a 2023 bulletin when researching 2025/2026 intake).
5. **Stage 5: Prioritized Verification Checklist**  
   Dynamically compiles concrete verification tasks with priority levels, impact reasoning, and target offices.

---

## 4. Benchmark Demonstration Scenario

To evaluate the platform, use the pre-loaded **"Scholarship Application Research"** demonstration:

- **Research Topic**: *Scholarship Application Research*
- **Research Question**: *"What should a student verify before applying for a government scholarship?"*
- **Included Sources**:
  1. `[DEMO SOURCE A] National Merit Scholarship Portal (2025-2026)` — Confirms 80% marks cutoff and INR 8L family income limit.
  2. `[DEMO SOURCE B] Department of Higher Education Circular (2025-2026)` — States deadline is **November 20, 2025** and demands **physical in-person original caste certificate submission** to the District Welfare Officer.
  3. `[DEMO SOURCE C] Student Welfare Archive Bulletin (2023-2024)` — Archival source stating deadline was **November 10, 2023** and claiming **physical verification was waived**.
  4. `[DEMO SOURCE D] Higher Studies Support Network FAQ` — Undated advisory on PFMS bank disbursement with **no mention of renewal CGPA maintenance cutoffs**.

### What Digital Dark Spot Detects:
- **Information Gap Detected**: *"Scholarship Renewal Terms & Multi-Year Maintenance Criteria"* — none of the sources clarify required college CGPA to maintain the scholarship.
- **Contradiction 1 Detected**: Conflicting deadlines (**Nov 20, 2025** vs. **Nov 10, 2023**).
- **Contradiction 2 Detected**: Conflicting document protocols (**Mandatory in-person verification** vs. **Physical submission waived**).
- **Outdated Warning Detected**: Source C is flagged as *Potentially Outdated* due to referencing the superseded 2023-2024 cycle.
- **Date Warning Detected**: Source D is flagged as *Date Unavailable*.
- **Actionable Checklist**: Directs the student to verify in-person verification rules with the District Welfare Officer and request the renewal CGPA policy from the university.

---

## 5. Local Setup & Installation

### Prerequisites
- Node.js v18+ & npm
- Python 3.10+
- (Optional) Google Gemini API Key

### Step 1: Clone and Configure Environment
```bash
git clone https://github.com/your-username/digital-dark-spot.git
cd "GapLens AI"

# Copy environment template
cp .env.example .env
```

To enable live Google Gemini analysis, add your key in `.env`:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```
*(Note: If no API key is provided, the platform automatically utilizes its built-in deterministic multi-stage analytical engine so all features work immediately).*

### Step 2: Install Backend Dependencies & Start Server
```bash
# Install Python packages
python -m pip install -r requirements.txt

# Start FastAPI backend
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
The backend API is now live at `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).

### Step 3: Install Frontend Dependencies & Start Dev Client
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 6. Running Automated Tests

Run the full end-to-end pipeline verification test suite:
```bash
python -m unittest tests/test_pipeline.py
```
This tests:
- SSRF and private-network IP blocking.
- Webpage content extraction and HTML boilerplate stripping.
- Multi-source contradiction detection.
- Information gap evaluation against research objectives.
- Freshness classification across cycles.
- Interactive checklist task toggling.
- ReportLab vector PDF report compilation.

---

## 7. Production Deployment Guide

### Frontend Deployment (Vercel)
1. Link your GitHub repository to Vercel with Root Directory set to `frontend`.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: URL of your deployed backend (e.g., `https://api.digitaldarkspot.yourdomain.com/api`)

### Backend Deployment (Render / Cloud Run / Railway)
1. Deploy from root or `backend` folder.
2. Build Command: `pip install -r requirements.txt`
3. Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`
4. Provide Environment Variables in dashboard:
   - `GEMINI_API_KEY`: Your Google GenAI key
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (if using cloud Firestore)

---

## 8. Responsible AI & Ethical Design

- **Epistemic Modesty**: The platform explicitly frames findings as *potential gaps*, *possible contradictions*, and *verification leads*.
- **Grounding Guarantee**: Every confirmed claim is linked to source IDs and verbatim text snippets.
- **SSRF Hardening**: Custom URL validators resolve hostnames and block private IPs (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `127.0.0.1`, cloud metadata endpoints).
- **Transparent Demonstration**: Demo sources are prominently tagged `[DEMO SOURCE]` to ensure no synthetic claims are confused with official government publications.

---

## 9. Enterprise Architectural Standards & Quality Matrix

| Architectural Principle | How Digital Dark Spot Delivers |
|---|---|
| **Problem Formulation & Relevance** | Eliminates blind spots, expired circulars, and conflicting instructions in multi-source decision making. |
| **Epistemic Innovation & Negative Proof** | Inverts traditional chatbots: instead of summarizing what is there, it systematically identifies what is *missing* and *contradictory*. |
| **End-to-End Functionality** | Full-stack production implementation: live web scraper, 5-stage analysis engine, interactive checklist, history persistence, and PDF export. |
| **Technical Hardening** | Production-grade FastAPI + React 19 + TypeScript + Pydantic v2 + SSRF protections + ReportLab PDF generation. |
| **Evidence, Accuracy & Transparency** | Verbatim quotes and clickable source links for every claim; explicit confidence notes. |
| **Production Readiness** | One-click benchmark demonstration scenarios with realistic conflicting documents, outdated years, and missing renewal criteria. |

---

*Digital Dark Spot — AI-Assisted Information Gap & Contradiction Detection Platform.*

