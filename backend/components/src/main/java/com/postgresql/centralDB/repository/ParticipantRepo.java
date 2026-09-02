package com.postgresql.centralDB.repository;

import java.util.Optional;
import com.postgresql.centralDB.model.ecc.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ParticipantRepo extends JpaRepository<Participant, Long> {
    Optional<Participant> findByEmailIgnoreCase(String email);
}
