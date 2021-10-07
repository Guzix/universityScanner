import React from "react";
import {Divider} from "antd";
import {Fas, ListItemProperty, t, withinGuard} from "../../misc/misc";
import {UniversalListArray} from "../UniversalListArray";
import {LocalErpOrderDto, ProductionOrderExtendedDto, WithoutErpOrder} from "../../openapi/models";
import {useParams} from "react-router-dom";
import {LocalErpOrderEditTable} from "./LocalErpOrderEditTable";
import {localErpOrderApi, nonErpOrderApi} from "../../api/exports";
import {ProductionOrderEditForHumans} from "../productionOrder/ProductionOrderEdit";
import {Spinner} from "react-bootstrap";

export const LocalErpOrderEdit: React.FC<{}> = () => {
    const [object, setObject] = React.useState<LocalErpOrderDto | undefined>();
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const {id}: { id: string | undefined } = useParams();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [chosenProductionOrder, setChosenProductionOrder] = React.useState<number>();
    const downloadElement = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await localErpOrderApi.loErOrGetObject(Number(id));
            const result = response.data;
            if (response.status === 200) {
                setObject(result);
            }
        })
    }

    React.useEffect(() => {
        if (isEditPage) {
            downloadElement();
        }
    }, []);
    return <div>
        {downloadingData && <Spinner animation="border"/>}
        {isEditPage ? <div>
                <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;{t("Preview of Local Erp Order")}</Divider>
                <LocalErpOrderEditTable object={object} setObject={setObject}/>
                <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;{t("Created Production Orders")}</Divider>
                <UniversalListArray hideLpColumn={true}
                                    onRowClick={obj => {
                                        setChosenProductionOrder(obj.id)
                                    }} getChosenObjectId={chosenProductionOrder}
                                    hideAddButton={true} properties={[
                    {extractFunction: (object) => object.id, label: "Id"},
                    {extractFunction: (object) => object.amount, label: t("amount")},
                    {extractFunction: (object) => object.atomicProductDefinition?.title, label: t("title")}
                ] as ListItemProperty<WithoutErpOrder>[]} getObjectArray={object?.productionOrders}/>
                {chosenProductionOrder && <ProductionOrderEditForHumans productionOrderId={chosenProductionOrder}/>}
            </div> :
            <h6>{t("Error, Instance can't be created manually")}</h6>}</div>
}
