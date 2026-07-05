<!-- markdownlint-disable-file -->
# Research: Expanding GeoSBC Prototype to Full Platform

**Date:** 2026-07-01
**Task:** Analyze three source documents (requirements PDF, DN 142 report, presentation) against the current prototype and produce a gap analysis with expansion plan
**Difficulty:** Medium-hard
**Mode:** Analysis and planning only — no code changes

---

## 1. Source Documents Analyzed

| Document | Content | Pages |
|---|---|---|
| AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf | Full functional requirements specification by Amal Krishna (Envision Energy) | 4 |
| Report_DN 142.pdf | Actual soil investigation report (300 MW Koppal Wind Project, BH-1) | 50 |
| Soil_Report_Automation_Tool_Presentation.pdf | Concept/proposal presentation with 6-stage pipeline | 8 slides |

---

## 2. Current Prototype Inventory

### 2.1 Static HTML Prototype (`soil_sbc_tool_prototype.html`)
- Single-file HTML/CSS/JS
- Hardcoded DN 142 data (no file upload)
- 6-stage pipeline visualization (Ingestion → AI Extraction → Validation → Calc Engine → Review/Rec → Summary)
- Deterministic IS 6403 shear and IS 8009 settlement calculation engine (client-side JS)
- 5 founding depths (1.0, 2.0, 2.475, 3.0, 4.0 m) — hardcoded depth-switcher
- Illustrative AI extraction display (not live)
- Hardcoded validation flags (5 items)
- Foundation recommendation with SBC class (20/40)
- One-page summary with export stubs (alert-only)
- Branded "Tredence / Built on Databricks"

### 2.2 Node.js App (`geo-sbc-app/`)
- Express server with Multer PDF upload
- `pdf-parse` for text extraction from uploaded PDFs
- Anthropic Claude API for AI-driven parameter extraction
- Structured JSON extraction prompt (project, strata, extracted params, flags, layers)
- Server-side IS 6403 shear + IS 8009 settlement calculation engine
- API routes: `GET /api/status`, `POST /api/extract`, `POST /api/calculate`
- Frontend (`public/index.html`) — enhanced version of the static prototype, with:
  - Live PDF upload (drag-and-drop)
  - Sample report loading option
  - API status banner (checks for API key)
  - Same visual pipeline and rendering

### 2.3 Calculation Engine Constants (both versions)
```
B = 20m (raft diameter), W' = 0.5, Sq = 1.2, Sg = 0.6, FoS = 3, Rw = 0.5, Sp = 6
```

### 2.4 What Works Today
- PDF upload and text extraction (Node.js app)
- AI extraction of geotechnical parameters via Claude
- Deterministic SBC calculations (shear and settlement)
- Visual pipeline display
- Depth-selector with live recomputation
- Illustrative validation flags

---

## 3. Requirements Gap Analysis

### 3.1 Module-by-Module Assessment

| Req# | Module (from Requirements PDF §6.x) | Current State | Gap Level |
|---|---|---|---|
| 6.1 | AI-Based Report Processing | Partial — PDF upload + Claude extraction exists, no OCR for scanned docs, no Word support | Medium |
| 6.2 | Engineering Calculation Engine | Partial — IS 6403 shear + SPT settlement exist, missing IS 1904, IS 5249, dynamic properties, rotational stiffness, consolidation settlement, reengineering depth logic | Large |
| 6.3 | Reengineering Recommendation | Missing — no auto-evaluation of deeper strata, no reengineering depth recommendation | Full gap |
| 6.4 | Engineering Approval Workflow | Missing — no user accounts, no approval states, no review queue | Full gap |
| 6.5 | Soil Report Repository | Missing — no persistent storage, no customer/project organization, no search, no version control | Full gap |
| 6.6 | Consolidated Engineering Register | Missing — no register, no Excel export | Full gap |
| 6.7 | User Management (RBAC) | Missing — no auth, no roles | Full gap |
| 6.8 | Dashboard | Missing — no dashboard, no statistics | Full gap |
| 6.9 | Audit Trail | Missing — no logging, no activity tracking | Full gap |
| 6.10 | API Integration | Partial — basic REST API exists, no documented contract, no external integration | Medium |

### 3.2 Calculation Engine Gaps (Cross-referenced with DN 142 Report)

| Calculation | Required? | Current State | Reference |
|---|---|---|---|
| IS 6403 Bearing Capacity (shear) | Yes | Implemented — matches DN 142 values | ✅ |
| IS 8009 Settlement (SPT-based) | Yes | Implemented — SPT formula only | ⚠️ Partial |
| IS 8009 Elastic Settlement (Bowles) | Yes | Not implemented — DN 142 uses Bowles method with I₁, I₂, If factors | ❌ |
| IS 1904 Foundation Design checks | Yes | Not implemented | ❌ |
| IS 5249 Dynamic Soil Properties | Yes | Not implemented — DN 142 has dynamic Poisson's ratio, G', E_dynamic, rotational stiffness, spring constants | ❌ |
| General/Local/Punching shear classification | Yes | Not implemented — hardcoded to intermediate shear | ❌ |
| Consolidation settlement | Yes | Not implemented | ❌ |
| Differential settlement check | Yes | Not implemented | ❌ |
| Shape factor correction (Sc, Sq, Sγ) | Yes | Partially — hardcoded Sq=1.2, Sg=0.6, missing Sc | ⚠️ |
| Inclination factor correction | Yes | Not implemented — assumed 1 in DN 142 | ❌ |
| Water table correction logic | Yes | Hardcoded W'=0.5 — should be derived from GWT depth | ⚠️ |
| Configurable foundation geometry | Yes | Hardcoded B=20m circular raft | ❌ |
| Configurable FoS | Yes | Hardcoded FoS=3 | ❌ |

### 3.3 AI Extraction Gaps

| Capability | Current State | Gap |
|---|---|---|
| PDF text extraction | ✅ via pdf-parse | Works for text-based PDFs |
| Scanned document OCR | ❌ | Need OCR engine (Azure Doc Intelligence, Tesseract, etc.) |
| Word document support | ❌ | Need DOC/DOCX parser |
| Confidence scoring | Illustrative only | Need real confidence from AI model |
| Source page citation | Illustrative only | Need real page references |
| Extraction validation rules | ❌ | Need range-checking and cross-field validation |
| Active learning from corrections | ❌ | Future enhancement per requirements |

### 3.4 Data Model Gaps

The current prototype has no persistent data model. The requirements specify:

- **Reports table**: Customer, project, location, borehole, upload date, status, version
- **Extracted parameters**: Per-report extraction results with confidence
- **Calculations**: SBC results at each depth, settlement, dynamic properties
- **Approval records**: Reviewer, action, comments, date, revision
- **Audit events**: Every user action logged
- **Users**: Roles, permissions
- **Customers/Projects**: Hierarchical organization

### 3.5 Cross-Reference: DN 142 Report Structure vs Extraction Prompt

The current Claude extraction prompt requests a good baseline of parameters. Cross-referencing against what DN 142 actually contains reveals additional extraction targets:

| DN 142 Section | Currently Extracted? | Notes |
|---|---|---|
| Project metadata | ✅ | Name, client, location, structure |
| Borehole configuration | ❌ | Diameter, method, depth — not in prompt |
| SPT blow counts per depth | ✅ | Via layers array |
| Grain size distribution | ❌ | Full sieve analysis data |
| Lab test results (density, Gs, etc.) | ❌ | Relative density, specific gravity, gravel % |
| Direct shear test raw data | ❌ | Proving ring, normal stress, division values |
| Bearing capacity factor table | ✅ | Nq, Ng via layers |
| Shape/depth/inclination factors | Partial | dq, dg extracted; Sq, Sg hardcoded |
| Elastic settlement (Bowles) | ❌ | I₁, I₂, If, strata averaging |
| Dynamic properties | Partial | G', Poisson only in extracted array |
| Rock properties (RQD, UCS, RMR) | Partial | RQD, UCS in extracted; RMR, point load missing |
| Spring constants (V, H, rocking, torsion) | ❌ | Critical for WTG design |

---

## 4. Architectural Decisions Needed

| Decision | Options | Notes |
|---|---|---|
| Database | PostgreSQL, MongoDB, SQLite (dev) | Need relational for register/audit; PostgreSQL recommended |
| Authentication | JWT + bcrypt, OAuth/SSO, Passport.js | 4 roles required; JWT simplest for MVP |
| OCR Engine | Azure Document Intelligence, Tesseract.js, AWS Textract | Azure DI best for structured docs |
| File Storage | Local filesystem, Azure Blob, S3 | Blob storage for production |
| Frontend Framework | Keep vanilla JS, migrate to React/Vue/Next.js | Current vanilla approach won't scale for dashboard + workflows |
| Export Engine | PDFKit, docx npm, ExcelJS | Need Word, PDF, Excel export |
| Deployment | Azure App Service, Container Apps, AKS | TBD per customer requirements |

---

## 5. Validation Against DN 142 Report

### 5.1 Calculation Accuracy

The prototype's SBC engine (IS 6403 shear) produces values matching the DN 142 report at all 5 depths when using the report's input parameters. This validates the core formula implementation.

However, the prototype uses `Sg = 0.6` while the DN 142 table header shows `Sγ = 0.8`. The worked example in DN 142 also uses 0.6, producing `qult = 222.80 t/m²` at 2.475m. This is a known inconsistency in the source report itself (Flag #4).

### 5.2 Missing Validations from DN 142

The DN 142 report contains 8 data quality issues that a production system should auto-detect:

1. **Bore termination depth conflict** (15m vs 10m) — cross-section consistency check
2. **Near-zero moisture content** (0.001%) — range validation
3. **Compressive strength inconsistency** (1818 MPa vs 42 MPa UCS) — value conflict detection
4. **Shape factor inconsistency** (Sγ = 0.8 header vs 0.6 used) — formula audit
5. **W' = 0.5 despite no GWT** — conservative assumption detection
6. **Rock density > specific gravity** (3.4 vs 2.85) — physical consistency check
7. **Single borehole for 20m raft** — coverage adequacy flag
8. **No liquid/plastic limit tests** — missing test detection

These represent the kind of automated validation the platform must perform.

---

## 6. Prioritized Feature Groups

### Priority 1: Core Engineering (Expand Calculation Engine)
- Complete IS 6403 with configurable shape/depth/inclination factors
- IS 8009 elastic settlement (Bowles method)
- IS 5249 dynamic properties calculation
- IS 1904 foundation design checks
- Shear failure mode classification
- Configurable geometry (B, shape), FoS, W' derivation
- Reengineering depth auto-evaluation

### Priority 2: Data Infrastructure
- Database schema (reports, parameters, calculations, users, audit)
- File storage for uploaded reports
- Report repository with search and versioning

### Priority 3: AI Enhancement
- OCR for scanned documents
- Word/DOCX support
- Extraction validation engine
- Confidence calibration
- Comprehensive parameter extraction (grain size, rock properties, dynamic)

### Priority 4: Workflow & Collaboration
- User authentication and RBAC (4 roles)
- Approval workflow (Pending → Reviewed → Approved/Rejected)
- Approval history and revision tracking

### Priority 5: Reporting & Dashboard
- Interactive dashboard with report statistics
- Consolidated engineering register (Excel export)
- One-page engineering summary (PDF/Word export)
- Audit trail UI

### Priority 6: Future Enhancements
- Active learning from reviewer corrections
- Multi-country code support (DNV/IEC)
- LLM chatbot for report queries
- Multi-borehole analysis

---

## 7. Key Findings Summary

1. **The prototype successfully demonstrates the core concept** — AI extraction + deterministic SBC calculation + visual pipeline. The IS 6403 shear calculation matches the DN 142 reference report.

2. **The gap between prototype and production is substantial** — 8 of 10 required modules are fully missing. The current app has no persistence, no auth, no workflows, no dashboard, and limited calculation coverage.

3. **The calculation engine needs significant expansion** — IS 8009 elastic settlement (Bowles method), IS 5249 dynamic properties, IS 1904 design checks, shear failure classification, and configurable parameters are all required.

4. **The AI extraction is a strong foundation** — the Claude-based extraction with structured JSON prompt works well. It needs OCR capability, extraction validation, and broader parameter coverage.

5. **The DN 142 report validates the engineering formulas** — all SBC values match. The 8 data quality issues found in DN 142 define the validation rule set the platform must implement.

6. **Architecture requires a full-stack redesign** — from single-page vanilla JS to a proper web application with database, auth, file storage, and structured API.

---

## Sources

- `.copilot-tracking/research/subagents/2026-07-01/pdf-requirements-extraction.md`
- `.copilot-tracking/research/subagents/2026-07-01/dn142-report-extraction.md`
- `.copilot-tracking/research/subagents/2026-07-01/soil-report-presentation.md`
- `soil_sbc_tool_prototype.html` (static prototype)
- `geo-sbc-app/server.js` (Node.js app)
- `geo-sbc-app/public/index.html` (frontend)
