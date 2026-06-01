package com.dip.doc_intelligence_pipeline.service;

import java.io.IOException;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class PdfExtractionService {

    public String extractText(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            
            PDFTextStripper stripper = new PDFTextStripper();
            String extractedText = stripper.getText(document);
            
            return extractedText;
            
        } catch (IOException e) {
            throw new RuntimeException("Failed to extract text from PDF: " + file.getOriginalFilename(), e);
        }
    }
}