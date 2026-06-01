package com.dip.doc_intelligence_pipeline.service;

import com.dip.doc_intelligence_pipeline.entity.DocumentEntity;
import com.dip.doc_intelligence_pipeline.enums.DocumentStatus;
import com.dip.doc_intelligence_pipeline.repository.DocumentRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StorageService storageService;
    private final PdfExtractionService pdfExtractionService;
    private final AiExtractionService aiExtractionService;
    private final OfficeExtractionService officeExtractionService;
    private final ObjectMapper objectMapper;

    public Map<String, Object> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDocs", documentRepository.countProcessedDocuments());
        Double totalSum = documentRepository.sumTotalAmount();
        stats.put("totalAmount", totalSum != null ? totalSum : 0.0);
        return stats;
    }

    public DocumentEntity processNewUpload(MultipartFile file, String userEmail) {
        try {
            String hash = calculateFileHash(file);

            // --- SECURITY FIX: Only check for duplicates within THIS user's account ---
            Optional<DocumentEntity> existingDoc = documentRepository.findByFileHashAndUserEmail(hash, userEmail);

            if (existingDoc.isPresent()) {
                DocumentEntity duplicateResponse = new DocumentEntity();
                duplicateResponse.setFileName(file.getOriginalFilename());
                duplicateResponse.setStatus(DocumentStatus.DUPLICATE);
                Map<String, Object> duplicateMessage = new HashMap<>();
                duplicateMessage.put("message", "Data is same as " + existingDoc.get().getFileName());
                duplicateResponse.setExtractedData(duplicateMessage);
                return duplicateResponse;
            }

            String storagePath = storageService.store(file);
            DocumentEntity doc = new DocumentEntity();
            doc.setUserEmail(userEmail);
            doc.setFileName(file.getOriginalFilename());
            doc.setFileHash(hash);
            doc.setStoragePath(storagePath);
            doc.setStatus(DocumentStatus.UPLOADED);

            doc = documentRepository.save(doc);

            // Omni-channel routing
            String rawText = "";
            String lowercaseName = file.getOriginalFilename().toLowerCase();
            if (lowercaseName.endsWith(".pdf")) {
                rawText = pdfExtractionService.extractText(file);
            } else if (lowercaseName.endsWith(".docx") || lowercaseName.endsWith(".xlsx")) {
                rawText = officeExtractionService.extractText(file);
            } else {
                rawText = new String(file.getBytes());
            }

            String aiJsonResult = aiExtractionService.extractDataWithLlama(rawText);
            Map<String, Object> mappedIntelligence = objectMapper.readValue(aiJsonResult, new TypeReference<Map<String, Object>>() {
            });

            doc.setExtractedData(mappedIntelligence);
            doc.setStatus(DocumentStatus.PROCESSED);
            return documentRepository.saveAndFlush(doc);

        } catch (Exception e) {
            throw new RuntimeException("Failed to process document", e);
        }
    }

    private String calculateFileHash(MultipartFile file) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        return String.format("%064x", new BigInteger(1, digest.digest(file.getBytes())));
    }

    // --- COMPILATION FIX: Added the method requested by DocumentController ---
    public List<DocumentEntity> getHistoryByUserEmail(String email) {
        return documentRepository.findByUserEmailOrderByIdDesc(email);
    }

    public List<DocumentEntity> getAllDocuments() {
        return documentRepository.findAll();
    }

    // --- FIXED: Only wipes the data for the specific user ---
    public void wipeUserDatabase(String userEmail) {
        documentRepository.deleteByUserEmail(userEmail);
    }
}
