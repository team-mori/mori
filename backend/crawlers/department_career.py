"""국민대 소프트웨어융합대학 SW 취업공지 — `./숫자` 형 상세 링크."""
import re
from urllib.parse import urljoin
from .base import BaseCrawler, board_config

_CFG = board_config("department_career")


class DepartmentCareerCrawler(BaseCrawler):
    category = _CFG["category"]
    source_board = _CFG["source_board"]
    BASE_URL = _CFG["base_url"]
    LIST_URLS = _CFG["list_urls"]
    LINK_SELECTOR = _CFG["link_selector"]
    LINK_HREF_PATTERN = None
    DETAIL_RE = re.compile(_CFG["link_href_regex"])

    def list_urls(self) -> list[str]:
        urls: list[str] = []
        for list_url in self.LIST_URLS:
            try:
                soup = self.soup(self.fetch(list_url))
                for a in soup.select(self.LINK_SELECTOR):
                    href = a.get("href") or ""
                    if not self.DETAIL_RE.match(href):
                        continue
                    abs_url = urljoin(list_url, href)
                    if abs_url not in urls:
                        urls.append(abs_url)
            except Exception as e:
                print(f"[{self.source_board}] list fetch fail {list_url}: {e}")
        return urls[: self.MAX_PER_RUN]
