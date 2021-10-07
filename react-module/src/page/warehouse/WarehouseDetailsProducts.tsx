import React, {useEffect} from "react";
import {Button, ButtonGroup, Col, Form, FormCheck, Row} from "react-bootstrap";
import {IProductDefsWithStorageAmount,
    StorageAreaBasicDto,
    WarehouseBasicDto
} from "../../openapi/models";
import {UniversalListArray} from "../UniversalListArray";
import {ListItemProperty, t} from "../../misc/misc";
import {UniversalSingleSimpleSelect} from "../UniversalEdit";
import {DefinitionEditFromWarehouseModal} from "./DefinitionEditFromWarehouseModal";
import {useHistory} from "react-router-dom";
import {PathPage} from "../../App";
import {HtmlTooltip} from "../machineCalendarTask/MachineCalendarTaskCalendarList";
import {
    WarehouseProductOperationsEnum,
    WarehouseProductReducerData,
    WarehouseProductReducerParams
} from "./WarehouseProductReducer";
import {useAsyncReducer} from "../machineCalendarTask/MachineCalendarTaskCalendarReducer";
import {
    defaultWrhDetProductsReducerData,
    WrhDetProductsOperationsEnum,
    wrhDetProductsReducer
} from "./WrhDetProductsReducer";

export const WarehouseDetailsProducts: React.FC<{
    pageState: WarehouseProductReducerData,
    pageDispatch: (action: WarehouseProductReducerParams) => void,
}> = ({pageState, pageDispatch}) => {
    const [state, dispatch] = useAsyncReducer(wrhDetProductsReducer, defaultWrhDetProductsReducerData);
    const history = useHistory();
    const optionStates = [state?.startAddProduct, state?.startPickProduct, state?.startMoveProduct, state?.startBookProduct]


    const allOptionEnabled = (): boolean => {
        let i: number = 0;
        optionStates.forEach(option => {
            !option ? i += 0 : i += 1;
        })
        return i === 0;
    }

    function getMinValue(): number {
        const wrh = pageState?.wrhProductsByDef?.find(p => state?.storageAreaIdFrom === p?.storageAreaId)
        let minValue: number = 0;
        if((state?.startPickProduct && (state?.storageAreaIdFrom != undefined)) ||
            (state?.startMoveProduct && (state?.storageAreaIdFrom != undefined)) ||
            ((state?.startBookProduct && state?.addBooking) && (state?.storageAreaIdFrom != undefined))) {
            minValue =  (wrh?.availableAmount > 0) ? 1 : minValue
        } else if ((state?.startBookProduct && !state?.addBooking) && (state?.storageAreaIdFrom != undefined)) {
            minValue = ((wrh?.totalAmount - wrh?.availableAmount) > 0) ? 1 : minValue
        } else {
            minValue = 1;
        }
        return minValue;
    }

    function getMaxValue(): number {
        const wrh = pageState?.wrhProductsByDef?.find(p => state?.storageAreaIdFrom === p?.storageAreaId)
        let maxValue;
        if(state?.startPickProduct || state?.startMoveProduct || (state?.startBookProduct && state?.addBooking)) {
           maxValue =  (wrh?.availableAmount === 0) ? 0 : wrh?.availableAmount
        } else if (state?.startBookProduct && !state?.addBooking) {
            maxValue = ((wrh?.totalAmount - wrh?.availableAmount) === 0) ? 0 : (wrh?.totalAmount - wrh?.availableAmount)
        }
        return maxValue;
    }

    function validate():boolean {
        return state?.startAddProduct || (state?.movedProductsAmount != 0 && (state?.movedProductsAmount >= getMinValue()) && (state?.movedProductsAmount <= getMaxValue()))
    }

    function notReservedAnyProd():boolean {
        const chosenStorageArea =  pageState?.wrhProductsByDef?.find(a => a?.storageAreaId === state?.storageAreaIdFrom)
        return (chosenStorageArea?.totalAmount - chosenStorageArea?.availableAmount) === 0
    }

    function notAvailableAnyProd():boolean {
        const chosenStorageArea =  pageState?.wrhProductsByDef?.find(a => a?.storageAreaId === state?.storageAreaIdFrom)
        return chosenStorageArea?.availableAmount === 0
    }


    useEffect(() => {
        getMinValue() === 0 ?
            dispatch({type: WrhDetProductsOperationsEnum.Choose,
            movedProductsAmount: 0}) :
            dispatch({type: WrhDetProductsOperationsEnum.Choose,
            movedProductsAmount: 1})
    },[getMinValue() === 0])

    const filteredStorageAreas = pageState?.storageAreas?.filter(s => s.warehouse?.id === state?.warehouse?.id)

    //------------Form disable logic------------------------------
    const disableForBookAndPick = allOptionEnabled() || (!allOptionEnabled() && (state?.startPickProduct || state?.startBookProduct))

    const disableWhenConfirmedOrNotChooseAnyWrh = state?.clickedConfirm || (!state?.startAddProduct && !state?.storageAreaIdFrom)

    const disableDuringAddingWhenFormIsNotCompleted = (state?.startAddProduct && (!state?.warehouse || !state?.storageAreaTo))

    const disableDuringBookingWhenNotChooseAnyWrhOrNotDuringBooking = !state?.startBookProduct || (state?.startBookProduct && !state?.storageAreaIdFrom)

    const disableDuringBookingWhenChooseAnyWrh = state?.startBookProduct && (state?.storageAreaIdFrom != undefined)

    const disableDuringMovingWhenFormIsNotCompleted = (state?.startMoveProduct && (!state?.warehouse || !state?.storageAreaTo))

    return<>
        {pageState?.showDetails &&
        <UniversalListArray
            onRowClick={obj => {
                !(allOptionEnabled() || (!allOptionEnabled() && state?.startAddProduct)) &&
                    dispatch({type: WrhDetProductsOperationsEnum.Choose,
                    chosenStorageAreaIdFrom: obj?.storageAreaId})
            }}
            customStyle={{border:"1px solid darkgrey"}}
            hideAddButton={true}
            hideLpColumn={true}
            properties={[
                {
                    extractFunction: (object) => <>
                        <FormCheck type="radio"
                                   style={{}}
                                   name="bigCheckbox"
                                   checked={state?.storageAreaIdFrom === object?.storageAreaId}
                                   disabled={allOptionEnabled() || (!allOptionEnabled() && state?.startAddProduct)}
                                   onChange={(e) => {
                                           e.target.checked && dispatch({type: WrhDetProductsOperationsEnum.Choose,
                                               chosenStorageAreaIdFrom: object?.storageAreaId})
                                   }}/>
                    </>, customStyle:{width:"25px",border:"1px solid darkgrey"}
                },
                {extractFunction: (object) => object?.warehouseName, label: t("Warehouse")},
                {extractFunction: (object) => object?.storageAreaCode, label: t("storageArea")},
                {extractFunction: (object) => object?.totalAmount, label: t("Total Amount")},
                {extractFunction: (object) => object?.availableAmount, label: t("Available Amount")},
                {extractFunction: (object) => object?.totalAmount - object?.availableAmount, label: t("Reserved Amount")},
            ] as ListItemProperty<IProductDefsWithStorageAmount>[]}
            getObjectArray={pageState?.wrhProductsByDef}/>}

        {pageState?.showDetails && !disableForBookAndPick &&
        <div style={{marginLeft:"5rem"}}>
            <UniversalSingleSimpleSelect fieldText={"warehouse"}
                                         disabled={disableForBookAndPick || disableWhenConfirmedOrNotChooseAnyWrh}
                                         useEffect={true}
                                         getObjects={pageState?.warehouses}
                                         getValue={(objectWr: WarehouseBasicDto) => objectWr.name}
                                         updateObject={(selectedObject: WarehouseBasicDto) =>
                                             dispatch({type: WrhDetProductsOperationsEnum.Choose,
                                             chosenWarehouse: selectedObject})}
                                         defaultValue={state?.warehouse?.name}/>
        </div>}
        {pageState?.showDetails && !disableForBookAndPick &&
        <div style={{marginLeft:"5rem"}}>
            <UniversalSingleSimpleSelect fieldText={"storageArea"}
                                         useEffect={false}
                                         disabled={disableForBookAndPick || disableWhenConfirmedOrNotChooseAnyWrh}
                                         getObjects={filteredStorageAreas}
                                         getValue={(locationStAr: StorageAreaBasicDto) => locationStAr?.code}
                                         updateObject={(selectedObject: StorageAreaBasicDto) =>
                                             dispatch({type: WrhDetProductsOperationsEnum.Choose,
                                                 chosenStorageAreaTo: selectedObject})}
                                         defaultValue={state?.storageAreaTo?.code}/>
        </div>}
        {pageState?.showDetails && !allOptionEnabled() &&
        <Row style={{marginLeft:"4rem"}}>
            <Col xs={1}>
                <Form.Label style={{fontWeight:"bold"}}>{t("Amount")}:</Form.Label>
            </Col>
            <Col xs={1}>
                <HtmlTooltip innerHtml={<Form.Control
                    isValid={validate()}
                    isInvalid={!validate()}
                    style={{textAlign:"center"}}
                    size={"sm"}
                    className="amountArea"
                    value={state?.movedProductsAmount}
                    min={getMinValue()}
                    max={getMaxValue()}
                    type="number"
                    disabled={allOptionEnabled() || disableWhenConfirmedOrNotChooseAnyWrh}
                    onChange={e => dispatch({type: WrhDetProductsOperationsEnum.Choose,
                        movedProductsAmount: parseInt(e.target.value)})}
                />} translation={!validate() ? "Choose storage area to change amount" : "Chosen amount"}/>
            </Col>
            <Col xs={2}>
                <Button variant={"primary"}
                        disabled={allOptionEnabled() ||
                        disableWhenConfirmedOrNotChooseAnyWrh ||
                        disableDuringAddingWhenFormIsNotCompleted ||
                        disableDuringMovingWhenFormIsNotCompleted ||
                        !validate()}
                        onClick={() => {
                            dispatch({type: WrhDetProductsOperationsEnum.Choose,
                                clickedConfirm: true})

                            if(state?.startAddProduct) {

                            dispatch({type: WrhDetProductsOperationsEnum.AddProducts,
                                chosenDefinitionId: pageState?.chosenDefinitionId})

                            }
                            if(state?.startPickProduct) {

                            dispatch({type: WrhDetProductsOperationsEnum.ReleaseProducts,
                                chosenDefinitionId: pageState?.chosenDefinitionId})

                            } else if(state?.startMoveProduct) {

                            dispatch({type: WrhDetProductsOperationsEnum.TransferProducts,
                                chosenDefinitionId: pageState?.chosenDefinitionId})

                            } else if(state?.startBookProduct) {

                            dispatch({type: WrhDetProductsOperationsEnum.BookProducts,
                                chosenDefinitionId: pageState?.chosenDefinitionId})

                            }
                            setTimeout(() => {
                                pageDispatch({type: WarehouseProductOperationsEnum.ChooseDefinitionAndDownloadWrhProducts,
                                    chosenDefinitionId: pageState?.chosenDefinitionId});
                                }, 500);
                        }}>{t("Confirm")}</Button>
            </Col>
        </Row>}
        {pageState?.showDetails && !allOptionEnabled() && state?.startBookProduct &&
        <Row style={{marginLeft:"4rem"}}>
            <Col xs={1}>
                <Form.Label style={{fontWeight:"bold"}}>{t("Booking options")}:</Form.Label>
            </Col>
            <Col xs={1}>
                <FormCheck type="radio"
                           style={{fontWeight:"bold", fontStyle:"italic"}}
                           label={t("Add")}
                           checked={state?.addBooking}
                           disabled={disableDuringBookingWhenNotChooseAnyWrhOrNotDuringBooking || (disableDuringBookingWhenChooseAnyWrh && notAvailableAnyProd())}
                           onChange={() => {dispatch({type: WrhDetProductsOperationsEnum.Choose,
                               addBooking: !state?.addBooking})}}/>
            </Col>
            <Col xs={1}>
                <FormCheck type="radio"
                           label={t("Cancel")}
                           style={{fontWeight:"bold", fontStyle:"italic", color:"red"}}
                           checked={!state?.addBooking}
                           disabled={disableDuringBookingWhenNotChooseAnyWrhOrNotDuringBooking || (disableDuringBookingWhenChooseAnyWrh && notReservedAnyProd())}
                           onChange={() => {dispatch({type: WrhDetProductsOperationsEnum.Choose,
                               addBooking: !state?.addBooking})}}/>
            </Col>
        </Row>}
        {pageState?.showDetails &&
        <ButtonGroup style={{marginTop:"10px"}}>
            <Button variant={"danger"}
                    onClick={() => {
                        dispatch({type: WrhDetProductsOperationsEnum.ChooseBetweenOptions,
                            startPickProduct: !state?.startPickProduct,
                            movedProductsAmount: getMinValue()})
                    }}
                    disabled={!state?.startPickProduct && !allOptionEnabled()}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Issue")}
            </Button>
            <Button variant={"success"}
                    onClick={() => {
                        dispatch({type: WrhDetProductsOperationsEnum.ChooseBetweenOptions,
                            startMoveProduct: !state?.startMoveProduct,
                            movedProductsAmount: getMinValue()})
                    }}
                    disabled={!state?.startMoveProduct && !allOptionEnabled()}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Transfer")}
            </Button>
            <Button variant={"info"}
                    onClick={() => {
                        dispatch({type: WrhDetProductsOperationsEnum.ChooseBetweenOptions,
                            startBookProduct: !state?.startBookProduct,
                            movedProductsAmount: getMinValue()})
                    }}
                    disabled={!state?.startBookProduct && !allOptionEnabled()}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Booking")}
            </Button>
            <Button variant={"primary"}
                    onClick={() => {
                        dispatch({type: WrhDetProductsOperationsEnum.ChooseBetweenOptions,
                            startAddProduct: !state?.startAddProduct,
                            movedProductsAmount: getMinValue()})
                    }}
                    disabled={!state?.startAddProduct && !allOptionEnabled()}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Add")}
            </Button>
            <Button variant={"dark"}
                    onClick={() => {history.push(`${PathPage.WAREHOUSE_HISTORY}/${pageState?.chosenDefinitionId}`)}}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("History")}
            </Button>
            <Button variant={"info"}
                    onClick={() => {dispatch({type: WrhDetProductsOperationsEnum.Choose,
                        showDefEditComp: true})}}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Edit")}
            </Button>
            <Button variant={"outline-primary"}
                    onClick={() => {
                        pageDispatch({type: WarehouseProductOperationsEnum.DownloadAndSortData,
                        sortByValue:true})
                    }}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Sort by amount")}
            </Button>
            <Button variant={"outline-primary"}
                    onClick={() => {
                        pageDispatch({type: WarehouseProductOperationsEnum.DownloadAndSortData,
                            sortByName:true})
                    }}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Sort by name")}
            </Button>
            <Button variant={"secondary"}
                    onClick={() => pageDispatch({type: WarehouseProductOperationsEnum.ChooseDefinitionAndDownloadWrhProducts,
                        chosenDefinitionId: undefined}
                    )}
                    style={{paddingRight: "1rem", paddingLeft: "1rem"}}>{t("Close")}
            </Button>
        </ButtonGroup>}
    <DefinitionEditFromWarehouseModal
        showModal={state?.showDefEditComp}
        setShowModal={() => dispatch({type: WrhDetProductsOperationsEnum.Choose,
        showDefEditComp: false})}
        loadDataAndClose={() => pageDispatch({type: WarehouseProductOperationsEnum.ChooseDefinitionAndDownloadWrhProducts,
            chosenDefinitionId: pageState?.chosenDefinitionId})}
        definitionId={pageState?.chosenDefinitionId}/>
    </>

}

