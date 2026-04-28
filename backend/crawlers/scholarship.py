"""국민대학교 장학공지 (kmuNews/notice/7)."""
from .base import BaseCrawler


class ScholarshipCrawler(BaseCrawler):
    category = "scholarship"
    source_board = "장학공지"
    BASE_URL = "https://www.kookmin.ac.kr"
    LIST_URLS = [
        "https://www.kookmin.ac.kr/user/kmuNews/notice/7/index.do",
    ]
    LINK_SELECTOR = "a[href*='view.do']"
    LINK_HREF_PATTERN = "/user/kmuNews/notice/7/"
