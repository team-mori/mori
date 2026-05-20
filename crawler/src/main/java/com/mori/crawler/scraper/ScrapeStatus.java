package com.mori.crawler.scraper;

public enum ScrapeStatus {
    SUCCESS,    // 정상 완료 (수집 0건이어도 SUCCESS)
    PARTIAL,    // 일부 공지에서 필수 필드(제목·링크) 누락
    FAILED,     // 예외 발생 또는 목록 컨테이너를 찾지 못함
}
