package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.InventoryLog.InventoryLogRequest;
import com.group07.hotel_API.dto.response.InventoryLog.InventoryLogResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.InventoryLog;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.InventoryLog.ResourceNotFoundException;
import com.group07.hotel_API.repository.InventoryItemRepository;
import com.group07.hotel_API.repository.InventoryLogRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.InventoryLogService;
import com.group07.hotel_API.utils.enums.Action;
import com.group07.hotel_API.utils.mappers.InventoryLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryLogServiceImpl implements InventoryLogService {

    private final InventoryItemRepository itemRepository;
    private final UserRepository userRepository;
    private final InventoryLogRepository logRepository;

    @Override
    public List<InventoryLogResponse> getAllLogs() {
        return logRepository.findAll()
                .stream()
                .map(InventoryLogMapper::toResponse)
                .toList();
    }

    @Override
    public InventoryLogResponse getLogById(Long id) {
        InventoryLog log = logRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory log not found with ID: " + id));
        return InventoryLogMapper.toResponse(log);
    }

    public InventoryLogResponse createLog(InventoryLogRequest request) {
        InventoryItem item = itemRepository.findById(request.getItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));

        UserClient user = userRepository.findById(Math.toIntExact(request.getUserId()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        InventoryLog log = InventoryLog.builder()
                .item(item)
                .user(user)
                .action(request.getAction())
                .quantityChanged(request.getQuantityChanged())
                .timestamp(request.getTimestamp())
                .build();

        if (request.getAction() == Action.USE) {
            int newQty = item.getQuantity() - request.getQuantityChanged();
            item.setQuantity(Math.max(newQty, 0));
            itemRepository.save(item);
        }

        InventoryLog saved = logRepository.save(log);
        return InventoryLogMapper.toResponse(saved);
    }

}
