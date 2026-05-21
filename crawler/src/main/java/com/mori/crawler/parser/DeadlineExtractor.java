package com.mori.crawler.parser;

import com.mori.crawler.dto.DeadlineItem;
import com.mori.crawler.dto.NoticeDetail;
import io.github.cdimascio.dotenv.Dotenv;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

public class DeadlineExtractor {

    private static final String GEMINI_MODEL = "gemini-3.1-flash-lite"; // gemini-2.5-flash
    private static final String GEMINI_URL_TEMPLATE =
            "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    private final String apiKey;

    public DeadlineExtractor() {
        Dotenv dotenv = Dotenv.configure()
                .directory(".")
                .filename(".env")
                .load();
        this.apiKey = dotenv.get("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is not set in .env");
        }
    }

    /**
     * NoticeDetail의 본문 텍스트와 이미지를 Gemini에 보내 마감일을 추출한다.
     * 실패 시 빈 리스트를 반환하고 예외를 던진다.
     */
    public List<DeadlineItem> extract(NoticeDetail detail, LocalDate postDate) throws IOException {
        String requestBody = buildRequestBody(detail, postDate);
        String response = callGeminiApi(requestBody);
        return parseResponse(response, postDate);
    }

    private String buildRequestBody(NoticeDetail detail, LocalDate postDate) {
        StringBuilder partsJson = new StringBuilder();
        partsJson.append("[");

        // 텍스트 파트: 프롬프트 + 본문
        String prompt = buildPrompt(detail.getBodyText(), postDate);
        partsJson.append("{\"text\":").append(jsonString(prompt)).append("}");

        // 이미지 파트: base64 인라인 이미지
        if (detail.getBodyImages() != null) {
            for (String dataUri : detail.getBodyImages()) {
                // data:image/png;base64,xxxxx 형태에서 mime과 data 분리
                int commaIdx = dataUri.indexOf(',');
                if (commaIdx < 0) continue;

                String meta = dataUri.substring(0, commaIdx); // data:image/png;base64
                String base64Data = dataUri.substring(commaIdx + 1);

                // mime 추출: "data:image/png;base64" -> "image/png"
                String mimeType = meta.replace("data:", "").replace(";base64", "");

                partsJson.append(",{\"inline_data\":{\"mime_type\":")
                        .append(jsonString(mimeType))
                        .append(",\"data\":")
                        .append(jsonString(base64Data))
                        .append("}}");
            }
        }

        partsJson.append("]");

        return "{\"contents\":[{\"parts\":" + partsJson + "}]}";
    }

    private String buildPrompt(String bodyText, LocalDate postDate) {
        return "다음은 대학 공지사항 본문입니다. 이 공지의 게시일은 " + postDate + " 입니다.\n\n"
                + "학생이 신청·접수·제출을 위해 놓치면 안 되는 마감일을 모두 추출해 주세요.\n"
                + "시험 기간, 행사일, 수업 기간 등 학생이 따로 신청하지 않는 날짜는 마감일이 아니므로 포함하지 마세요.\n\n"
                + "각 마감일을 {\"label\": \"...\", \"date\": \"YYYY-MM-DD\"} 형태의 JSON 객체로 만들고, "
                + "그 객체들의 JSON 배열로만 반환하세요.\n"
                + "- label: 그 마감일이 무엇에 대한 것인지 나타내는 짧은 한국어 텍스트\n"
                + "- date: YYYY-MM-DD 형식의 날짜\n"
                + "- 연도가 명시되지 않은 날짜는 게시일(" + postDate + ")을 기준으로 해석하세요. "
                + "마감일은 게시일 이후가 자연스러우므로, 게시일보다 앞선 날짜가 나오면 다음 해로 해석하세요.\n"
                + "- 마감일이 없으면 빈 배열 []을 반환하세요.\n"
                + "- JSON 배열 외 다른 설명은 출력하지 마세요.\n\n"
                + "공지 본문:\n" + bodyText;
    }

    private String callGeminiApi(String requestBody) throws IOException {
        String urlStr = String.format(GEMINI_URL_TEMPLATE, GEMINI_MODEL, apiKey);
        URL url = new URL(urlStr);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        try {
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(30000);
            conn.setReadTimeout(60000);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(requestBody.getBytes(StandardCharsets.UTF_8));
            }

            int statusCode = conn.getResponseCode();
            if (statusCode != 200) {
                String errorBody = new String(conn.getErrorStream().readAllBytes(), StandardCharsets.UTF_8);
                throw new IOException("Gemini API returned status " + statusCode + ": " + errorBody);
            }

            return new String(conn.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        } finally {
            conn.disconnect();
        }
    }

    private List<DeadlineItem> parseResponse(String response, LocalDate postDate) throws IOException {
        // Gemini 응답에서 text 필드 추출: "text": "..." 패턴
        String text = extractTextField(response);
        if (text == null) {
            throw new IOException("Failed to extract text from Gemini response");
        }

        // JSON 코드블록 마커 제거
        text = text.trim();
        if (text.startsWith("```json")) {
            text = text.substring(7);
        } else if (text.startsWith("```")) {
            text = text.substring(3);
        }
        if (text.endsWith("```")) {
            text = text.substring(0, text.length() - 3);
        }
        text = text.trim();

        if (text.equals("[]")) {
            return new ArrayList<>();
        }

        return parseJsonArray(text, postDate);
    }

    /**
     * Gemini 응답 JSON에서 첫 번째 "text" 필드의 값을 추출한다.
     */
    private String extractTextField(String json) {
        // "text" : "..." 패턴을 찾아 값 추출
        String marker = "\"text\"";
        int idx = json.indexOf(marker);
        if (idx < 0) return null;

        // marker 이후 : 와 " 를 찾는다
        int colonIdx = json.indexOf(':', idx + marker.length());
        if (colonIdx < 0) return null;

        // 여는 따옴표 찾기
        int openQuote = json.indexOf('"', colonIdx + 1);
        if (openQuote < 0) return null;

        // 닫는 따옴표 찾기 (이스케이프 처리)
        StringBuilder sb = new StringBuilder();
        for (int i = openQuote + 1; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '\\' && i + 1 < json.length()) {
                char next = json.charAt(i + 1);
                if (next == '"') {
                    sb.append('"');
                    i++;
                } else if (next == 'n') {
                    sb.append('\n');
                    i++;
                } else if (next == '\\') {
                    sb.append('\\');
                    i++;
                } else if (next == 't') {
                    sb.append('\t');
                    i++;
                } else {
                    sb.append(c);
                }
            } else if (c == '"') {
                return sb.toString();
            } else {
                sb.append(c);
            }
        }
        return null;
    }

    /**
     * JSON 배열 문자열을 파싱하여 DeadlineItem 리스트로 변환한다.
     */
    private List<DeadlineItem> parseJsonArray(String arrayStr, LocalDate postDate) throws IOException {
        List<DeadlineItem> items = new ArrayList<>();

        if (!arrayStr.startsWith("[") || !arrayStr.endsWith("]")) {
            throw new IOException("Invalid JSON array format: " + arrayStr);
        }

        // 각 {...} 객체를 추출
        int i = 1; // '[' 다음부터
        while (i < arrayStr.length() - 1) {
            int objStart = arrayStr.indexOf('{', i);
            if (objStart < 0) break;

            int objEnd = arrayStr.indexOf('}', objStart);
            if (objEnd < 0) break;

            String objStr = arrayStr.substring(objStart, objEnd + 1);
            DeadlineItem item = parseDeadlineObject(objStr, postDate);
            if (item != null) {
                items.add(item);
            }
            i = objEnd + 1;
        }

        return items;
    }

    private DeadlineItem parseDeadlineObject(String objStr, LocalDate postDate) {
        String label = extractJsonStringField(objStr, "label");
        String dateStr = extractJsonStringField(objStr, "date");

        if (label == null || dateStr == null) {
            System.err.println("[Warn] Incomplete deadline object: " + objStr);
            return null;
        }

        try {
            LocalDate date = LocalDate.parse(dateStr);

            // 연도 검증: 게시일 대비 비정상 범위 경고
            if (postDate != null) {
                long daysBefore = ChronoUnit.DAYS.between(date, postDate);
                long daysAfter = ChronoUnit.DAYS.between(postDate, date);

                if (daysBefore > 365) {
                    System.err.println("[Warn] Deadline " + date + " is more than 1 year before postDate "
                            + postDate + " (label: " + label + ")");
                }
                if (daysAfter > 365) {
                    System.err.println("[Warn] Deadline " + date + " is more than 1 year after postDate "
                            + postDate + " (label: " + label + ")");
                }
            }

            return new DeadlineItem(label, date);
        } catch (DateTimeParseException e) {
            System.err.println("[Warn] Failed to parse date '" + dateStr + "' in deadline: " + objStr);
            return null;
        }
    }

    private String extractJsonStringField(String json, String field) {
        String pattern = "\"" + field + "\"";
        int idx = json.indexOf(pattern);
        if (idx < 0) return null;

        int colonIdx = json.indexOf(':', idx + pattern.length());
        if (colonIdx < 0) return null;

        int openQuote = json.indexOf('"', colonIdx + 1);
        if (openQuote < 0) return null;

        // 닫는 따옴표 (이스케이프 처리)
        StringBuilder sb = new StringBuilder();
        for (int i = openQuote + 1; i < json.length(); i++) {
            char c = json.charAt(i);
            if (c == '\\' && i + 1 < json.length()) {
                sb.append(json.charAt(i + 1));
                i++;
            } else if (c == '"') {
                return sb.toString();
            } else {
                sb.append(c);
            }
        }
        return null;
    }

    /** JSON 문자열로 이스케이프하여 감싼다. */
    private static String jsonString(String value) {
        if (value == null) return "null";
        StringBuilder sb = new StringBuilder("\"");
        for (char c : value.toCharArray()) {
            switch (c) {
                case '"' -> sb.append("\\\"");
                case '\\' -> sb.append("\\\\");
                case '\n' -> sb.append("\\n");
                case '\r' -> sb.append("\\r");
                case '\t' -> sb.append("\\t");
                default -> sb.append(c);
            }
        }
        sb.append('"');
        return sb.toString();
    }
}
