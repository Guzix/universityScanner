import React, {useEffect} from "react";
import {
    IProductDefsWithTotalAmount,
} from "../../openapi/models";
import {ListItemProperty, t} from "../../misc/misc";
import {UniversalListArray} from "../UniversalListArray";
import {WarehouseDetailsProducts} from "./WarehouseDetailsProducts";
import {Button} from "react-bootstrap";
import {WarehouseAddNewProducts} from "./WarehouseAddNewProduct";
import {
    defaultWarehouseProductReducerData,
    WarehouseProductOperationsEnum,
    warehouseProductReducer
} from "./WarehouseProductReducer";
import {useAsyncReducer} from "../machineCalendarTask/MachineCalendarTaskCalendarReducer";
import {WarehouseProductFilters} from "./WarehouseProductFilters";

export const WarehouseProductPage: React.FC<{}> = () => {
    const [state, dispatch] = useAsyncReducer(warehouseProductReducer, defaultWarehouseProductReducerData);

    useEffect(() => {
        dispatch({type: WarehouseProductOperationsEnum.Download}).then()
    },[]);

    return <>
        <WarehouseProductFilters pageState={state} pageDispatch={dispatch}/>
        <WarehouseAddNewProducts pageState={state}
                                 pageDispatch={dispatch}/>
        <div style={{marginBottom:"10px", marginTop:"10px"}}>
            <Button variant={"primary"}
                    onClick={() => dispatch({type: WarehouseProductOperationsEnum.ShowAddComponent,
                        showAddComponent: !state?.showAddComponent})
                    }>
                {t("Add New Product")}
            </Button>
            <Button variant={"success"}
                    style={{marginLeft:"1rem"}}
                    onClick={() => dispatch({type: WarehouseProductOperationsEnum.ShowFilterComponent,
                        showFilterComponent: !state?.showFilterComponent})
                    }>
                {t("Show Filters")}
            </Button>
        </div>
        <div style={state?.showDetails ? {border:"2px solid green", padding:"3px"} : {}}>
            <WarehouseDetailsProducts pageState={state}
                                      pageDispatch={dispatch}/>
        </div>
        <UniversalListArray
        getChosenObjectId={state?.chosenDefinitionId}
        hideAddButton={true}
        hideLpColumn={true}
        properties={[
        {extractFunction: (object) => object?.defId, label:t("DefId")},
        {extractFunction: (object) => object?.defTitle, label:t("Product")},
        {extractFunction: (object) => object?.defTitle, label:t("Parameters")},
        {extractFunction: (object) => object?.totalAmount, label: t("Total Amount")},
        {extractFunction: (object) => object?.availableAmount, label: t("Available Amount")},
        {extractFunction: (object) => object?.totalAmount - object?.availableAmount, label: t("Reserved Amount")},
        ] as ListItemProperty<IProductDefsWithTotalAmount>[]}
        getObjectArray={state?.products}
        onRowClick={(object) => {
            dispatch({type: WarehouseProductOperationsEnum.ChooseDefinitionAndDownloadWrhProducts,
                chosenDefinitionId: object?.defId,
                sort: true})
            window.scroll({top:0, left:0, behavior:"smooth"})
        }}/>
    </>
}
