package com.wsiz.universityscanner.model.dto;

import com.wsiz.universityscanner.model.FieldOfStudyLevel;
import com.wsiz.universityscanner.model.FieldOfStudyType;
import lombok.Data;

import javax.annotation.Nullable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
public class FieldOfStudyDto extends BasicDto{

    private Long id;

    private String name;

    private FieldOfStudyType fieldOfStudyType;

    private FieldOfStudyLevel fieldOfStudyLevel;

    private Integer numberOfSemesters;
}
