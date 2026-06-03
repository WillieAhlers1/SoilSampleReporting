'use strict';

require('dotenv').config({ path: '.env.local' });

const express   = require('express');
const multer    = require('multer');
const path      = require('path');
const pdfParse  = require('pdf-parse');
const Anthropic = require('@anthropic-ai/sdk');

const app   = express();
const PORT  = process.env.PORT || 3000;
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
  storage   : multer.memoryStorage(),
  limits    : { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype === 'application/pdf')
});

// ── Anthropic client (lazy-init) ──────────────────────────────────────────────
let _ai = null;
function ai() {
  if (!_ai) {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) throw new Error('ANTHROPIC_API_KEY not found in .env.local');
    _ai = new Anthropic({ apiKey: key });
  }
  return _ai;
}

// ── IS 6403 / IS 8009 Calculation Engine ──────────────────────────────────────
const C = { B: 20, W: 0.5, Sq: 1.2, Sg: 0.6, FoS: 3, Rw: 0.5, Sp: 6 };

function shear(lyr) {
  const qult = lyr.q  * (lyr.Nq - 1) * C.Sq * lyr.dq
             + 0.5    * C.B * lyr.g  * lyr.Ng * C.Sg * lyr.dg * C.W;
  return { qult, qna: qult / C.FoS };
}

function settle(lyr) {
  return 0.7 * (lyr.N - 3) * C.Rw * (1 + lyr.D / C.B) * C.Sp;
}

// ── Extraction prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT =
  'You are a geotechnical engineering data extraction specialist. ' +
  'Return ONLY valid JSON — no markdown fences, no explanation.';

function buildPrompt(text) {
  return `Extract all geotechnical parameters from this soil investigation report.
Return a single JSON object matching this schema exactly:

{
  "project": {
    "id": "report/document ID or designation",
    "name": "project name",
    "client": "client organisation",
    "location": "site / village / state",
    "structure": "foundation/structure type",
    "seismic": "seismic zone per IS 1893",
    "gwt": "ground water table depth or 'Not encountered to X m'"
  },
  "strata": "one-line stratigraphy e.g. Gravels (GP) 0–4.5 m · Hard rock 4.5–10 m",
  "extracted": [
    { "l": "human label", "v": "value string", "u": "unit", "c": 0.97, "p": "p.32" }
  ],
  "flags": [
    { "t": "warn|ok", "h": "short title", "d": "description", "p": "page ref" }
  ],
  "layers": [
    { "D": 2.475, "g": 1.99, "phi": 34.38, "Nq": 20.489, "Ng": 26.866,
      "q": 2.45, "dq": 1.023, "dg": 1.023, "N": 53 }
  ]
}

Rules:
• "extracted": include Cohesion (c) kPa, Friction angle (φ) °, Bulk unit weight (γ) t/m³,
  SPT-N at main founding depth, Founding stratum (USCS class), Ground water table,
  Rock UCS MPa (if present), RQD % (if present), Poisson ratio (if present),
  Dynamic shear modulus G′ MPa (if present).
• Confidence: ≥0.95 explicitly stated; 0.85–0.94 from table; 0.75–0.84 derived; <0.75 inferred.
• "flags": identify depth/value conflicts across sections, missing data, positive cross-checks.
• "layers": each row of the SBC calculation table — one per founding depth tested.
  D=founding depth m, g=bulk unit weight t/m³, phi=friction angle °, Nq & Ng=bearing-capacity
  factors (IS 6403 intermediate shear), q=overburden pressure t/m², dq & dg=depth factors,
  N=SPT blow count.
  If no explicit SBC table exists, derive best estimates from available parameters.

Report text:
${text.slice(0, 80000)}`;
}

// ── Routes ────────────────────────────────────────────────────────────────────

app.get('/api/status', (_req, res) => res.json({
  ok       : true,
  hasApiKey: !!process.env.ANTHROPIC_API_KEY,
  model    : MODEL
}));

app.post('/api/extract', upload.single('report'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF file received.' });

  try {
    // Extract text from PDF
    const pdf = await pdfParse(req.file.buffer);

    // Call Claude for structured extraction
    const raw = await ai().messages.create({
      model    : MODEL,
      max_tokens: 4096,
      system   : SYSTEM_PROMPT,
      messages : [{ role: 'user', content: buildPrompt(pdf.text) }]
    });

    // Strip any accidental markdown fences
    const txt = raw.content[0].text.trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '');

    let data;
    try {
      data = JSON.parse(txt);
    } catch {
      return res.status(500).json({
        error: 'AI returned invalid JSON.',
        raw  : txt.slice(0, 500)
      });
    }

    res.json({
      fileName : req.file.originalname,
      fileSize : (req.file.size / 1_048_576).toFixed(1),
      pageCount: pdf.numpages,
      data
    });
  } catch (err) {
    console.error('Extraction error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/calculate', (req, res) => {
  const { layers, depthIndex } = req.body ?? {};
  if (!Array.isArray(layers) || !layers.length)
    return res.status(400).json({ error: 'layers array required' });

  const idx = Math.min(Math.max(0, depthIndex ?? 0), layers.length - 1);
  const lyr = layers[idx];
  const sh  = shear(lyr);
  const st  = settle(lyr);
  const gov = Math.min(sh.qna, st);

  res.json({
    depth     : lyr.D,
    shear     : sh,
    settlement: st,
    governing : gov,
    govShear  : sh.qna <= st,
    layer     : lyr,
    constants : C
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n  ┌─────────────────────────────────────────┐');
  console.log(`  │  GeoSBC  →  http://localhost:${PORT}         │`);
  console.log('  └─────────────────────────────────────────┘');
  console.log(`\n  API key : ${process.env.ANTHROPIC_API_KEY ? '✓ loaded' : '✗ NOT SET — edit .env.local'}`);
  console.log(`  Model   : ${MODEL}\n`);
});
