package com.smartcampus.resources.model;

public enum ResourceStatus {
    ACTIVE("Active", "#10B981"),
    MAINTENANCE("Maintenance", "#F59E0B"),
    INACTIVE("Inactive", "#EF4444");

    private final String displayName;
    private final String color;

    ResourceStatus(String displayName, String color) {
        this.displayName = displayName;
        this.color = color;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getColor() {
        return color;
    }
}
