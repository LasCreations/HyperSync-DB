package com.postgresql.centralDB.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.postgresql.centralDB.model.User;
import com.postgresql.centralDB.repository.UserRepo;

public class UserController {
    @Autowired
    private UserRepo userRepo;

    // Post one entry
    @PostMapping("/users/add")
    public ResponseEntity<User> add(@RequestBody User user) {
        User response = userRepo.save(user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/users/fetch/username/{username}")
    public User get(@PathVariable String username) {
        return userRepo.findByUsernameIgnoreCase(username).orElse(null);
    }

    @DeleteMapping("/users/delete/{id}")
    public void delete(@PathVariable Long id) {
        userRepo.deleteById(id);
    }

}
