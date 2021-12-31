package com.wsiz.universityscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class FieldOfStudy extends BaseEntity{

    private String name;

    @Enumerated(EnumType.STRING)
    private FieldOfStudyType fieldOfStudyType;

    @Enumerated(EnumType.STRING)
    private FieldOfStudyLevel fieldOfStudyLevel;

    @Nullable
    private Integer numberOfSemesters;
}
