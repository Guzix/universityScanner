package com.wsiz.skiscanner.controller;



import com.wsiz.skiscanner.model.Address;
import com.wsiz.skiscanner.service.AddressService;
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
    public Address getAddress(@PathVariable Long id){
//        return addressService.getAddress(id);
        return new Address();
    }
}
