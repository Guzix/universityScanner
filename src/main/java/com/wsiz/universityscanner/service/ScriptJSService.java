package com.wsiz.universityscanner.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.University;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;



@Service
@Log4j2
@RequiredArgsConstructor
public class ScriptJSService {

    private final UniversityService universityService;

    @Value("${path.scrapper.script}")
    private String scriptPath;

    public ActionResourceStatus getFieldOfStudies(Long universityId) {
        try {
                University university = universityService.getByID(universityId);

                String finalPath = "node " + scriptPath + "university_" + universityId.toString() + ".js";

                Runtime.getRuntime().exec(finalPath);

                return ActionResourceStatus.OK;


        } catch (Exception e) {
            e.printStackTrace();
            return ActionResourceStatus.UNEXPECTED_ERROR;
        }
    }
}
