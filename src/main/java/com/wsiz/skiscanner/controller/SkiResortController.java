package com.wsiz.skiscanner.controller;


import com.wsiz.skiscanner.model.SkiResort;
import com.wsiz.skiscanner.service.SkiResortService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ski-resort")
public class SkiResortController {

    private final SkiResortService skiResortService;

    @GetMapping("/get-list")
    public List<SkiResort> getSkiResortList(){
        return skiResortService.getSkiResortList();
    }
}
