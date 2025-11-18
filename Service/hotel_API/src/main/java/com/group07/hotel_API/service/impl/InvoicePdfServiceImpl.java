package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.entities.Invoice;
import com.group07.hotel_API.entities.InvoiceDetail;
import com.group07.hotel_API.entities.Transmitter;
import com.group07.hotel_API.service.InvoicePdfService;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class InvoicePdfServiceImpl implements InvoicePdfService {

    public byte[] generateInvoicePdf(Invoice invoice) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);

        PdfWriter.getInstance(document, out);
        document.open();

        // ============================================================
        // 1. COMPANY HEADER
        // ============================================================

        Transmitter company = invoice.getTransmitter(); // tu empresa

        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD, Color.BLACK);
        Font subFont = new Font(Font.HELVETICA, 10, Font.NORMAL, Color.DARK_GRAY);

        Paragraph title = new Paragraph(company.getName(), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        document.add(new Paragraph(company.getLineOfBusiness(), subFont));
        document.add(new Paragraph("NIT: " + company.getNit(), subFont));
        document.add(new Paragraph("Phone: " + company.getPhoneNumber(), subFont));
        document.add(new Paragraph("Email: " + company.getEmail(), subFont));
        document.add(new Paragraph("Address: " + company.getAddress(), subFont));

        document.add(new Paragraph(" "));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        // ============================================================
        // 2. INVOICE HEADER
        // ============================================================

        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);

        infoTable.addCell(getCell("Invoice Code: ", PdfPCell.ALIGN_LEFT, true));
        infoTable.addCell(getCell(invoice.getCode(), PdfPCell.ALIGN_LEFT, false));

        infoTable.addCell(getCell("Client:", PdfPCell.ALIGN_LEFT, true));
        infoTable.addCell(getCell(invoice.getClientName(), PdfPCell.ALIGN_LEFT, false));

        infoTable.addCell(getCell("Email:", PdfPCell.ALIGN_LEFT, true));
        infoTable.addCell(getCell(invoice.getClientEmail(), PdfPCell.ALIGN_LEFT, false));

        infoTable.addCell(getCell("Date:", PdfPCell.ALIGN_LEFT, true));
        infoTable.addCell(getCell(invoice.getDate().toString(), PdfPCell.ALIGN_LEFT, false));

        infoTable.addCell(getCell("Reason:", PdfPCell.ALIGN_LEFT, true));
        infoTable.addCell(getCell(invoice.getReason().getName(), PdfPCell.ALIGN_LEFT, false));

        document.add(infoTable);

        document.add(new Paragraph(" "));
        document.add(new Paragraph(" "));

        // ============================================================
        // 3. DETAILS TABLE
        // ============================================================

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4, 2, 2, 2}); // producto, dias/cant, precio, subtotal

        addTableHeader(table, "Product");
        addTableHeader(table, "Qty/Days");
        addTableHeader(table, "Price");
        addTableHeader(table, "Subtotal");

        for (InvoiceDetail d : invoice.getDetails()) {
            table.addCell(getCell(d.getProductName(), PdfPCell.ALIGN_LEFT, false));
            table.addCell(getCell(String.valueOf(d.getBookingDays()), PdfPCell.ALIGN_CENTER, false));

            float priceUnit;
            if (d.getBookingDays() == 0) {
                priceUnit = d.getSubtotal(); // productos normales como room service
            } else {
                priceUnit = d.getSubtotal() / d.getBookingDays(); // dividir si es hospedaje
            }

            table.addCell(getCell(String.format("$%.2f", priceUnit), PdfPCell.ALIGN_RIGHT, false));
            table.addCell(getCell(String.format("$%.2f", d.getSubtotal()), PdfPCell.ALIGN_RIGHT, false));
        }

        document.add(table);

        document.add(new Paragraph(" "));
        document.add(new LineSeparator());
        document.add(new Paragraph(" "));

        // ============================================================
        // 4. TOTALS
        // ============================================================

        PdfPTable totalsTable = new PdfPTable(2);
        totalsTable.setWidthPercentage(40);
        totalsTable.setHorizontalAlignment(Element.ALIGN_RIGHT);

        totalsTable.addCell(getCell("Subtotal:", PdfPCell.ALIGN_RIGHT, true));
        totalsTable.addCell(getCell(String.format("$%.2f", invoice.getSubtotal()), PdfPCell.ALIGN_RIGHT, false));

        totalsTable.addCell(getCell("IVA (13%):", PdfPCell.ALIGN_RIGHT, true));
        totalsTable.addCell(getCell(String.format("$%.2f", invoice.getIVA()), PdfPCell.ALIGN_RIGHT, false));

        totalsTable.addCell(getCell("TOTAL:", PdfPCell.ALIGN_RIGHT, true));
        totalsTable.addCell(getCell(String.format("$%.2f", invoice.getTotal()), PdfPCell.ALIGN_RIGHT, false));

        document.add(totalsTable);

        document.close();
        return out.toByteArray();
    }

    // ============================================================
    // Helpers
    // ============================================================

    private PdfPCell getCell(String text, int alignment, boolean bold) {
        Font font = bold
                ? new Font(Font.HELVETICA, 10, Font.BOLD)
                : new Font(Font.HELVETICA, 10, Font.NORMAL);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setHorizontalAlignment(alignment);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private void addTableHeader(PdfPTable table, String header) {
        Font headFont = new Font(Font.HELVETICA, 11, Font.BOLD, Color.WHITE);

        PdfPCell cell = new PdfPCell(new Phrase(header, headFont));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.BLACK);
        cell.setPadding(5);

        table.addCell(cell);
    }
}
