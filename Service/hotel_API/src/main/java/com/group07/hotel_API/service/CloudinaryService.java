package com.group07.hotel_API.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryService {

    Map<String, Object> upload(MultipartFile file, String folder) throws IOException;

    Map<String, Object> destroy(String publicId) throws Exception;
}
