package com.wsiz.skiscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import java.util.List;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class SkiResort extends BaseEntity{

    public String name;

    public Boolean isOpen;

    public Float maxHeight;

    public Float minHeight;

    public Float maxPrize;

    public Float minPrize;

    @OneToOne
    public Address address;

    @OneToMany
    public List<Lift> lifts;

    @OneToMany
    public List<SkiRun> skiRuns;

}
