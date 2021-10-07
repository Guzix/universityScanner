import {
    AtomicProductDefinitionBasicDto,
    StorageAreaBasicDto,
    WarehouseBasicDto
} from "../../openapi/models";
import {Button, Col, Form,Row} from "react-bootstrap";
import {t} from "../../misc/misc";
import {UniversalSingleSimpleSelect} from "../UniversalEdit";
import React from "react";
import {
    WarehouseProductOperationsEnum,
    WarehouseProductReducerData,
    WarehouseProductReducerParams
} from "./WarehouseProductReducer";
import {useAsyncReducer} from "../machineCalendarTask/MachineCalendarTaskCalendarReducer";
import {defaultWrhAddCompReducerData, WrhAddCompOperationsEnum, wrhAddCompReducer} from "./WrhAddCompReducer";


export const WarehouseAddNewProducts: React.FC<{
    pageState: WarehouseProductReducerData,
    pageDispatch: (action: WarehouseProductReducerParams) => void,
}> = ({pageState, pageDispatch}) => {
    const [state, dispatch] = useAsyncReducer(wrhAddCompReducer, defaultWrhAddCompReducerData);

    const filteredStorageAreas = pageState?.storageAreas?.filter(s => s.warehouse?.id === state?.warehouse?.id)

    return<>
        {pageState?.showAddComponent &&
        <Form.Label style={{fontWeight:"bold"}}>{t("Added Products")}:</Form.Label>}
        {pageState?.showAddComponent  &&
        <UniversalSingleSimpleSelect fieldText={"Product Definitions"}
                                     useEffect={true}
                                     getObjects={pageState?.productDefinitions}
                                     getValue={(def: AtomicProductDefinitionBasicDto) => def.title}
                                     updateObject={(selectedObject: AtomicProductDefinitionBasicDto) =>
                                         dispatch({type: WrhAddCompOperationsEnum.Choose,
                                             chosenProductDefinition: selectedObject})}
                                     defaultValue={state?.productDefinition?.title}/>}
        {pageState?.showAddComponent  &&
        <UniversalSingleSimpleSelect fieldText={"warehouse"}
                                     useEffect={true}
                                     getObjects={pageState?.warehouses}
                                     getValue={(objectWr: WarehouseBasicDto) => objectWr.name}
                                     updateObject={(selectedObject: WarehouseBasicDto) =>
                                         dispatch({type: WrhAddCompOperationsEnum.Choose,
                                         chosenWarehouse: selectedObject})}
                                     defaultValue={state?.warehouse?.name}/>}
        {pageState?.showAddComponent  &&
        <UniversalSingleSimpleSelect fieldText={"storageArea"}
                                     useEffect={false}
                                     getObjects={filteredStorageAreas}
                                     getValue={(locationStAr: StorageAreaBasicDto) => locationStAr?.code}
                                     updateObject={(selectedObject: StorageAreaBasicDto) =>
                                         dispatch({type: WrhAddCompOperationsEnum.Choose,
                                             chosenArea: selectedObject})}
                                     defaultValue={state?.storageArea?.code}/>}

        {pageState?.showAddComponent  &&
        <Row>
            <Col xs={2}>
                <Form.Label style={{fontWeight:"bold"}}>{t("Amount")}:</Form.Label>
            </Col>
            <Col xs={1}>
                <Form.Control
                    style={{textAlign:"center"}}
                    size={"sm"}
                    className="amountArea"
                    value={state?.newProductsAmount}
                    min={1}
                    type="number"
                    onChange={e => dispatch({type: WrhAddCompOperationsEnum.Choose,
                        amount: parseInt(e.target.value)})}
                />
            </Col>
            <Col xs={2}>
                <Button variant={"primary"}
                        disabled={!state?.productDefinition?.id || !state?.warehouse?.id || !state?.storageArea?.id}
                        onClick={() => {
                            dispatch({type: WrhAddCompOperationsEnum.AddNewProducts})
                            setTimeout(() => {
                                pageDispatch({type: WarehouseProductOperationsEnum.DownloadDataAndCloseComponent});
                            }, 1000)
                        }}>{t("Add")
                }</Button>
            </Col>
        </Row>}
    </>

}