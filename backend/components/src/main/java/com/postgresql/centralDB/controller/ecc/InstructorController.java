package com.postgresql.centralDB.controller.ecc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.postgresql.centralDB.model.ecc.Instructor;
import com.postgresql.centralDB.repository.InstructorRepo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")

public class InstructorController {

    @Autowired
    private InstructorRepo instructorRepo;

    //Get all data from table
    @GetMapping("/instructors/fetch/all")
    public List<Instructor> getAll() {
        return instructorRepo.findAll();
    }

}
