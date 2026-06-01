package com.dip.doc_intelligence_pipeline.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.dip.doc_intelligence_pipeline.entity.DocumentEntity;

import jakarta.transaction.Transactional;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long> {

    List<DocumentEntity> findByUserEmailOrderByIdDesc(String userEmail);

    // Change it to this:
    Optional<DocumentEntity> findByFileHashAndUserEmail(String fileHash, String userEmail);

    // Count every document ever processed successfully
    @Query("SELECT COUNT(d) FROM DocumentEntity d WHERE d.status = 'PROCESSED'")
    long countProcessedDocuments();

    // Sum up the 'totalAmount' field from inside the JSONB column across all records
    @Query(value = "SELECT SUM(CAST(extracted_data->>'totalAmount' AS NUMERIC)) FROM documents WHERE status = 'PROCESSED'", nativeQuery = true)
    Double sumTotalAmount();

    @Modifying
    @Transactional
    void deleteByUserEmail(String userEmail);

}
