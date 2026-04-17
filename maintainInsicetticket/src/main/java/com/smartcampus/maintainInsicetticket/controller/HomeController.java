package com.smartcampus.maintainInsicetticket.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:55747"})
public class HomeController {

    @GetMapping
    public String home() {
        return "Smart Campus Maintenance System API is running!";
    }

    @GetMapping("/favicon.ico")
    public void favicon() {
        // Return empty response for favicon to avoid 404 errors
    }
}
