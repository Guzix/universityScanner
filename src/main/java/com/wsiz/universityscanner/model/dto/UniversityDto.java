package com.wsiz.universityscanner.model.dto;

import com.wsiz.universityscanner.model.UniversityType;
import lombok.Data;

import javax.persistence.Column;
import java.util.List;

@Data
public class UniversityDto extends BasicDto{

    private Long id;

    private String name;

    private String summary;

    private AddressDto address;

    private List<FieldOfStudyDto> fieldOfStudies;

    private UniversityType universityType;

    private String scriptJS;

    private String website;

    private String logoURL;

    private String photoURL;

}
