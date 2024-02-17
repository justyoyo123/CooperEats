package com.coopereats.springboot.exceptions;

import com.coopereats.springboot.exceptions.CustomException;

public class CustomException extends RuntimeException {
    public CustomException(String message) {
        super(message);
    }
}
