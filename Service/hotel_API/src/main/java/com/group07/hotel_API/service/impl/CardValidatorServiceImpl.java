package com.group07.hotel_API.service.impl;

import com.group07.hotel_API.service.CardValidatorService;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
public class CardValidatorServiceImpl implements CardValidatorService {

    @Override
    public boolean luhnCheck(String number) {
        int sum = 0;
        boolean alternate = false;
        for (int i = number.length() - 1; i >= 0; i--) {
            int n = Character.getNumericValue(number.charAt(i));
            if (alternate) {
                n *= 2;
                if (n > 9) n -= 9;
            }
            sum += n;
            alternate = !alternate;
        }
        return sum % 10 == 0;
    }

    @Override
    public boolean isValidExpiry(Integer month, Integer year) {
        if (month == null || year == null) return false;
        if (month < 1 || month > 12) return false;
        YearMonth now = YearMonth.now();
        YearMonth then = YearMonth.of(year, month);
        return !then.isBefore(now);
    }

    @Override
    public boolean isValidCvv(String cvv) {
        return cvv != null && cvv.matches("\\d{3,4}");
    }

    @Override
    public String getBrand(String number) {
        if (number == null || number.isEmpty()) return "DESCONOCIDA";
        number = number.replaceAll("\\s+", "");

        if (number.startsWith("4")) return "VISA";
        if (number.matches("^5[1-5].*")) return "MASTERCARD";
        if (number.matches("^3[47].*")) return "AMEX";
        if (number.matches("^3(?:0[0-5]|[68]).*")) return "DINERS CLUB";
        if (number.matches("^35(2[89]|[3-8][0-9]).*")) return "JCB";
        if (number.matches("^6(?:011|5).*")) return "DISCOVER";
        if (number.matches("^62.*")) return "UNIONPAY";
        if (number.matches("^7.*")) return "FUEL CARD / PRIVATE";
        return "DESCONOCIDA";
    }

    @Override
    public String last4(String number) {
        return number.substring(Math.max(number.length() - 4, 0));
    }
}
