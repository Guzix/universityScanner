package com.wsiz.universityscanner.utils;


import com.wsiz.universityscanner.model.BaseEntity;
import com.wsiz.universityscanner.model.dto.BasicDto;
import lombok.experimental.UtilityClass;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@UtilityClass
public class ModelMappingUtils {
    public static <T,U> List<T> mapList(ModelMapper mm, List<U> list, Class<T> clazz) {
        return list.stream().map(obj -> mm.map(obj, clazz)).collect(Collectors.toList());
    }

    public static <T extends BaseEntity,U extends BasicDto> void addIdMapping(ModelMapper mm, Function<Long, T> getById, Class<U> dtoClass, Class<T> entityClass) {
        Converter<U, T> converter = context -> {
            U dto = context.getSource();
            return dto == null ? null : getById.apply(dto.getId());
        };
        mm.addConverter(converter, dtoClass, entityClass);
//        mm
//            .createTypeMap(dtoClass, entityClass)
//            .addMappings(mapper -> {
//                mapper.with(r -> {
//                    U dto = (U) r.getSource();
//                    return dto == null ? null : getById.apply(dto.getId());
//                });
//            });
    }

}
