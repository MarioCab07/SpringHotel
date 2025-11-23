package com.group07.hotel_API.dto.response.MaterialRequest;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class MaterialRequestResponse {
    private Long id;
    private Integer requestedById;
    private String requestedByUsername;
    private String requestedByName;
    private LocalDateTime requestDate;
    private String status;
    private String notes;
    private List<MaterialRequestItemResponse> items;
}


