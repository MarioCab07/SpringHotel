package com.group07.hotel_API.service;

import com.group07.hotel_API.dao.InvoiceData;
import com.group07.hotel_API.entities.Invoice;

import java.util.Optional;
import java.util.UUID;

public interface InvoiceService {

    Optional<Invoice> findById(UUID id);
    Invoice createInvoice(InvoiceData invoiceData);


}
