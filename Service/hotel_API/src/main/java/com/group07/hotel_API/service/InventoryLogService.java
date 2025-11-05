package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.InventoryLog.InventoryLogRequest;
import com.group07.hotel_API.dto.response.InventoryLog.InventoryLogResponse;

import java.util.List;

public interface InventoryLogService {
    InventoryLogResponse createLog(InventoryLogRequest request);
    List<InventoryLogResponse> getAllLogs();
    InventoryLogResponse getLogById(Long id);
}
