import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {AtomicProductDefinitionBasicDto} from "../../openapi/models";
import {atomicProductDefinitionApi} from "../../api/exports";
import {PathPage} from "../../App";

export const AtomicProductDefinitionList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_TYPE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) =>
            `${object.title}${object.parent?.title ? ` -> ${object.parent?.title}` :
            ``}${object.parent?.parent?.title ? ` -> ${object.parent?.parent?.title}` :
            ``}${object.parent?.parent?.parent?.title ? ` -> ${object.parent?.parent?.parent?.title}` :
            ``}${object.parent?.parent?.parent?.parent?.title ? ` -> ${object.parent?.parent?.parent?.parent?.title}` :``}`
            , label: t("Name")},
    ] as ListItemProperty<AtomicProductDefinitionBasicDto>[]}
                          getObjectViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}/>
}