package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class InventoryWebSocketController {
    
    private final SimpMessagingTemplate messagingTemplate;
    
    public void notifyInventoryUpdate(InventoryItemResponse item) {
        messagingTemplate.convertAndSend("/topic/inventory/update", item);
    }
    
    public void notifyLowStock(InventoryItemResponse item) {
        messagingTemplate.convertAndSend("/topic/inventory/low-stock", item);
    }
    
    public void notifyInventoryListUpdate() {
        messagingTemplate.convertAndSend("/topic/inventory/list-update", "refresh");
    }
}

