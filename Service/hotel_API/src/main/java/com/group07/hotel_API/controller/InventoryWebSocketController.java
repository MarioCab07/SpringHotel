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
        System.out.println("InventoryWebSocketController: Enviando notificación a /topic/inventory/update para item: " + item.getName() + " (ID: " + item.getId() + ")");
        System.out.println("InventoryWebSocketController: Item completo: " + item.toString());
        try {
            messagingTemplate.convertAndSend("/topic/inventory/update", item);
            System.out.println("InventoryWebSocketController: Mensaje enviado exitosamente");
        } catch (Exception e) {
            System.err.println("InventoryWebSocketController: Error enviando mensaje: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    public void notifyLowStock(InventoryItemResponse item) {
        System.out.println("InventoryWebSocketController: Enviando notificación de stock bajo a /topic/inventory/low-stock para item: " + item.getName());
        messagingTemplate.convertAndSend("/topic/inventory/low-stock", item);
    }
    
    public void notifyInventoryListUpdate() {
        System.out.println("InventoryWebSocketController: Enviando notificación de actualización de lista a /topic/inventory/list-update");
        messagingTemplate.convertAndSend("/topic/inventory/list-update", "refresh");
    }
}

