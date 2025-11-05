package com.group07.hotel_API.utils.enums;

import java.util.Arrays;
import java.util.Optional;

public enum ServiceStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED,
    CANCELED;

    public static Optional<ServiceStatus> fromString(String status) {
        return Arrays.stream(values())
                .filter(s -> s.name().equalsIgnoreCase(status))
                .findFirst();
    }
}
