package com.group07.hotel_API.service.impl;


import com.group07.hotel_API.configuration.EnterpriseProperties;
import com.group07.hotel_API.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {
    private final JavaMailSender mailSender;
    private final EnterpriseProperties  enterpriseProperties;

    @Async("mailExecutor")
    @Override
    public void sendEmail(String to, String subject, String text,byte[] pdfBytes,String fileName) {
        try{
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message,true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text);
            helper.setFrom(enterpriseProperties.getEmail());

            helper.addAttachment(fileName,new ByteArrayResource(pdfBytes));

            mailSender.send(message);
        }catch(MessagingException e){
            throw new RuntimeException("Error sending PDF email: " + e.getMessage());
        }
    }

    @Async("mailExecutor")
    @Override
    public void sendSimpleEmail(String to, String subject, String text){
        try{
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            message.setFrom(enterpriseProperties.getEmail());

            mailSender.send(message);
        }catch(Exception e){
            throw new RuntimeException("Error sending PDF email: " + e.getMessage());
        }



    }

}
