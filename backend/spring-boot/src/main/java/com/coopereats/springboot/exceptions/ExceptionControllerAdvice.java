package com.coopereats.springboot.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.http.converter.HttpMessageNotReadableException; // Corrected import
import java.util.stream.Collectors;

@ControllerAdvice
public class ExceptionControllerAdvice {

    @ExceptionHandler(value = CustomException.class)
    public ResponseEntity<String> handleCustomException(CustomException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errorMessage = ex.getBindingResult().getAllErrors().stream()
                .map(error -> error.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return new ResponseEntity<>(errorMessage, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleMessageNotReadableException(HttpMessageNotReadableException ex) {
        return new ResponseEntity<>("Could not read JSON: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
