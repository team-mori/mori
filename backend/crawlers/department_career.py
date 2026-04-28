"""국민대 소프트웨어융합대학 SW 취업공지."""
import re
from .base import BaseCrawler


class DepartmentCareerCrawler(BaseCrawler):
    category = "career"
    source_board = "소프트웨어융합대학 취업공지"
    BASE_URL = "https://cs.kookmin.ac.kr"
    LIST_URLS = [
        "https://cs.kookmin.ac.kr/news/jobs/",
    ]
    # 상세 링크는 `./숫자` 형태 (예: ./2041)
    LINK_SELECTOR = "a[href]"
    LINK_HREF_PATTERN = None
    DETAIL_RE = re.compile(r"^\./\d+$")

    def list_urls(self) -> list[str]:
        from urllib.parse import urljoin
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
