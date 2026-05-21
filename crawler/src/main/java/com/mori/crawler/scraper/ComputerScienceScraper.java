package com.mori.crawler.scraper;

import com.mori.crawler.category.NoticeCategory;
import com.mori.crawler.dto.NoticeDetail;
import com.mori.crawler.dto.NoticeDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ComputerScienceScraper implements Scraper {

    private static final String RSS_URL = "https://cs.kookmin.ac.kr/news/notice/rss";
    private static final String DETAIL_URL_PREFIX = "https://cs.kookmin.ac.kr/news/notice/";
    private static final Path LOG_DIR = Paths.get("log");
    private static final Path PROCESSED_FILE = LOG_DIR.resolve("computerscience_processed.txt");

    private final ProcessedNoticeStore processedStore;
    private final List<NoticeDetail> noticeDetails = new ArrayList<>();

    public ComputerScienceScraper() {
        this.processedStore = new ProcessedNoticeStore(PROCESSED_FILE);
    }

    @Override
    public ScrapeResult scrape() {
        List<NoticeDto> allNotices;
        boolean hasPartialFailure = false;

        // 1단계: RSS에서 공지 목록 수집
        try {
            allNotices = fetchNoticeList();
        } catch (IOException e) {
            System.err.println("[Error] Failed to fetch or parse RSS from: " + RSS_URL + " - " + e.getMessage());
            return new ScrapeResult(new ArrayList<>(), ScrapeStatus.FAILED);
        }

        // 2단계: 신규 공지 판정
        List<NoticeDto> newNotices = new ArrayList<>();
        for (NoticeDto notice : allNotices) {
            if (!processedStore.isProcessed(notice.getIdentifier())) {
                newNotices.add(notice);
            }
        }

        System.out.println("[Info] RSS total: " + allNotices.size() + ", New: " + newNotices.size());

        // 3단계: 신규 공지의 상세 페이지 본문 수집
        for (NoticeDto notice : newNotices) {
            try {
                NoticeDetail detail = fetchDetail(notice);
                noticeDetails.add(detail);
                processedStore.markProcessed(notice.getIdentifier());
            } catch (Exception e) {
                System.err.println("[Warn] Failed to fetch detail for " + notice.getIdentifier()
                        + ": " + e.getMessage());
                hasPartialFailure = true;
            }
        }

        // 4단계: 처리 이력 저장
        processedStore.save();

        ScrapeStatus status = hasPartialFailure ? ScrapeStatus.PARTIAL : ScrapeStatus.SUCCESS;
        return new ScrapeResult(newNotices, status);
    }

    /**
     * RSS 피드에서 공지 목록을 수집한다.
     * 필수 필드(제목·링크) 누락 시 해당 항목은 건너뛴다.
     */
    private List<NoticeDto> fetchNoticeList() throws IOException {
        List<NoticeDto> notices = new ArrayList<>();

        Document doc = Jsoup.connect(RSS_URL)
                .parser(Parser.xmlParser())
                .timeout(10000)
                .get();

        Elements items = doc.select("item");

        for (Element item : items) {
            Element titleElement = item.selectFirst("title");
            Element linkElement = item.selectFirst("link");
            Element pubDateElement = item.selectFirst("pubDate");

            if (titleElement == null || linkElement == null
                    || titleElement.text().trim().isEmpty() || linkElement.text().trim().isEmpty()) {
                continue;
            }

            String title = titleElement.text().trim();
            String postNumber = linkElement.text().trim();
            String fullLink = DETAIL_URL_PREFIX + postNumber;
            String identifier = NoticeCategory.COMPUTERSCIENCE_ACADEMIC_RSS.name() + "-" + postNumber;

            LocalDate postDate = null;
            if (pubDateElement != null && !pubDateElement.text().trim().isEmpty()) {
                try {
                    postDate = ZonedDateTime.parse(
                            pubDateElement.text().trim(),
                            DateTimeFormatter.RFC_1123_DATE_TIME
                    ).toLocalDate();
                } catch (Exception e) {
                    // 날짜 파싱 실패 — null 유지
                }
            }

            notices.add(new NoticeDto(
                    title,
                    fullLink,
                    postDate,
                    null,
                    NoticeCategory.COMPUTERSCIENCE_ACADEMIC_RSS,
                    identifier
            ));
        }

        return notices;
    }

    /**
     * 공지 상세 페이지에서 본문 텍스트와 base64 인라인 이미지를 수집한다.
     */
    private NoticeDetail fetchDetail(NoticeDto notice) throws IOException {
        Document doc = Jsoup.connect(notice.getLink())
                .timeout(10000)
                .get();

        // #view-detail-data가 모바일/PC용으로 두 번 등장 — 첫 번째만 사용
        Element container = doc.selectFirst("#view-detail-data");
        if (container == null) {
            throw new IOException("Detail container #view-detail-data not found for " + notice.getLink());
        }

        String bodyText = container.text();

        List<String> images = new ArrayList<>();
        Elements imgElements = container.select("img");
        for (Element img : imgElements) {
            String src = img.attr("src");
            if (src.startsWith("data:image")) {
                images.add(src);
            }
        }

        return new NoticeDetail(notice.getIdentifier(), bodyText, images);
    }

    public List<NoticeDetail> getNoticeDetails() {
        return noticeDetails;
    }

    public static void main(String[] args) {
        System.out.println("=== Starting ComputerScienceScraper ===");
        ComputerScienceScraper scraper = new ComputerScienceScraper();
        ScrapeResult result = scraper.scrape();

        System.out.println("\nExecution Status: " + result.getStatus());
        System.out.println("New notices: " + result.getNotices().size());

        System.out.println("\n--- New Notices ---");
        for (NoticeDto notice : result.getNotices()) {
            System.out.println(notice);
        }

        System.out.println("\n--- Notice Details ---");
        for (NoticeDetail detail : scraper.getNoticeDetails()) {
            System.out.println(detail);
        }

        System.out.println("========================================");
    }
}
