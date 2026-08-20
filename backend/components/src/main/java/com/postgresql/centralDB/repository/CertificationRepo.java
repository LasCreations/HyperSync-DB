package com.postgresql.centralDB.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.postgresql.centralDB.dto.ecc.ExpiringCertificateDTO;
import com.postgresql.centralDB.model.ecc.Certification;
import com.postgresql.centralDB.view.CertificationViewProjection;

import jakarta.transaction.Transactional;

@RepositoryRestResource
public interface CertificationRepo extends JpaRepository<Certification, Long> {

        @Modifying
        @Transactional
        @Query(value = "INSERT INTO certification (registration_id, issue_date, participant_id) " +
                        "VALUES (:registrationId, CAST(:issueDate AS date), :participantId)", nativeQuery = true)
        void insertCertification(
                        @Param("registrationId") Long registrationId,
                        @Param("issueDate") String issueDate,
                        @Param("participantId") Long participantId);

        // Query from the view, mapping results directly into Certification objects
        @Query(value = "SELECT * FROM certification_status_view", nativeQuery = true)
        List<Certification> findAllFromView();

        // Fetch by participant_id from the view
        @Query(value = "SELECT * FROM certification_status_view WHERE participant_id = :participantId", nativeQuery = true)
        List<Certification> findByParticipantIdFromView(@Param("participantId") Long participantId);

        // Fetch by course_id from the view
        @Query(value = "SELECT * FROM certification_status_view WHERE course_id = :courseId", nativeQuery = true)
        List<Certification> findByCourseIdFromView(@Param("courseId") Long courseId);

        // Fetch by course_id from the view
        @Query(value = "SELECT * FROM certification_status_view WHERE registration_id = :registrationId", nativeQuery = true)
        List<Certification> findByRegistrationIdFromView(@Param("registrationId") Long registrationId);

        // CertificationRepo
        @Modifying
        @Transactional
        @Query(value = "DELETE FROM certification WHERE participant_id = :participantId", nativeQuery = true)
        void deleteAllByParticipantId(@Param("participantId") Long participantId);

        @Query(value = "SELECT * FROM certification_status_view WHERE participant_id = :participantId", nativeQuery = true)
        List<CertificationViewProjection> findViewByParticipantIdFromView(@Param("participantId") Long participantId);

        @Query(value = "SELECT p.first_name AS firstName, p.last_name AS lastName, p.email AS email, " +
                        "c.expiration_date AS expirationDate, cs.course_name AS courseName " +
                        "FROM certification_status_view c " +
                        "JOIN registration r ON c.registration_id = r.id " +
                        "JOIN participant p ON c.participant_id = p.id " +
                        "JOIN course cs ON r.course_id = cs.id " +
                        "WHERE EXTRACT(MONTH FROM CAST(c.expiration_date AS date)) = :month " +
                        "AND EXTRACT(YEAR FROM CAST(c.expiration_date AS date)) = :year", nativeQuery = true)
        List<ExpiringCertificateDTO> findExpiringCertificatesByMonthAndYear(@Param("month") int month,
                        @Param("year") int year);
}
