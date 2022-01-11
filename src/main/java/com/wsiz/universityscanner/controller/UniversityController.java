package com.wsiz.universityscanner.controller;

import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.service.UniversityService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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
    public ActionResource<List<UniversityDto>> getListDto(){
        return universityService.getListDto();
    }
}
