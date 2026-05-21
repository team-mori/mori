package com.mori.crawler.scraper;

import com.mori.crawler.category.NoticeCategory;
import com.mori.crawler.dto.DeadlineItem;
import com.mori.crawler.dto.NoticeDetail;
import com.mori.crawler.dto.NoticeDto;
import com.mori.crawler.parser.DeadlineExtractor;
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
    private static final int MAX_RSS_ITEMS = 30;

    private final ProcessedNoticeStore processedStore;
    private final DeadlineExtractor deadlineExtractor;
    private final List<NoticeDetail> noticeDetails = new ArrayList<>();

    public ComputerScienceScraper() {
        this.processedStore = new ProcessedNoticeStore(PROCESSED_FILE);
        this.deadlineExtractor = new DeadlineExtractor();
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

        // 3단계: 신규 공지의 상세 페이지 본문 수집 + 4단계: LLM 마감일 추출
        for (NoticeDto notice : newNotices) {
            // 상세 페이지 수집
            NoticeDetail detail;
            try {
                detail = fetchDetail(notice);
                noticeDetails.add(detail);
            } catch (Exception e) {
                System.err.println("[Warn] Failed to fetch detail for " + notice.getIdentifier()
                        + ": " + e.getMessage());
                hasPartialFailure = true;
                continue; // 상세 수집 실패 → markProcessed 안 함 → 다음 실행에서 재시도
            }

            // 이미지 다운로드 실패가 있으면 미완료 처리
            if (detail.hasImageDownloadError()) {
                System.err.println("[Warn] Image download error for " + notice.getIdentifier()
                        + " — will retry next run");
                hasPartialFailure = true;
                continue; // markProcessed 안 함 → 다음 실행에서 재시도
            }

            // LLM 마감일 추출
            boolean isEmptyDetail = (detail.getBodyText() == null || detail.getBodyText().trim().isEmpty())
                    && (detail.getBodyImages() == null || detail.getBodyImages().isEmpty());

            if (isEmptyDetail) {
                // 본문·이미지 모두 없음 (다운로드 실패가 아닌 원래 없는 경우) → 정상
                notice.setDeadlines(new ArrayList<>());
                System.out.println("[Info] " + notice.getIdentifier() + " has no text and no images. Skipping LLM call.");
                processedStore.markProcessed(notice.getIdentifier());
            } else {
                try {
                    List<DeadlineItem> deadlines = deadlineExtractor.extract(detail, notice.getPostDate());
                    notice.setDeadlines(deadlines);
                    System.out.println("[Info] " + notice.getIdentifier() + " → deadlines: " + deadlines);
                    processedStore.markProcessed(notice.getIdentifier());
                } catch (Exception e) {
                    System.err.println("[Warn] Failed to extract deadlines for " + notice.getIdentifier()
                            + ": " + e.getMessage() + " — will retry next run");
                    hasPartialFailure = true;
                    // markProcessed 안 함 → 다음 실행에서 재시도
                }
            }
        }

        // 5단계: 처리 이력 저장
        processedStore.save();

        ScrapeStatus status = hasPartialFailure ? ScrapeStatus.PARTIAL : ScrapeStatus.SUCCESS;
        return new ScrapeResult(newNotices, status);
    }

    private List<NoticeDto> fetchNoticeList() throws IOException {
        List<NoticeDto> notices = new ArrayList<>();

        Document doc = Jsoup.connect(RSS_URL)
                .parser(Parser.xmlParser())
                .timeout(10000)
                .get();

        Elements items = doc.select("item");
        int limit = Math.min(items.size(), MAX_RSS_ITEMS);

        for (int i = 0; i < limit; i++) {
            Element item = items.get(i);
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
                    new ArrayList<>(),
                    NoticeCategory.COMPUTERSCIENCE_ACADEMIC_RSS,
                    identifier
            ));
        }

        return notices;
    }

    private NoticeDetail fetchDetail(NoticeDto notice) throws IOException {
        Document doc = Jsoup.connect(notice.getLink())
                .timeout(10000)
                .get();

        Element container = doc.selectFirst("#view-detail-data");
        if (container == null) {
            throw new IOException("Detail container #view-detail-data not found for " + notice.getLink());
        }

        String bodyText = container.text();

        List<String> images = new ArrayList<>();
        boolean hasImageDownloadError = false;
        Elements imgElements = container.select("img");
        
        for (Element img : imgElements) {
            String src = img.attr("src").trim();
            if (src.isEmpty()) {
                continue;
            }

            if (src.startsWith("data:image")) {
                images.add(src);
            } else if (src.startsWith("//") || src.startsWith("http:") || src.startsWith("https:")) {
                String imageUrl = src;
                if (src.startsWith("//")) {
                    imageUrl = "https:" + src;
                }
                
                String base64Image = downloadAndEncodeToBase64(imageUrl);
                if (base64Image != null) {
                    images.add(base64Image);
                } else {
                    hasImageDownloadError = true;
                }
            }
        }

        return new NoticeDetail(notice.getIdentifier(), bodyText, images, hasImageDownloadError);
    }

    private String downloadAndEncodeToBase64(String imageUrl) {
        try {
            String encodedUrl = encodeUrl(imageUrl);
            org.jsoup.Connection.Response response = Jsoup.connect(encodedUrl)
                    .ignoreContentType(true)
                    .timeout(15000)
                    .execute();
            byte[] bytes = response.bodyAsBytes();
            String contentType = response.contentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                contentType = "image/png"; // Default fallback
            }
            String base64Data = java.util.Base64.getEncoder().encodeToString(bytes);
            return "data:" + contentType + ";base64," + base64Data;
        } catch (Exception e) {
            System.err.println("[Warn] Failed to download and encode image from URL: " + imageUrl + " - " + e.getMessage());
            return null;
        }
    }

    /**
     * URL의 경로·쿼리에 포함된 비ASCII·특수문자를 퍼센트 인코딩한다.
     * 이미 인코딩된 %XX 시퀀스는 이중 인코딩하지 않는다.
     */
    private String encodeUrl(String rawUrl) {
        try {
            java.net.URI uri = java.net.URI.create("dummy://dummy");
            // scheme + authority 분리
            int schemeEnd = rawUrl.indexOf("://");
            if (schemeEnd < 0) return rawUrl;

            String scheme = rawUrl.substring(0, schemeEnd);
            String rest = rawUrl.substring(schemeEnd + 3);

            // authority(host:port)와 path+query 분리
            int pathStart = rest.indexOf('/');
            if (pathStart < 0) return rawUrl;

            String authority = rest.substring(0, pathStart);
            String pathAndQuery = rest.substring(pathStart);

            // query 분리
            String path = pathAndQuery;
            String query = null;
            int queryIdx = pathAndQuery.indexOf('?');
            if (queryIdx >= 0) {
                path = pathAndQuery.substring(0, queryIdx);
                query = pathAndQuery.substring(queryIdx + 1);
            }

            // URI 생성자가 경로·쿼리를 자동 인코딩 (이미 인코딩된 것은 보존)
            uri = new java.net.URI(scheme, authority, path, query, null);
            return uri.toASCIIString();
        } catch (Exception e) {
            // 인코딩 실패 시 원본 반환
            return rawUrl;
        }
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

        System.out.println("\n--- New Notices with Deadlines ---");
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
