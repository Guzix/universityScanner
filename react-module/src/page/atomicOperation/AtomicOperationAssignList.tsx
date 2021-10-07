import React, {FC, useEffect, useState} from "react";
import {ListItemProperty, t} from "../../misc/misc";
import {
    AtomicOperationBasicDto,
    AtomicProductBasicDto,
    IdAndTitle,
    MachineDto,
    OperationTypeBasicDto,
} from "../../openapi/models";
import {atomicOperationApi, machineApi, operationTypeApi} from "../../api/exports";
import {Button, Col, FormCheck, Row} from "react-bootstrap";
import {AtomicOperationAssignModal} from "./AtomicOperationAssignModal";
import {enumToPrettyString, UniversalSingleSelect, UniversalSingleSimpleSelect} from "../UniversalEdit";
import {UniversalListArray} from "../UniversalListArray";
import {useHistory} from "react-router-dom";
import {isEmpty} from "lodash";
import {notification} from "antd";

export const AtomicOperationAssignList: FC<{
    path?: string, show?: boolean
}> = ({path,show}) => {
    const [atomicOperationsId, setAtomicOperationsId] = useState<number[]>([]);
    const [operation, setOperation] = useState<OperationTypeBasicDto>();
    const [atomicOperationList, setAtomicOperationList] = useState<AtomicOperationBasicDto[] | undefined>();
    const [atomicOperationToGroup, setAtomicOperationToGroup] = useState<AtomicOperationBasicDto[] | undefined>();
    const [orderNumberList, setOrderNumberList] = useState<IdAndTitle[]>([]);
    const [orderNumber, setOrderNumber] = useState<IdAndTitle>();
    const [machine, setMachine] = useState<MachineDto>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectAll, setSelectAll] = useState<boolean>(true);
    const history = useHistory();

    const atomicOperationFiltered = atomicOperationList?.filter(atomicOp => atomicOp?.operationType?.id == operation?.id)

    const downloadList = async () => {
        const response = await atomicOperationApi.getAtomicOperationsWithNotStartedResult();
        const result = response.data;
        if (response.status === 200) {
            setAtomicOperationList(result);
            const uniqueOrderNumberList = Array.from(new Set(result.map((v) => v.productionOrder?.erpOrder?.orderNumber)))
            setOrderNumberList([{id: 0, title: t("All")}])
            uniqueOrderNumberList.map((unique, index) => setOrderNumberList(state => [...state, {id: index+1, title: unique}]))
        } else {
            notification.error({message: response.statusText});
        }
    }
    useEffect(() => {
            downloadList();
    }, []);
    const mainPath = history.location.pathname != path;
    return <>
        {(show || mainPath) && <Row style={{marginTop:"1rem"}}>
            <Col sm={2} style={{marginLeft:"1rem"}}>
                <Button variant={selectAll ? "success" : "danger"}
                        onClick={() => {
                            selectAll ? setAtomicOperationsId(atomicOperationFiltered?.map((value) => value.id) || []) : setAtomicOperationsId([]);
                            setSelectAll((select: any) => !select)
                        }}
                        disabled={!operation || isEmpty(atomicOperationFiltered)}>{selectAll ? t("Select All") : t("Unselect All")}</Button>
            </Col>
            <Col sm={2}>
                <UniversalSingleSimpleSelect fieldText={""}
                                             useEffect={false}
                                             customSizeCol={12}
                                             getObjects={orderNumberList}
                                             getValue={(object: IdAndTitle) => object.title}
                                             updateObject={(selectedObject: IdAndTitle) => setOrderNumber(selectedObject)}
                                             defaultValue={orderNumber?.title}
                                             placeholder={t("Order Number")}
                />
            </Col>
            <Col sm={2}>
                <UniversalSingleSelect fieldText={""}
                                       placeholder={"Operation Type"}
                                       getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                       getItemLabel={(operationType: OperationTypeBasicDto) => operationType?.title}
                                       defaultValue={operation}
                                       updateObject={(selectedObject: OperationTypeBasicDto ) => {
                                           setOperation({...operation, id: selectedObject.id})
                                           setAtomicOperationsId([])
                                           setSelectAll(true)
                                       }}
                />
            </Col>
            <Col sm={2} style={{marginLeft:"1rem"}}>
                <UniversalSingleSelect fieldText={""}
                                       placeholder={"Machine"}
                                       getObjectsViaApi={machineApi.maGetObjectList}
                                       getItemLabel={(objectMachine: MachineDto) => objectMachine?.title}
                                       defaultValue={machine}
                                       updateObject={(selectedObject: MachineDto ) => setMachine({...machine, id: selectedObject?.id})}
                />
            </Col>
            <Col style={{marginLeft:"20rem"}} sm={1}>
                <Button variant={"success"}
                        onClick={() => {
                            const atomicOperationToAssign = atomicOperationList?.filter(ao => atomicOperationsId.includes(ao?.id))
                            setAtomicOperationToGroup(atomicOperationToAssign);
                            setShowModal(true)}}
                        disabled={atomicOperationsId.length === 0}>{t("Assign")}
                </Button>
            </Col>
        </Row>}
        {(show || mainPath) && <UniversalListArray
            hideAddButton={true} properties={[
            {extractFunction: (object) => <><FormCheck type="checkbox" checked={atomicOperationsId.includes(object?.id)} disabled={!operation}
                                                       onChange={(e) => {e.target.checked ? setAtomicOperationsId(atomicOperationsId.concat(object.id)) :
                                                           setAtomicOperationsId(atomicOperationsId.filter(selectedId => selectedId !== object.id))
                                                           if (!isEmpty(atomicOperationsId)) {
                                                               setSelectAll( true)
                                                           }
                                                       }}/></>},
            {extractFunction: (object) => object.id, label: "Id"},
            {extractFunction: (object) => object.operationType?.title, label: t("Operation Type")},
            {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label: t("Operation Result")},
            {extractFunction: (object) => object.priority, label: t("Priority")},
            {extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Input Products")},
            {extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`), label:t("Output Products")},,
            {extractFunction: (object) => object.productionOrder?.erpOrder?.orderNumber, label: t("Order Number")},

        ] as ListItemProperty<AtomicOperationBasicDto>[]} getObjectArray={
            atomicOperationList?.filter(atomicOp => operation?.id && !atomicOperationsId?.includes(atomicOp.id) ? atomicOp?.operationType?.id === operation?.id : atomicOp)
                .filter(atomicOp => orderNumber?.id && !atomicOperationsId?.includes(atomicOp.id) ? atomicOp?.productionOrder?.erpOrder?.orderNumber === orderNumber?.title : atomicOp)
        }/>}

        {(show || mainPath) && <AtomicOperationAssignModal initialDeny={() => {setShowModal(false)}}
                                                           showModal={showModal}
                                                           atomicOperations={atomicOperationToGroup}
                                                           machine={machine}
                                                           operationTypeId={operation?.id}
                                                           path={path}/>}
    </>
}
