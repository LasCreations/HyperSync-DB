package com.postgresql.centralDB.repository;

import com.postgresql.centralDB.model.ecc.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ParticipantRepo extends JpaRepository<Participant, Long> {
}
