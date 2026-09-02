package com.postgresql.centralDB.controller.ecc;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/sheets")
@CrossOrigin("*")
public class SheetsController {

    private static final String SPREADSHEET_ID = "15gXnpRuAJR7hquwtdX10e1H4b28rO8UaAKf8u4W07W4";
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

    @GetMapping("/read/{day}/{month}/{year}")
    public List<List<Object>> readSheetData(
            @PathVariable String day,
            @PathVariable String month,
            @PathVariable String year) throws IOException {

        String spreadsheetId = SPREADSHEET_ID;
        String range = "Form Responses 1!A1:K";
        ValueRange response = sheetsService.spreadsheets().values()
                .get(spreadsheetId, range)
                .execute();

        List<List<Object>> allRows = response.getValues();
        List<List<Object>> filteredRows = new ArrayList<>();

        if (allRows == null || allRows.isEmpty()) {
            return filteredRows;
        }

        // Keep the header row, add a label for the new column
        List<Object> header = new ArrayList<>(allRows.get(0));
        header.add("Row Number");
        filteredRows.add(header);

        int targetDay = Integer.parseInt(day);
        int targetMonth = Integer.parseInt(month);
        int targetYear = Integer.parseInt(year);

        for (int i = 1; i < allRows.size(); i++) {
            List<Object> row = allRows.get(i);
            if (row.isEmpty() || row.get(0) == null) {
                continue;
            }

            String timestamp = row.get(0).toString();
            String datePart = timestamp.split(" ")[0];
            String[] dateComponents = datePart.split("/");

            if (dateComponents.length != 3) {
                continue;
            }

            int rowMonth = Integer.parseInt(dateComponents[0]);
            int rowDay = Integer.parseInt(dateComponents[1]);
            int rowYear = Integer.parseInt(dateComponents[2]);

            if (rowDay == targetDay && rowMonth == targetMonth && rowYear == targetYear) {
                List<Object> rowWithIndex = new ArrayList<>(row);
                rowWithIndex.add(i + 1); // actual sheet row number (1-indexed)
                filteredRows.add(rowWithIndex);
            }
        }

        return filteredRows;
    }

    @PostMapping("/write/{cell}/{value}")
    public String writeToCell(
            @PathVariable String cell, // e.g. "K5"
            @PathVariable String value) throws IOException {

        String range = "Form Responses 1!" + cell; // e.g. "Form Responses 1!K5"

        ValueRange body = new ValueRange()
                .setValues(Collections.singletonList(
                        Collections.singletonList(value)));

        sheetsService.spreadsheets().values()
                .update(SPREADSHEET_ID, range, body)
                .setValueInputOption("USER_ENTERED") // or "RAW"
                .execute();

        return "Cell " + cell + " updated successfully";
    }

}