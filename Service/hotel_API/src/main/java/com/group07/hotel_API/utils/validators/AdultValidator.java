package com.group07.hotel_API.utils.validators;

import com.group07.hotel_API.utils.beans.Adult;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;

public class AdultValidator implements ConstraintValidator<Adult, LocalDate> {
    @Override
    public boolean isValid(LocalDate dateBirth, ConstraintValidatorContext context){
        if(dateBirth ==null){
            return true;
        }

        return dateBirth.plusYears(18).isBefore(LocalDate.now())
                || dateBirth.plusYears(18).isEqual(LocalDate.now());
    }
}
