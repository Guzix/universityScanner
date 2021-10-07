import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty, t} from "../../misc/misc";
import {LocalErpOrderDto} from "../../openapi/models";
import {localErpOrderApi} from "../../api/exports";
import moment from "moment/moment";

export const LocalErpOrderList: React.FC<{}> = () => {
    return <UniversalList hideAddButton={true} onClickString={(id) => `${PathPage.LOCAL_ERP_ORDER_EDIT}/${id}`}
                          properties={[
                              {extractFunction: (object) => object.id, label: "Id"},
                              {extractFunction: (object) => object.orderNumber, label: "orderNumber"},
                              {
                                  extractFunction: (object) => object.deadline ? moment(object.deadline).format("LLL") : "",
                                  label: "Deadline"
                              },
                              {
                                  extractFunction: (object) => object.productionOrders ? object.productionOrders.length : t("Missing"),
                                  label: "Amount of Production Orders"
                              },
                          ] as ListItemProperty<LocalErpOrderDto>[]}
                          getObjectViaApi={localErpOrderApi.loErOrGetObjectList}/>
}
