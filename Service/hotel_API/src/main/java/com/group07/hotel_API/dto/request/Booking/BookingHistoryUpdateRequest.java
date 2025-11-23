package com.group07.hotel_API.dto.request.Booking;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class BookingHistoryUpdateRequest {
    // Información de servicios a actualizar
    private List<Integer> serviceTypeIds; // IDs de los tipos de servicio a mantener/agregar
    
    // Montos manuales (opcional, si se quiere sobrescribir el cálculo automático)
    private BigDecimal subtotalRoom;
    private BigDecimal subtotalServices;
    private BigDecimal iva;
    
    // Si se debe recalcular automáticamente la factura
    private Boolean recalculateInvoice;
}

