package com.group07.hotel_API.dao;

import com.group07.hotel_API.entities.Reason;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceData {
    String clientName;
    String clientEmail;
    Double total;
    Double IVA;
    Double subtotal;
    Long idPaymentMethod;
    Integer idBooking;
    String  reason;
}
