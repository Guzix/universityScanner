package com.wsiz.skiscanner.model.dto;

import com.wsiz.skiscanner.model.Province;
import lombok.Data;


@Data
public class AddressDto extends BasicDto {

    public String city;

    public String street;

    public String postalCode;

    public String buildingNumber;

    public Province province;
}
