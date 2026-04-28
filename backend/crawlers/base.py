"""
BaseCrawler — 한국 대학 게시판 공통 패턴 처리.

대부분의 국내 대학 게시판은 다음 중 하나의 패턴을 따른다:
  1) JSP/Spring board: ?bbsId=...&nttId=...
  2) Custom CMS: /article/{id}, /view/{id}
  3) 일반 게시판: 목록 <a href="...">제목</a>

서브클래스는 다음 중 하나만 채우면 된다:
  - LIST_URLS, LINK_SELECTOR (목록 페이지 + 상세 링크 셀렉터)
  - TITLE_SELECTORS, BODY_SELECTORS (상세 페이지 셀렉터)
"""
import re
import time
from urllib.parse import urljoin, urlparse
import requests
from bs4 import BeautifulSoup
from dataclasses import dataclass, field

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36"
    ),
    "Accept-Language": "ko-KR,ko;q=0.9,en;q=0.8",
}

REQUEST_DELAY_SEC = 1.0  # rate-limit (학교 서버 배려)

# 첨부파일 후보 셀렉터
ATTACHMENT_SELECTORS = [
    "a[href*='download']",
    "a[href*='attach']",
    ".attach a",
    ".file a",
    ".attachment a",
]


@dataclass
class RawNotice:
    category: str
    title: str
    source_url: str
    source_board: str
    raw_html: str
    documents: list[str] = field(default_factory=list)


class BaseCrawler:
    category: str = ""
    source_board: str = ""

    # 서브클래스가 오버라이드
    LIST_URLS: list[str] = []
    BASE_URL: str = ""
    LINK_SELECTOR: str = "a"
    LINK_CONTAINER_SELECTOR: str | None = None  # 목록 영역 한정 (선택)
    LINK_HREF_PATTERN: str | None = None  # href에 포함되어야 할 패턴 (선택)
    TITLE_SELECTORS: list[str] = [
        ".view_tit", ".view-title", ".board-view-title", ".bbs_title",
        ".subject", ".tit", ".title",
        "h1.title", "h2.title", "h1", "h2", "h3",
    ]
    BODY_SELECTORS: list[str] = [
        ".view_cont", ".view_inner", ".board-view-content", ".view-content",
        ".board-view", ".board_view", ".bbs-content",
        "article", ".cont", ".content", "#content"
    ]
    MAX_PER_RUN: int = 20  # 1회 실행당 최대 신규 수집

    def fetch(self, url: str) -> str:
        time.sleep(REQUEST_DELAY_SEC)
        r = requests.get(url, headers=HEADERS, timeout=15)
        r.raise_for_status()
        # 한글 인코딩 보정
        if r.encoding and r.encoding.lower() in ("iso-8859-1", "ascii"):
            r.encoding = r.apparent_encoding or "utf-8"
        return r.text

    def soup(self, html: str) -> BeautifulSoup:
        return BeautifulSoup(html, "lxml")

    def list_urls(self) -> list[str]:
        """목록 페이지들에서 상세 URL 추출."""
        urls: list[str] = []
        for list_url in self.LIST_URLS:
            try:
                html = self.fetch(list_url)
                soup = self.soup(html)
                root = soup
                if self.LINK_CONTAINER_SELECTOR:
                    found = soup.select_one(self.LINK_CONTAINER_SELECTOR)
                    if found:
                        root = found
                for a in root.select(self.LINK_SELECTOR):
                    href = a.get("href")
                    if not href:
                        continue
                    if self.LINK_HREF_PATTERN and self.LINK_HREF_PATTERN not in href:
                        continue
                    abs_url = urljoin(list_url, href)
                    # 외부 도메인 차단
                    if self.BASE_URL and urlparse(self.BASE_URL).netloc != urlparse(abs_url).netloc:
                        continue
                    if abs_url not in urls:
                        urls.append(abs_url)
            except Exception as e:
                print(f"[{self.source_board}] list fetch fail {list_url}: {e}")
        return urls[: self.MAX_PER_RUN]

    def _pick(self, soup: BeautifulSoup, selectors: list[str]):
        for sel in selectors:
            el = soup.select_one(sel)
            if el and el.get_text(strip=True):
                return el
        return None

    def parse(self, html: str, url: str) -> RawNotice | None:
        soup = self.soup(html)
        title_el = self._pick(soup, self.TITLE_SELECTORS)
        body_el = self._pick(soup, self.BODY_SELECTORS)
        if not title_el:
            # title fallback: <title> 태그
            t = soup.title.string if soup.title else None
            if not t:
                return None
            title = re.sub(r"\s+", " ", t).strip()
        else:
            title = title_el.get_text(strip=True)
        if not body_el:
            # body fallback: 본문 비슷한 가장 큰 <div>
            candidates = sorted(
                soup.find_all("div"),
                key=lambda d: len(d.get_text(strip=True)),
                reverse=True,
            )
            body_el = candidates[0] if candidates else None
        if not body_el:
            return None

        documents: list[str] = []
        for sel in ATTACHMENT_SELECTORS:
            for a in body_el.select(sel):
                name = a.get_text(strip=True)
                if name and name not in documents:
                    documents.append(name)
        return RawNotice(
            category=self.category,
            title=title[:200],
            source_url=url,
            source_board=self.source_board,
            raw_html=str(body_el)[:50000],
            documents=documents[:10],
        )

    def run(self) -> list[RawNotice]:
        out: list[RawNotice] = []
        for url in self.list_urls():
            try:
                html = self.fetch(url)
                n = self.parse(html, url)
                if n:
                    out.append(n)
            except Exception as e:
                print(f"[{self.source_board}] detail fail {url}: {e}")
        print(f"[{self.source_board}] collected {len(out)}")
        return out
