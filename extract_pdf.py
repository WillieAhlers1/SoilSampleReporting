import fitz
doc = fitz.open(r'c:\Sandbox\SoilsampleReport-prototype\AI-Based Geotechnical Report Review & Foundation Recommendation Platform.pdf')
for i, page in enumerate(doc):
    print(f"=== PAGE {i+1} ===")
    print(page.get_text())
doc.close()
