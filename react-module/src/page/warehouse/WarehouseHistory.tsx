import React from "react";
import {useHistory, useParams} from "react-router-dom";
import {UniversalListArray} from "../UniversalListArray";
import {fixDtStr, ListItemProperty, t,} from "../../misc/misc";
import {warehouseApi} from "../../api/exports";
import {WarehouseActionExtendedDto} from "../../openapi/models";
import {enumToPrettyString} from "../UniversalEdit";
import {Button, Form, Row} from "react-bootstrap";
import {PathPage} from "../../App";
import {useAsyncReducer} from "../machineCalendarTask/MachineCalendarTaskCalendarReducer";
import {
    defaultWarehouseProductReducerData,
    WarehouseProductOperationsEnum,
    warehouseProductReducer
} from "./WarehouseProductReducer";

export const WarehouseHistory: React.FC<{}> = ({}) => {
    const {id}: { id: string | undefined } = useParams();
    const history = useHistory();
    const [warehouseActions, setWarehouseActions] = React.useState<WarehouseActionExtendedDto[]>([]);
    const [state, dispatch] = useAsyncReducer(warehouseProductReducer, defaultWarehouseProductReducerData);

    const downloadWarehouseActions = async () => {
        const response = await warehouseApi.getAllWrhHistoryByProductDefinition(Number(id));
        const result = response.data;
        if (response.status === 200) {
            setWarehouseActions(result);
        }
    }
    React.useEffect(() => {
        downloadWarehouseActions();
    }, []);

    const chosenProductDefinitionTitle = warehouseActions?.map(w => w.productDefinition)[0]?.title

    return <>
        <Form.Label style={{fontSize:"25px"}}>{t("History")} : {chosenProductDefinitionTitle}</Form.Label>
        <UniversalListArray
            hideAddButton={true} properties={[
            {extractFunction: (object) => fixDtStr(object.createdAt).substring(0,19), label: t("Date")},
            {extractFunction: (object) => t(enumToPrettyString(object.type?.valueOf())), label: t("Type")},
            {extractFunction: (object) => object?.amount, label: t("Amount")},
            {extractFunction: (object) => object.sourceArea && object.sourceArea?.warehouse?.name + " | " + object.sourceArea?.code, label:t("Source Warehouse")},
            {extractFunction: (object) => object.targetArea && object.targetArea?.warehouse?.name + " | " + object.targetArea?.code, label:t("Target Warehouse")},,
            {extractFunction: (object) => object.user ? object.user : <>Użytkownik_1</> , label: t("User")},
        ] as ListItemProperty<WarehouseActionExtendedDto>[]} getObjectArray={warehouseActions}/>
    </>
}