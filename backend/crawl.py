"""1일 1회 cron으로 실행. 신규 공지를 notices 테이블에 INSERT (URL 기반 중복 방지)."""
from crawlers.scholarship import ScholarshipCrawler
from crawlers.extracurricular import ExtracurricularCrawler
from crawlers.career import CareerCrawler
from crawlers.academic import AcademicCrawler
from crawlers.department_career import DepartmentCareerCrawler
from lib.supabase_client import get_supabase

CRAWLERS = [
    ScholarshipCrawler(),
    ExtracurricularCrawler(),
    CareerCrawler(),
    AcademicCrawler(),
    DepartmentCareerCrawler(),
]


def main():
    sb = get_supabase()
    inserted = 0
    for c in CRAWLERS:
        for n in c.run():
            try:
                sb.table("notices").insert({
                    "category": n.category,
                    "title": n.title,
                    "source_url": n.source_url,
                    "source_board": n.source_board,
                    "raw_html": n.raw_html,
                    "documents": n.documents,
                    "llm_processed": False,
                }).execute()
                inserted += 1
            except Exception as e:
                # source_url unique 제약 → 중복은 무시
                if "duplicate" in str(e).lower():
                    continue
                print(f"insert fail: {e}")
    print(f"inserted {inserted} new notices")


if __name__ == "__main__":
    main()
