package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.InvoiceDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InvoiceDetailRepository extends JpaRepository<InvoiceDetail, UUID> {
}
