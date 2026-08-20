package com.postgresql.centralDB.dto.ecc;

public class ExpiringCertificateDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String CourseName;
    private String expirationDate;

    public ExpiringCertificateDTO(String firstName, String lastName, String email, String CourseName, String expirationDate) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.expirationDate = expirationDate;
        this.CourseName = CourseName;
    }

    // Getters and Setters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getExpirationDate() { return expirationDate; }
    public String getCourseName() { return CourseName; }
}
