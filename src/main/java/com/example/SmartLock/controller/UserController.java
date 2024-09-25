package com.example.SmartLock.controller;

import com.example.SmartLock.model.User;
import com.example.SmartLock.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/register")
    public String displayRegisterPage() {
        return "register";
    }
    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String password, @RequestParam String firstname, @RequestParam String lastname) {
        return userService.registerUser(username, password, firstname, lastname);
    }
    @GetMapping("/login")
    public String displayLoginPage() {
        return "login";
    }
    @GetMapping("/home")
    public String displayHomePage() {
        return "home";
    }
}
