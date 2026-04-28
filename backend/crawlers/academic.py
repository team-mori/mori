"""국민대학교 학사공지 (kmuNews/notice/4) — 장학 관련 키워드만 필터."""
from .base import BaseCrawler, RawNotice

SCHOLARSHIP_KEYWORDS = ["장학", "학자금", "지원금", "등록금"]


class AcademicCrawler(BaseCrawler):
    category = "scholarship"
    source_board = "학사공지"
    BASE_URL = "https://www.kookmin.ac.kr"
    LIST_URLS = [
        "https://www.kookmin.ac.kr/user/kmuNews/notice/4/index.do",
    ]
    LINK_SELECTOR = "a[href*='view.do']"
    LINK_HREF_PATTERN = "/user/kmuNews/notice/4/"

    def parse(self, html: str, url: str) -> RawNotice | None:
        notice = super().parse(html, url)
        if not notice:
            return None
        if not any(k in notice.title for k in SCHOLARSHIP_KEYWORDS):
            return None
        return notice
