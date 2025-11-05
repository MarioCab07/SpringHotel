package com.group07.hotel_API.utils.enums;

import java.util.Arrays;
import java.util.Optional;

public enum RoomStatus {
    AVAILABLE,
    OCCUPIED,
    RESERVED,
    MAINTENANCE;

    public static Optional<RoomStatus> fromString(String status) {
        return Arrays.stream(values())
                .filter(s -> s.name().equalsIgnoreCase(status))
                .findFirst();
    }
}
