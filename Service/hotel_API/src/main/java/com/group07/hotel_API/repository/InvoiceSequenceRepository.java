package com.group07.hotel_API.repository;

import com.group07.hotel_API.entities.InvoiceSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface InvoiceSequenceRepository extends JpaRepository<InvoiceSequence,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM InvoiceSequence s WHERE s.prefix =:prefix AND s.year = :year AND s.month = :month")
    Optional<InvoiceSequence> findByPrefixAndYearAndMonthForUpdate(@Param("prefix") String prefix,@Param("year")int year,@Param("month")int month);
}
