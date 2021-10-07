package com.wsiz.skiscanner.model.dto;

import lombok.Data;

@Data
public class SkiRunDto extends BasicDto {

    public Integer numberOfRoute;

    public Float sumOfTheLength;

    public Float maxLength;
}
