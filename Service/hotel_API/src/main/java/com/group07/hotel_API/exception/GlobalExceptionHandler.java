package com.group07.hotel_API.exception;


import com.group07.hotel_API.dto.response.ApiErrorResponse;
import com.group07.hotel_API.exception.Booking.BookingNotFoundException;
import com.group07.hotel_API.exception.Inventory.InventoryItemException;
import com.group07.hotel_API.exception.InventoryLog.ResourceNotFoundException;
import com.group07.hotel_API.exception.Ticket.TicketNotFoundException;
import com.group07.hotel_API.exception.role.RoleAlreadyExistsException;
import com.group07.hotel_API.exception.role.RoleNotFoundException;
import com.group07.hotel_API.exception.room.InvalidRoomStatusException;
import com.group07.hotel_API.exception.room.RoomNotFoundException;
import com.group07.hotel_API.exception.room.RoomNumberAlreadyExistsException;
import com.group07.hotel_API.exception.room_cleaning.InvalidRoomCleaningStatusException;
import com.group07.hotel_API.exception.room_cleaning.RoomCleaningNotFoundException;
import com.group07.hotel_API.exception.room_service.InvalidRoomServiceRequestException;
import com.group07.hotel_API.exception.room_service.RoomServiceNotFoundException;
import com.group07.hotel_API.exception.room_service_type.RoomServiceTypeNotFoundException;
import com.group07.hotel_API.exception.room_type.RoomTypeNotFoundException;
import com.group07.hotel_API.exception.token.TokenNotFoundException;
import com.group07.hotel_API.exception.ItemCategory.ItemCategoryNotFoundException;
import com.group07.hotel_API.exception.user.EmailAlreadyExistsException;
import com.group07.hotel_API.exception.user.UserNameAlreadyExistisException;
import com.group07.hotel_API.exception.user.UserNotFoundException;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDate;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ItemCategoryNotFoundException.class)
    public ResponseEntity<String> handleCategoryNotFound(ItemCategoryNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValueOfEntity(MethodArgumentNotValidException e){
        List<String> errors = e.getFieldErrors().stream().map(
                error -> error.getField() + ": "+error.getDefaultMessage()
        ).toList();

        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,errors);
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException e){
        return buildErrorResponse(e,HttpStatus.CONFLICT,e.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleInventoryLogNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNotFound(UserNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(UserNameAlreadyExistisException.class)
    public ResponseEntity<ApiErrorResponse> handleUserNameAlreadyExists(UserNameAlreadyExistisException e){
        return buildErrorResponse(e,HttpStatus.CONFLICT,e.getMessage());
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ApiErrorResponse> hanldeAuthorizationDenied(AuthorizationDeniedException e){
        return buildErrorResponse(e,HttpStatus.FORBIDDEN,e.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException e){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,e.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException e){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,"Invalid request body");
    }

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleBookingNotFound(BookingNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(InventoryItemException.class)
    public ResponseEntity<ApiErrorResponse> handleInventoryItemException(InventoryItemException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(RoleAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleRoleAlreadyExists(RoleAlreadyExistsException e){
        return buildErrorResponse(e,HttpStatus.CONFLICT,e.getMessage());
    }

    @ExceptionHandler(RoleNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoleNotFound(RoleNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(InvalidRoomStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRoomStatus(InvalidRoomStatusException e){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,"Invalid room Status");
    }

    @ExceptionHandler(RoomNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomNotFound(RoomNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(RoomNumberAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomNumberAlreadyExists(RoomNumberAlreadyExistsException e){
        return buildErrorResponse(e,HttpStatus.CONFLICT,e.getMessage());
    }

    @ExceptionHandler(InvalidRoomCleaningStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRoomCleaningStatus(InvalidRoomCleaningStatusException e){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,e.getMessage());
    }

    @ExceptionHandler(RoomCleaningNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomCleaningNotFound(RoomCleaningNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(InvalidRoomServiceRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRoomServiceRequest(InvalidRoomServiceRequestException e){
        return buildErrorResponse(e,HttpStatus.BAD_REQUEST,e.getMessage());
    }

    @ExceptionHandler(RoomServiceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomServiceNotFound(RoomServiceNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(RoomServiceTypeNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomServiceTypeNotFound(RoomServiceTypeNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(RoomTypeNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleRoomTypeNotFound(RoomTypeNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleTicketNotFound(TicketNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    @ExceptionHandler(TokenNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleTokenNotFound(TokenNotFoundException e){
        return buildErrorResponse(e,HttpStatus.NOT_FOUND,e.getMessage());
    }

    public ResponseEntity<ApiErrorResponse> buildErrorResponse(Exception e, HttpStatus status, Object data){
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().build().getPath();
        return ResponseEntity.status(status).body(ApiErrorResponse.builder()
                .message(data)
                .status(status.value())
                .time(LocalDate.now().toString())
                .uri(uri)
                .build()
        );
    }
}
