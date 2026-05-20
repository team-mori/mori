package com.mori.crawler.scraper;

import com.mori.crawler.category.NoticeCategory;
import com.mori.crawler.dto.NoticeDto;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.parser.Parser;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class ComputerScienceScraper implements Scraper {

    private static final String RSS_URL = "https://cs.kookmin.ac.kr/news/notice/rss";
    private static final String DETAIL_URL_PREFIX = "https://cs.kookmin.ac.kr/news/notice/";

    @Override
    public ScrapeResult scrape() {
        List<NoticeDto> notices = new ArrayList<>();
        boolean hasPartialFailure = false;

        try {
            // Jsoup을 사용한 XML 파싱 (Timeout 10초 설정)
            Document doc = Jsoup.connect(RSS_URL)
                    .parser(Parser.xmlParser())
                    .timeout(10000)
                    .get();

            Elements items = doc.select("item");
            if (items.isEmpty()) {
                // 수집된 item이 0개여도 정상 완료(SUCCESS)로 처리
                return new ScrapeResult(notices, ScrapeStatus.SUCCESS);
            }

            for (Element item : items) {
                Element titleElement = item.selectFirst("title");
                Element linkElement = item.selectFirst("link");
                Element pubDateElement = item.selectFirst("pubDate");

                // 필수 필드(제목, 링크) 검증
                if (titleElement == null || linkElement == null || 
                        titleElement.text().trim().isEmpty() || linkElement.text().trim().isEmpty()) {
                    hasPartialFailure = true;
                    continue;
                }

                String title = titleElement.text().trim();
                String postNumber = linkElement.text().trim();
                String fullLink = DETAIL_URL_PREFIX + postNumber;
                String identifier = NoticeCategory.COMPUTERSCIENCE_ACADEMIC_RSS.name() + "-" + postNumber;

                // pubDate 파싱
                LocalDate postDate = null;
                if (pubDateElement != null && !pubDateElement.text().trim().isEmpty()) {
                    String pubDateStr = pubDateElement.text().trim();
                    try {
                        // RFC 1123 포맷 파싱 (예: "Wed, 20 May 2026 15:00:00 +0900")
                        postDate = ZonedDateTime.parse(pubDateStr, DateTimeFormatter.RFC_1123_DATE_TIME).toLocalDate();
                    } catch (Exception e) {
                        // 파싱 실패 시 null 대입하고 PARTIAL 플래그 표시
                        hasPartialFailure = true;
                    }
                } else {
                    hasPartialFailure = true;
                }

                NoticeDto noticeDto = new NoticeDto(
                        title,
                        fullLink,
                        postDate,
                        null, // 이번 단계에서는 deadline null
                        NoticeCategory.COMPUTERSCIENCE_ACADEMIC_RSS,
                        identifier
                );
                notices.add(noticeDto);
            }

        } catch (IOException e) {
            // 네트워크 오류 또는 파싱 자체가 깨진 경우 FAILED 리턴
            System.err.println("[Error] Failed to fetch or parse RSS from: " + RSS_URL + " - " + e.getMessage());
            return new ScrapeResult(new ArrayList<>(), ScrapeStatus.FAILED);
        }

        ScrapeStatus status = hasPartialFailure ? ScrapeStatus.PARTIAL : ScrapeStatus.SUCCESS;
        return new ScrapeResult(notices, status);
    }

    public static void main(String[] args) {
        System.out.println("=== Starting ComputerScienceScraper ===");
        ComputerScienceScraper scraper = new ComputerScienceScraper();
        ScrapeResult result = scraper.scrape();

        System.out.println("Execution Status: " + result.getStatus());
        System.out.println("Total notices collected: " + result.getNotices().size());
        System.out.println("\n--- Collected Notices ---");
        for (NoticeDto notice : result.getNotices()) {
            System.out.println(notice);
        }
        System.out.println("========================================");
    }
}
