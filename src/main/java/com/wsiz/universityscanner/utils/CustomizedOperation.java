package com.wsiz.universityscanner.utils;

import io.swagger.v3.oas.models.Operation;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface CustomizedOperation {
    String addition() default "customized operation!";
}

@Component
class OperationCustomizer implements org.springdoc.core.customizers.OperationCustomizer {
    @Override
    public Operation customize(Operation operation, HandlerMethod handlerMethod) {
        CustomizedOperation annotation = handlerMethod.getMethodAnnotation(CustomizedOperation.class);
        CustomizedName annotation1 = handlerMethod.getBeanType().getAnnotation(CustomizedName.class);

        if (annotation != null && annotation1 != null) {
            operation.setOperationId(StringUtils.uncapitalize(annotation1.name().getName()) + StringUtils.capitalize(handlerMethod.getMethod().getName()));
        }
        return operation;
    }
}
