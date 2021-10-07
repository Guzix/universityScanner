package com.wsiz.skiscanner.model.dto;


import java.util.List;

public class SkiResortDto extends BasicDto {

    public String name;

    public Boolean isOpen;

    public Float maxHeight;

    public Float minHeight;

    public Float maxPrize;

    public Float minPrize;

    public AddressDto address;

    public List<LiftDto> lifts;

    public List<SkiRunDto> skiRuns;
}
