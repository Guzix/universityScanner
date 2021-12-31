package com.wsiz.universityscanner.utils;

import com.wsiz.universityscanner.controller.CustomizedRestNames;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface CustomizedName {
    CustomizedRestNames name();
}
