package com.wsiz.skiscanner.controller;


import com.wsiz.skiscanner.misc.ActionResource;
import com.wsiz.skiscanner.misc.ActionResourceStatus;
import com.wsiz.skiscanner.model.BaseEntity;
import com.wsiz.skiscanner.model.dto.BasicDto;
import com.wsiz.skiscanner.service.BasicService;
import com.wsiz.skiscanner.utils.CustomizedOperation;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public abstract class BasicController<T extends BasicDto, U, V extends BaseEntity> {
    protected abstract BasicService<T, U, V > getService();

    @GetMapping("/get/{id}")
    @CustomizedOperation
    public T getObject(@PathVariable Long id) {
        return getService().getById(id);
    }

    @GetMapping("/list")
    @CustomizedOperation
    public List<U> getObjectList() {
        return getService().getList();
    }

    @PostMapping("/save")
    @CustomizedOperation
    public ActionResource<T> saveObject(@RequestBody T objectExtendedDto) {
        return getService().save(objectExtendedDto, objectExtendedDto.getId() == null);
    }

//    @Secured({RoleNames.ROLE_ADMIN})
    @DeleteMapping("/delete/{id}")
    @CustomizedOperation
    public ActionResourceStatus deleteObject(@PathVariable Long id) {
        return getService().deleteById(id);
    }
}
