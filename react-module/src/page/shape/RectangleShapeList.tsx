import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {RectangleShapeBasicDto} from "../../openapi/models";
import {rectangleShapeApi} from "../../api/exports";
import {PathPage} from "../../App";

export const RectangleShapeList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.RECTANGLE_SHAPE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.height, label: t("Height") + " (mm)"},
        {extractFunction: (object) => object.width, label: t("Width") + " (mm)"},
    ] as ListItemProperty<RectangleShapeBasicDto>[]} getObjectViaApi={rectangleShapeApi.reShGetObjectList}/>
}