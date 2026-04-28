"""국민대학교 교외채용 공지 (kmuNews/notice/11)."""
from .base import BaseCrawler


class CareerCrawler(BaseCrawler):
    category = "career"
    source_board = "교외채용"
    BASE_URL = "https://www.kookmin.ac.kr"
    LIST_URLS = [
        "https://www.kookmin.ac.kr/user/kmuNews/notice/11/index.do",
    ]
    LINK_SELECTOR = "a[href*='view.do']"
    LINK_HREF_PATTERN = "/user/kmuNews/notice/11/"
