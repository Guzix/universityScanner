package com.wsiz.universityscanner.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Data
@Builder
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Address extends BaseEntity{

    public String city;

    public String street;

    public String postalCode;

    public String buildingNumber;

    @Enumerated(EnumType.STRING)
    public Province province;
}
