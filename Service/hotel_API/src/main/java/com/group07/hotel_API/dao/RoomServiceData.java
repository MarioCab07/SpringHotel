package com.group07.hotel_API.dao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomServiceData {
    private Integer roomServiceId;
    private Integer serviceTypeId;
    private String name;
    private Float price;
}