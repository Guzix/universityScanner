import React from "react";
import {UniversalEnumSelect, UniversalEdit, UniversalSingleSelect} from "../UniversalEdit";
import {layerShapeApi, rectangleShapeApi} from "../../api/exports";
import {PathPage} from "../../App";
import {
    LayerShapeExtendedDto,
    LayerShapeExtendedDtoLayerShapeTypeEnum,
    RectangleShapeExtendedDto
} from "../../openapi/models";

export const LayerShapeEdit: React.FC<{}> = () => {
    return <UniversalEdit formElements={(object: LayerShapeExtendedDto | undefined, setObject: (object: LayerShapeExtendedDto) => void) => <>
                              <UniversalEnumSelect
                                  updateObject={(selectObject) => setObject({...object, layerShapeType: selectObject})}
                                  currentValue={object?.layerShapeType} objectList={Object.values(LayerShapeExtendedDtoLayerShapeTypeEnum)}
                                  fieldText={"Shape"}/>
                              <UniversalSingleSelect fieldText={"Dimensions"} getObjectsViaApi={rectangleShapeApi.reShGetObjectList}
                              getItemLabel={(object: RectangleShapeExtendedDto) => `${object?.height} x ${object?.width} mm`}
                              defaultValue={object?.rectangleShape}
                              updateObject={(selectObject: RectangleShapeExtendedDto) => setObject({...object, rectangleShape: selectObject})}/>
                          </> }
                          getObjectViaApi={layerShapeApi.laShGetObject}
                          save={layerShapeApi.laShSaveObject as any}
                          primitiveKeys={[]}
                          onSubmitString={PathPage.LAYER_SHAPE_LIST}/>
}
