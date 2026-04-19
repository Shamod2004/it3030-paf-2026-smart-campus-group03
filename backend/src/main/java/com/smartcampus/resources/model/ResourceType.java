package com.smartcampus.resources.model;

public enum ResourceType {
    ROOM("Room"),
    LAB("Lab"),
    EQUIPMENT("Equipment"),
    FACILITY("Facility");

    private final String displayName;

    ResourceType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
