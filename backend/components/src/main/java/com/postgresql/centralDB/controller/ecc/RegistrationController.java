package com.postgresql.centralDB.controller.ecc;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import jakarta.transaction.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

import com.postgresql.centralDB.model.ecc.Registration;
import com.postgresql.centralDB.repository.RegistrationRepo;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")

public class RegistrationController {

    @Autowired
    private RegistrationRepo registrationRepo;

    //Post one entry
    @PostMapping("/registrations/add")
    public ResponseEntity<Registration> add(@RequestBody Registration registration) {
        Registration response = registrationRepo.save(registration);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/registrations/delete/participant/{participant_id}")
    @Transactional
    public ResponseEntity<Void> deleteByParticipant(@PathVariable Long participant_id) {
        registrationRepo.deleteByParticipantId(participant_id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/registrations/participant/{participant_id}")
    public ResponseEntity<List<Registration>> getByParticipant(@PathVariable Long participant_id) {
        List<Registration> registrations = registrationRepo.findByParticipantId(participant_id);
        return ResponseEntity.ok(registrations);
    }
}
