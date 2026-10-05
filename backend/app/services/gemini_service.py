import os
from pathlib import Path
from google import genai
from google.genai import types
from fastapi import HTTPException, status
from dotenv import load_dotenv

# Ensure .env is loaded from backend/
BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY and GEMINI_API_KEY != "your_gemini_api_key_here":
    client = genai.Client(api_key=GEMINI_API_KEY)


def get_client() -> genai.Client:
    global client
    if not client:
        key = os.getenv("GEMINI_API_KEY")
        if key and key != "your_gemini_api_key_here":
            client = genai.Client(api_key=key)
            return client
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Gemini API key is not configured on the backend server. Please add GEMINI_API_KEY in backend/.env"
        )
    return client


# Resilient model fallback pool to automatically bypass temporary 503 high-demand spikes
FALLBACK_MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-3.8-flash",
    "gemini-2.0-flash-lite"
]


def _generate_with_fallback(prompt: str, max_tokens: int, temperature: float) -> str:
    ai_client = get_client()
    last_error = None

    for model_name in FALLBACK_MODELS:
        try:
            response = ai_client.models.generate_content(
                model=model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=temperature,
                    max_output_tokens=max_tokens
                )
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            err_str = str(e)
            # If model is unavailable (503) or not found (404), try the next model in the pool
            if any(code in err_str for code in ["503", "UNAVAILABLE", "404", "NOT_FOUND"]):
                last_error = e
                continue
            # If it's another fatal error (e.g. invalid key), raise immediately
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Gemini API error: {err_str}"
            )

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail=f"All Gemini models are temporarily experiencing high demand. Please retry in a few seconds."
    )


def summarize_notes(notes: str) -> str:
    """Summarize interaction notes strictly based on provided text."""
    if not notes or not notes.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interaction notes cannot be empty."
        )

    prompt = f"""You are a professional B2B sales assistant.
Given the interaction notes below from a business event, produce a concise professional summary (3 to 4 bullet points maximum).

CONSTRAINTS:
- Rely strictly on the information provided in the notes.
- Do NOT fabricate, assume, or invent details not present in the notes.
- Focus strictly on action items, expressed interests, requirements, or next steps.

Interaction Notes:
{notes.strip()}
"""
    return _generate_with_fallback(prompt, max_tokens=300, temperature=0.2)


def generate_follow_up(name: str, company: str, event: str, notes: str) -> str:
    """Draft a polite, professional business follow-up message based strictly on contact & notes."""
    if not notes or not notes.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot generate follow-up email without interaction notes."
        )

    prompt = f"""You are drafting a professional business follow-up email after meeting a prospect at an event.

Contact Information:
- Recipient Name: {name}
- Company: {company}
- Met At Event: {event}
- Conversation Notes:
{notes.strip()}

GUIDELINES:
- Tone: Professional, polite, concise, and business-ready.
- Mention meeting them at {event}.
- Reference specific points discussed in the notes.
- Propose a logical next step (e.g. 15-minute call, sharing requested materials).
- Do NOT invent facts or terms not mentioned in the notes.
- Provide a Subject Line and Email Body.
"""
    return _generate_with_fallback(prompt, max_tokens=450, temperature=0.3)