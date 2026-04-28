import os
import json
import re
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

_client = None

def client() -> Anthropic:
    global _client
    if _client is None:
        _client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
    return _client


PROMPT = """다음은 한국 대학교의 [{category}] 공지 원문이다. 아래 6개 항목을 JSON으로 추출하라.

원문:
{raw_html}

출력 형식 (JSON only, 다른 텍스트 금지):
{{
  "summary": "25자 이내 한 줄 요약",
  "target": "지원대상 (예: 재학생 / 소득분위 8분위 이하)",
  "start_date": "YYYY-MM-DD or null",
  "end_date": "YYYY-MM-DD or null",
  "documents": ["서류1", "서류2", "서류3"]
}}"""


def extract_fields(category: str, raw_html: str) -> dict:
    msg = client().messages.create(
        model="claude-sonnet-4-6",
        max_tokens=600,
        messages=[{"role": "user", "content": PROMPT.format(category=category, raw_html=raw_html[:8000])}],
    )
    text = "".join(b.text for b in msg.content if b.type == "text").strip()
    # JSON only를 요구했지만 안전하게 첫 { ~ 마지막 } 범위 추출
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        raise ValueError(f"LLM did not return JSON: {text[:200]}")
    return json.loads(m.group(0))
