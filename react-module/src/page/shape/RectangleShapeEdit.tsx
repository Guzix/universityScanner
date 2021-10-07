import React from "react";
import {UniversalEdit, UniversalInputType} from "../UniversalEdit";
import {rectangleShapeApi} from "../../api/exports";
import {PathPage} from "../../App";

export const RectangleShapeEdit: React.FC<{}> = () => {
    return <UniversalEdit formElements={ () => <></> }
                          getObjectViaApi={rectangleShapeApi.reShGetObject}
                          save={rectangleShapeApi.reShSaveObject as any}
                          primitiveKeys={[{key: "height", htmlValueType: UniversalInputType.TEXT}, {key: "width", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.RECTANGLE_SHAPE_LIST}/>
}
