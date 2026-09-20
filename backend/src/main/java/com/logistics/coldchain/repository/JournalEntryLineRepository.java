package com.logistics.coldchain.repository;

import com.logistics.coldchain.model.JournalEntryLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryLineRepository extends JpaRepository<JournalEntryLine, Long> {
}
