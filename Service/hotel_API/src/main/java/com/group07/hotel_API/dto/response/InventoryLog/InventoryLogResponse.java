package com.group07.hotel_API.dto.response.InventoryLog;

import com.group07.hotel_API.utils.enums.Action;
import jdk.jshell.Snippet;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class InventoryLogResponse {
    private Long id;
    private String itemName;
    private String username;
    private Action action;
    private int quantityChanged;
    private String timestamp;


}
