package com.wsiz.universityscanner.controller;



import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.dto.AddressDto;
import com.wsiz.universityscanner.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/address")
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/get/{id}")
    public AddressDto getAddress(@PathVariable Long id){
//        return addressService.getAddress(id);
        return new AddressDto();
    }
}
