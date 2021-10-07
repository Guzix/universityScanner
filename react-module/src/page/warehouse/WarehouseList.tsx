import React from "react";
import {
    WarehouseBasicDto
} from "../../openapi/models";
import {UniversalList} from "../UniversalList";
import {warehouseApi} from "../../api/exports"
import {ListItemProperty, t} from "../../misc/misc";
import {PathPage} from "../../App";

export const WarehouseList: React.FC<{}> = () => {

    return <UniversalList onClickString={(id) => `${PathPage.WAREHOUSE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object?.id, label:"Id"},
        {extractFunction: (object) => object?.name, label:t("Warehouse")},
    ] as ListItemProperty<WarehouseBasicDto>[]}  getObjectViaApi={warehouseApi.wrGetObjectList}/>
}
