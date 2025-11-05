package com.group07.hotel_API.utils.beans;


import com.group07.hotel_API.utils.validators.AdultValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = AdultValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface Adult {
    String message() default "Must be an adult (18 years or older)";
    Class<?>[] groups() default {};
    Class<? extends Payload> [] payload() default {};

}
