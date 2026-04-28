"""국민대학교 교외채용 — 셀렉터는 backend/config/selectors.json."""
from .base import BaseCrawler, board_config

_CFG = board_config("career")


class CareerCrawler(BaseCrawler):
    category = _CFG["category"]
    source_board = _CFG["source_board"]
    BASE_URL = _CFG["base_url"]
    LIST_URLS = _CFG["list_urls"]
    LINK_SELECTOR = _CFG["link_selector"]
    LINK_HREF_PATTERN = _CFG.get("link_href_pattern")
