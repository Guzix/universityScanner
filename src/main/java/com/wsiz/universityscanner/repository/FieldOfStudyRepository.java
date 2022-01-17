package com.wsiz.universityscanner.repository;

import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.FieldOfStudyLevel;
import com.wsiz.universityscanner.model.FieldOfStudyType;
import com.wsiz.universityscanner.model.University;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FieldOfStudyRepository extends JpaRepository<FieldOfStudy, Long> {

    Optional<FieldOfStudy> findByUniversity_IdAndNameAndFieldOfStudyLevelAndFieldOfStudyTypeAndNumberOfSemestersAndDeletedFalse(Long universityId,
                                                                                                                             String name,
                                                                                                                             FieldOfStudyLevel fieldOfStudyLevel,
                                                                                                                             FieldOfStudyType fieldOfStudyType,
                                                                                                                             Integer numberOfSemesters);
}
