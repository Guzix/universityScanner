package com.wsiz.universityscanner.repository;

import com.wsiz.universityscanner.model.FieldOfStudy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldOfStudyRepository extends JpaRepository<FieldOfStudy, Long> {

}
