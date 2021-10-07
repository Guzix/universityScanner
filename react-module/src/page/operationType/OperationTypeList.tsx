import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {OperationTypeBasicDto} from "../../openapi/models";
import {operationTypeApi} from "../../api/exports";
import {PathPage} from "../../App";

export const OperationTypeList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.OPERATION_TYPE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.title, label: t("Name")},
    ] as ListItemProperty<OperationTypeBasicDto>[] }   getObjectViaApi={operationTypeApi.opTyGetObjectList}/>
}