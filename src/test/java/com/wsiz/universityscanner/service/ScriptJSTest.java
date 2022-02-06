package com.wsiz.universityscanner.service;

import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.FieldOfStudyLevel;
import com.wsiz.universityscanner.model.FieldOfStudyType;
import org.json.simple.JSONObject;
import org.junit.Assert;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ScriptJSTest {


    @Test
    void getFieldOfStudies() {
        assertTrue(true);
    }

    @Test
    void parseObjectTest()
    {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name", "Informatyka");
        jsonObject.put("fieldOfStudyType", "STACJONARNE");
        jsonObject.put("numberOfSemesters", "7");
        jsonObject.put("fieldOfStudyLevel", "PIERWSZEGO_STOPNIA");


        FieldOfStudy fieldOfStudy = ScriptJSService.parseObject(jsonObject);

        assertEquals(fieldOfStudy.getName(), "Informatyka");
        assertEquals(fieldOfStudy.getFieldOfStudyType(), FieldOfStudyType.STACJONARNE);
        assertEquals(fieldOfStudy.getNumberOfSemesters(), 7);
        assertEquals(fieldOfStudy.getFieldOfStudyLevel(), FieldOfStudyLevel.PIERWSZEGO_STOPNIA);

    }
}