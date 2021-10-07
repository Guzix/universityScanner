import React from "react";
import {UniversalEdit, UniversalInputType, UniversalSingleSelect} from "../UniversalEdit";
import {
    storageAreaApi,
    warehouseApi
} from "../../api/exports";
import {PathPage} from "../../App";
import {StorageAreaExtendedDto, WarehouseBasicDto} from "../../openapi/models";

export const StorageAreaEdit: React.FC<{}> = () => {
    return <UniversalEdit formElements={(object: StorageAreaExtendedDto | undefined, setObject: (object: StorageAreaExtendedDto) => void) =>
        <UniversalSingleSelect fieldText={"warehouse"}
                              getObjectsViaApi={warehouseApi.wrGetObjectList}
                              getItemLabel={(objectWr: WarehouseBasicDto) => objectWr.name}
                              updateObject={(selectedObjects: WarehouseBasicDto ) => setObject({...object, warehouse: selectedObjects })}
                               defaultValue={object?.warehouse}/>
    }
                          getObjectViaApi={storageAreaApi.stArGetObject}
                          save={storageAreaApi.stArSaveObject as any}
                          primitiveKeys={[{key:"code", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.STORAGE_AREA_LIST}/>
}