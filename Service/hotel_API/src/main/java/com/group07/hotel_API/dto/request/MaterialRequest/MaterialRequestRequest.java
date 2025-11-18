package com.group07.hotel_API.dto.request.MaterialRequest;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class MaterialRequestRequest {
    @NotEmpty(message = "Items list cannot be empty")
    @NotNull(message = "Items list cannot be null")
    @Valid
    private List<MaterialRequestItemRequest> items;

    private String notes;
}


