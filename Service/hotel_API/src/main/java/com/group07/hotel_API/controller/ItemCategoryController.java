package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.request.ItemCategory.ItemCategoryRequest;
import com.group07.hotel_API.dto.response.ItemCategory.ItemCategoryResponse;
import com.group07.hotel_API.service.ItemCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory/category")
@RequiredArgsConstructor
public class ItemCategoryController {

    private final ItemCategoryService itemCategoryService;

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @GetMapping
    public ResponseEntity<List<ItemCategoryResponse>> getAll() {
        return ResponseEntity.ok(itemCategoryService.getAllCategories());
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @GetMapping("/{id}")
    public ResponseEntity<ItemCategoryResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(itemCategoryService.getCategoryById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ItemCategoryResponse> create(@Valid @RequestBody ItemCategoryRequest request) {
        return ResponseEntity.ok(itemCategoryService.createCategory(request));
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'CLEANING_STAFF')")
    @PutMapping("/{id}")
    public ResponseEntity<ItemCategoryResponse> update(@PathVariable Long id, @Valid @RequestBody ItemCategoryRequest request) {
        return ResponseEntity.ok(itemCategoryService.updateCategory(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }


}
