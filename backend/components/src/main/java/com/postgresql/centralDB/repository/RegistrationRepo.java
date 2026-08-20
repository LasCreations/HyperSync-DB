package com.postgresql.centralDB.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import java.util.List;

import com.postgresql.centralDB.model.ecc.Registration;



@RepositoryRestResource
public interface RegistrationRepo extends JpaRepository<Registration, Long> {
    List<Registration> findByParticipantId(Long participantId);
    void deleteByParticipantId(Long participant_id);

    
}


