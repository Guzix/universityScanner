import React from "react";
import {Col, Container, Form, Modal, Row} from "react-bootstrap";
import {Fas, ListItemProperty, t} from "../../misc/misc";
import {machineApi, operationTypeApi, uploadMachineCalendarTaskFile} from "../../api/exports";
import {
    AtomicOperationBasicDto,
    AtomicProductBasicDto, IdAndTitle,
    MachineCalendarTaskCalendarDto,
    MachineCalendarTaskCalendarDtoPlanningStatusEnum,
    MachineCalendarTaskCalendarDtoProductionStatusEnum,
    MachineDto,
    OperationTypeBasicDto
} from "../../openapi/models";
import {
    enumToPrettyString,
    UniversalEnumSelect,
    UniversalInputType,
    UniversalMultiSelect,
    UniversalSingleSelect, UniversalSingleSimpleSelect
} from "../UniversalEdit";
import {UniversalSimpleObjectEdit, UniversalSimpleObjectEditWithoutApi} from "../UniversalSimpleObjectEdit";
import {UniversalListArray} from "../UniversalListArray";
import {
    MachineTaskOperationsEnum,
    MachineTaskReducerData,
    MachineTaskReducerParams, MachineTaskWithStatus
} from "./MachineCalendarTaskCalendarReducer";
import { notification} from "antd";
import {FileCardComponent} from "../FileCardComponent";
import Dropzone from "react-dropzone";


export const MachineTaskModal: React.FC<{state: MachineTaskReducerData, dispatch: (action: MachineTaskReducerParams) => void,
}> = ({state, dispatch}) => {

    const uploadFile = async (e: File) => {
        const result = e && await uploadMachineCalendarTaskFile(state.chosenMachineTaskWithStatus.machineTask.id, e);
        if (result === "OK") {
            notification.success({message:t("File added")})
            dispatch({type: MachineTaskOperationsEnum.ChooseMachineTask, machineTaskId: state.chosenMachineTaskWithStatus.machineTask.id} as MachineTaskReducerParams)
        }
    }

    return <Modal  show={state.chosenMachineTaskWithStatus} onHide={() => {dispatch({type: MachineTaskOperationsEnum.ChooseMachineTask} as MachineTaskReducerParams)}} size="xl">
        <Modal.Header closeButton>
            <Modal.Title>{`Zadanie nr ${state.chosenMachineTaskWithStatus?.machineTask?.id}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {/*<UniversalSimpleObjectEdit getSimpleObject={state.chosenMachineTaskWithStatus?.machineTask}*/}
            {/*                           save={machineCalendarTaskApi.saveWithAtomicOperations as any}*/}
            <UniversalSimpleObjectEditWithoutApi getSimpleObject={state.chosenMachineTaskWithStatus?.machineTask}
                                                 updateObject={(updatedObject: MachineCalendarTaskCalendarDto) => {dispatch({type: MachineTaskOperationsEnum.UpdateTask, changedMachineTaskWithStatus: {
                                                      ...state,
                                                          machineTask: updatedObject,
                                                          isEdited: true,
                                                          isChecked: false
                                                      } as MachineTaskWithStatus} as MachineTaskReducerParams
                                                  );}}
                                                 formElements={ (object: MachineCalendarTaskCalendarDto | undefined, setObject: (object: MachineCalendarTaskCalendarDto) => void) => <>
                               <UniversalSingleSimpleSelect fieldText={"machine"} getObjects={state.machines}
                                                            filedSizeCol={2} customSizeCol={10} fontWeight={"normal"}
                                                            getValue={(objectMachine: IdAndTitle) => objectMachine?.title}
                                                            defaultValue={object?.machine}
                                                            updateObject={(selectedObject: IdAndTitle ) => setObject({...object, machine: selectedObject })}
                               />
                               <UniversalSingleSimpleSelect fieldText={"operationType"} getObjects={state.operationTypes}
                                                            filedSizeCol={2} customSizeCol={10} fontWeight={"normal"}
                                                            getValue={(operationType: OperationTypeBasicDto) => operationType?.title}
                                                            defaultValue={object?.operationType}
                                                            disabled={true}
                               />
                               <UniversalEnumSelect
                                   updateObject={(selectObject) => setObject({...object, planningStatus: selectObject})}
                                   currentValue={object?.planningStatus}
                                   objectList={Object.values(MachineCalendarTaskCalendarDtoPlanningStatusEnum)}
                                   fieldText={t("Planning Status")}/>
                               <UniversalEnumSelect
                                   updateObject={(selectObject) => setObject({...object, productionStatus: selectObject})}
                                   currentValue={object?.productionStatus}
                                   objectList={Object.values(MachineCalendarTaskCalendarDtoProductionStatusEnum)}
                                   fieldText={t("Production Status")}/>
                               <Form.Group className="mb-3">
                                   <Row>
                                       <Col sm={2}>
                                           <Form.Label>{t("Files")}</Form.Label>
                                       </Col>
                                       <Col>
                                           <Row>
                                               <Dropzone onDrop={(e) => uploadFile(e[0])}>
                                                   {({getRootProps, getInputProps}) => (
                                                       <div  {...getRootProps()} className={"dropzone"}
                                                             style={{
                                                                 width: "100%",
                                                                 minHeight: 200,
                                                                 display: "flex",
                                                                 border: "2px dashed #4aa1f3",
                                                                 // border: state.fileList.length < 1 ? " 2px dashed #4aa1f3" : "none",
                                                                 alignItems: "center",
                                                                 textAlign: "center"
                                                             }}>
                                                           <input {...getInputProps()}  />
                                                           {state.fileList.length > 0 ? <Row>
                                                               {state.fileList.map((file, index) =>
                                                                   <Col style={{margin: 5}}>
                                                                       <div onClick={(e) => e.stopPropagation()}>
                                                                           <FileCardComponent file={file}
                                                                                              deletedButtonVisible={true}
                                                                                              deleteFile={(fileToDelete) => dispatch({
                                                                                                  type: MachineTaskOperationsEnum.DeleteFile,
                                                                                                  fileData: fileToDelete
                                                                                              })}
                                                                                              chooseFile={() => dispatch({
                                                                                                  type: MachineTaskOperationsEnum.ChooseFile,
                                                                                                  fileData: file
                                                                                              })}
                                                                           />
                                                                       </div>
                                                                   </Col>
                                                               )}
                                                           </Row> : <Col style={{fontSize: "17px",}}>
                                                               <Fas icon={"upload"}/>&nbsp; Drag 'n' drop some files here, or click to select files
                                                           </Col>
                                                           }
                                                       </div>
                                                   )}
                                               </Dropzone>
                                           </Row>
                                       </Col>
                                   </Row>
                               </Form.Group>
                               <UniversalListArray
                                   hideAddButton={true}
                                   properties={[{extractFunction: (object) => object.id, label:"Id"},
                                       {extractFunction: (object) => object.operationType?.title, label:t("Operation Type")},
                                       {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label:t("Operation Result")},
                                       {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Input Products")},
                                       {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Output Products")},
                                       {extractFunction: (object) => object.productionOrder?.erpOrder?.orderNumber, label: t("Order Number")}
                                   ] as ListItemProperty<AtomicOperationBasicDto>[]}
                                   getObjectArray={state.chosenMachineTaskWithStatus?.machineTask?.operationList}/>
                                                 </> }
                                                 primitiveKeys={[{key:"estimatedTime", htmlValueType: UniversalInputType.DURATION},
                                                     {key:"startDatePlanned", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                                                     {key:"endDatePlanned", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                                                     {key:"startDate", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                                                     {key:"endDate", htmlValueType: UniversalInputType.DATETIME_LOCAL},
                                                     {key:"info", htmlValueType: UniversalInputType.TEXTAREA}]}
            />
        </Modal.Body>
    </Modal>
}

export const MachineModal: React.FC<{state: MachineTaskReducerData, dispatch: (action: MachineTaskReducerParams) => void,
}> = ({state, dispatch}) => {
    return <Modal show={state.chosenMachine} onHide={() => {dispatch({type: MachineTaskOperationsEnum.ChooseMachine} as MachineTaskReducerParams)}} size="xl">
        <Modal.Header closeButton>
            <Modal.Title>{state.chosenMachine?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <UniversalSimpleObjectEdit
                getSimpleObject={state?.chosenMachine}
                save={machineApi.maSaveObject as any}
                formElements={(object: MachineDto | undefined, setObject: (object: MachineDto) => void) =>
                    <UniversalMultiSelect getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                          updateObject={(selectedObjects: OperationTypeBasicDto[]) => setObject({...object, operationTypeList: selectedObjects})}
                                          defaultValues={object?.operationTypeList}
                                          getValue={(object: OperationTypeBasicDto) => object.title}
                                          fieldText={t("Operation Types")}/>
                }
                primitiveKeys={[
                    {key:"title", htmlValueType: UniversalInputType.TEXT}]}/>
        </Modal.Body>
    </Modal>
}