package com.wsiz.universityscanner.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@AllArgsConstructor
@Getter
public enum CustomizedRestNames {
    ATOMIC_OPERATION_CONTROLLER("atOp"),
    ATOMIC_PRODUCT_CONTROLLER("atPr"),
    ATOMIC_PRODUCT_PARAMETER_CONTROLLER("atPrPa"),
    ATOMIC_PRODUCT_PARAMETER_TYPE_CONTROLLER("atPrPaTy"),
    ATOMIC_PRODUCT_TYPE_CONTROLLER("atPrTy"),
    MACHINE_CALENDAR_TASK_CONTROLLER("maCaTa"),
    MACHINE_CONTROLLER("ma"),
    OPERATION_TIME_CONTROLLER("opTi"),
    OPERATION_TYPE_CONTROLLER("opTy"),
    PRODUCTION_ORDER_CONTROLLER("prOr"),
    LAYER_SHAPE_CONTROLLER("laSh"),
    LOCAL_ERP_ORDER_CONTROLLER("loErOr"),
    NON_ERP_ORDER_CONTROLLER("noErOr"),
    RECTANGLE_SHAPE_CONTROLLER("reSh"),
    ATOMIC_OPERATION_TEMPLATE_CONTROLLER("atOpTe"),
    ATOMIC_PRODUCT_TEMPLATE_CONTROLLER("atPrTe"),
    PRODUCTION_ORDER_TEMPLATE_CONTROLLER("prOrTe"),
    PRODUCTION_GID_CONTROLLER("prGi"),
    USER_WORK_TIME("usWoTi"),
    USER_ML("usMl"),
    STORAGE_AREA_CONTROLLER("stAr"),
    WAREHOUSE_CONTROLLER("wr"),
    FILE("file"),
    INVENTORY("inventory"),
    PACK("pack"),
    CONTRACTOR("contractor"),
    PRINTER("printer"),
    WORK_PLACE("wrkPlc");

    private final String name;

    static {
        // check that the names are unique.
        if (Arrays.stream(CustomizedRestNames.values()).map(CustomizedRestNames::getName).distinct()
                .count() != CustomizedRestNames.values().length)
            throw new IllegalStateException("Names in CustomizedRestNames aren't unique.");
    }
}
