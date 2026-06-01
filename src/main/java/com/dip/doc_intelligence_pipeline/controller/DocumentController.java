package com.dip.doc_intelligence_pipeline.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.dip.doc_intelligence_pipeline.entity.DocumentEntity;
import com.dip.doc_intelligence_pipeline.service.DocumentService;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<List<DocumentEntity>> uploadFiles(
            @RequestParam("file") MultipartFile[] files,
            @RequestParam("userEmail") String userEmail) {

        List<DocumentEntity> currentBatch = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            try {
                // Process the file
                DocumentEntity processedDoc = documentService.processNewUpload(file, userEmail);
                currentBatch.add(processedDoc);

                // --- FIX: Dynamic API Throttling ---
                // Wait 4 full seconds between files to allow Groq API limits to reset
                if (i < files.length - 1) {
                    System.out.println("Groq API Cooldown: Waiting 4 seconds...");
                    Thread.sleep(1500);
                }

            } catch (Exception e) {
                System.err.println("CRITICAL AI ERROR processing " + file.getOriginalFilename() + ": " + e.getMessage());

                // --- SDE FIX: Tell the frontend it failed! ---
                DocumentEntity failedDoc = new DocumentEntity();
                failedDoc.setFileName(file.getOriginalFilename());
                failedDoc.setStatus(com.dip.doc_intelligence_pipeline.enums.DocumentStatus.FAILED);

                Map<String, Object> errorData = new HashMap<>();
                errorData.put("Error", "AI Engine Rate Limit. Please wait 60 seconds and try again.");
                failedDoc.setExtractedData(errorData);

                currentBatch.add(failedDoc);
            }
        }
        return ResponseEntity.ok(currentBatch);
    }

    // --- FIXED: Now calling the Service layer properly ---
    @GetMapping("/history/{email}")
    public ResponseEntity<List<DocumentEntity>> getTenantHistory(@PathVariable String email) {
        return ResponseEntity.ok(documentService.getHistoryByUserEmail(email));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(documentService.getGlobalStats());
    }

    @GetMapping("/history")
    public ResponseEntity<List<DocumentEntity>> getGlobalHistory() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }
}
