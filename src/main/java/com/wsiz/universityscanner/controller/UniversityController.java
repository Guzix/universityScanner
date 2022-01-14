package com.wsiz.universityscanner.controller;

import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.dto.FieldOfStudyDto;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/university")
public class UniversityController {

    private final UniversityService universityService;

    @GetMapping("/get/{id}")
    public ActionResource<UniversityDto> getUniversity(@PathVariable Long id){
        return universityService.getDtoById(id);
    }

    @PostMapping("/saveDto")
    public ActionResource<UniversityDto> saveDto(@RequestParam(required = false) Long id, @RequestBody UniversityDto universityDto){
        return universityService.saveDto(id,universityDto);
    }

    @GetMapping("/get-list")
    public ActionResource<Page<UniversityDto>> getListDto(@RequestParam Integer pageNumber, @RequestParam Integer pageSize){
        return universityService.getListDto(pageNumber, pageSize);
    }

    @PostMapping("/add-or-save-field-of-studey")
    public ActionResource<UniversityDto> addOrSaveFieldOfStudy(@RequestParam Long id, @RequestBody FieldOfStudyDto fieldOfStudyDto){
        return universityService.addOrSaveFieldOfStudy(id,fieldOfStudyDto);
    }

    @PostMapping("/delete-field-of-study")
    public ActionResource<UniversityDto> deleteFieldOfStudy(@RequestParam Long universityId, @RequestParam Long fieldOfStudyId){
        return universityService.deleteFieldOfStudy(universityId, fieldOfStudyId);
    }

    @PostMapping("/delete-university")
    public ActionResourceStatus deleteUniversity(@RequestParam Long id){
        return universityService.deleteUniversity(id);
    }

    @GetMapping("/get-random-university")
    public ActionResource<List<UniversityDto>> getRandomUniversity(@RequestParam Integer amount) {
        return universityService.getRandomUniversity(amount);
    }
}
