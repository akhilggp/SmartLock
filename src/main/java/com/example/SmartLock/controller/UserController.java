package com.example.SmartLock.controller;

import com.example.SmartLock.model.User;
import com.example.SmartLock.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String password, @RequestParam String firstname, @RequestParam String lastname) {
        User user = userService.registerUser(username, password, firstname, lastname);
        return "User "+user.getFirstname()+" registered successfully";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password) {
        User user = userService.loginUser(username, password);
        return "User "+ user.getFirstname()+" logged in successfully";
    }
}
