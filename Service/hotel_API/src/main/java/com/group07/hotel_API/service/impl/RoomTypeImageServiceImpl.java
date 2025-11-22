package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dto.response.room_type.RoomTypeImageResponse;
import com.group07.hotel_API.entities.RoomType;
import com.group07.hotel_API.entities.RoomTypeImage;
import com.group07.hotel_API.exception.room_type.RoomTypeNotFoundException;
import com.group07.hotel_API.exception.room_type.RoomTypeImageNotFoundException;
import com.group07.hotel_API.repository.RoomTypeImageRepository;
import com.group07.hotel_API.repository.RoomTypeRepository;
import com.group07.hotel_API.service.CloudinaryService;
import com.group07.hotel_API.service.RoomTypeImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomTypeImageServiceImpl implements RoomTypeImageService {

    private final RoomTypeImageRepository imageRepo;
    private final RoomTypeRepository roomTypeRepo;
    private final CloudinaryService cloudinaryService;

    @Override
    @Transactional
    public RoomTypeImageResponse uploadImage(Integer roomTypeId, MultipartFile file, String altText) throws Exception {
        RoomType rt = roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found: " + roomTypeId));

        Map<String, Object> uploadResult = cloudinaryService.upload(file, "room_type_" + roomTypeId);

        String url = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");

        RoomTypeImage img = RoomTypeImage.builder()
                .url(url)
                .publicId(publicId)
                .altText(altText)
                .roomType(rt)
                .build();

        RoomTypeImage saved = imageRepo.save(img);

        return RoomTypeImageResponse.builder()
                .id(saved.getId())
                .url(saved.getUrl())
                .publicId(saved.getPublicId())
                .altText(saved.getAltText())
                .build();
    }

    @Override
    public List<RoomTypeImageResponse> listByRoomType(Integer roomTypeId) {
        // valida existencia del room type
        roomTypeRepo.findById(roomTypeId)
                .orElseThrow(() -> new RoomTypeNotFoundException("Room type not found: " + roomTypeId));

        return imageRepo.findByRoomType_IdOrderByIdAsc(roomTypeId)
                .stream()
                .map(i -> RoomTypeImageResponse.builder()
                        .id(i.getId())
                        .url(i.getUrl())
                        .publicId(i.getPublicId())
                        .altText(i.getAltText())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteImage(Integer roomTypeId, Integer imageId, boolean isAdmin, Integer userId) {
        RoomTypeImage img = imageRepo.findById(imageId)
                .orElseThrow(() -> new RoomTypeImageNotFoundException("Image not found: " + imageId));

        if (!img.getRoomType().getId().equals(roomTypeId)) {
            throw new RoomTypeImageNotFoundException("Image does not belong to room type");
        }

        // policy: only ADMIN can delete images OR you can extend to allow uploader to delete (if you store owner)
        if (!isAdmin) {
            throw new RuntimeException("No permission to delete image");
        }

        // primero eliminar en Cloudinary (si publicId existe)
        try {
            if (img.getPublicId() != null && !img.getPublicId().isBlank()) {
                cloudinaryService.destroy(img.getPublicId());
            }
        } catch (Exception e) {
            // log y seguir (no bloquear) o lanzar según tu política
            // throw new RuntimeException("Failed to remove image from cloudinary", e);
        }

        imageRepo.delete(img);
    }
}
