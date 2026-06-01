package com.dip.doc_intelligence_pipeline.service;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xssf.extractor.XSSFExcelExtractor;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class OfficeExtractionService {

    public String extractText(MultipartFile file) throws Exception {
        String filename = file.getOriginalFilename();
        if (filename == null) throw new IllegalArgumentException("Filename is null");
        
        filename = filename.toLowerCase();

        // Open a safe stream to the uploaded file
        try (InputStream is = file.getInputStream()) {
            
            if (filename.endsWith(".docx")) {
                // Read modern Microsoft Word Documents
                try (XWPFDocument doc = new XWPFDocument(is);
                     XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
                    return extractor.getText();
                }
                
            } else if (filename.endsWith(".xlsx")) {
                // Read modern Microsoft Excel Spreadsheets
                try (XSSFWorkbook workbook = new XSSFWorkbook(is);
                     XSSFExcelExtractor extractor = new XSSFExcelExtractor(workbook)) {
                    extractor.setFormulasNotResults(false); // We want the actual calculated numbers, not the formula text!
                    return extractor.getText();
                }
                
            } else {
                throw new IllegalArgumentException("Unsupported Office format: " + filename);
            }
        }
    }
}