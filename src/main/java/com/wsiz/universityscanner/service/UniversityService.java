package com.wsiz.universityscanner.service;

import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.University;
import com.wsiz.universityscanner.model.dto.AddressDto;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.repository.UniversityRepository;
import com.wsiz.universityscanner.utils.ModelMappingUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.List;

@Service
@Log4j2
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;

    private final AddressService addressService;

    protected ModelMapper mm = new ModelMapper();


    @PostConstruct
    public void configureModelMapper() {
        mm
                .createTypeMap(UniversityDto.class, University.class)
                .addMappings(mapper -> {
                    mapper.with(r -> {
                        AddressDto addressDto = (AddressDto) r.getSource();
                        return addressDto == null ? null : addressService.getById(addressDto.getId());
                    }).map(UniversityDto::getAddress, University::setAddress);
                });
    }

    public ActionResource<UniversityDto> saveDto(Long id, UniversityDto universityDto){
        try {
            if (id == null){
                Address address =  addressService.save(universityDto.getAddress());
                University university = University.builder()
                        .universityType(universityDto.getUniversityType())
                        .name(universityDto.getName())
                        .summary(universityDto.getSummary())
                        .address(address)
                        .build();
                universityRepository.save(university);
                return ActionResource.result(mm.map(university, UniversityDto.class));

            } else {
                University objectToDb =  universityRepository.getByIdAndDeletedFalse(universityDto.getId());
                mm.map(universityDto, objectToDb);
                universityRepository.save(objectToDb);

                return ActionResource.result(mm.map(objectToDb, UniversityDto.class));
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResource<UniversityDto> getDtoById(Long id){
        try {
            University university = universityRepository.getByIdAndDeletedFalse(id);
            UniversityDto universityDto = mm.map(university, UniversityDto.class);
            return ActionResource.result(universityDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResource<List<UniversityDto>> getListDto(){
        try {
            List<University> universityList = universityRepository.findAllByDeletedFalse();
            return ActionResource.result(ModelMappingUtils.mapList(mm, universityList, UniversityDto.class));
        }catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }
}
