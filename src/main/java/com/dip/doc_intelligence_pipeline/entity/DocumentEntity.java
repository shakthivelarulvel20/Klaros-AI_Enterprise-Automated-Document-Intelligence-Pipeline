package com.dip.doc_intelligence_pipeline.entity;

import java.util.Map;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.dip.doc_intelligence_pipeline.enums.DocumentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "documents")
@Data
public class DocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fileName;

    // NEW: Store the unique digital fingerprint of the file
    @Column(name = "file_hash")
    private String fileHash;

    private String storagePath;

    @Enumerated(EnumType.STRING)
    private DocumentStatus status;

    @Column(name = "user_email")
    private String userEmail;

    // Make sure to add the Getter and Setter for this!
    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> extractedData;

    private Double confidenceScore;
}
