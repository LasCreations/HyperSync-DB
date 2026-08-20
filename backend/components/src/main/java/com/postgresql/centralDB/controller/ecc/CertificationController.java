package com.postgresql.centralDB.controller.ecc;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.postgresql.centralDB.dto.ecc.ExpiringCertificateDTO;
import com.postgresql.centralDB.model.ecc.Certification;
import com.postgresql.centralDB.repository.CertificationRepo;
import com.postgresql.centralDB.view.CertificationViewProjection;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")

public class CertificationController {
    @Autowired
    private CertificationRepo certificationRepo;

    @PostMapping("/certification/add")
    public ResponseEntity<?> add(@RequestBody Certification certification) {
        try {
            certificationRepo.insertCertification(
                    certification.getRegistration_id(),
                    certification.getIssue_date(),
                    certification.getParticipantId()
            );

            return ResponseEntity.ok("{\"message\": \"Certification added successfully\"}");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error inserting certification: " + e.getMessage());
        }
    }

    @GetMapping("/certification/fetch/all")
    public List<Certification> getAll() {
        return certificationRepo.findAllFromView();
    }

    // @GetMapping("/certification/fetch/participant/{participantId}")
    // public List<Certification> getByParticipantId(@PathVariable Long participantId) {
    //     return certificationRepo.findByParticipantIdFromView(participantId);
    // }

    
    @Transactional // Ensures cascading deletes execute within a single database transaction
    @DeleteMapping("/certifications/delete/participant/{participant_id}")
    public ResponseEntity<Void> delete(@PathVariable("participant_id") Long id) {
        certificationRepo.deleteAllByParticipantId(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/certification/fetch/participant/{participantId}")
    public List<CertificationViewProjection> getViewByParticipantId(@PathVariable Long participantId) {
        return certificationRepo.findViewByParticipantIdFromView(participantId);
    }

    @GetMapping("/reports/expiring")
    public ResponseEntity<List<ExpiringCertificateDTO>> getExpiringCertificates(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        
        List<ExpiringCertificateDTO> reportData = 
                certificationRepo.findExpiringCertificatesByMonthAndYear(month, year);
        return ResponseEntity.ok(reportData);
    }
}
