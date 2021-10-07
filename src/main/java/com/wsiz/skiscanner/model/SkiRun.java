package com.wsiz.skiscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class SkiRun extends BaseEntity{

    public Integer numberOfRoute;

    public Float sumOfTheLength;

    public Float maxLength;
}
