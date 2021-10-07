import React from "react";
import {Col, Form, Modal, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {ListItemProperty, t} from "../../misc/misc";
import {UniversalEnumSelect} from "../UniversalEdit";
import {
    AtomicOperationBasicDto,
    AtomicOperationBasicDtoGroupingOptionEnum,
    AtomicProductBasicDto, MachineDto
} from "../../openapi/models";
import {UniversalListArray} from "../UniversalListArray";
import {machineCalendarTaskApi} from "../../api/exports";
import {PathPage} from "../../App";
import {useHistory} from "react-router-dom";
import {toFragments, toIso} from "pomeranian-durations";


export const AtomicOperationAssignModal: React.FC<{
    showModal: boolean, initialDeny: () => void,
    atomicOperations: AtomicOperationBasicDto[] | undefined,
    machine:MachineDto | undefined,
    operationTypeId:number,
    path?: string
}> = ({
          showModal,initialDeny, atomicOperations,machine,path, operationTypeId
      }) => {
    const [optionToGroup, setOptionToGroup] = React.useState<AtomicOperationBasicDto>();
    const [estimatedTime, setEstimatedTime] = React.useState<string>("PT1H");
    const history = useHistory();
    const generateMachineCalendarTask = async () => {
        const atomicOperationsId: number[] = [];
        atomicOperations?.forEach(operation => {
            atomicOperationsId.push(operation?.id)})
        const option: any = optionToGroup?.groupingOption?.toString();
        await machineCalendarTaskApi.createNewMachineCalendarTasksForOperations(
            atomicOperationsId,
            operationTypeId,
            option,
            estimatedTime,
            machine?.id);
    }
    const historyPath = history?.location?.pathname;
    return <Modal show={showModal} onHide={initialDeny} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>{t("Grouping  of operations")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group>
                    <Form.Label className="mr-2">{t("Options of grouping")}:</Form.Label>
                   <UniversalEnumSelect
                        updateObject={(selectObject) => setOptionToGroup({...optionToGroup, groupingOption: selectObject})}
                        currentValue={optionToGroup?.groupingOption} objectList={Object?.values(AtomicOperationBasicDtoGroupingOptionEnum)}
                        fieldText={""}/>
                    <Form.Label className="mr-2">{t("estimatedTime")}</Form.Label>
                        <Row>
                            <Col xs={2}>
                                <Form.Control type={"number"} min={0}
                                              value={toFragments(estimatedTime).hours}
                                              name={"estimatedTime"}
                                              onChange={(e) => {
                                                  setEstimatedTime(toIso({hours: e.target.value, minutes: toFragments(estimatedTime).minutes}))
                                              }}/>
                            </Col>
                            <Col xs={2}>
                                <Form.Control type={"number"} min={0} max={59}
                                              value={toFragments(estimatedTime).minutes}
                                              name={"estimatedTime"}
                                              onChange={(e) => {
                                                  setEstimatedTime(toIso({minutes: e.target.value, hours: toFragments(estimatedTime).hours}))
                                              }}/>
                            </Col>
                        </Row>
                </Form.Group>
            </Form>
            <UniversalListArray
                hideAddButton={true}
                properties={[
                    {extractFunction: (object) => object.id, label: "Id"},
                    {extractFunction: (object) => object.operationType?.title, label: t("Operation Type")},
                    {extractFunction: (object) => object.priority, label: t("Priority")},
                    {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Input Products")},
                    {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Output Products")},
                ] as ListItemProperty<AtomicOperationBasicDto>[]} getObjectArray={atomicOperations}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={initialDeny}>{t("Close")}</Button>
            <Button variant="primary" disabled={optionToGroup === null || optionToGroup === undefined}
                    onClick={() => {
                    generateMachineCalendarTask();
                    initialDeny();
                    if(historyPath === path) {
                        setTimeout(() => {window.location.reload()}, 1000);
                    } else {
                        setTimeout(() => {history.push(path ? path : PathPage.MACHINE_CALENDAR_TASK_LIST);},1000)
                    }
                    }
            }>{t("Confirm")}</Button>
        </Modal.Footer>
    </Modal>
}
