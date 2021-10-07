import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty} from "../../misc/misc";
import {NonErpOrderBasicDto} from "../../openapi/models";
import {nonErpOrderApi} from "../../api/exports";

export const NonErpOrderList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.NON_ERP_ORDER_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.orderNumber, label: "orderNumber"},
        {extractFunction: (object) => object.contractorName, label: "contractorName"},
        {extractFunction: (object) => object.contractorAddress, label: "contractorAddress"},
    ] as ListItemProperty<NonErpOrderBasicDto>[]} getObjectViaApi={nonErpOrderApi.noErOrGetObjectList}/>
}
