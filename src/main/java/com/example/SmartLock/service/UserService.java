package com.example.SmartLock.service;

import com.example.SmartLock.model.User;
import com.example.SmartLock.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public String registerUser(String username, String password, String firstname, String lastname) {
        if (userRepository.findByUsername(username) != null) {
            return "User already exists";
        }
        User user = new User(username, bCryptPasswordEncoder.encode(password), firstname, lastname);
        userRepository.save(user);
        return "User "+ user.getFirstname()+" registered in successfully";
    }

    public String loginUser(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && bCryptPasswordEncoder.matches(password, user.getPassword())) {
            return "User "+ user.getFirstname()+" logged in successfully";
        }
        return "Invalid username or password";
    }
}
