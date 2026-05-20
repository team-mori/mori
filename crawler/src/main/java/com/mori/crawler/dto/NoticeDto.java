package com.mori.crawler.dto;

import com.mori.crawler.category.NoticeCategory;
import java.time.LocalDate;

public class NoticeDto {

    private final String title;
    private final String link;
    private final LocalDate postDate;
    private final LocalDate deadline;
    private final NoticeCategory category;
    private final String identifier;

    public NoticeDto(String title, String link, LocalDate postDate,
                     LocalDate deadline, NoticeCategory category, String identifier) {
        this.title = title;
        this.link = link;
        this.postDate = postDate;
        this.deadline = deadline;
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

    public LocalDate getDeadline() {
        return deadline;
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
                ", deadline=" + deadline +
                ", category=" + category +
                ", identifier='" + identifier + '\'' +
                '}';
    }
}
