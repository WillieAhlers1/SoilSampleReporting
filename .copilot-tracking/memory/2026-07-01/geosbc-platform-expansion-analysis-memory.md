<!-- markdownlint-disable-file -->
# Memory: GeoSBC Platform Expansion Analysis

**Created:** 2026-07-01 | **Last Updated:** 2026-07-01

## Task Overview

Analyze three PDF documents against the existing GeoSBC prototype and produce a comprehensive gap analysis with a phased implementation plan for expanding the prototype into a full AI-based geotechnical report review and foundation recommendation platform. No code changes — analysis and planning only.

**Success Criteria:**
- All 10 functional modules from requirements §6.1–§6.10 mapped to plan phases
- All 4 IS codes (IS 6403, IS 1904, IS 8009, IS 5249) covered in calculation engine expansion
- DN 142 report data used as validation reference
- Presentation pipeline architecture cross-referenced

## Current State

**Status:** Phase 5 (Discover) complete — full RPI cycle finished.

**Completed work:**
- Read and analyzed all 3 PDF documents via subagents
- Inventoried current prototype (static HTML + Node.js/Express app)
- Identified 8 of 10 required modules fully missing, 11 calculation engine gaps
- Cross-referenced DN 142 report data against extraction prompt (found 6+ missing extraction targets)
- Documented 8 data quality issues in DN 142 as validation rule definitions
- Created 10-phase implementation plan with 50+ tasks, dependencies, success criteria, effort estimates

**Files created/modified:**
- `.copilot-tracking/research/2026-07-01/platform-expansion-research.md` — Full research document with gap analysis
- `.copilot-tracking/plans/2026-07-01/platform-expansion-plan.instructions.md` — 10-phase implementation plan
- `.copilot-tracking/plans/logs/2026-07-01/platform-expansion-log.md` — Planning log with discrepancies and decision rationale
- `.copilot-tracking/research/subagents/2026-07-01/pdf-requirements-extraction.md` — Requirements PDF extraction
- `.copilot-tracking/research/subagents/2026-07-01/dn142-report-extraction.md` — DN 142 report full data extraction
- `.copilot-tracking/research/subagents/2026-07-01/soil-report-presentation.md` — Presentation slides extraction

## Important Discoveries

* **Decisions:**
  - Path A selected (extend Express app) over NestJS rewrite or Python/Django rewrite — minimal disruption, reuse existing working code
  - React + Vite for frontend migration — vanilla JS won't scale for dashboard/workflows/multi-view app
  - PostgreSQL for database — relational needed for register/audit; recommended over MongoDB
  - Phase 2 (calc engine) prioritized as highest engineering value — validated against DN 142

* **Failed Approaches:** None — this was analysis-only, no implementation attempted

* **Key Engineering Findings:**
  - Prototype IS 6403 shear calculation matches DN 142 at all 5 founding depths — validates core formula
  - DN 142 uses Sγ=0.6 in worked example but Sγ=0.8 in table header — genuine inconsistency in source report (Flag #4)
  - W'=0.5 applied despite no GWT encountered — conservative assumption the platform should auto-detect
  - Elastic settlement (Bowles method with I₁/I₂ factors) not implemented — required for IS 8009 compliance
  - Dynamic properties (IS 5249) entirely missing — spring constants critical for WTG design
  - Requirements specify 95%+ extraction accuracy and <1 minute processing time as NFRs

## Next Steps

1. **Start Phase 1: Project scaffolding** — TypeScript monorepo, PostgreSQL schema, dev tooling
2. **Start Phase 2: Extract calc engine to TypeScript** — Port IS 6403/IS 8009 with DN 142 test fixtures
3. **Collect additional test reports** — Need cohesive soil, multi-borehole, problem-case reports
4. **Benchmark OCR engines** — Azure Document Intelligence vs Tesseract.js on scanned reports
5. **Define SBC class thresholds formally** — "20 SBC" and "40 SBC" exact engineering definitions

## Context to Preserve

* **Sources:**
  - `AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf`: 10 functional modules (§6.1–§6.10), 4 IS codes, 4 user roles, approval workflow, future enhancements (§8)
  - `Report_DN 142.pdf`: 50-page soil report, BH-1, 5 SPT depths, SBC 74.27 t/m² at 2.475m, 8 data quality flags
  - `Soil_Report_Automation_Tool_Presentation.pdf`: 8 slides, 6-stage pipeline concept, no technology stack specified
* **Agents:** Researcher Subagent (used for all 3 PDF extractions)
* **Questions:**
  - Technology stack not specified in requirements — all choices are open decisions
  - No deployment model (cloud/on-premise/hybrid) defined by customer
  - "20 SBC" and "40 SBC" foundation types need formal engineering definition with threshold values
  - Bowles Table 5.2 (I₁/I₂) needs digitization or interpolation formula for implementation
  - IS 5249 dynamic property formulas need detailed standard review
