package com.wsiz.universityscanner.service;


import com.wsiz.universityscanner.misc.ActionResource;
import com.wsiz.universityscanner.misc.ActionResourceStatus;
import com.wsiz.universityscanner.model.BaseEntity;
import com.wsiz.universityscanner.model.dto.BasicDto;
import com.wsiz.universityscanner.repository.BasicRepository;
import com.wsiz.universityscanner.utils.ModelMappingUtils;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;

import java.util.List;

public abstract class BasicService<T extends BasicDto, U, V extends BaseEntity> {

    protected abstract BasicRepository<V> getRepository();

    protected abstract Class<T> getExtendedDTOClass();

    protected abstract Class<U> getShortDTOClass();

    protected abstract Class<V> getDBClass();

    // NOTE(jbi): If we use autowired model mapper instance is shared across all BasicServices, this behaviour is undesirable because behaviour isn't
    //  isolated and it might cause really complicated errors as every model mapper configuration might break every other one, if we have really
    //  similar logic then let's use some static method that injects this shared configuration taking model mapper as an argument.
    //    @Autowired
    protected ModelMapper mm = new ModelMapper();

    public T getById(Long id) {
//        ModelMapper modelMapper = new ModelMapper();
        mm.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        V modelObj = getRepository().getByIdAndDeletedFalse(id);
        return mm.map(modelObj, getExtendedDTOClass());
    }

    public V getDbById(Long id) {
//        return getRepository().getByIdAndDeletedFalse(id, getDBClass());
        return getRepository().getByIdAndDeletedFalse(id);
    }

    public List<U> getList() {
        List<V> srcValues = getRepository().findAllByDeletedFalseOrderByIdDesc();
        List<U> values = ModelMappingUtils.mapList(mm, srcValues, getShortDTOClass());
        return values;
    }

    public <Y extends BasicDto> ActionResource<T> saveAbs(Y dtoExtended) {
        boolean excludeId = dtoExtended.getId() == null || dtoExtended.getId() == -1L;

        return saveAbs(dtoExtended, excludeId);
    }

    <Y extends BasicDto> ActionResource<T> saveAbs(Y dtoExtended, boolean excludeId) {
        try {
            V objectForDB = excludeId ?
                    getDBClass   ().getDeclaredConstructor().newInstance() :
                    getRepository().getByIdAndDeletedFalse(dtoExtended.getId());

            mm.map(dtoExtended, objectForDB);
            getRepository().save(objectForDB);

            return ActionResource.result(mm.map(objectForDB, getExtendedDTOClass()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResource.result(ActionResourceStatus.UNEXPECTED_ERROR);
    }

    public ActionResource<T> save(T dtoExtended) {
        return saveAbs(dtoExtended);
    }

    public ActionResource<T> save(T dtoExtended, boolean excludeId) {
        return saveAbs(dtoExtended, excludeId);
    }

    public ActionResourceStatus save(V dbObject) {
        try {
            getRepository().save(dbObject);
            return ActionResourceStatus.OK;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ActionResourceStatus.UNEXPECTED_ERROR;
    }

    public ActionResourceStatus deleteById(Long id) {
        try {
            V objectForDB = getRepository().getByIdAndDeletedFalse(id);
            if (objectForDB != null) {
                objectForDB.setDeleted(true);
                getRepository().save(objectForDB);
            } else {
                return ActionResourceStatus.OBJECT_DOES_NOT_EXIST;
            }
            return ActionResourceStatus.OK;

        } catch (Exception e) {
            e.printStackTrace();
        }

        return ActionResourceStatus.UNEXPECTED_ERROR;
    }
}
