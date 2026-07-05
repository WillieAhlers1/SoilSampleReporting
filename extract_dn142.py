import fitz
doc = fitz.open(r'c:\Sandbox\SoilsampleReport-prototype\Report_DN 142.pdf')
for i, page in enumerate(doc):
    print(f"=== PAGE {i+1} ===")
    print(page.get_text())
doc.close()
