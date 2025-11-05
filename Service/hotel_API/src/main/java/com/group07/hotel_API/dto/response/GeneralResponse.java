package com.group07.hotel_API.dto.response;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class GeneralResponse {
    private String uri;
    private String message;
    private int status;
    private Object data;
    private LocalDate time = LocalDate.now();
}
