package com.mori.crawler.category;

public enum CategoryGroup {
    UNIVERSITY_CATEGORY("국민대"),
    COMPUTERSCIENCE_CATEGORY("소프트웨어융합대학"),
    BUSINESSADMINISTRATION_CATEGORY("경영대학"),
    ARCHITECTURE_CATEGORY("건축대학"),
    SOCIALSCIENCE_CATEGORY("사회과학대학"),
    CREATIVEENGINEERING_CATEGORY("창의공과대학"),
    DESIGN_CATEGORY("조형대학"),
    OTHERS_CATEGORY("사업단 및 부속기관"),
    AUTOMOTIVEENGINEERING_CATEGORY("자동차융합대학"),
    LAW_CATEGORY("법과대학"),
    SCIENCETECHNOLOGY_CATEGORY("과학기술대학"),
    ECONOMICCOMMERCE_CATEGORY("경상대학"),
    CULTURE_CATEGORY("교양대학"),
    TEACHING_CATEGORY("교직과정부"),
    ARTS_CATEGORY("예술대학"),
    PHYSICALEDUCATION_CATEGORY("체육대학"),
    GLOBALHUMANITIES_CATEGORY("글로벌인문지역대학"),
    LIBRARY_CATEGORY("성곡도서관"),
    OFFCAMPUS_CONTEST_CATEGORY("외부 대회 및 공모전"),
    ;

    private final String label;

    CategoryGroup(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
