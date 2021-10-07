import React from "react";
import {machineApi, operationTypeApi} from "../../api/exports";
import {PathPage} from "../../App";
import {UniversalEdit, UniversalInputType, UniversalMultiSelect} from "../UniversalEdit";
import {MachineDto, OperationTypeBasicDto} from "../../openapi/models";
import {t} from "../../misc/misc";

export const MachineEdit: React.FC<{}> = () => {
    return <UniversalEdit getObjectViaApi={machineApi.maGetObject}
                       save={machineApi.maSaveObject as any}
                       formElements={(object: MachineDto | undefined, setObject: (object: MachineDto) => void) =>
                           <UniversalMultiSelect getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                           updateObject={(selectedObjects: OperationTypeBasicDto[]) => setObject({...object, operationTypeList: selectedObjects})}
                           defaultValues={object?.operationTypeList}
                           getValue={(object: OperationTypeBasicDto) => object.title}
                           fieldText={t("Operation Types")}/>
                       }
                       primitiveKeys={[
                           {key:"title", htmlValueType: UniversalInputType.TEXT}]}
                       onSubmitString={PathPage.MACHINE_LIST}/>
}
