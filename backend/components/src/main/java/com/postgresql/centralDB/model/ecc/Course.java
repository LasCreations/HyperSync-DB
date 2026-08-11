package com.postgresql.centralDB.model.ecc;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name= "course")


public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "course_name")
    private String course_name;
}