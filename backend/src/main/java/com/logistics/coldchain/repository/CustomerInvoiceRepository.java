package com.logistics.coldchain.repository;

import com.logistics.coldchain.model.CustomerInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerInvoiceRepository extends JpaRepository<CustomerInvoice, String> {
}
