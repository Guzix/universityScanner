package com.wsiz.universityscanner.controller;

import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.University;
import com.wsiz.universityscanner.model.dto.FieldOfStudyDto;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.service.FieldOfStudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/field-of-study")
public class FieldOfStudyController {

    private final FieldOfStudyService fieldOfStudyService;

    @GetMapping("/get/{id}")
    public FieldOfStudyDto getFieldOfStudy(@PathVariable Long id){
//        return addressService.getAddress(id);
        return new FieldOfStudyDto();
    }

//    @GetMapping("/get-list-by-university/{id}")
//    public ActionResource<FieldOfStudyDto> getListByUniversity(@PathVariable Long id){
//        return fieldOfStudyService.getListByUniversity(id);
//    }


}
