package com.logistics.coldchain.repository;

import com.logistics.coldchain.model.JournalEntry;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalEntryRepository extends JpaRepository<JournalEntry, String> {
}
