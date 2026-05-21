package com.mori.crawler.scraper;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

/**
 * 이미 처리한 공지 식별자를 파일에 보관하여 신규 공지를 판정한다.
 * 최근 N개(기본 200)의 식별자를 보관하며, 초과 시 오래된 것부터 제거한다.
 */
public class ProcessedNoticeStore {

    private static final int DEFAULT_MAX_SIZE = 200;

    private final Path filePath;
    private final int maxSize;
    private final LinkedHashSet<String> identifiers;

    public ProcessedNoticeStore(Path filePath) {
        this(filePath, DEFAULT_MAX_SIZE);
    }

    public ProcessedNoticeStore(Path filePath, int maxSize) {
        this.filePath = filePath;
        this.maxSize = maxSize;
        this.identifiers = new LinkedHashSet<>();
        load();
    }

    private void load() {
        if (!Files.exists(filePath)) {
            return;
        }
        try {
            List<String> lines = Files.readAllLines(filePath);
            for (String line : lines) {
                String trimmed = line.trim();
                if (!trimmed.isEmpty()) {
                    identifiers.add(trimmed);
                }
            }
        } catch (IOException e) {
            System.err.println("[Warn] Failed to load processed identifiers from " + filePath + ": " + e.getMessage());
        }
    }

    public boolean isProcessed(String identifier) {
        return identifiers.contains(identifier);
    }

    public void markProcessed(String identifier) {
        identifiers.add(identifier);
        trimToMaxSize();
    }

    private void trimToMaxSize() {
        while (identifiers.size() > maxSize) {
            String oldest = identifiers.iterator().next();
            identifiers.remove(oldest);
        }
    }

    public void save() {
        try {
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, identifiers);
        } catch (IOException e) {
            System.err.println("[Error] Failed to save processed identifiers to " + filePath + ": " + e.getMessage());
        }
    }
}
