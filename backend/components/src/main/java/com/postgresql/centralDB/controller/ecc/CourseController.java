package com.postgresql.centralDB.controller.ecc;

import java.util.List;

import com.postgresql.centralDB.repository.CourseRepo;
import com.postgresql.centralDB.model.ecc.Course;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")


public class CourseController{

    @Autowired
    private CourseRepo courseRepo;

    //Get all data from table
    @GetMapping("/courses/fetch/all")
    public List<Course> getAll(){
        return courseRepo.findAll();
    }


    
}