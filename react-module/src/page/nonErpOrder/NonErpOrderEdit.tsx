import React from "react";
import {Divider} from "antd";
import {Fas, ListItemProperty, t, withinGuard} from "../../misc/misc";
import {Button, Spinner} from "react-bootstrap";
import {useHistory, useParams} from "react-router-dom";
import {nonErpOrderApi} from "../../api/exports";
import {NonErpOrderEditTable} from "./NonErpOrderEditTable";
import {
    NonErpOrderExtendedDto,
    NonErpProductionOrderParams, ProductionOrderExtendedDto
} from "../../openapi/models";
import {NonErpOrderCreateProdOrder} from "./NonErpOrderCreateProdOrder";
import {UniversalListArray} from "../UniversalListArray";
import {ProductionOrderEditForHumans} from "../productionOrder/ProductionOrderEdit";
import {PathPage} from "../../App";

export const NonErpOrderEdit: React.FC<{}> = () => {
    const [object, setObject] = React.useState<NonErpOrderExtendedDto | undefined>();
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const {id}: { id: string | undefined } = useParams();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [nonErpOrder, setNonErpOrder] = React.useState<NonErpProductionOrderParams>({nonErpOrderId: id, amount: 0});
    const [chosenProductionOrder, setChosenProductionOrder] = React.useState<number>();

    const history = useHistory();

    const downloadElement = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await nonErpOrderApi.noErOrGetObject(Number(id));
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
        <div>
            <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;{t("Preview of Non-Erp Order")}</Divider>
            <NonErpOrderEditTable object={object} setDownloadingData={setDownloadingData} setObject={setObject}/>
            <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;{t("Created Production Orders")}</Divider>
            <UniversalListArray hideLpColumn={true}
                                onRowClick={obj => {
                                    setChosenProductionOrder(obj.id)
                                }} getChosenObjectId={chosenProductionOrder}
                                hideAddButton={true} properties={[
                {extractFunction: (object) => object.id, label: "Id"},
                {extractFunction: (object) => object.amount, label: t("amount")},
                {extractFunction: (object) => object.atomicProductDefinition?.title, label: t("title")},
                {
                    extractFunction: (object) => object.erpOrder ? <Button size="sm" onClick={(e) => {
                        e.stopPropagation();
                        window.open(`${PathPage.ERP_ORDER_VIEW}/${object.erpOrder.gid?.type}/${object.erpOrder.gid?.company}/${object.erpOrder.gid?.number}/${object.erpOrder.gid?.counter}`, "_blank")
                    }}>{object.erpOrder.orderNumber}</Button> : t("NO"), label: t("Assigned to ERP Order")
                },
            ] as ListItemProperty<ProductionOrderExtendedDto>[]} getObjectArray={object?.productionOrders}/>
            {isEditPage && <>
                <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;Nowy ProductionOrder</Divider>
                <NonErpOrderCreateProdOrder object={nonErpOrder} setObject={setNonErpOrder}
                                            reloadObject={downloadElement}/>
            </>}
            {chosenProductionOrder && <ProductionOrderEditForHumans productionOrderId={chosenProductionOrder}/>}
        </div>
    </div>
}
