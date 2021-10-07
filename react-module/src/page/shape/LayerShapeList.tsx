import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {LayerShapeBasicDto} from "../../openapi/models";
import {layerShapeApi} from "../../api/exports";
import {PathPage} from "../../App";
import {enumToPrettyString} from "../UniversalEdit";

export const LayerShapeList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.LAYER_SHAPE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => t(enumToPrettyString(object.layerShapeType?.valueOf())), label: t("Shape")},
        {extractFunction: (object) => `${object.rectangleShape?.height} x ${object.rectangleShape?.width} mm`, label: t("Dimensions")},
    ] as ListItemProperty<LayerShapeBasicDto>[]} getObjectViaApi={layerShapeApi.laShGetObjectList}/>
}