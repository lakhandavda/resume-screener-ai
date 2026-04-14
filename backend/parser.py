import pdfplumber
import io

def extract_text_from_pdf(file_content: bytes) -> str:
    """
    Extracts text from a PDF file provided as bytes.
    """
    text = ""
    try:
        with pdfplumber.open(io.BytesIO(file_content)) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""
    
    return text.strip()
