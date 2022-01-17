package com.wsiz.universityscanner.service;

import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.*;
import com.wsiz.universityscanner.model.dto.AddressDto;
import com.wsiz.universityscanner.model.dto.FieldOfStudyDto;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.repository.FieldOfStudyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class FieldOfStudyService {

    private final FieldOfStudyRepository fieldOfStudyRepository;


    public Optional<FieldOfStudy> getIfExist(Long universityId, String name, FieldOfStudyLevel fieldOfStudyLevel, FieldOfStudyType fieldOfStudyType, Integer numberOfSemesters) {
        return fieldOfStudyRepository.findByUniversity_IdAndNameAndFieldOfStudyLevelAndFieldOfStudyTypeAndNumberOfSemestersAndDeletedFalse(universityId, name,fieldOfStudyLevel,fieldOfStudyType,numberOfSemesters);
    }

    public FieldOfStudy save(FieldOfStudy fieldOfStudy){
        return fieldOfStudyRepository.save(fieldOfStudy);
    }

    public FieldOfStudy saveDto(FieldOfStudyDto fieldOfStudyDto) {
        if (fieldOfStudyDto.getId() == null){
            FieldOfStudy fieldOfStudy = FieldOfStudy.builder()
                    .name(fieldOfStudyDto.getName())
                    .numberOfSemesters(fieldOfStudyDto.getNumberOfSemesters())
                    .fieldOfStudyLevel(fieldOfStudyDto.getFieldOfStudyLevel())
                    .fieldOfStudyType(fieldOfStudyDto.getFieldOfStudyType())
                    .build();
            return fieldOfStudyRepository.save(fieldOfStudy);
        } else {
            FieldOfStudy fieldOfStudy = fieldOfStudyRepository.getById(fieldOfStudyDto.getId());
            fieldOfStudy.setFieldOfStudyLevel(fieldOfStudyDto.getFieldOfStudyLevel());
            fieldOfStudy.setFieldOfStudyType(fieldOfStudyDto.getFieldOfStudyType());
            fieldOfStudy.setName(fieldOfStudyDto.getName());
            fieldOfStudy.setNumberOfSemesters(fieldOfStudyDto.getNumberOfSemesters());
            return fieldOfStudyRepository.save(fieldOfStudy);
        }
    }

    public ActionResourceStatus delete(Long id){
        try {
            FieldOfStudy fieldOfStudy = fieldOfStudyRepository.getById(id);
            fieldOfStudy.setDeleted(true);
            fieldOfStudyRepository.save(fieldOfStudy);
            return ActionResourceStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResourceStatus.UNEXPECTED_ERROR;
    }
}
