import React from "react";
import {
    AtomicProductBasicDto,
    ProductionOrderBasicDto,
    ProductionOrderExtendedDto
} from "../../openapi/models";
import { useHistory } from "react-router-dom";
import {UniversalList} from "../UniversalList";
import {productionOrderApi} from "../../api/exports"
import {ListItemProperty, t} from "../../misc/misc";
import {PathPage} from "../../App";

export const ProductionOrderList: React.FC<{}> = () => {
    const history = useHistory();

    return <UniversalList onClickString={(id) => `${PathPage.PRODUCTION_ORDER_EDIT}/${id}`} properties={[
        {extractFunction: (object) =>object.id, label:"Id"},
        // {extractFunction: (object) =>object.title, label: t("Name")},
        // {extractFunction: (object) =>object.orderNumber, label: "ZS"},
        {extractFunction: (object) =>object.amount, label: t("Amount")},
        {extractFunction: (object) =>
                object.completedProducts?.map((product: AtomicProductBasicDto) => product.atomicProductDefinition?.title).join(", "),
            label: t("Completed Products")}
    ] as ListItemProperty<ProductionOrderExtendedDto>[]}  getObjectViaApi={productionOrderApi.prOrGetObjectList}/>
}
