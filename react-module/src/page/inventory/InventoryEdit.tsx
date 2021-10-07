import React from "react";
import {UniversalEdit, UniversalEnumSelect, UniversalInputType} from "../UniversalEdit";
import {inventoryApi} from "../../api/exports";
import {PathPage} from "../../App";
import {
   InventoryDtoInventoryStatusEnum
} from "../../openapi/models";

export const InventoryEdit: React.FC<{}> = () => {
    return <UniversalEdit formElements={(object, setObject) => <><UniversalEnumSelect
        updateObject={(selectObject) => setObject({...object, inventoryStatus: selectObject})}
        currentValue={object?.inventoryStatus} objectList={Object?.values(InventoryDtoInventoryStatusEnum)}
        fieldText={"Status"}/>
    </>}
                            getObjectViaApi={inventoryApi.inventoryGetObject}
                            save={inventoryApi.inventorySaveObject as any}
                            primitiveKeys={[
                                {key: "title", htmlValueType: UniversalInputType.TEXT}
                            ]}
                            onSubmitString={PathPage.INVENTORY_LIST}/>
}
