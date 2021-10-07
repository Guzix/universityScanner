package com.wsiz.skiscanner.repository;

import com.wsiz.skiscanner.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long>  {

    Address findAddressByCityIsNotNull();
}
