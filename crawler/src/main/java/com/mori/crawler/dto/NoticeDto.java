package com.mori.crawler.dto;

import com.mori.crawler.category.NoticeCategory;
import java.time.LocalDate;
import java.util.List;

public class NoticeDto {

    private final String title;
    private final String link;
    private final LocalDate postDate;
    private List<DeadlineItem> deadlines;
    private final NoticeCategory category;
    private final String identifier;

    public NoticeDto(String title, String link, LocalDate postDate,
                     List<DeadlineItem> deadlines, NoticeCategory category, String identifier) {
        this.title = title;
        this.link = link;
        this.postDate = postDate;
        this.deadlines = deadlines;
        this.category = category;
        this.identifier = identifier;
    }

    public String getTitle() {
        return title;
    }

    public String getLink() {
        return link;
    }

    public LocalDate getPostDate() {
        return postDate;
    }

    public List<DeadlineItem> getDeadlines() {
        return deadlines;
    }

    public void setDeadlines(List<DeadlineItem> deadlines) {
        this.deadlines = deadlines;
    }

    public NoticeCategory getCategory() {
        return category;
    }

    public String getIdentifier() {
        return identifier;
    }

    @Override
    public String toString() {
        return "NoticeDto{" +
                "title='" + title + '\'' +
                ", link='" + link + '\'' +
                ", postDate=" + postDate +
                ", deadlines=" + deadlines +
                ", category=" + category +
                ", identifier='" + identifier + '\'' +
                '}';
    }
}
