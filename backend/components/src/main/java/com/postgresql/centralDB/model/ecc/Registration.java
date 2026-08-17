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
@Table(name = "registration")

public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("participant_id")
    @Column(name = "participant_id")
    private Long participantId;

    @Column(name = "course_id")
    private Long course_id;

    @Column(name = "instructor_id")
    private Long instructor_id;

    @Column(name = "registration_date")
    private String registration_date;

}
