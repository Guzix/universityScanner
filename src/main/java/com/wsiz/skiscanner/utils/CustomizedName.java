package com.wsiz.skiscanner.utils;

import com.wsiz.skiscanner.controller.CustomizedRestNames;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

@Retention(RetentionPolicy.RUNTIME)
public @interface CustomizedName {
    CustomizedRestNames name();
}
