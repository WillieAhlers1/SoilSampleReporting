# Subagent Research: PDF Requirements Extraction

## Research Topics

- Extract complete content from "AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf"
- Organize by: vision/objectives, functional requirements, architecture, data flow, AI/ML, IS codes, user roles, integrations, outputs, phasing, NFRs, UI/UX

## Source Document

- File: `AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf`
- Prepared by: Amal Krishna, Senior R&D Engineer, R&D Innovation Centre, Envision Energy India Pvt. Ltd., Bangalore
- Document: 4 pages, PDF-1.7 format

---

## 1. Platform Vision and Objectives

**Purpose Statement:** Develop an AI-enabled platform that automatically reviews geotechnical investigation reports, extracts engineering parameters, performs code-based calculations, and recommends suitable foundation solutions for wind turbine and other infrastructure projects.

**Objectives (Section 1):**
- Automate interpretation of soil investigation reports
- Extract geotechnical parameters from PDF/DOC reports
- Calculate Safe Bearing Capacity (SBC), immediate and long-term settlements
- Evaluate dynamic soil properties and rotational stiffness
- Recommend suitable foundation type and governing design criteria
- Generate engineering summary reports

**Expected Benefits (Section 9):**
- Reduce review time by >80%
- Improve consistency
- Reduce manual errors
- Standardize engineering decisions
- Create searchable geotechnical database

---

## 2. Functional Requirements (Complete)

### 2.1 Functional Scope (Section 2)
- OCR and AI extraction of borehole logs, lab data, and groundwater
- Validation of extracted values
- Engineering calculations as per IS 6403, IS 1904, IS 8009, IS 5249 and configurable DNV/IEC requirements
- Foundation suitability logic based on SBC, settlement, and dynamic criteria
- Export results to Word/PDF/Excel

### 2.2 AI-Based Report Processing (Section 6.1)
- Upload soil investigation reports (PDF, Word, scanned documents)
- OCR and AI-based extraction of geotechnical parameters
- Automatic engineering calculations based on configured design standards
- Automated foundation recommendation with governing design criteria

### 2.3 Engineering Calculation & Recommendation Engine (Section 6.2)
- Automatic Safe Bearing Capacity (SBC) calculations based on shear and settlement criteria
- Immediate and long-term settlement calculations
- Dynamic soil property calculations
- Rotational stiffness calculations
- Automatic foundation recommendation (20 SBC, 40 SBC, or other configured foundation types)
- Identification of the governing design criterion

### 2.4 Reengineering Recommendation Module (Section 6.3)
If the recommended SBC at the founding level does not satisfy the project requirement, the system shall:
- Automatically evaluate deeper soil strata
- Recalculate SBC and settlement at successive founding depths
- Recommend the minimum reengineering depth at which the required SBC is achieved
- Recommend the excavation/removal depth for unsuitable soil
- Indicate the replacement depth required for engineered fill, if applicable
- Generate a reengineering summary report with the engineering basis for the recommendation

### 2.5 Engineering Approval Workflow (Section 6.4)
The system shall include a configurable approval workflow:
- AI generates the engineering recommendation
- The recommendation shall remain in "Pending Approval" status
- The designated reviewer/approver shall review:
  - Extracted soil parameters
  - SBC calculations
  - Settlement calculations
  - Foundation recommendation
- The reviewer shall have the option to:
  - Approve
  - Reject
  - Request modification
- Only approved recommendations shall be considered final and available for downstream users
- The system shall maintain complete approval history with reviewer name, comments, date, and revision number

### 2.6 Soil Report Repository (Section 6.5)
The application shall maintain a centralized repository of all uploaded reports. Features:
- Customer-wise folder structure
- Project-wise organization
- Search by:
  - Customer
  - Project
  - Location ID
  - Borehole ID
  - Date
  - Report number
- Version control for revised reports
- Storage of original uploaded report
- Storage of AI-generated recommendation report
- Storage of final approved engineering report

### 2.7 Consolidated Engineering Register (Section 6.6)
The application shall automatically generate a consolidated register for each customer. The register shall be exportable to Excel and include:
- Customer Name
- Project Name
- Location ID
- Borehole Number
- Foundation Level
- Recommended SBC
- Governing Design Criteria
- Settlement
- Recommended Foundation Type
- Reengineering Required (Yes/No)
- Recommended Reengineering Depth
- Approval Status
- Reviewer Name
- Approval Date

The register shall automatically update whenever a report is approved.

### 2.8 User Management (Section 6.7)
- Role-based access control
- Roles defined:
  - Administrator
  - Engineering Reviewer
  - Engineering Approver
  - Site Civil Team (Read Only)

### 2.9 Dashboard (Section 6.8)
Interactive dashboard showing:
- Reports Uploaded
- Pending Review
- Pending Approval
- Approved Reports
- Rejected Reports
- Reports Requiring Reengineering
- Customer-wise project statistics
- Monthly report trends

### 2.10 Audit Trail (Section 6.9)
The application shall maintain a complete audit trail of:
- Upload history
- AI extraction changes
- Manual edits
- Engineering calculations
- Approval history
- Report downloads
- User activity

---

## 3. Architecture / System Design Details

### Deliverables (Section 6.10) — implies the following system components:
- Web-based application
- AI document processing engine
- Engineering calculation engine
- OCR module
- Approval workflow (module)
- Customer repository (module)
- Consolidated Excel generation (module)
- Admin dashboard
- API integration
- User manual
- Source code
- Installation guide
- Testing and deployment support

**Note:** The document does not specify explicit architecture diagrams, technology stack, or deployment topology. The architecture is implied through the deliverables list and workflow descriptions.

---

## 4. Data Flow / Pipeline Stages

### AI Workflow (Section 3) — 6-stage pipeline:
1. **Input soil report** — User uploads PDF/DOC/scanned soil investigation report
2. **AI parameter extraction** — OCR + AI extracts geotechnical parameters (borehole logs, lab data, groundwater levels)
3. **Engineering calculations** — Code-based calculations per IS standards and DNV/IEC requirements
4. **SBC and settlement verification** — Safe Bearing Capacity and settlement checks
5. **Foundation suitability assessment** — Evaluate foundation options against SBC, settlement, and dynamic criteria
6. **Final recommendation** — Output recommended foundation type with governing criteria

### Required Inputs (Section 4):
- Soil report (PDF/DOC)
- Foundation dimensions
- Loads and moments
- Groundwater level
- Project location
- Applicable design code

### Outputs (Section 5):
- Extracted soil profile
- SBC (shear and settlement governed)
- Immediate and consolidation settlement
- Dynamic soil properties
- Rotational stiffness
- Recommended foundation option (20 SBC / 40 SBC or custom)
- Ground improvement recommendation
- One-page engineering summary

---

## 5. AI/ML Capabilities

- **OCR (Optical Character Recognition):** Process scanned documents, PDFs, and Word files to extract text
- **AI-based parameter extraction:** Automated extraction of geotechnical parameters from borehole logs, lab data, and groundwater data
- **Validation of extracted values:** AI validates extracted parameters against expected ranges/rules
- **Automated engineering calculations:** AI-driven calculations per configured standards
- **Foundation suitability logic:** Rule-based / AI logic to determine foundation type based on SBC, settlement, and dynamic criteria
- **Reengineering evaluation:** Automated evaluation of deeper strata when initial SBC is insufficient

### Future AI Enhancements (Section 8):
- Learning from reviewer corrections (feedback loop / active learning)
- LLM chatbot for report queries (natural language interface for querying reports)

---

## 6. Indian Standards (IS Codes) Referenced

The document explicitly references the following Indian Standards:
- **IS 6403** — Code of Practice for Determination of Breaking Capacity of Shallow Foundations
- **IS 1904** — Code of Practice for Design and Construction of Foundations in Soils: General Requirements
- **IS 8009** — Code of Practice for Calculation of Settlements of Foundations
- **IS 5249** — Determination of Dynamic Properties of Soil — Method of Test

### International Standards:
- **DNV** — Det Norske Veritas (configurable requirements for wind turbine foundations)
- **IEC** — International Electrotechnical Commission (configurable requirements)

---

## 7. User Roles and Workflows

### Roles (Section 6.7):
| Role | Access Level |
|---|---|
| Administrator | Full system access, user management, configuration |
| Engineering Reviewer | Review AI-generated reports, extracted parameters, calculations |
| Engineering Approver | Approve/reject/request modification of recommendations |
| Site Civil Team | Read-only access to approved reports and recommendations |

### Approval Workflow:
1. AI generates recommendation → Status: "Pending Approval"
2. Reviewer reviews extracted parameters, SBC, settlement, foundation recommendation
3. Reviewer action: Approve / Reject / Request Modification
4. Only approved recommendations become final for downstream users
5. Complete approval history maintained (reviewer name, comments, date, revision number)

---

## 8. Integration Points

- **File upload interface:** PDF, Word, scanned document upload
- **OCR engine:** For processing scanned documents
- **Engineering calculation engine:** Configurable for IS codes, DNV, IEC
- **API integration:** Listed as a deliverable (Section 6.10) — implies REST/API endpoints for external system integration
- **Excel export:** Consolidated engineering register export
- **Word/PDF export:** Report generation and export
- **Customer repository / database:** Centralized storage with search and version control

**Note:** Specific database technologies, cloud services, or third-party APIs are not specified in the document.

---

## 9. Output Deliverables

### Engineering Outputs (Section 5):
- Extracted soil profile
- SBC (shear and settlement governed)
- Immediate and consolidation settlement
- Dynamic soil properties
- Rotational stiffness
- Recommended foundation option (20 SBC / 40 SBC or custom)
- Ground improvement recommendation
- One-page engineering summary

### Report Types:
- AI-generated recommendation report
- Final approved engineering report
- Reengineering summary report (with engineering basis)
- Consolidated engineering register (Excel)

### Export Formats:
- Word
- PDF
- Excel

### System Deliverables (Section 6.10):
- Web-based application
- AI document processing engine
- Engineering calculation engine
- OCR module
- Approval workflow
- Customer repository
- Consolidated Excel generation
- Admin dashboard
- API integration
- User manual
- Source code
- Installation guide
- Testing and deployment support

---

## 10. Phasing / Roadmap Information

### Current Scope (Sections 1–7):
All features described in sections 1 through 7 and 6.1 through 6.10 are in the current scope.

### Future Enhancements (Section 8):
- Learning from reviewer corrections (active learning / feedback loop)
- Multi-country code support (beyond Indian Standards)
- LLM chatbot for report queries

**Note:** The document does not provide explicit phases, milestones, or timeline estimates. It distinguishes between current scope and future enhancements.

---

## 11. Non-Functional Requirements

### Explicitly Stated (Section 7):
- **Extraction accuracy:** 95%+ accuracy for AI parameter extraction
- **Processing time:** < 1 minute per report
- **Security:** Secure storage (no further specifics given)

### Implied:
- **Auditability:** Complete audit trail (Section 6.9) implies compliance/regulatory requirements
- **Version control:** Revised report version management
- **Role-based security:** RBAC for user access control
- **Data integrity:** Approval workflow ensures data validation before finalization
- **Searchability:** Multi-criteria search across repository

---

## 12. UI/UX Requirements

### Explicitly Stated:
- **Web-based application** (Section 6.10)
- **Interactive dashboard** (Section 6.8) showing:
  - Reports Uploaded count
  - Pending Review count
  - Pending Approval count
  - Approved Reports count
  - Rejected Reports count
  - Reports Requiring Reengineering count
  - Customer-wise project statistics
  - Monthly report trends
- **File upload interface** for soil reports
- **Search interface** with multiple filter criteria (customer, project, location ID, borehole ID, date, report number)
- **Customer-wise folder structure** for repository navigation
- **Approval interface** with Approve/Reject/Request Modification actions
- **Consolidated register view** exportable to Excel

### Implied:
- Report viewing/preview capability
- Parameter review and manual edit interface
- Calculation review interface
- Audit trail viewing interface
- User management admin interface

---

## Clarifying Questions

1. No technology stack is specified — database, backend language, frontend framework, cloud platform, and OCR engine are all unspecified.
2. No deployment model specified — cloud, on-premise, or hybrid.
3. No specific API contract or integration protocol defined.
4. No data retention or backup policy defined.
5. No performance requirements beyond the two stated (95% accuracy, <1 min processing).
6. No accessibility or internationalization requirements stated.
7. Foundation dimension inputs (20 SBC / 40 SBC) are domain-specific and may need further clarification for implementation.
