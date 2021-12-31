package com.wsiz.universityscanner.repository;

import java.util.List;

public interface BasicRepository<U>  {

    <U> List<U> findAllByDeletedFalseOrderByIdDesc();

    <U> U getByIdAndDeletedFalse(Long id);

    U save(U object);

//    void saveAll(List<U> objects);

    List<U> findAllById(Iterable<Long> var1);
}
