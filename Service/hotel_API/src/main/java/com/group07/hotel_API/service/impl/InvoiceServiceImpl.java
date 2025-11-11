package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.dao.InvoiceData;
import com.group07.hotel_API.entities.*;
import com.group07.hotel_API.exception.Booking.BookingNotFoundException;
import com.group07.hotel_API.repository.*;
import com.group07.hotel_API.service.InvoiceService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceSequenceRepository invoiceSequenceRepository;
    private final InvoiceRepository invoiceRepository;
    private final BookingRepository bookingRepository;
    private final TransmitterRepository transmitterRepository;
    private final ReasonRepository reasonRepository;
    private final PaymentMethodRepository paymentMethodRepository;

    @Transactional
    private String createInvoiceSequence() {
        LocalDateTime now = LocalDateTime.now();
        String prefix = "F";

        InvoiceSequence sequence = invoiceSequenceRepository.findByPrefixAndYearAndMonthForUpdate(prefix,now.getYear(),now.getMonthValue()).orElseGet(()->{
            InvoiceSequence invoiceSequence = new InvoiceSequence();
            invoiceSequence.setPrefix(prefix);
            invoiceSequence.setYear(now.getYear());
            invoiceSequence.setMonth(now.getMonthValue());
            invoiceSequence.setCurrentNumber(0);
            return invoiceSequenceRepository.save(invoiceSequence);
        });

        int nextNumber = sequence.getCurrentNumber() + 1;
        sequence.setCurrentNumber(nextNumber);
        invoiceSequenceRepository.save(sequence);

       return String.format("%s-%03d-%02d%02d",prefix, nextNumber, now.getMonthValue(), now.getYear() % 100);

    }

    public Optional<Invoice> findById(UUID id) {
        return invoiceRepository.findById(id);
    }

    public Invoice createInvoice(InvoiceData invoiceData){
        String code = createInvoiceSequence();

        Booking booking = bookingRepository.findById(invoiceData.getIdBooking()).orElseThrow(()-> new BookingNotFoundException("Booking not found"));
        Transmitter enterprise =  transmitterRepository.findByName("Lume Hotel & Suits").orElseThrow(()-> new RuntimeException("Transmitter not found"));
        Reason reason = reasonRepository.findByName(invoiceData.getReason()).orElseThrow(()-> new RuntimeException("Reason not found"));
        PaymentMethod paymentMethod = paymentMethodRepository.findById(invoiceData.getIdPaymentMethod());

        Invoice invoice = Invoice.builder().code(code).clientName(invoiceData.getClientName()).clientEmail(invoiceData.getClientEmail())
                .transmitter(enterprise).total(invoiceData.getTotal()).IVA(invoiceData.getIVA()).subtotal(invoiceData.getSubtotal()).reason(reason)
                .date(LocalDateTime.now()).paymentMethod(paymentMethod).booking(booking).build();
        return invoiceRepository.save(invoice);

    }


}
