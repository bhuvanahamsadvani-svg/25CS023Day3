package com.logistics.coldchain.repository;

import com.logistics.coldchain.model.VendorBill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorBillRepository extends JpaRepository<VendorBill, String> {
}
