import React from "react";
import {atomicProductApi, atomicProductDefinitionApi} from "../../api/exports";
import {
    AtomicProductBasicDto,
    AtomicProductExtendedDto, AtomicProductDefinitionBasicDto
} from "../../openapi/models";
import {UniversalEdit, UniversalInputType, UniversalSingleSelect} from "../UniversalEdit";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {PathPage} from "../../App";

export const AtomicProductEdit: React.FC<{}> = () => {
    return <UniversalEdit getObjectViaApi={atomicProductApi.atPrGetObject}
                          save={atomicProductApi.atPrSaveObject as any}
                          formElements={ (object: AtomicProductExtendedDto | undefined, setObject: (object: AtomicProductExtendedDto) => void) => <>
                              <UniversalSingleSelect fieldText={t("atomicProductType")} getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                               getItemLabel={(objectMachine: AtomicProductDefinitionBasicDto) => objectMachine?.title}
                                               defaultValue={object?.atomicProductDefinition}
                                               updateObject={(selectedObject: AtomicProductDefinitionBasicDto ) => setObject({...object, atomicProductDefinition: selectedObject })}
                              />
                              <p>Wewnętrzne Produkty (mockup component)</p>
                              <UniversalList getObjectViaApi={atomicProductApi.atPrGetObjectList} onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_EDIT}/${id}`} properties={[
                                  {extractFunction: (object) => object.id, label: "Id"},
                                  {extractFunction: (object) => object.barcodeFromId, label: "Barcode"},
                                  {extractFunction: (object) => object.atomicProductDefinition?.title, label: "Product Definition Name"},
                                  {extractFunction: (object) => object.layerNumber, label: "layerNumber"}
                              ] as ListItemProperty<AtomicProductBasicDto>[]}/>
                          </> }
                          primitiveKeys={[{key: "layerNumber", htmlValueType: UniversalInputType.TEXT},]}
                          onSubmitString={PathPage.ATOMIC_PRODUCT_LIST}/>
}
