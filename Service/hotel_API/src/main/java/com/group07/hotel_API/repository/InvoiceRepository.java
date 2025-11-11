package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {

}
