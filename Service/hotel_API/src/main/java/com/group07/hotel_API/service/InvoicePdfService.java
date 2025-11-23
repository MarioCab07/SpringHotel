package com.group07.hotel_API.service;

import com.group07.hotel_API.entities.Invoice;

public interface InvoicePdfService {
    byte[] generateInvoicePdf(Invoice invoice);
}
