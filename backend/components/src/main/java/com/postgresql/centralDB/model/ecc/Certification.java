package com.postgresql.centralDB.model.ecc;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "certification")

public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("participant_id")
    @Column(name = "participant_id")
    private Long participantId;

    @JsonProperty("registration_id")
    @Column(name = "registration_id")
    private Long registration_id;

    @JsonProperty("issue_date")
    @Column(name = "issue_date")
    private String issue_date;

    @JsonProperty("expiration_date")
    @Column(name = "expiration_date", insertable = false, updatable = false)
    private String expiration_date;

    @JsonProperty("status")
    @Column(name = "status", insertable = false, updatable = false)
    private String status;

}
