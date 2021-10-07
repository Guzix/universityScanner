import React from "react";
import {UniversalEdit, UniversalInputType} from "../UniversalEdit";
import {warehouseApi} from "../../api/exports";
import {PathPage} from "../../App";

export const WarehouseEdit: React.FC<{}> = () => {
    return <UniversalEdit formElements={() => <></>}
                          getObjectViaApi={warehouseApi.wrGetObject}
                          save={warehouseApi.wrSaveObject as any}
                          primitiveKeys={[{key:"name", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.WAREHOUSE_LIST}/>
}