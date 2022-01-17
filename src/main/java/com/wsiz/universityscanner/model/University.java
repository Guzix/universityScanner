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

    private String website;

    private String logoURL;

    private String photoURL;

    @Column(columnDefinition = "TEXT")
    private String scriptJS;

    @ManyToOne
    private Address address;

    @OneToMany
    @JoinTable(
            name = "university_field_of_studies",
            joinColumns = @JoinColumn(name = "field_of_studies_id"),
            inverseJoinColumns = @JoinColumn(name = "university_id" )
    )
    private List<FieldOfStudy> fieldOfStudies;

    @Enumerated(EnumType.STRING)
    private  UniversityType universityType;


}
