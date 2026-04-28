"""국민대학교 학사공지 — 제목 키워드 필터로 장학 관련만 통과."""
from .base import BaseCrawler, RawNotice, board_config

_CFG = board_config("academic")


class AcademicCrawler(BaseCrawler):
    category = _CFG["category"]
    source_board = _CFG["source_board"]
    BASE_URL = _CFG["base_url"]
    LIST_URLS = _CFG["list_urls"]
    LINK_SELECTOR = _CFG["link_selector"]
    LINK_HREF_PATTERN = _CFG.get("link_href_pattern")
    KEYWORDS: list[str] = _CFG.get("title_keyword_filter", [])

    def parse(self, html: str, url: str) -> RawNotice | None:
        notice = super().parse(html, url)
        if not notice:
            return None
        if self.KEYWORDS and not any(k in notice.title for k in self.KEYWORDS):
            return None
        return notice
