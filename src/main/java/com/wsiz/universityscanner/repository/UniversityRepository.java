package com.wsiz.universityscanner.repository;

import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UniversityRepository extends JpaRepository<University, Long> {

}
