package com.coopereats.springboot.web;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/app")
public class AppController {

    @GetMapping(path = "/test")
    public String test(Principal principal) {
        // The `principal` may be null if the endpoint is accessed without authentication
        return principal != null ? principal.getName() : "No authenticated user";
    }
}
