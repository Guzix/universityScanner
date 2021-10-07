import React from "react";
import {UniversalEdit, UniversalInputType, UniversalMultiSelect} from "../UniversalEdit";
import {atomicProductDefinitionApi, operationTypeApi} from "../../api/exports";
import {MachineDto, OperationTypeExtendedDto} from "../../openapi/models";
import {PathPage} from "../../App";

export const OperationTypeEdit: React.FC<{}> = () => {
     return <UniversalEdit formElements={(object: OperationTypeExtendedDto | undefined, setObject: (object: OperationTypeExtendedDto) => void) =>
                              <UniversalMultiSelect fieldText={"Allowed Product Definitions"} getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                                    getValue={(object: MachineDto) => object.title}
                                                    defaultValues={object?.allowedAtomicProductDefinitions}
                                                    updateObject={(selectedObjects: MachineDto[] ) => setObject({...object, allowedAtomicProductDefinitions: selectedObjects })}/>
                          }
                          getObjectViaApi={operationTypeApi.opTyGetObject}
                          save={operationTypeApi.opTySaveObject as any} primitiveKeys={[{key:"title", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.OPERATION_TYPE_LIST}/>
}
