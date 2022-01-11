package com.wsiz.universityscanner.controller;

import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.dto.FieldOfStudyDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/field-of-study")
public class FieldOfStudyController {

    @GetMapping("/get/{id}")
    public FieldOfStudyDto getFieldOfStudy(@PathVariable Long id){
//        return addressService.getAddress(id);
        return new FieldOfStudyDto();
    }
}
