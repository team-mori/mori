package com.mori.crawler.dto;

import java.util.List;

/**
 * 공지 상세 페이지에서 수집한 본문 콘텐츠.
 * NoticeDto와 1:1로 대응하며, identifier로 연결한다.
 */
public class NoticeDetail {

    private final String identifier;
    private final String bodyText;
    private final List<String> bodyImages;
    private final boolean hasImageDownloadError;

    public NoticeDetail(String identifier, String bodyText, List<String> bodyImages) {
        this(identifier, bodyText, bodyImages, false);
    }

    public NoticeDetail(String identifier, String bodyText, List<String> bodyImages, boolean hasImageDownloadError) {
        this.identifier = identifier;
        this.bodyText = bodyText;
        this.bodyImages = bodyImages;
        this.hasImageDownloadError = hasImageDownloadError;
    }

    public String getIdentifier() {
        return identifier;
    }

    public String getBodyText() {
        return bodyText;
    }

    public List<String> getBodyImages() {
        return bodyImages;
    }

    public boolean hasImageDownloadError() {
        return hasImageDownloadError;
    }

    @Override
    public String toString() {
        return "NoticeDetail{" +
                "identifier='" + identifier + '\'' +
                ", bodyTextLength=" + (bodyText != null ? bodyText.length() : 0) +
                ", imageCount=" + (bodyImages != null ? bodyImages.size() : 0) +
                '}';
    }
}
