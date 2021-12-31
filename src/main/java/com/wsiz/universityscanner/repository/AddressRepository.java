package com.wsiz.universityscanner.repository;

import com.wsiz.universityscanner.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long>  {

    Address findAddressByCityIsNotNull();
}
