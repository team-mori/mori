"""마감일 1차 추출 (정규식). 실패 시 None → process.py가 LLM fallback."""
import re
from datetime import date

# (pattern, has_year)
PATTERNS: list[tuple[re.Pattern, bool]] = [
    # 2025-05-15 / 2025.05.15 / 2025/5/15 / 2025년 5월 15일
    (re.compile(r"(20\d{2})\s*[.\-/년]\s*(\d{1,2})\s*[.\-/월]\s*(\d{1,2})\s*일?"), True),
    # 25.05.15 (2자리 연도)
    (re.compile(r"(?<!\d)(2\d)\s*[.\-]\s*(\d{1,2})\s*[.\-]\s*(\d{1,2})(?!\d)"), True),
    # 5월 15일 (연도 없음)
    (re.compile(r"(\d{1,2})\s*월\s*(\d{1,2})\s*일"), False),
    # 5/15 (슬래시 약식)
    (re.compile(r"(?<![\d/])(\d{1,2})/(\d{1,2})(?![\d/])"), False),
]

DEADLINE_KEYWORDS = [
    "마감일", "신청마감", "접수마감", "신청 마감", "접수 마감",
    "신청기한", "신청 기한", "마감", "까지",
]


def _to_iso(y: int | None, m: int, d: int) -> str | None:
    today = date.today()
    if y is None:
        try:
            cand = date(today.year, m, d)
            if cand < today:
                cand = date(today.year + 1, m, d)
            return cand.isoformat()
        except ValueError:
            return None
    if y < 100:
        y += 2000
    try:
        return date(y, m, d).isoformat()
    except ValueError:
        return None


def _scan(text: str) -> list[tuple[int, int, str]]:
    """모든 매칭을 (start, end, iso)로. 연도 있는 매칭이 같은 영역의 연도 없는 매칭을 가린다."""
    raw: list[tuple[int, int, str, bool]] = []  # (start, end, iso, has_year)
    for pat, has_year in PATTERNS:
        for m in pat.finditer(text):
            if has_year:
                iso = _to_iso(int(m.group(1)), int(m.group(2)), int(m.group(3)))
            else:
                iso = _to_iso(None, int(m.group(1)), int(m.group(2)))
            if iso:
                raw.append((m.start(), m.end(), iso, has_year))
    # 연도 없는 매칭이 연도 있는 매칭의 span에 포함되면 제거
    year_spans = [(s, e) for s, e, _, hy in raw if hy]
    out: list[tuple[int, int, str]] = []
    seen_iso_at_span: set[tuple[int, int]] = set()
    for s, e, iso, hy in raw:
        if not hy and any(ys <= s and e <= ye for ys, ye in year_spans):
            continue
        key = (s, e)
        if key in seen_iso_at_span:
            continue
        seen_iso_at_span.add(key)
        out.append((s, e, iso))
    out.sort(key=lambda x: x[0])
    return out


def extract_end_date(text: str) -> str | None:
    if not text:
        return None
    matches = _scan(text)
    if not matches:
        return None

    # 1) 마감 키워드 ±80자 내의 마지막 매칭
    for kw in DEADLINE_KEYWORDS:
        idx = text.find(kw)
        if idx < 0:
            continue
        lo, hi = max(0, idx - 80), idx + 80
        in_window = [iso for s, e, iso in matches if lo <= s < hi]
        if in_window:
            return in_window[-1]

    # 2) "~" 직후의 첫 매칭 (신청기간 A ~ B 패턴의 B)
    tilde_idx = text.find("~")
    if tilde_idx >= 0:
        after = [iso for s, _, iso in matches if s > tilde_idx]
        if after:
            return after[0]

    # 3) 본문 전체에서 마지막 매칭
    return matches[-1][2]
