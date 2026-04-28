"""마감일 추출 정확도 측정. samples.json에 50건을 채운 뒤 실행하면 정확도 % 출력."""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from lib.date_extract import extract_end_date
from lib.claude_client import extract_fields

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    with open(os.path.join(HERE, "samples.json"), "r", encoding="utf-8") as f:
        samples = json.load(f)

    n = len(samples)
    correct = 0
    for s in samples:
        text = s["raw_text"]
        expected = s["expected"]["end_date"]
        got = extract_end_date(text)
        if not got:
            try:
                data = extract_fields("scholarship", text)
                got = data.get("end_date")
            except Exception:
                got = None
        ok = got == expected
        if ok:
            correct += 1
        print(f"{'OK' if ok else 'NG'}  expected={expected} got={got}")

    pct = round(correct * 100 / max(1, n))
    print(f"\n=== 정확도: {pct}% ({correct}/{n}) ===")


if __name__ == "__main__":
    main()
