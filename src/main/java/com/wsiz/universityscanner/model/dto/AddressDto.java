package com.wsiz.universityscanner.model.dto;

import com.wsiz.universityscanner.model.Province;
import lombok.Data;


@Data
public class AddressDto extends BasicDto {

    public String city;

    public String street;

    public String postalCode;

    public String buildingNumber;

    public Province province;
}
