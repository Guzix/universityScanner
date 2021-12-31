package com.wsiz.universityscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class ScriptsJS extends BaseEntity{

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;
}
