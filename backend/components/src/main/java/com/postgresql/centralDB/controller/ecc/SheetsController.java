package com.postgresql.centralDB.controller.ecc;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/sheets")
public class SheetsController {

    private final Sheets sheetsService;

    // Spring automatically passes the getSheetsService() bean here
    public SheetsController(Sheets sheetsService) {
        this.sheetsService = sheetsService;
    }

    // Test 1: Simple health check endpoint
    @GetMapping("/status")
    public String checkStatus() {
        return "Google Sheets service is connected and ready!";
    }

    // Test 2: Read data from a specific Google Sheet
    // Example usage: 
    //http://192.168.0.67:8080/api/sheets/read?spreadsheetId=15gXnpRuAJR7hquwtdX10e1H4b28rO8UaAKf8u4W07W4&range=Form%20Responses%201!A1:J
    @GetMapping("/read")
    public List<List<Object>> readSheetData(
            @RequestParam String spreadsheetId,
            @RequestParam String range) throws IOException {

        ValueRange response = sheetsService.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute();

        return response.getValues();
    }

    
}