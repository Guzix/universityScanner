import React from "react";
import {UniversalEdit, UniversalEnumSelect, UniversalInputType, UniversalSingleSelect} from "../UniversalEdit";
import {atomicOperationApi, atomicProductApi, operationTypeApi} from "../../api/exports";
import {
    AtomicOperationExtendedDto, AtomicOperationExtendedDtoOperationResultEnum, OperationTypeBasicDto
} from "../../openapi/models";
import {PathPage} from "../../App";
import {UniversalTableSelect} from "../UniversalTableSelect";
import {t} from "../../misc/misc";

export const AtomicOperationEdit: React.FC<{}> = () => {
    return <UniversalEdit getObjectViaApi={atomicOperationApi.atOpGetObject}
                          save={atomicOperationApi.atOpSaveObject as any}
                          formElements={(object: AtomicOperationExtendedDto | undefined, setObject: (object: AtomicOperationExtendedDto) => void) => <>
                              <UniversalSingleSelect fieldText={t("operationType")}
                                                     getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                                     getItemLabel={(objectMachine: OperationTypeBasicDto) => objectMachine?.title}
                                                     defaultValue={object?.operationType}
                                                     updateObject={(selectedObject: OperationTypeBasicDto) => setObject({
                                                         ...object,
                                                         operationType: selectedObject
                                                     })}
                              />
                              <UniversalEnumSelect
                                  updateObject={(selectObject) => setObject({...object, operationResult: selectObject})}
                                  currentValue={object?.operationResult}
                                  objectList={Object.values(AtomicOperationExtendedDtoOperationResultEnum)}
                                  fieldText={t("operationResult")}/>

                              <UniversalTableSelect getObjectsViaApi={atomicProductApi.atPrGetObjectList}
                                                    selectedObjectList={object?.inputProducts}
                                                    setSelectedObjectList={(selectedObjects) => setObject({
                                                        ...object,
                                                        inputProducts: selectedObjects
                                                    })}
                                                    fieldText={t("Input Products")} properties={[
                                  {extractFunction: (object) => object.id, label: "Id"},
                                  {extractFunction: (object) => object.barcodeFromId, label: "Barcode"},
                                  {
                                      extractFunction: (object) => object.atomicProductDefinition?.title,
                                      label: t("Product Definition Name")
                                  },
                                  {extractFunction: (object) => object.layerNumber, label: t("layerNumber")}
                              ]} editLink={PathPage.ATOMIC_PRODUCT_EDIT}/>

                              <UniversalTableSelect getObjectsViaApi={atomicProductApi.atPrGetObjectList}
                                                    selectedObjectList={object?.outputProducts}
                                                    setSelectedObjectList={(selectedObjects) => setObject({
                                                        ...object,
                                                        outputProducts: selectedObjects
                                                    })}
                                                    fieldText={t("Output Products")} properties={[
                                  {extractFunction: (object) => object.id, label: "Id"},
                                  {extractFunction: (object) => object.barcodeFromId, label: "Barcode"},
                                  {
                                      extractFunction: (object) => object.atomicProductDefinition?.title,
                                      label: t("Product Definition Name")
                                  },
                                  {extractFunction: (object) => object.layerNumber, label: t("layerNumber")}
                              ]} editLink={PathPage.ATOMIC_PRODUCT_EDIT}/>
                          </>}
                          primitiveKeys={[{key: "priority", htmlValueType: UniversalInputType.NUMBER},]}
                          onSubmitString={PathPage.ATOMIC_OPERATION_LIST}/>
}
