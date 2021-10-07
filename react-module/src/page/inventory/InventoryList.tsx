import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty, t} from "../../misc/misc";
import {InventoryDto} from "../../openapi/models";
import {inventoryApi, packApi} from "../../api/exports";

export const InventoryList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.INVENTORY_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.title, label: t("title")},
    ] as ListItemProperty<InventoryDto>[] }   getObjectViaApi={inventoryApi.inventoryGetObjectList}/>
}