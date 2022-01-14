package com.wsiz.universityscanner.service;

import ch.qos.logback.core.pattern.Converter;
import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.Address;
import com.wsiz.universityscanner.model.BaseEntity;
import com.wsiz.universityscanner.model.FieldOfStudy;
import com.wsiz.universityscanner.model.University;
import com.wsiz.universityscanner.model.dto.AddressDto;
import com.wsiz.universityscanner.model.dto.FieldOfStudyDto;
import com.wsiz.universityscanner.model.dto.UniversityDto;
import com.wsiz.universityscanner.repository.UniversityRepository;
import com.wsiz.universityscanner.utils.ModelMappingUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
public class UniversityService {

    private final UniversityRepository universityRepository;

    private final AddressService addressService;

    private final FieldOfStudyService fieldOfStudyService;

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

    public University getByID(Long id) {
        return universityRepository.getByIdAndDeletedFalse(id);
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



    public ActionResource<Page<UniversityDto>> getListDto(Integer pageNumber, Integer pageSize){
        try {
            Page<University> universityList = universityRepository.findAllUniversityByDeletedFalse(PageRequest.of(pageNumber, pageSize));
            Page<UniversityDto> dtoPage = universityList.map(univ -> mm.map(univ, UniversityDto.class));
            return ActionResource.result(dtoPage);
        }catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResource<UniversityDto> addOrSaveFieldOfStudy(Long id, FieldOfStudyDto fieldOfStudyDto){
        try {
            FieldOfStudy fieldOfStudy = fieldOfStudyService.save(fieldOfStudyDto);

            University university = universityRepository.getByIdAndDeletedFalse(id);

            List<FieldOfStudy> fieldOfStudyList = university.getFieldOfStudies();

            if(fieldOfStudyList.stream().noneMatch(fos -> fos.getId().equals(fieldOfStudy.getId()))){
              fieldOfStudyList.add(fieldOfStudy);
            }
            universityRepository.save(university);

            return ActionResource.result(mm.map(university, UniversityDto.class));
        } catch (Exception e){
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResource<UniversityDto> deleteFieldOfStudy(Long universityId, Long fieldOfStudyId){
        try {
            University university = universityRepository.getByIdAndDeletedFalse(universityId);

            fieldOfStudyService.delete(fieldOfStudyId);
            university.setFieldOfStudies(university.getFieldOfStudies().stream().filter(fos -> !fos.getId().equals(fieldOfStudyId)).collect(Collectors.toList()));
            universityRepository.save(university);

            return ActionResource.result(mm.map(university, UniversityDto.class));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResourceStatus deleteUniversity(Long id){
        try {
            University university = universityRepository.getByIdAndDeletedFalse(id);

            university.getFieldOfStudies().forEach(fos -> fieldOfStudyService.delete(fos.getId()));
            addressService.delete(university.getAddress().getId());
            university.setDeleted(true);
            universityRepository.save(university);
            return ActionResourceStatus.OK;
        } catch (Exception e){
            e.printStackTrace();
        }
        return ActionResourceStatus.UNEXPECTED_ERROR;
    }

    public ActionResource<List<UniversityDto>> getRandomUniversity(Integer amount) {
        try {
            List<University> universityList = universityRepository.findAllByDeletedFalse();
            List<UniversityDto> selectedUniversity = new ArrayList<>();
            List<Long> universityIds = universityList.stream().map(BaseEntity::getId).collect(Collectors.toList());

            for (int i = 0; i < amount; i++) {
                int v = (int)(Math.random() * (universityIds.size() - 1));
                selectedUniversity.add(mm.map(universityList.get(v), UniversityDto.class));
            }
            return ActionResource.result(selectedUniversity);
        } catch (Exception e){
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }
}
