package com.wsiz.universityscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.annotation.Nullable;
import javax.persistence.*;

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

    @ManyToOne
    @JoinTable(
            name = "university_field_of_studies",
            joinColumns = @JoinColumn(name = "university_id"),
            inverseJoinColumns = @JoinColumn(name = "field_of_studies_id")
    )
    private University university;
}
