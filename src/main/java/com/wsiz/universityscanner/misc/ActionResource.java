package com.wsiz.universityscanner.misc;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ActionResource<T> {

    private ActionResourceStatus actionResourceStatus;

    private T resource;

    public static <T> ActionResource<T> result(T resource) {return new ActionResource<>(ActionResourceStatus.OK, resource);}
    public static <T> ActionResource<T> result(ActionResourceStatus actionResultStatus) {return new ActionResource<>(actionResultStatus, null); }
    public static <T> ActionResource<T> result(T response, ActionResourceStatus actionResourceStatus) {return new ActionResource<>(actionResourceStatus, response);}
}
