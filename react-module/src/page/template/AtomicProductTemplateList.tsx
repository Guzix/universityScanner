import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {AtomicProductTemplateDto} from "../../openapi/models";
import {atomicProductTemplateApi} from "../../api/exports";
import {PathPage} from "../../App";
import {enumToPrettyString} from "../UniversalEdit";

export const AtomicProductTemplateList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_TEMPLATE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.title, label: t("Name")},
        {extractFunction: (object) =>
                `${t(enumToPrettyString(object.layerShape?.layerShapeType?.valueOf()))} ${object.layerShape?.rectangleShape?.height} x ${object.layerShape?.rectangleShape?.width} mm` ,
            label: t("Layer")},
        {extractFunction: (object) => object.layerNumber, label: t("Layer Number")},
        {extractFunction: (object) => object.atomicProductDefinition?.title, label: t("Product Definition")},
    ] as ListItemProperty<AtomicProductTemplateDto>[]} getObjectViaApi={atomicProductTemplateApi.atPrTeGetObjectList}/>
}