package com.postgresql.centralDB.controller.ecc;

import com.postgresql.centralDB.repository.ParticipantRepo;
import com.postgresql.centralDB.model.ecc.Participant;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin("*")
public class ParticipantController {

    @Autowired
    private ParticipantRepo participantRepo;

    // Post one entry
    @PostMapping("/participants/add")
    public ResponseEntity<Participant> add(@RequestBody Participant participant) {
        Participant response = participantRepo.save(participant);
        return ResponseEntity.ok(response);
    }

    // Post more than one entry
    @PostMapping("/participants/add/all")
    public List<Participant> addAll(@RequestBody List<Participant> participantList) {
        return participantRepo.saveAll(participantList);
    }

    // Get all data from table
    @GetMapping("/participants/fetch/all")
    public List<Participant> getAll() {
        return participantRepo.findAll();
    }

    // Get data from table by ID
    @GetMapping("/participants/fetch/{id}")
    public Participant get(@PathVariable Long id) {
        return participantRepo.findById(id).orElse(null);
    }

    @GetMapping("/participants/fetch/email/{email}")
    public Participant get(@PathVariable String email) {
        return participantRepo.findByEmailIgnoreCase(email).orElse(null);
    }

    // Update existing data
    @PutMapping("/participants/update/{id}")
    public Participant update(@PathVariable long id, @RequestBody Participant participant) {
        Participant existingData = participantRepo.findById(id).orElse(null);
        if (existingData != null) {
            existingData.setFirst_name(participant.getFirst_name());
            existingData.setLast_name(participant.getLast_name());
            existingData.setEmail(participant.getEmail());
            existingData.setTelephone(participant.getTelephone());
            participantRepo.save(existingData);
            return existingData;
        } else {
            return null;
        }
    }

    // Update existing data
    @DeleteMapping("/participants/delete/{id}")
    public void delete(@PathVariable Long id) {
        participantRepo.deleteById(id);
    }

}
