package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.request.ItemCategory.ItemCategoryRequest;
import com.group07.hotel_API.dto.response.ItemCategory.ItemCategoryResponse;

import java.util.List;

public interface  ItemCategoryService {

    List<ItemCategoryResponse> getAllCategories();
    ItemCategoryResponse getCategoryById(Long id);
    ItemCategoryResponse createCategory(ItemCategoryRequest request);
    ItemCategoryResponse updateCategory(Long id, ItemCategoryRequest request);
    void deleteCategory(Long id);

}
