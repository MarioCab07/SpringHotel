package com.group07.hotel_API.dao;

import com.group07.hotel_API.entities.PaymentMethod;
import com.group07.hotel_API.entities.Reason;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class InvoiceData {
    String clientName;
    String clientEmail;
    Double total;
    Double IVA;
    Double subtotal;
    PaymentMethod paymentMethod;
    Integer idBooking;
    String  reason;
}
