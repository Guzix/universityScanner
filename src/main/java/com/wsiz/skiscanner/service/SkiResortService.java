package com.wsiz.skiscanner.service;


import com.wsiz.skiscanner.model.SkiResort;
import com.wsiz.skiscanner.repository.SkiResortRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class SkiResortService {


    private final SkiResortRepository skiResortRepository;

    public List<SkiResort> getSkiResortList(){
        List<SkiResort> list = skiResortRepository.getAllByDeletedFalse();
        return list;
    }
}
