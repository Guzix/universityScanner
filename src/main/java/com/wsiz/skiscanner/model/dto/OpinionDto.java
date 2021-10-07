package com.wsiz.skiscanner.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class OpinionDto extends BasicDto {

    private String email;

    private String name;

    private String review;

    private Float generalRating;

    public Float beginner;

    public Float intermediate;

    public Float advanced;

    public Float snowpark;

    public LocalDateTime visitDate;

    public SkiResortDto skiResort;
}
