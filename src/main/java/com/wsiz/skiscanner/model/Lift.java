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
public class Lift extends BaseEntity {

    public Integer belt;

    public Integer chair;

    public Integer gondol;

    public Integer killerWhole;
}
