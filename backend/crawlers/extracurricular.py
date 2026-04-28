"""국민대학교 공모·행사 (kmuNews/notice/9) — 비교과·대외활동 카테고리."""
from .base import BaseCrawler


class ExtracurricularCrawler(BaseCrawler):
    category = "extracurricular"
    source_board = "공모·행사"
    BASE_URL = "https://www.kookmin.ac.kr"
    LIST_URLS = [
        "https://www.kookmin.ac.kr/user/kmuNews/notice/9/index.do",
    ]
    LINK_SELECTOR = "a[href*='view.do']"
    LINK_HREF_PATTERN = "/user/kmuNews/notice/9/"
