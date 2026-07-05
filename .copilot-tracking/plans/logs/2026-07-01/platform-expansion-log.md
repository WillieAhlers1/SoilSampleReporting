<!-- markdownlint-disable-file -->
# Planning Log: GeoSBC Platform Expansion

**Date:** 2026-07-01
**Plan:** `.copilot-tracking/plans/2026-07-01/platform-expansion-plan.instructions.md`

---

## Discrepancy Log

### Research → Plan Discrepancies

| # | Research Finding | Plan Treatment | Rationale |
|---|---|---|---|
| 1 | DN 142 uses Sγ=0.6 in worked example but Sγ=0.8 in table header | Plan Phase 2.2 makes shape factors configurable per IS 6403 Table 2 | Both values should be computable; current prototype uses 0.6 which matches the worked example |
| 2 | Requirements §6.10 lists "Built on Databricks" as branding, presentation mentions Unity Catalog | Plan does not prescribe Databricks | Prototype branding says "Built on Databricks" but no Databricks-specific code exists; technology stack is an open decision |
| 3 | Requirements specify Word/PDF/Excel export but no specific library | Plan selects ExcelJS, PDFKit, docx based on Node.js ecosystem | Most mature options for the Node.js stack |
| 4 | No explicit UI framework in requirements | Plan selects React + Vite | Current vanilla JS won't scale for dashboard, workflows, multi-view app; React is most common enterprise choice |
| 5 | Requirements mention "configurable DNV/IEC requirements" | Plan defers to Phase 10 (Future Enhancements) | Core IS code implementation must come first; DNV/IEC are additive |

### Unaddressed Research Items

| # | Item | Reason |
|---|---|---|
| 1 | Specific OCR engine benchmarking | Requires hands-on testing with sample scanned reports; recommend Azure Document Intelligence evaluation |
| 2 | Bowles Table 5.2 lookup implementation | Requires digitizing the I₁/I₂ tables or implementing interpolation; detailed in Phase 2.4 |
| 3 | IS 5249 formula specifics | Requires detailed standard review; outlined in Phase 2.5 |

---

## Implementation Paths Considered

### Path A: Extend Current Express App (Selected)
- Keep Node.js/Express, add PostgreSQL, migrate frontend to React
- **Pros:** Minimal disruption, reuse existing extraction and calculation code, familiar stack
- **Cons:** Express is lightweight for complex enterprise features

### Path B: Full Rewrite with NestJS + Next.js
- Server: NestJS (TypeScript, decorators, DI), Frontend: Next.js (SSR)
- **Pros:** Better enterprise patterns, built-in validation, OpenAPI generation
- **Cons:** Complete rewrite, longer initial setup

### Path C: Python/Django Rewrite
- Django + DRF backend, React frontend
- **Pros:** Rich scientific computing ecosystem (numpy, scipy), Django admin
- **Cons:** Discards all existing code, different language

**Decision:** Path A selected. The existing Express + Anthropic + pdf-parse stack works. Wrap it in TypeScript, add PostgreSQL, and build React frontend. If enterprise complexity grows, NestJS migration is straightforward from Express.

---

## Suggested Follow-On Work

1. **Benchmark OCR engines** — Test Azure Document Intelligence vs Tesseract.js on scanned soil reports to select the right OCR engine before Phase 3
2. **Digitize Bowles tables** — I₁/I₂ lookup tables need to be digitized or approximated with interpolation formulas for Phase 2.4
3. **Collect additional test reports** — DN 142 is a single-site, single-borehole, non-cohesive soil report. Need cohesive soil, multi-borehole, and problem-case reports for validation
4. **Define SBC class thresholds** — "20 SBC" and "40 SBC" foundation types need formal definition with exact threshold values and design parameters
5. **IS code digital library** — Acquire and digitize bearing capacity factor tables (Nc, Nq, Nγ) for all friction angles to enable automated lookup
