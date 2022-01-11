package com.wsiz.universityscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class University extends BaseEntity{

    private String name;

    private String summary;

    @Column(columnDefinition = "TEXT")
    private String scriptJS;

    @ManyToOne
    private Address address;

    @OneToMany
    private List<FieldOfStudy> fieldOfStudies;

    @Enumerated(EnumType.STRING)
    private  UniversityType universityType;


}
