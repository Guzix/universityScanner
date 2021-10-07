import React from "react";
import {UniversalEdit, UniversalSingleSelect} from "../UniversalEdit";
import {machineApi, printerApi, workPlaceApi} from "../../api/exports";
import {PathPage} from "../../App";
import {FailableResourceWorkPlaceDtoStatusEnum, MachineDto, PrinterDto, WorkPlaceDto} from "../../openapi/models";
import {useParams} from "react-router-dom";
import {processRawRes, t, withinGuard} from "../../misc/misc";
import {Button} from "react-bootstrap";
import {notification} from "antd";
import {SpinCentered} from "../../CommonComponent";


export const WorkPlaceEdit: React.FC<{}> = () =>{
    const {id}: { id: string | undefined } = useParams();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [reseating, setReseating] = React.useState<boolean>(false);

     const resetWorkPlace = async() => {
         await withinGuard(setReseating, async () => {
             await processRawRes<FailableResourceWorkPlaceDtoStatusEnum>(
                 () => workPlaceApi.resetWorkPlace(Number(id)) as any,
                 async (actionResult) => {
                     if (actionResult == FailableResourceWorkPlaceDtoStatusEnum.OK) {
                         window.location.reload()
                     } else {
                         notification.error({message: "Reset Error"})
                     }
                 }
             )
         });
    }


    return <>
        {reseating ? <SpinCentered/> :
        <UniversalEdit formElements={(object: WorkPlaceDto | undefined, setObject: (object: WorkPlaceDto) => void) => <>
            <UniversalSingleSelect fieldText={"machine"}
                                   getObjectsViaApi={()=>workPlaceApi.getMachineList(isEditPage ? Number(id) : 0)}
                                   updateObject={(selectedObjects: MachineDto) => setObject({...object, machine: selectedObjects})}
                                   getItemLabel={(object: MachineDto) => `${object.title}`}
                                   defaultValue={object?.machine} nullable={true}
            />
            <UniversalSingleSelect fieldText={"printer"}
                                   getObjectsViaApi={printerApi.printerGetObjectList}
                                   updateObject={(selectedObjects: PrinterDto) => setObject({...object, printer: selectedObjects})}
                                   getItemLabel={(object: PrinterDto) => `${object.name}`}
                                   defaultValue={object?.printer} nullable={true}
            />
            <Button onClick={resetWorkPlace} hidden={isNaN(Number(id))} variant={"outline-danger"} >{t("Clear Work Place")}</Button>
        </>}
            getObjectViaApi={workPlaceApi.wrkPlcGetObject}
            save={workPlaceApi.wrkPlcSaveObject as any}
            delete={workPlaceApi.wrkPlcDeleteObject as any}
            primitiveKeys={[]}
            onSubmitString={PathPage.WORK_PLACE_LIST}
        />}
    </>
}