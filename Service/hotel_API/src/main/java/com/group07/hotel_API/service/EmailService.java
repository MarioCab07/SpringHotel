package com.group07.hotel_API.service;

public interface EmailService {
     void sendEmail(String to, String subject, String body,byte[]pdfBytes,String fileName);

}
