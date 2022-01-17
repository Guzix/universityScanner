package com.wsiz.universityscanner.controller;


import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.service.ScriptJSService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/scrapper")
public class ScriptJSController {

    private final ScriptJSService scriptJSService;

    @PostMapping("/scrap/{id}")
    public ActionResourceStatus scrapFieldOfStudies(@PathVariable Long id){
        return scriptJSService.getFieldOfStudies(id);
    }
}
