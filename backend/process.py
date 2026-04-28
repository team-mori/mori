"""llm_processed=false 인 공지를 가져와 Claude로 6필드 추출 → notices 업데이트."""
from lib.supabase_client import get_supabase
from lib.claude_client import extract_fields
from lib.date_extract import extract_end_date
from bs4 import BeautifulSoup


def html_to_text(html: str) -> str:
    return BeautifulSoup(html or "", "lxml").get_text("\n", strip=True)


def main():
    sb = get_supabase()
    rows = sb.table("notices").select("*").eq("llm_processed", False).limit(50).execute().data
    print(f"to process: {len(rows)}")

    for r in rows:
        text = html_to_text(r.get("raw_html") or "")
        # 1차: 정규식으로 마감일 시도
        end_date_regex = extract_end_date(text)

        try:
            data = extract_fields(r["category"], text or r["title"])
        except Exception as e:
            print(f"LLM fail {r['id']}: {e}")
            continue

        update = {
            "summary": (data.get("summary") or "")[:60],
            "target": data.get("target"),
            "start_date": data.get("start_date") or None,
            "end_date": end_date_regex or data.get("end_date") or None,
            "documents": data.get("documents") or [],
            "llm_processed": True,
        }
        try:
            sb.table("notices").update(update).eq("id", r["id"]).execute()
            print(f"ok {r['id']} → {update['summary']}")
        except Exception as e:
            print(f"update fail {r['id']}: {e}")


if __name__ == "__main__":
    main()
