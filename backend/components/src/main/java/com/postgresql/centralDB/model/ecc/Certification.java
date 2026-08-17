package com.postgresql.centralDB.model.ecc;


import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@Entity
@Table(name= "certification")




public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("participant_id")
    @Column(name = "participant_id")
    private Long participantId;

    @Column(name = "course_id")
    private Long course_id;
    
    @Column(name = "issue_date")
    private String issue_date;

    @Column(name = "expiration_date")
    private String expiration_date;

    @Column (name = "status")
    private Boolean status;



}
