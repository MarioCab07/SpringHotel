package com.group07.hotel_API.service;

import com.group07.hotel_API.dto.response.room_type.RoomTypeImageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RoomTypeImageService {
    RoomTypeImageResponse uploadImage(Integer roomTypeId, MultipartFile file, String altText) throws Exception;
    List<RoomTypeImageResponse> listByRoomType(Integer roomTypeId);
    void deleteImage(Integer roomTypeId, Integer imageId, boolean isAdmin, Integer userId);
}
