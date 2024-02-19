package com.coopereats.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import org.springframework.stereotype.Component;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}
}
