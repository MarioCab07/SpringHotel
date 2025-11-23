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
        try {
            messagingTemplate.convertAndSend("/topic/inventory/update", item);
        } catch (Exception e) {
            System.err.println("WebSocket: Error enviando actualización - " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void notifyLowStock(InventoryItemResponse item) {
        try {
            messagingTemplate.convertAndSend("/topic/inventory/low-stock", item);
        } catch (Exception e) {
            System.err.println("WebSocket: Error enviando alerta de stock bajo - " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void notifyInventoryListUpdate() {
        try {
            messagingTemplate.convertAndSend("/topic/inventory/list-update", "refresh");
        } catch (Exception e) {
            System.err.println("WebSocket: Error enviando actualización de lista - " + e.getMessage());
            e.printStackTrace();
        }
    }
}

