# GeoSBC — Interactive Soil Report Automation Tool

AI-powered geotechnical parameter extraction + deterministic SBC calculations, running entirely on your local machine.

## Quick start

### 1. Install dependencies

```bash
cd geo-sbc-app
npm install
```

### 2. Add your Anthropic API key

```bash
copy .env.example .env.local
```

Open `.env.local` and replace `sk-ant-your_key_here` with your actual key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxx
```

### 3. Start the server

```bash
npm start
```

Open **http://localhost:3000** in your browser.

---

## How it works

| Step | What happens |
|------|-------------|
| **Upload PDF** | Drag-and-drop or click to browse for a soil investigation report |
| **AI extraction** | Claude parses the PDF text and extracts geotechnical parameters, confidence scores, and source page citations |
| **Validation** | Flags inconsistencies across sections (depth conflicts, boundary mismatches) |
| **Calc engine** | Deterministic IS 6403 (shear) + IS 8009 (settlement) SBC calculations |
| **Recommendation** | Maps governing SBC to the standardised 20/40 SBC foundation design class |
| **Summary** | One-page auto-generated engineering summary |

### Live recalculation
After the pipeline runs, use the **Founding depth** buttons to instantly recalculate for any depth from the extracted SBC table.

### Sample data
Click **load DN 142 sample** to run the full pipeline with the pre-loaded Koppal Wind Project data — no API key required for the demo.

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | — | **Required** for PDF extraction |
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-20241022` | Claude model to use |
| `PORT` | `3000` | Local server port |

---

## Development (auto-restart on changes)

```bash
npm run dev
```

---

## Notes

- `.env.local` is git-ignored and **never committed**
- PDF text is sent to the Anthropic API for analysis — do not upload confidential/restricted reports if your API usage terms prohibit it
- SBC calculations are fully deterministic and match IS 6403:1981 intermediate shear + IS 8009:1976 settlement criteria
- Designed for local demo use — not for engineering sign-off without a qualified geotechnical engineer
