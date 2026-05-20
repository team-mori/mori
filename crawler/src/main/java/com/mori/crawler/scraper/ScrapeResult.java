package com.mori.crawler.scraper;

import com.mori.crawler.dto.NoticeDto;

import java.util.List;

public class ScrapeResult {

    private final List<NoticeDto> notices;
    private final ScrapeStatus status;

    public ScrapeResult(List<NoticeDto> notices, ScrapeStatus status) {
        this.notices = notices;
        this.status = status;
    }

    public List<NoticeDto> getNotices() {
        return notices;
    }

    public ScrapeStatus getStatus() {
        return status;
    }
}
