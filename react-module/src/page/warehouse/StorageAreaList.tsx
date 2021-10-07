import React from "react";
import {
    StorageAreaBasicDto,
} from "../../openapi/models";
import {UniversalList} from "../UniversalList";
import {storageAreaApi} from "../../api/exports"
import {ListItemProperty, t} from "../../misc/misc";
import {PathPage} from "../../App";

export const StorageAreaList: React.FC<{}> = () => {

    return <>
        <UniversalList onClickString={(id) => `${PathPage.STORAGE_AREA_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object?.id, label:"Id"},
        {extractFunction: (object) => object?.warehouse?.name, label:t("Warehouse")},
        {extractFunction: (object) => object?.code, label:t("Storage Area")},
    ] as ListItemProperty<StorageAreaBasicDto>[]}  getObjectViaApi={storageAreaApi.stArGetObjectList}/>
    </>
}
