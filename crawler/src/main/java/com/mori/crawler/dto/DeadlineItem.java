package com.mori.crawler.dto;

import java.time.LocalDate;

public class DeadlineItem {

    private final String label;
    private final LocalDate date;

    public DeadlineItem(String label, LocalDate date) {
        this.label = label;
        this.date = date;
    }

    public String getLabel() {
        return label;
    }

    public LocalDate getDate() {
        return date;
    }

    @Override
    public String toString() {
        return "DeadlineItem{label='" + label + "', date=" + date + '}';
    }
}
