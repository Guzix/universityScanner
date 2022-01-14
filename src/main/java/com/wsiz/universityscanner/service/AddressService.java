package com.wsiz.universityscanner.service;

import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.dto.AddressDto;
import com.wsiz.universityscanner.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;


    public Address save(AddressDto addressDto) {
        if (addressDto.getId() == null) {
            Address address = Address.builder()
                    .city(addressDto.getCity())
                    .buildingNumber(addressDto.getBuildingNumber())
                    .postalCode(addressDto.getPostalCode())
                    .province(addressDto.getProvince())
                    .street(addressDto.getStreet())
                    .build();
            return addressRepository.save(address);
        } else {
            Address address = addressRepository.getById(addressDto.getId());
            address.setCity(addressDto.getCity());
            address.setBuildingNumber(address.getBuildingNumber());
            address.setPostalCode(address.getPostalCode());
            address.setStreet(addressDto.getStreet());
            address.setProvince(addressDto.getProvince() );
            return addressRepository.save(address);
        }
    }

    public Address getById(Long id){
        return addressRepository.getById(id);
    }

    public ActionResourceStatus delete(Long id){
        try {
            Address address = addressRepository.getById(id);
            address.setDeleted(true);
            addressRepository.save(address);
            return ActionResourceStatus.OK;
        } catch (Exception e){
            e.printStackTrace();
        }
        return ActionResourceStatus.UNEXPECTED_ERROR;
    }
}
