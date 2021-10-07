import React from "react";

import {
    AtomicOperationBasicDto,
    AtomicOperationExtendedDtoOperationResultEnum,
    AtomicProductBasicDto,
    MachineCalendarTaskExtendedDto,
    MachineCalendarTaskExtendedDtoPlanningStatusEnum,
    MachineCalendarTaskExtendedDtoProductionStatusEnum,
    MachineDto,
    OperationTypeBasicDto, SurfaceWithPlacedEntities
} from "../../openapi/models";

import {
    enumToPrettyString,
    UniversalEdit,
    UniversalEnumSelect,
    UniversalInputType,
    UniversalSingleSelect
} from "../UniversalEdit";
import {atomicOperationApi, machineApi, machineCalendarTaskApi, operationTypeApi} from "../../api/exports";
import {Fas, ListItemProperty, t} from "../../misc/misc";
import {PathPage} from "../../App";
import {UniversalListArray} from "../UniversalListArray";
import {Button as AntButton, Card, Input} from "antd";
import {useTranslation} from "react-i18next";
import {MachineCalendarTaskConfirmModal} from "./MachineCalendarTaskConfirmModal";
import {useHistory} from "react-router-dom";
import {indexOf} from "lodash";
import {displayFillRatio, DownloadDxfButton, getWasteWithFormat, SpacedBetween, SurfaceWithEntitiesRenderer} from "../../CommonComponent";

export const createProductAppend = (product: AtomicProductBasicDto):string => {
    const layerShape = product.layerShape;
    if(layerShape == null) {
        return "";
    }
    const rectangleShape = layerShape.rectangleShape;
    if(rectangleShape == null) {
        return '";'
    }

    return " - " + rectangleShape.width + " x " + rectangleShape.height + " mm";
}

export const CuttingOptimizationComponent: React.FC<{calendarTaskId: number}> = ({calendarTaskId}) => {
    const [width, setWidth] = React.useState<number>(1000);
    const [height, setHeight] = React.useState<number>(1000);
    const [targetLink, setTargetLink] = React.useState<string | null>(
        // `/cutting/machineCalendarTask/${calendarTaskId}/${width}/${height}`
        null
    );

    const generate = () => {
        setTargetLink(`/cutting/machineCalendarTask/${calendarTaskId}/${width}/${height}`);
    }
    const {t} = useTranslation();

    return (
        <Card title={<><Fas icon={"cut"}/>&nbsp;{t("Cutting Optimization")}</>} size={"small"}>

            <div className={"mb-1"}>Szerokość [mm]</div>
            <Input type="number" value={width} onChange={evt => setWidth(parseInt(evt.target.value))}/>
            <div className={"mb-1"}>Wysokość [mm]</div>
            <Input type="number" value={height} onChange={evt => setHeight(parseInt(evt.target.value))} className={"mb-2"}/>

            {targetLink && <div style={{backgroundImage: `url('${targetLink}')`}} className={"generated-cut-image"}/>}

            <AntButton type={"primary"} size={"middle"} block className={"mt-1"} onClick={generate}
                       disabled={width === 0 || height === 0}
            >
                <Fas icon={"cut"}/>&nbsp; {t("Optimize")}
            </AntButton>
        </Card>
    )
}

export const SwpeRenderer : React.FC<{swpe: SurfaceWithPlacedEntities}> = ({swpe}) => {
    return (
        <Card key={swpe.surface.id} size={"small"} style={{display: "inline-block"}}
            title={
                <SpacedBetween>
                    <div> <Fas icon={"th"}/>&nbsp; Tafla ({swpe.surface.width} x {swpe.surface.height}) {displayFillRatio(swpe.fillRatio)} {getWasteWithFormat(swpe)} </div>
                    <DownloadDxfButton spe={swpe}/>
                </SpacedBetween>
            }
        >
            <SurfaceWithEntitiesRenderer obj={swpe} key={swpe.surface.id} maxWidth={window.screen.width / 4}/>
        </Card>
    )
}

export const MachineCalendarTaskEdit: React.FC<{}> = () => {
    const {t} = useTranslation();
    const [showModal, setShowModal] = React.useState<boolean>(false)
    const history = useHistory()
    const addPage = history?.location?.pathname === "/machine-calendar-task/edit/new"
    return <div>
        <UniversalEdit getObjectViaApi={machineCalendarTaskApi.maCaTaGetObject}
                       save={machineCalendarTaskApi.saveWithAtomicOperations as any}
                       defaultCreateValue={{planningStatus: MachineCalendarTaskExtendedDtoPlanningStatusEnum.INIT,
                           productionStatus: MachineCalendarTaskExtendedDtoProductionStatusEnum.INIT, estimatedTime: "PT1H"}}
                       formElements={ (object: MachineCalendarTaskExtendedDto | undefined, setObject: (object: MachineCalendarTaskExtendedDto) => void) => <>
                      <UniversalSingleSelect fieldText={"machine"} getObjectsViaApi={machineApi.maGetObjectList}
                                            getItemLabel={(objectMachine: MachineDto) => objectMachine?.title}
                                            defaultValue={object?.machine}
                                            updateObject={(selectedObject: MachineDto ) => setObject({...object, machine: selectedObject })}
                                            />
                           <UniversalSingleSelect fieldText={"operationType"} getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                                  getItemLabel={(operationType: OperationTypeBasicDto) => operationType?.title}
                                                  defaultValue={object?.operationType}
                                                  disabled={!addPage}
                                                  updateObject={(selectedObject: OperationTypeBasicDto ) => setObject({...object, operationType: selectedObject })}
                           />
                           <UniversalEnumSelect
                               updateObject={(selectObject) => setObject({...object, planningStatus: selectObject})}
                               currentValue={object?.planningStatus}
                               objectList={Object.values(MachineCalendarTaskExtendedDtoPlanningStatusEnum)}
                               fieldText={t("Planning Status")}/>
                           <UniversalEnumSelect
                               updateObject={(selectObject) => setObject({...object, productionStatus: selectObject})}
                               currentValue={object?.productionStatus}
                               objectList={Object.values(MachineCalendarTaskExtendedDtoProductionStatusEnum)}
                               fieldText={t("Production Status")}/>
                           {/*<UniversalTableSelect getObjectsViaApi={atomicOperationApi.getAtomicOperationsWithNotStartedResult}
                                                 selectedObjectList={object?.operationList as AtomicOperationBasicDto[]}
                                                 setSelectedObjectList={(selectedObjects => setObject({
                                                     ...object,
                                                     operationList:selectedObjects
                                                 }))}
                                                 fieldText={t("Planned Operations")}
                                                 properties={[
                                                     {extractFunction: (object) => object.id, label:"Id"},
                                                     {extractFunction: (object) => object.operationType?.title, label:t("Operation Type")},
                                                     {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label:t("Operation Result")},
                                                     {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Input Products")},
                                                     {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Output Products")},
                                                     {extractFunction: (object) => (`${t("Order Number")}: ${object.productionOrder?.id}, ERP: ${object.productionOrder?.orderNumber}`), label: t("Order")}
                                                 ] as ListItemProperty<AtomicOperationBasicDto>[]}   editLink={PathPage.ATOMIC_OPERATION_EDIT}/>*/}
                           <UniversalListArray
                               hideAddButton={true}
                               properties={[
                                   {extractFunction: (object) => object.id, label:"Id"},
                                   {extractFunction: (object) => object.operationType?.title, label:t("Operation Type")},
                                   {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label:t("Operation Result")},
                                   {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Input Products")},
                                   {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} ${createProductAppend(product)} \n`), label:t("Output Products")},
                                   {extractFunction: (object) => object.productionOrder?.erpOrder?.orderNumber, label: t("Order Number")}
                               ] as ListItemProperty<AtomicOperationBasicDto>[]}
                               getObjectArray={object?.operationList}/>
                           {/*{object && <CuttingOptimizationComponent calendarTaskId={object.id}/>}*/}
                           {object?.spe && <SwpeRenderer swpe={object?.spe}/>}
                           </> }
                       primitiveKeys={[
                           {key:"estimatedTime", htmlValueType: UniversalInputType.DURATION},
                           {key:"startDatePlanned", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                           {key:"endDatePlanned", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                           {key:"startDate", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                           {key:"endDate", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                           {key:"info", htmlValueType: UniversalInputType.TEXTAREA}]}
                       onSubmitString={PathPage.MACHINE_CALENDAR_TASK_LIST}/>
        <MachineCalendarTaskConfirmModal initialDeny={() => setShowModal(false)} showModal={showModal} save={machineCalendarTaskApi.saveWithAtomicOperations as any}/>
    </div>
}
