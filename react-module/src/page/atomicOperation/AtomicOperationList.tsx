import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {AtomicOperationBasicDto, AtomicProductBasicDto} from "../../openapi/models";
import {atomicOperationApi} from "../../api/exports";
import {PathPage} from "../../App";
import {enumToPrettyString} from "../UniversalEdit";

export const AtomicOperationList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.ATOMIC_OPERATION_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.operationType?.title, label: "Operation Type"},
        {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label: "Operation Result",},
        {extractFunction: (object) => object.priority, label: "Priority",},
        {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:"Input Products"},
        {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:"Output Products"},
        {extractFunction: (object) => object.productionOrder?.erpOrder?.orderNumber, label: t("Order Number")},
    ] as ListItemProperty<AtomicOperationBasicDto>[]} getObjectViaApi={atomicOperationApi.atOpGetObjectList}/>
}