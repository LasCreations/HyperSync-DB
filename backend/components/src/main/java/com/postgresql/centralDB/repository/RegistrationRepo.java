package com.postgresql.centralDB.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.postgresql.centralDB.model.ecc.Registration;

@RepositoryRestResource
public interface RegistrationRepo extends JpaRepository<Registration, Long> {

}
