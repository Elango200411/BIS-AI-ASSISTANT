"""
Translation service with multi-layer fallback:
1. MyMemory API (free, no key required, 5000 chars/day)
2. Built-in BIS phrase dictionary (offline, instant)
3. Pass-through in English (always works)

Never crashes. Always returns a string.
"""

import re
import json
import logging
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

TIMEOUT = httpx.Timeout(8.0, connect=5.0)

LANG_CODES = {
    "en": "en",
    "hi": "hi",
    "ta": "ta",
}

LANG_NAMES = {
    "en": "English",
    "hi": "हिन्दी",
    "ta": "தமிழ்",
}

BIS_PHRASES = {
    "hi": {
        "What is BIS?": "BIS क्या है?",
        "BIS certification": "BIS प्रमाणन",
        "hallmarking": "हॉलमार्किंग",
        "gold": "सोना",
        "silver": "चाँदी",
        "complaint": "शिकायत",
        "consumer": "उपभोक्ता",
        "standard": "मानक",
        "certificate": "प्रमाण पत्र",
        "application": "आवेदन",
        "documents": "दस्तावेज",
        "required": "आवश्यक",
        "process": "प्रक्रिया",
        "step": "चरण",
        "how to": "कैसे करें",
        "LED bulb": "LED बल्ब",
        "steel": "इस्पात",
        "cement": "सीमेंट",
        "solar": "सौर",
        "toys": "खिलौने",
        "Welcome to BIS Sahayak AI!": "BIS सहायक AI में आपका स्वागत है!",
        "How can I assist you today?": "आज मैं आपकी कैसे सहायता कर सकता हूँ?",
        "Type your question about Indian Standards...": "भारतीय मानकों के बारे में अपना प्रश्न टाइप करें...",
        "AI Assistant": "AI सहायक",
        "Ask questions about Indian Standards, BIS certification, and compliance": "भारतीय मानकों, BIS प्रमाणन और अनुपालन के बारे में प्रश्न पूछें",
        "Suggested questions": "सुझाए गए प्रश्न",
        "How this answer was generated": "इस उत्तर को कैसे तैयार किया गया",
        "User Intent": "उपयोगकर्ता इरादा",
        "Retrieved Knowledge": "प्राप्त ज्ञान",
        "Matched Sources": "मिलान स्रोत",
        "Response Method": "प्रतिक्रिया विधि",
        "Clear": "साफ करें",
        "Sources:": "स्रोत:",
        "BIS Sahayak AI": "BIS सहायक AI",
        "You": "आप",
    },
    "ta": {
        "What is BIS?": "BIS என்ன?",
        "BIS certification": "BIS சான்றிதழ்",
        "hallmarking": "முத்திரையிடல்",
        "gold": "தங்கம்",
        "silver": "வெள்ளி",
        "complaint": "புகார்",
        "consumer": "நுகர்வோர்",
        "standard": "தரநிலை",
        "certificate": "சான்றிதழ்",
        "application": "விண்ணப்பம்",
        "documents": "ஆவணங்கள்",
        "required": "தேவை",
        "process": "செயல்முறை",
        "step": "படி",
        "how to": "எப்படி",
        "LED bulb": "LED விளக்கு",
        "steel": "எஃகு",
        "cement": "சிமென்ட்",
        "solar": "சூரிய",
        "toys": "பொம்மைகள்",
        "Welcome to BIS Sahayak AI!": "BIS சகாய் AI க்கு வரவேற்கிறோம்!",
        "How can I assist you today?": "இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?",
        "Type your question about Indian Standards...": "இந்திய தரநிலைகள் பற்றிய உங்கள் கேள்வியை டைப் செய்யுங்கள்...",
        "AI Assistant": "AI உதவியாளர்",
        "Ask questions about Indian Standards, BIS certification, and compliance": "இந்திய தரநிலைகள், BIS சான்றிதழ் மற்றும் இணக்கம் பற்றி கேள்விகள் கேளுங்கள்",
        "Suggested questions": "பரிந்துரைக்கப்பட்ட கேள்விகள்",
        "How this answer was generated": "இந்த பதில் எப்படி உருவாக்கப்பட்டது",
        "User Intent": "பயனர் நோக்கம்",
        "Retrieved Knowledge": "பெறப்பட்ட அறிவு",
        "Matched Sources": "பொருந்திய மூலங்கள்",
        "Response Method": "பதில் முறை",
        "Clear": "அழி",
        "Sources:": "மூலங்கள்:",
        "BIS Sahayak AI": "BIS சகாய் AI",
        "You": "நீங்கள்",
    },
}

LANG_PAIR_RE = re.compile(r"^([a-z]{2})-([a-z]{2})$", re.IGNORECASE)


def _mymemory_translate(text: str, source: str, target: str) -> Optional[str]:
    """Translate using MyMemory free API (no key needed)."""
    try:
        url = "https://api.mymemory.translated.net/get"
        params = {
            "q": text[:500],
            "langpair": f"{source}|{target}",
        }
        with httpx.Client(timeout=TIMEOUT) as client:
            resp = client.get(url, params=params)
            resp.raise_for_status()
            data = resp.json()

        translated = data.get("responseData", {}).get("translatedText", "")
        if translated and translated.lower() != text.lower():
            return translated
        return None

    except Exception as e:
        logger.debug(f"MyMemory translation failed: {e}")
        return None


def _dictionary_translate(text: str, lang: str) -> str:
    """Offline phrase-level translation using built-in dictionary."""
    phrases = BIS_PHRASES.get(lang, {})
    if not phrases:
        return text

    result = text
    for en, translated in sorted(phrases.items(), key=lambda x: -len(x[0])):
        pattern = re.compile(re.escape(en), re.IGNORECASE)
        result = pattern.sub(translated, result)

    return result


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text with automatic fallback.
    Returns translated text or original if translation fails.
    """
    if not text or not text.strip():
        return text
    if source_lang == target_lang:
        return text

    target = LANG_CODES.get(target_lang, target_lang)
    source = LANG_CODES.get(source_lang, source_lang)

    api_result = _mymemory_translate(text, source, target)
    if api_result:
        return api_result

    dict_result = _dictionary_translate(text, target)
    if dict_result != text:
        return dict_result

    return text
