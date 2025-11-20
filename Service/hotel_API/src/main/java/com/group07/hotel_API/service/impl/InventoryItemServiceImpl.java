package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.Inventory.InventoryItemRequest;
import com.group07.hotel_API.dto.response.Inventory.InventoryItemResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.InventoryLog;
import com.group07.hotel_API.entities.ItemCategory;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.Inventory.InventoryItemException;
import com.group07.hotel_API.exception.InventoryLog.ResourceNotFoundException;
import com.group07.hotel_API.controller.InventoryWebSocketController;
import com.group07.hotel_API.repository.InventoryItemRepository;
import com.group07.hotel_API.repository.InventoryLogRepository;
import com.group07.hotel_API.repository.ItemCategoryRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.InventoryItemService;
import com.group07.hotel_API.utils.enums.Action;
import com.group07.hotel_API.utils.enums.Status;
import com.group07.hotel_API.utils.mappers.InventoryItemMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventoryItemServiceImpl implements InventoryItemService {

    private final InventoryItemRepository repository;
    private final ItemCategoryRepository categoryRepository;
    private final InventoryLogRepository logRepository;
    private final UserRepository userRepository;
    private final InventoryWebSocketController webSocketController;
    
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


    @Override
    public InventoryItemResponse create(InventoryItemRequest request) {

        ItemCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));

        InventoryItem item = InventoryItemMapper.toEntity(request);
        item.setCategory(category);
        InventoryItem savedItem = repository.save(item);
        InventoryItemResponse response = InventoryItemMapper.toResponse(savedItem);
        
        // Notificar creación vía WebSocket
        webSocketController.notifyInventoryUpdate(response);
        webSocketController.notifyInventoryListUpdate();
        
        return response;
    }

    @Override
    public Map<String, List<InventoryItemResponse>> getGroupedByCategory() {
        List<InventoryItem> items = repository.findAll();

        return items.stream()
                .collect(Collectors.groupingBy(
                        item -> item.getCategory() != null ? item.getCategory().getName() : "Sin categoría",
                        Collectors.mapping(InventoryItemMapper::toResponse, Collectors.toList())
                ));
    }


    @Override
    public List<InventoryItemResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(InventoryItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InventoryItemResponse getById(Long id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));
        return InventoryItemMapper.toResponse(item);
    }

    @Override
    public InventoryItemResponse update(Long id, InventoryItemRequest request) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));

        item.setName(request.getName());
        item.setQuantity(request.getQuantity());
        
        if (request.getMinimumStock() != null) {
            item.setMinimumStock(request.getMinimumStock());
        }

        if (request.getStatus() != null) {
            item.setStatus(request.getStatus());
        }

        InventoryItem savedItem = repository.save(item);
        InventoryItemResponse response = InventoryItemMapper.toResponse(savedItem);
        
        // Notificar actualización vía WebSocket
        webSocketController.notifyInventoryUpdate(response);
        
        // Si el stock está bajo, notificar también
        if (savedItem.getQuantity() < savedItem.getMinimumStock()) {
            webSocketController.notifyLowStock(response);
        }
        
        webSocketController.notifyInventoryListUpdate();
        
        return response;
    }

    @Override
    @Transactional
    public void updateItemQuantity(Long id, Integer quantity) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado con id: " + id));
        
        // Validar que no sea negativo
        if (quantity < 0) {
            throw new IllegalArgumentException("La cantidad no puede ser negativa");
        }
        
        item.setQuantity(quantity);
        InventoryItem savedItem = repository.save(item);
        InventoryItemResponse response = InventoryItemMapper.toResponse(savedItem);
        
        // Notificar actualización vía WebSocket
        webSocketController.notifyInventoryUpdate(response);
        
        // Si el stock está bajo, notificar también
        if (savedItem.getQuantity() < savedItem.getMinimumStock()) {
            webSocketController.notifyLowStock(response);
        }
        
        webSocketController.notifyInventoryListUpdate();
    }

    @Override
    @Transactional
    public void updateItemQuantityWithLog(Long id, Integer quantity, Integer userId, Action action) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado con id: " + id));
        
        UserClient user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        
        int oldQuantity = item.getQuantity();
        int quantityChanged;
        int newQuantity;
        
        // Calcular nueva cantidad según la acción
        switch (action) {
            case USE:
                quantityChanged = quantity;
                if (quantity > oldQuantity) {
                    throw new IllegalArgumentException("No hay suficiente stock. Disponible: " + oldQuantity + ", Solicitado: " + quantity);
                }
                newQuantity = Math.max(oldQuantity - quantityChanged, 0);
                break;
            case ADD:
                quantityChanged = quantity;
                newQuantity = oldQuantity + quantityChanged;
                break;
            case REMOVE:
                quantityChanged = quantity;
                if (quantity > oldQuantity) {
                    throw new IllegalArgumentException("No se puede remover más cantidad de la disponible. Disponible: " + oldQuantity);
                }
                newQuantity = Math.max(oldQuantity - quantityChanged, 0);
                break;
            default:
                throw new IllegalArgumentException("Acción no válida: " + action);
        }
        
        // Validar integridad - no permitir valores negativos
        if (newQuantity < 0) {
            throw new IllegalArgumentException("La cantidad resultante no puede ser negativa");
        }
        
        // Actualizar cantidad
        item.setQuantity(newQuantity);
        InventoryItem savedItem = repository.save(item);
        
        // Crear log automáticamente
        InventoryLog log = InventoryLog.builder()
                .item(savedItem)
                .user(user)
                .action(action)
                .quantityChanged(quantityChanged)
                .timestamp(LocalDateTime.now().format(TIMESTAMP_FORMATTER))
                .build();
        logRepository.save(log);
        
        // Notificar actualización vía WebSocket
        InventoryItemResponse response = InventoryItemMapper.toResponse(savedItem);
        System.out.println("WebSocket: Enviando notificación de actualización para item ID: " + savedItem.getId() + ", cantidad: " + savedItem.getQuantity());
        webSocketController.notifyInventoryUpdate(response);
        
        // Si el stock está bajo, notificar también
        if (savedItem.getQuantity() < savedItem.getMinimumStock()) {
            System.out.println("WebSocket: Enviando notificación de stock bajo para item ID: " + savedItem.getId());
            webSocketController.notifyLowStock(response);
        }
        
        // Notificar actualización general de la lista
        System.out.println("WebSocket: Enviando notificación de actualización de lista");
        webSocketController.notifyInventoryListUpdate();
    }

    @Override
    public List<InventoryItemResponse> getLowStockItems() {
        return repository.findAll().stream()
                .filter(item -> item.getQuantity() < item.getMinimumStock())
                .map(InventoryItemMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void updateStatus(Long id, Status status) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado"));

        item.setStatus(status);
        repository.save(item);
    }

    @Override
    public void delete(Long id) {
        InventoryItem item = repository.findById(id)
                .orElseThrow(() -> new InventoryItemException("Item not found"));
        repository.delete(item);
    }


}
