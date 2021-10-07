import React from "react";
import {enumToPrettyString, UniversalEdit, UniversalInputType, UniversalSingleSelect} from "../UniversalEdit";
import {atomicProductTemplateApi, layerShapeApi, atomicProductDefinitionApi} from "../../api/exports";
import {PathPage} from "../../App";
import {
    AtomicProductTemplateDto,
    AtomicProductDefinitionBasicDto,
    LayerShapeBasicDto,
} from "../../openapi/models";
import {t} from "../../misc/misc";

export const AtomicProductTemplateEdit: React.FC<{}> = () => {
    return <UniversalEdit
                          formElements={(object: AtomicProductTemplateDto | undefined, setObject: (object: AtomicProductTemplateDto) => void) => <>
                              <UniversalSingleSelect fieldText={t("Product Definition")} getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                                     getItemLabel={(object: AtomicProductDefinitionBasicDto) => object?.title}
                                                     defaultValue={object?.atomicProductDefinition}
                                                     updateObject={(selectObject: AtomicProductDefinitionBasicDto) => setObject({...object, atomicProductDefinition: selectObject})}/>
                              <UniversalSingleSelect fieldText={t("Layer")} getObjectsViaApi={layerShapeApi.laShGetObjectList}
                                                     getItemLabel={(object: LayerShapeBasicDto) => `${t(enumToPrettyString(object.layerShapeType?.valueOf()))} ${object.rectangleShape?.height} x ${object.rectangleShape?.width} mm`}
                                                     defaultValue={object?.layerShape}
                                                     updateObject={(selectObject: LayerShapeBasicDto) => setObject({...object, layerShape: selectObject})}/>
                          </> }
                          getObjectViaApi={atomicProductTemplateApi.atPrTeGetObject}
                          save={atomicProductTemplateApi.atPrTeSaveObject as any}
                          primitiveKeys={[{key: "title", htmlValueType: UniversalInputType.TEXT}, {key: "layerNumber", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.ATOMIC_PRODUCT_TEMPLATE_LIST}/>
}
