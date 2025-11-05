package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.request.ItemCategory.ItemCategoryRequest;
import com.group07.hotel_API.dto.response.ItemCategory.ItemCategoryResponse;
import com.group07.hotel_API.entities.ItemCategory;
import com.group07.hotel_API.exception.ItemCategory.ItemCategoryNotFoundException;
import com.group07.hotel_API.repository.ItemCategoryRepository;
import com.group07.hotel_API.service.ItemCategoryService;
import com.group07.hotel_API.utils.mappers.ItemCategoryMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCategoryServiceImpl implements ItemCategoryService {

    private final ItemCategoryRepository itemcategoryRepository;

    @Autowired
    public ItemCategoryServiceImpl(ItemCategoryRepository itemcategoryRepository) {
        this.itemcategoryRepository = itemcategoryRepository;
    }

    @Override
    public List<ItemCategoryResponse> getAllCategories() {
        return itemcategoryRepository.findAll()
                .stream()
                .map(ItemCategoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ItemCategoryResponse getCategoryById(Long id) {
        return itemcategoryRepository.findById(id)
                .map(ItemCategoryMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    @Override
    @Transactional
    public ItemCategoryResponse createCategory(ItemCategoryRequest request) {
        var entity = ItemCategoryMapper.toEntityCreate(request);
        var saved = itemcategoryRepository.save(entity);
        return ItemCategoryMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ItemCategoryResponse updateCategory(Long id, ItemCategoryRequest request) {
        ItemCategory category = itemcategoryRepository.findById(id)
                .orElseThrow(() -> new ItemCategoryNotFoundException("Category not found with ID: " + id));

        ItemCategoryMapper.toEntityUpdate(category, request);
        return ItemCategoryMapper.toResponse(itemcategoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) {
        if (!itemcategoryRepository.existsById(id)) {
            throw new ItemCategoryNotFoundException("Category not found with ID: " + id);
        }
        itemcategoryRepository.deleteById(id);
    }


}
