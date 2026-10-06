import os
from pathlib import Path
from openai import OpenAI
from fastapi import HTTPException, status
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

client = None
if OPENROUTER_API_KEY and OPENROUTER_API_KEY != "your_openrouter_api_key_here":
    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=OPENROUTER_API_KEY,
    )

def get_client() -> OpenAI:
    global client
    if not client:
        key = os.getenv("OPENROUTER_API_KEY")
        if key and key != "your_openrouter_api_key_here":
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=key,
            )
            return client
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OpenRouter API key is not configured on the backend server. Please add OPENROUTER_API_KEY in backend/.env"
        )
    return client

FALLBACK_MODELS = [
    "openrouter/free",
    "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3.5-lightning:free"
]
import re

def _generate_with_fallback(prompt: str, max_tokens: int, temperature: float) -> str:
    ai_client = get_client()
    for model_name in FALLBACK_MODELS:
        try:
            response = ai_client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": "You are a professional B2B sales assistant. Provide ONLY the final requested output directly without any chain-of-thought, reasoning steps, or preamble text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature,
                max_tokens=max_tokens
            )
            if response and response.choices and response.choices[0].message.content:
                text = response.choices[0].message.content.strip()
                
                # Strip out common reasoning blocks or thinking tags if the model outputs them
                text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL).strip()
                
                # If there's a preamble like "Here's a thinking process:", try to look for standard markers or clean it
                if "Suggested Follow-up Message" in text or "Subject:" in text:
                    # Keep from Subject onwards if present
                    sub_idx = text.find("Subject:")
                    if sub_idx != -1:
                        text = text[sub_idx:]
                
                return text
        except Exception as e:
            err_str = str(e)
            if any(code in err_str for code in ["429", "503", "rate_limit", "overloaded", "404"]):
                continue
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"OpenRouter API error: {err_str}"
            )
    raise HTTPException(
        status_code=status.HTTP_53_SERVICE_UNAVAILABLE,
        detail="OpenRouter free models are temporarily busy. Please retry in a few seconds."
    )

def summarize_notes(notes: str) -> str:
    if not notes or not notes.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Interaction notes cannot be empty.")
    prompt = f"""Given the interaction notes below from a business event, produce a concise professional summary (3 to 4 bullet points maximum).
CONSTRAINTS:
- Rely strictly on the information provided in the notes.
- Do NOT fabricate, assume, or invent details not present in the notes.
- Focus strictly on action items, expressed interests, requirements, or next steps.

Interaction Notes:
{notes.strip()}
"""
    return _generate_with_fallback(prompt, max_tokens=300, temperature=0.2)

def generate_follow_up(name: str, company: str, event: str, notes: str) -> str:
    if not notes or not notes.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot generate follow-up email without interaction notes.")
    prompt = f"""Draft a professional business follow-up email after meeting a prospect at an event.
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