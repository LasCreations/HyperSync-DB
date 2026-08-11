package com.postgresql.centralDB.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.postgresql.centralDB.model.ecc.Instructor;

public interface InstructorRepo extends JpaRepository<Instructor, Long> {

}
