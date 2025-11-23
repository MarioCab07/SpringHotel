package com.group07.hotel_API.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.group07.hotel_API.service.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;
    private final String defaultFolder = "hotel_app/room_images"; // puedes cambiarlo con @Value si quieres

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public Map<String, Object> upload(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String targetFolder = (folder != null && !folder.isBlank()) ? defaultFolder + "/" + folder : defaultFolder;

        Map options = ObjectUtils.asMap(
                "folder", targetFolder,
                "use_filename", true,
                "unique_filename", true,
                "resource_type", "image"
        );

        // sube los bytes y devuelve el mapa con secure_url, public_id, etc.
        return cloudinary.uploader().upload(file.getBytes(), options);
    }

    @Override
    public Map<String, Object> destroy(String publicId) throws Exception {
        if (publicId == null || publicId.isBlank()) {
            throw new IllegalArgumentException("publicId is required");
        }
        return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}
