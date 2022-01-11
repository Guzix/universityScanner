package com.wsiz.universityscanner.repository;

import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UniversityRepository extends JpaRepository<University, Long> {

    University getByIdAndDeletedFalse(Long id);

    List<University> findAllByDeletedFalse();

}
