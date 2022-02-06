package com.wsiz.universityscanner.service;


import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.FieldOfStudyLevel;
import com.wsiz.universityscanner.model.FieldOfStudyType;
import com.wsiz.universityscanner.model.University;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j;
import lombok.extern.log4j.Log4j2;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.InputStreamReader;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;


@Service
@Log4j2
@RequiredArgsConstructor
public class ScriptJSService {

    private final UniversityService universityService;

    private final FieldOfStudyService fieldOfStudyService;

    @Value("${path.scrapper.script}")
    private String scriptPath;

    @Value("${path.scrapper.values}")
    private String valuesPath;

    public ActionResourceStatus getFieldOfStudies(Long universityId) {
        try {
            University university = universityService.getByID(universityId);

            List<FieldOfStudy> fieldOfStudyList = new ArrayList<>();

            String finalPath = "node " + scriptPath + "university_" + universityId.toString() + ".js";

            LocalDateTime before = LocalDateTime.now();
            System.out.println( "start: " + before);

            Process p = Runtime.getRuntime().exec(finalPath);

            System.out.println("Waiting for batch file ...");
            if (p.waitFor(2, TimeUnit.MINUTES)){
                LocalDateTime after = LocalDateTime.now();
                System.out.println( "end: " + after);

                System.out.println(Duration.between(before, after).getSeconds());

                JSONParser jsonParser = new JSONParser();

                FileReader reader = new FileReader(valuesPath + "names_" + universityId + ".json");

                Object obj = jsonParser.parse(reader);

                JSONArray jsonArray = (JSONArray) obj;

                jsonArray.forEach( fos -> fieldOfStudyList.add(parseObject((JSONObject) fos)));

                List<FieldOfStudy> fieldOfStudiesWithIds = fieldOfStudyList.stream().map(fos ->
                    fieldOfStudyService.getIfExist(
                            universityId,
                            fos.getName(),
                            fos.getFieldOfStudyLevel(),
                            fos.getFieldOfStudyType(),
                            fos.getNumberOfSemesters()
                    ).orElseGet(() -> fieldOfStudyService.save(fos))
                ).collect(Collectors.toList());

                university.setFieldOfStudies(fieldOfStudiesWithIds);
                universityService.save(university);

                return ActionResourceStatus.OK;
            } else {
                LocalDateTime after = LocalDateTime.now();
                System.out.println( "end: " + after);

                System.out.println(Duration.between(before, after).getSeconds());
                return ActionResourceStatus.REPLY_TIMEOUT;
            }
        } catch (Exception e) {
            e.printStackTrace();
             return ActionResourceStatus.UNEXPECTED_ERROR;
        }
    }

    public static FieldOfStudy parseObject(JSONObject jsonObject)
    {
        return FieldOfStudy.builder()
                .name((String) jsonObject.get("name"))
                .fieldOfStudyLevel(FieldOfStudyLevel.valueOf((String) jsonObject.get("fieldOfStudyLevel")))
                .numberOfSemesters(Integer.parseInt((String) jsonObject.get("numberOfSemesters")))
                .fieldOfStudyType(FieldOfStudyType.valueOf((String) jsonObject.get("fieldOfStudyType")) )
                .build();
    }


}
