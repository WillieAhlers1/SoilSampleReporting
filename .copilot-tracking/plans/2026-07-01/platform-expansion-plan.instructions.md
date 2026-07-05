<!-- markdownlint-disable-file -->
# Implementation Plan: GeoSBC Platform Expansion

**Date:** 2026-07-01
**Research:** `.copilot-tracking/research/2026-07-01/platform-expansion-research.md`
**Planning Log:** `.copilot-tracking/plans/logs/2026-07-01/platform-expansion-log.md`

---

## User Requests

1. Review the "AI-Based Geotechnical Report Review & Foundation Recommendation Platform" requirements document
2. Cross-reference requirements against Report_DN 142.pdf (reference soil report) and Soil_Report_Automation_Tool_Presentation.pdf (concept presentation)
3. Produce a full analysis and plan for expanding the prototype to include the described functionality
4. Do not write or update code — analysis and planning only

---

## Overview and Objectives

Expand the current GeoSBC prototype (single-page HTML + lightweight Node.js/Express API) into a full-featured AI-based geotechnical report review and foundation recommendation platform as defined in the requirements specification (10 functional modules, 4 IS code calculation engines, 4 user roles, approval workflows, dashboards, and audit trails).

### Derived Objectives
1. Define a phased implementation sequence that delivers incremental engineering value
2. Maintain backward compatibility with the existing DN 142 calculation validation (known-good reference)
3. Architect for the 10 functional modules specified in requirements §6.1–§6.10
4. Enable configurable IS code calculations (IS 6403, IS 1904, IS 8009, IS 5249) validated against DN 142 data
5. Support production deployment with proper data persistence, security, and audit capabilities

---

## Context Summary

### Discovered Instructions Files
- No project-specific `.github/instructions/` or `.github/copilot-instructions.md` found
- Project has no linting, testing, or CI configuration

### Key Reference Documents
- Requirements: `AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf` (§1–§9)
- Validation data: `Report_DN 142.pdf` (50 pages, 5 founding depths, complete SBC calculations)
- Concept: `Soil_Report_Automation_Tool_Presentation.pdf` (6-stage pipeline architecture)
- Research: `.copilot-tracking/research/2026-07-01/platform-expansion-research.md`

---

## Implementation Phases

### Phase 1: Project Foundation & Architecture <!-- parallelizable: false -->

Establish the project structure, development tooling, and architectural foundations before building features.

- [ ] **1.1** Define technology stack decisions
  - Backend: Node.js/Express (extend existing) or migrate to NestJS/Fastify
  - Database: PostgreSQL with Prisma/Drizzle ORM
  - Frontend: React + Vite (migrate from vanilla JS)
  - Auth: JWT with bcrypt password hashing
  - File storage: Local filesystem (dev) / Azure Blob Storage (prod)
  - OCR: Azure Document Intelligence or Tesseract.js
  - Export: ExcelJS, PDFKit, docx
- [ ] **1.2** Create project scaffolding
  - Monorepo structure: `packages/api`, `packages/web`, `packages/calc-engine`, `packages/shared`
  - Package management: pnpm workspaces
  - TypeScript across all packages
  - ESLint + Prettier configuration
  - Vitest for unit testing
  - Docker Compose for local dev (app + PostgreSQL)
- [ ] **1.3** Design database schema
  - `customers` — customer organizations
  - `projects` — projects per customer
  - `reports` — uploaded soil reports (file reference, metadata, status)
  - `report_versions` — version control for revised reports
  - `boreholes` — borehole configuration per report
  - `soil_layers` — strata per borehole
  - `spt_data` — SPT blow counts per depth
  - `lab_results` — grain size, density, shear, etc.
  - `extracted_parameters` — AI-extracted params with confidence scores
  - `calculations` — SBC/settlement/dynamic results per depth
  - `recommendations` — foundation recommendations per report
  - `approval_records` — approval workflow history
  - `users` — user accounts with roles
  - `audit_events` — complete activity log
- [ ] **1.4** Define API contract (OpenAPI spec)
  - Authentication endpoints (`POST /auth/login`, `POST /auth/register`)
  - Report management (`POST /reports`, `GET /reports`, `GET /reports/:id`)
  - Extraction (`POST /reports/:id/extract`)
  - Calculation (`POST /reports/:id/calculate`)
  - Approval workflow (`POST /reports/:id/approve`, `POST /reports/:id/reject`)
  - Dashboard (`GET /dashboard/stats`)
  - Register (`GET /register`, `GET /register/export`)
  - Audit (`GET /audit`)
- [ ] **1.5** Create CI pipeline (GitHub Actions)
  - Lint, type-check, test, build
  - Database migration check

### Phase 2: Engineering Calculation Engine Expansion <!-- parallelizable: false -->

The core engineering value. Must be validated against DN 142 reference data at every step.

- [ ] **2.1** Extract calculation engine into standalone TypeScript package (`packages/calc-engine`)
  - Port existing IS 6403 shear calculation from JS to TypeScript
  - Port existing IS 8009 SPT settlement calculation
  - Add comprehensive unit tests using DN 142 values as test fixtures
  - Ensure all 5 depths (1.0, 2.0, 2.475, 3.0, 4.0m) produce exact DN 142 results
- [ ] **2.2** Make calculation parameters configurable
  - Foundation geometry: B (width/diameter), shape (circular, square, rectangular, strip)
  - Shape factors: Sc, Sq, Sγ — derived from shape per IS 6403 Table 2
  - Depth factors: dc, dq, dγ — calculated from D/B ratio
  - Inclination factors: ic, iq, iγ — from load inclination angle
  - Water table correction: W' derived from GWT depth relative to foundation (0.5, 1.0, or interpolated)
  - Factor of Safety: configurable (default 3)
  - Settlement limit: configurable (default 60mm)
- [ ] **2.3** Implement shear failure mode classification
  - General shear failure (dense soils, N > 30)
  - Local shear failure (medium soils, 10 < N < 30) — requires 2/3 c and tan⁻¹(2/3 tan φ)
  - Punching shear failure (loose soils, N < 10) — separate capacity formula
  - Auto-classify based on relative density and N-value
- [ ] **2.4** Implement IS 8009 elastic settlement (Bowles method)
  - Influence factors I₁, I₂ from Bowles Table 5.2 (H/B' and L/B lookup)
  - Is = I₁ + (1−2µ)/(1−µ) × I₂
  - Multi-strata averaging (weighted E and µ by thickness)
  - ΔH = q × B' × m × (1−µ²) × Is × If / E
  - Validate against DN 142: expected ΔH = 2.20mm at 2.475m
- [ ] **2.5** Implement IS 5249 dynamic soil properties
  - Dynamic Poisson's ratio (µ_dynamic)
  - Shear modulus G' (MPa)
  - Young's modulus E_dynamic (MPa)
  - Rotational stiffness (Nm/rad)
  - Dynamic spring constants: vertical, horizontal, rocking, torsion (N/m or Nm)
  - Validate against DN 142 dynamic property tables (gravels and rock)
- [ ] **2.6** Implement IS 1904 foundation design checks
  - Permissible settlement verification (total and differential)
  - Angular distortion check
  - Foundation adequacy assessment
- [ ] **2.7** Implement reengineering depth evaluation (§6.3)
  - When SBC at recommended depth < required SBC:
    - Iterate through deeper founding depths
    - Recalculate SBC and settlement at each depth
    - Find minimum depth meeting the requirement
    - Calculate excavation/removal depth
    - Calculate replacement depth for engineered fill
  - Generate reengineering summary

### Phase 3: AI Extraction Enhancement <!-- parallelizable: true -->

Improve the AI extraction pipeline for production use.

- [ ] **3.1** Add OCR capability for scanned documents
  - Integrate Azure Document Intelligence or Tesseract.js
  - Pre-process: deskew, threshold, denoise
  - Fall back to OCR when pdf-parse returns insufficient text
  - Support multi-page table extraction
- [ ] **3.2** Add Word/DOCX document support
  - Integrate mammoth.js or docx parser
  - Extract text and tables from structured Word documents
- [ ] **3.3** Expand extraction prompt coverage
  - Add extraction targets identified from DN 142 cross-reference:
    - Borehole configuration (diameter, method, depth, count)
    - Grain size distribution (full sieve analysis)
    - Lab test results (relative density, specific gravity, grain percentages)
    - Direct shear test raw data
    - Elastic settlement parameters (I₁, I₂, If)
    - Rock properties (RMR, point load index, water absorption)
    - Dynamic spring constants (V, H, rocking, torsion)
  - Return structured arrays per borehole (support multi-borehole reports)
- [ ] **3.4** Implement extraction validation engine
  - Range validation per parameter type:
    - Friction angle: 0°–50° (flag > 45°)
    - Cohesion: 0–500 kPa
    - Unit weight: 1.0–3.5 t/m³
    - SPT N: 0–100+ (flag refusal > 100)
    - Specific gravity: 2.5–3.0 (flag outside range)
    - Moisture content: 0%–100% (flag < 0.1%)
  - Cross-field consistency checks:
    - Density ≤ specific gravity
    - N-value monotonicity with depth (flag inversions)
    - Strata boundary consistency (bore log vs lab data)
    - Value conflicts across report sections (UCS example from DN 142)
  - Physical plausibility checks:
    - GWT vs W' correction consistency
    - Single borehole coverage adequacy for raft size
    - Missing standard tests (LL/PL for cohesive soils)
- [ ] **3.5** Implement confidence calibration
  - Calibrate AI confidence against known correct values from validated reports
  - Route low-confidence fields (< 0.85) to manual review queue

### Phase 4: Data Persistence & Repository <!-- parallelizable: true -->

- [ ] **4.1** Implement database migrations
  - Create schema from Phase 1.3 design
  - Seed with DN 142 reference data for testing
- [ ] **4.2** Implement report upload and storage
  - File upload API with validation (PDF, DOCX, max size)
  - Store original file (filesystem or blob storage)
  - Create report record with metadata
  - Customer/project association
- [ ] **4.3** Implement report repository features (§6.5)
  - Customer-wise folder structure (virtual)
  - Project-wise organization
  - Multi-criteria search (customer, project, location ID, borehole ID, date, report number)
  - Version control for revised reports
  - Link original upload, AI recommendation, and final approved report
- [ ] **4.4** Persist extraction and calculation results
  - Store extracted parameters with confidence scores
  - Store calculation results at each founding depth
  - Store recommendations and governing criteria
  - Enable re-extraction and re-calculation

### Phase 5: User Authentication & RBAC <!-- parallelizable: true -->

- [ ] **5.1** Implement authentication
  - User registration and login (email + password)
  - JWT token issuance and validation
  - Password hashing with bcrypt
  - Session management
- [ ] **5.2** Implement role-based access control (§6.7)
  - Administrator: full system access, user management, configuration
  - Engineering Reviewer: review AI-generated reports, edit extracted parameters
  - Engineering Approver: approve/reject/request modification of recommendations
  - Site Civil Team: read-only access to approved reports
- [ ] **5.3** Implement authorization middleware
  - Route-level permission checks
  - Role-based UI element visibility

### Phase 6: Approval Workflow <!-- parallelizable: false -->

- [ ] **6.1** Implement report status state machine
  - States: Draft → Extracted → Calculated → Pending Review → Pending Approval → Approved / Rejected
  - Track state transitions with timestamps
- [ ] **6.2** Implement review workflow (§6.4)
  - Reviewer queue: list of reports pending review
  - Review UI: side-by-side view of extracted params + original PDF
  - Manual parameter edit with diff tracking
  - Recalculate after parameter edits
- [ ] **6.3** Implement approval workflow
  - Approver queue: list of reports pending approval
  - Actions: Approve, Reject, Request Modification (with comments)
  - Approval history: reviewer name, action, comments, date, revision number
  - Only approved recommendations accessible to downstream users (Site Civil Team)
- [ ] **6.4** Implement notification system
  - Notify reviewer when new report is extracted
  - Notify approver when review is complete
  - Notify uploader when report is approved/rejected

### Phase 7: Dashboard & Reporting <!-- parallelizable: true -->

- [ ] **7.1** Implement interactive dashboard (§6.8)
  - Report status counts (uploaded, pending review, pending approval, approved, rejected)
  - Reports requiring reengineering count
  - Customer-wise project statistics
  - Monthly report trend charts
  - Filterable by customer, project, date range
- [ ] **7.2** Implement consolidated engineering register (§6.6)
  - Auto-generated register per customer with all fields:
    - Customer, Project, Location ID, Borehole Number, Foundation Level
    - Recommended SBC, Governing Criteria, Settlement
    - Foundation Type, Reengineering Required, Reengineering Depth
    - Approval Status, Reviewer, Approval Date
  - Auto-update when report is approved
  - Excel export via ExcelJS
- [ ] **7.3** Implement report exports
  - One-page engineering summary (PDF via PDFKit)
  - Full recommendation report (Word via docx)
  - Calculation detail report with formulas shown
- [ ] **7.4** Implement audit trail UI (§6.9)
  - Searchable audit log
  - Filter by user, action type, report, date range
  - Events: upload, extraction, manual edit, calculation, approval, download

### Phase 8: Frontend Migration <!-- parallelizable: false -->

- [ ] **8.1** Migrate to React + Vite
  - Set up React project with TypeScript
  - Create component library matching existing design system (navy/orange theme)
  - Implement routing (React Router)
- [ ] **8.2** Recreate pipeline visualization as React components
  - Upload panel with drag-and-drop
  - Stage pipeline rail
  - Extraction results grid
  - Validation flags display
  - SBC calculation display with live depth selector
  - Recommendation card
  - Summary view with export buttons
- [ ] **8.3** Build new views
  - Login/registration
  - Dashboard (charts, stats)
  - Report list with search/filter
  - Report detail with side-by-side PDF viewer
  - Review/approval interface
  - Engineering register table
  - User management (admin)
  - Audit trail viewer
- [ ] **8.4** Implement responsive design
  - Mobile-friendly layouts for field use (Site Civil Team)

### Phase 9: Integration & Production Readiness <!-- parallelizable: false -->

- [ ] **9.1** API documentation (OpenAPI/Swagger)
- [ ] **9.2** Integration testing (API + database + AI extraction)
- [ ] **9.3** Performance testing (< 1 minute per report requirement)
- [ ] **9.4** Security hardening
  - Input sanitization
  - Rate limiting
  - CORS configuration
  - File upload validation (type, size, malware scan)
  - SQL injection prevention (ORM parameterized queries)
  - XSS prevention
- [ ] **9.5** Deployment configuration
  - Docker multi-stage builds
  - Environment variable management
  - Database migration on deploy
  - Health check endpoints
- [ ] **9.6** Monitoring and logging
  - Structured logging
  - Error tracking
  - Performance metrics

### Phase 10: Future Enhancements (§8) <!-- parallelizable: true -->

- [ ] **10.1** Active learning from reviewer corrections
  - Track parameter corrections by reviewers
  - Build correction dataset
  - Fine-tune extraction prompts based on correction patterns
- [ ] **10.2** Multi-country code support
  - Configurable calculation standards (DNV, IEC, Eurocode)
  - Standard-specific bearing capacity and settlement formulas
- [ ] **10.3** LLM chatbot for report queries
  - Natural language interface for querying report data
  - "What is the SBC at DN 142 at 3m depth?"
  - "Show all reports where reengineering was required"
- [ ] **10.4** Multi-borehole analysis
  - Support reports with multiple boreholes
  - Spatial interpolation of soil properties
  - Foundation placement optimization

---

## Dependencies

| Phase | Depends On | Rationale |
|---|---|---|
| Phase 1 | — | Foundation — must come first |
| Phase 2 | Phase 1 | Needs TypeScript scaffolding and test framework |
| Phase 3 | Phase 1 | Needs project structure |
| Phase 4 | Phase 1 | Needs database schema |
| Phase 5 | Phase 4 | Auth needs database |
| Phase 6 | Phase 4, 5 | Workflow needs persistence and auth |
| Phase 7 | Phase 4, 5, 6 | Dashboard needs data and approval states |
| Phase 8 | Phase 2, 3 | Frontend needs stable API and calc engine |
| Phase 9 | All prior | Integration and hardening |
| Phase 10 | Phase 9 | Post-production enhancements |

### Parallelization Opportunities
- Phases 2, 3, 4, 5 can proceed in parallel after Phase 1
- Phase 8 can overlap with Phases 6, 7 as APIs stabilize

---

## Success Criteria

1. **Calculation accuracy**: All IS 6403 shear and IS 8009 settlement values match DN 142 report within ±0.01 t/m² at all 5 founding depths
2. **Elastic settlement**: Bowles method produces ΔH = 2.20mm (±0.05mm) for DN 142 at 2.475m
3. **Dynamic properties**: IS 5249 calculations match DN 142 dynamic property tables
4. **Extraction accuracy**: ≥ 95% parameter extraction accuracy on test reports (per requirements §7)
5. **Processing time**: < 1 minute per report end-to-end (per requirements §7)
6. **All 10 functional modules operational**: §6.1 through §6.10
7. **Data quality**: 8 DN 142 inconsistencies automatically detected by validation engine
8. **Audit completeness**: Every user action logged with timestamp, user, and action detail

---

## Effort Estimation (Rough Order of Magnitude)

| Phase | Estimated Effort | Priority |
|---|---|---|
| Phase 1: Architecture | 2–3 weeks | P0 |
| Phase 2: Calc Engine | 3–4 weeks | P0 |
| Phase 3: AI Enhancement | 2–3 weeks | P1 |
| Phase 4: Data Persistence | 2–3 weeks | P0 |
| Phase 5: Auth & RBAC | 1–2 weeks | P1 |
| Phase 6: Approval Workflow | 2–3 weeks | P1 |
| Phase 7: Dashboard & Reporting | 2–3 weeks | P2 |
| Phase 8: Frontend Migration | 3–4 weeks | P1 |
| Phase 9: Production Readiness | 2–3 weeks | P1 |
| Phase 10: Future Enhancements | Ongoing | P3 |
| **Total** | **~20–28 weeks** | |
