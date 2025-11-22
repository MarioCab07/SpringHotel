package com.group07.hotel_API.controller;

import com.group07.hotel_API.dto.response.GeneralResponse;
import com.group07.hotel_API.dto.response.room_type.RoomTypeImageResponse;
import com.group07.hotel_API.service.RoomTypeImageService;
import com.group07.hotel_API.service.AuthService;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/room_type")
@RequiredArgsConstructor
public class RoomTypeImageController {

    private final RoomTypeImageService imageService;
    private final AuthService authService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(value = "/{roomTypeId}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GeneralResponse> upload(
            @PathVariable Integer roomTypeId,
            @RequestParam("file") @NotNull MultipartFile file,
            @RequestParam(value = "alt", required = false) String alt,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) throws Exception {

        // si necesitas userId o validar por rol adicional, lo obtienes así:
        Integer userId = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            userId = authService.getUserDetails(authorizationHeader.substring(7)).getUserId();
        }

        RoomTypeImageResponse res = imageService.uploadImage(roomTypeId, file, alt);

        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(HttpStatus.CREATED).body(
                GeneralResponse.builder()
                        .uri(uri)
                        .message("Image uploaded")
                        .status(HttpStatus.CREATED.value())
                        .data(res)
                        .build()
        );
    }

    @GetMapping("/{roomTypeId}/images")
    public ResponseEntity<GeneralResponse> list(@PathVariable Integer roomTypeId) {
        List<RoomTypeImageResponse> data = imageService.listByRoomType(roomTypeId);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.ok(GeneralResponse.builder()
                .uri(uri).message("Images retrieved").status(HttpStatus.OK.value()).data(data).build());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{roomTypeId}/images/{imageId}")
    public ResponseEntity<GeneralResponse> delete(
            @PathVariable Integer roomTypeId,
            @PathVariable Integer imageId,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) {
        boolean isAdmin = false;
        Integer userId = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            var user = authService.getUserDetails(authorizationHeader.substring(7));
            userId = user.getUserId();
            isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        }

        imageService.deleteImage(roomTypeId, imageId, isAdmin, userId);
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.ok(GeneralResponse.builder()
                .uri(uri).message("Image deleted").status(HttpStatus.OK.value()).data(null).build());
    }
}
