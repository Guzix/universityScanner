import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {
    AtomicProductParameterTypeBasicDto
} from "../../openapi/models";
import {atomicProductParameterTypeApi} from "../../api/exports";
import {PathPage} from "../../App";

export const AtomicProductParameterTypeList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_PARAMETER_TYPE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.title, label: t("Name")},
    ] as ListItemProperty<AtomicProductParameterTypeBasicDto>[]}
                          getObjectViaApi={atomicProductParameterTypeApi.atPrPaTyGetObjectList}/>
}