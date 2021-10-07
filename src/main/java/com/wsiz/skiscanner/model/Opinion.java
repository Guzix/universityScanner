package com.wsiz.skiscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.OneToOne;
import java.time.LocalDateTime;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Opinion extends BaseEntity {

    private String email;

    private String name;

    private String review;

    private Float generalRating;

    public Float beginner;

    public Float intermediate;

    public Float advanced;

    public Float snowpark;

    public LocalDateTime visitDate;

    @OneToOne
    public SkiResort skiResort;
}
