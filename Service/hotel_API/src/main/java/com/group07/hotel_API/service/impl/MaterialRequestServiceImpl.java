package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.MaterialRequest.MaterialRequestRequest;
import com.group07.hotel_API.dto.response.MaterialRequest.MaterialRequestResponse;
import com.group07.hotel_API.entities.InventoryItem;
import com.group07.hotel_API.entities.InventoryLog;
import com.group07.hotel_API.entities.MaterialRequest;
import com.group07.hotel_API.entities.MaterialRequestItem;
import com.group07.hotel_API.entities.UserClient;
import com.group07.hotel_API.exception.InventoryLog.ResourceNotFoundException;
import com.group07.hotel_API.exception.MaterialRequest.InsufficientStockException;
import com.group07.hotel_API.exception.MaterialRequest.MaterialRequestNotFoundException;
import com.group07.hotel_API.repository.InventoryItemRepository;
import com.group07.hotel_API.repository.InventoryLogRepository;
import com.group07.hotel_API.repository.MaterialRequestRepository;
import com.group07.hotel_API.repository.UserRepository;
import com.group07.hotel_API.service.MaterialRequestService;
import com.group07.hotel_API.utils.enums.Action;
import com.group07.hotel_API.utils.enums.RequestStatus;
import com.group07.hotel_API.utils.mappers.MaterialRequestMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaterialRequestServiceImpl implements MaterialRequestService {

    private final MaterialRequestRepository materialRequestRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final UserRepository userRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private static final DateTimeFormatter TIMESTAMP_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional
    public MaterialRequestResponse createRequest(MaterialRequestRequest request, String username) {
        // Obtener usuario desde el username
        UserClient user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        // Validar y preparar items
        List<MaterialRequestItem> requestItems = new ArrayList<>();
        
        for (var itemRequest : request.getItems()) {
            InventoryItem item = inventoryItemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Inventory item not found with ID: " + itemRequest.getItemId()));

            // Validar que hay stock suficiente
            if (item.getQuantity() < itemRequest.getRequestedQuantity()) {
                throw new InsufficientStockException(
                        String.format("Insufficient stock for item '%s'. Available: %d, Requested: %d",
                                item.getName(), item.getQuantity(), itemRequest.getRequestedQuantity()));
            }

            // Validar que el item esté activo
            if (item.getStatus().name().equals("INACTIVE")) {
                throw new InsufficientStockException(
                        "Item '" + item.getName() + "' is not available (INACTIVE)");
            }

            MaterialRequestItem requestItem = MaterialRequestItem.builder()
                    .item(item)
                    .requestedQuantity(itemRequest.getRequestedQuantity())
                    .approvedQuantity(itemRequest.getRequestedQuantity()) // Auto-aprobar si hay stock
                    .build();

            requestItems.add(requestItem);
        }

        // Crear la solicitud
        MaterialRequest materialRequest = MaterialRequest.builder()
                .requestedBy(user)
                .requestDate(LocalDateTime.now())
                .status(RequestStatus.APPROVED) // Auto-aprobar si hay stock suficiente
                .notes(request.getNotes())
                .items(requestItems)
                .build();

        // Establecer la relación bidireccional
        requestItems.forEach(item -> item.setMaterialRequest(materialRequest));

        // Guardar la solicitud
        MaterialRequest savedRequest = materialRequestRepository.save(materialRequest);

        // Reducir stock y crear logs de inventario
        for (MaterialRequestItem requestItem : savedRequest.getItems()) {
            InventoryItem item = requestItem.getItem();
            int quantityToDeduct = requestItem.getApprovedQuantity();

            // Reducir stock
            int newQuantity = item.getQuantity() - quantityToDeduct;
            item.setQuantity(Math.max(newQuantity, 0));
            inventoryItemRepository.save(item);

            // Crear log de inventario para auditoría
            InventoryLog log = InventoryLog.builder()
                    .item(item)
                    .user(user)
                    .action(Action.USE)
                    .quantityChanged(quantityToDeduct)
                    .timestamp(LocalDateTime.now().format(TIMESTAMP_FORMATTER))
                    .build();
            inventoryLogRepository.save(log);
        }

        return MaterialRequestMapper.toResponse(savedRequest);
    }

    @Override
    public List<MaterialRequestResponse> getAllRequests() {
        return materialRequestRepository.findAll().stream()
                .map(MaterialRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MaterialRequestResponse> getMyRequests(String username) {
        UserClient user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

        return materialRequestRepository.findByRequestedByOrderByRequestDateDesc(user).stream()
                .map(MaterialRequestMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MaterialRequestResponse getRequestById(Long id) {
        MaterialRequest request = materialRequestRepository.findById(id)
                .orElseThrow(() -> new MaterialRequestNotFoundException("Material request not found with ID: " + id));
        return MaterialRequestMapper.toResponse(request);
    }

    @Override
    @Transactional
    public MaterialRequestResponse approveRequest(Long id) {
        MaterialRequest request = materialRequestRepository.findById(id)
                .orElseThrow(() -> new MaterialRequestNotFoundException("Material request not found with ID: " + id));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be approved");
        }

        // Validar stock nuevamente antes de aprobar
        for (MaterialRequestItem item : request.getItems()) {
            InventoryItem inventoryItem = item.getItem();
            if (inventoryItem.getQuantity() < item.getRequestedQuantity()) {
                throw new InsufficientStockException(
                        String.format("Insufficient stock for item '%s'. Available: %d, Requested: %d",
                                inventoryItem.getName(), inventoryItem.getQuantity(), item.getRequestedQuantity()));
            }
        }

        // Aprobar cantidades
        request.getItems().forEach(item -> 
            item.setApprovedQuantity(item.getRequestedQuantity())
        );

        request.setStatus(RequestStatus.APPROVED);
        MaterialRequest savedRequest = materialRequestRepository.save(request);

        // Reducir stock y crear logs
        UserClient user = savedRequest.getRequestedBy();
        for (MaterialRequestItem requestItem : savedRequest.getItems()) {
            InventoryItem item = requestItem.getItem();
            int quantityToDeduct = requestItem.getApprovedQuantity();

            int newQuantity = item.getQuantity() - quantityToDeduct;
            item.setQuantity(Math.max(newQuantity, 0));
            inventoryItemRepository.save(item);

            InventoryLog log = InventoryLog.builder()
                    .item(item)
                    .user(user)
                    .action(Action.USE)
                    .quantityChanged(quantityToDeduct)
                    .timestamp(LocalDateTime.now().format(TIMESTAMP_FORMATTER))
                    .build();
            inventoryLogRepository.save(log);
        }

        return MaterialRequestMapper.toResponse(savedRequest);
    }

    @Override
    @Transactional
    public MaterialRequestResponse rejectRequest(Long id) {
        MaterialRequest request = materialRequestRepository.findById(id)
                .orElseThrow(() -> new MaterialRequestNotFoundException("Material request not found with ID: " + id));

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new IllegalStateException("Only PENDING requests can be rejected");
        }

        request.setStatus(RequestStatus.REJECTED);
        MaterialRequest savedRequest = materialRequestRepository.save(request);

        return MaterialRequestMapper.toResponse(savedRequest);
    }
}


