package com.postgresql.centralDB.view;

import java.time.LocalDate;

public interface CertificationViewProjection {
    Long getId();
    Long getParticipantId();
    LocalDate getIssueDate();
    LocalDate getExpirationDate();
    String getComputedStatus();
    String getRegistrationId();
}
