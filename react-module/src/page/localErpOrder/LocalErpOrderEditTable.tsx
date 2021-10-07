import React from "react";
import {ErpOrder, LocalErpOrderDto} from "../../openapi/models";
import {t} from "../../misc/misc";
import {Col, Form, Row} from "react-bootstrap";
import {UniversalInput, UniversalInputType, UniversalValueView} from "../UniversalEdit";

export const LocalErpOrderEditTable: React.FC<{
    object: LocalErpOrderDto | undefined, setObject: (object: LocalErpOrderDto) => void,
}> = ({
          object,
          setObject,
      }) => {
    const srcOrder = object?.srcOrder?.order || {} as ErpOrder;
    return <Form>
        <UniversalInput key={"creationDate"}
                        disabled={true}
                        fieldName={"creationDate"} object={srcOrder}
                        setObject={() => undefined} valueType={UniversalInputType.TEXT}/>
        <UniversalInput key={"orderNumber"}
                        disabled={true}
                        fieldName={"orderNumber"} object={object || {} as LocalErpOrderDto}
                        setObject={setObject} valueType={UniversalInputType.TEXT}/>
        <UniversalInput key={"foreignDocument"}
                        disabled={true}
                        fieldName={"foreignDocument"} object={object || {} as LocalErpOrderDto}
                        setObject={setObject} valueType={UniversalInputType.TEXT}/>
        <UniversalValueView fieldName={"Gid"}
                            value={object?.gid ?
                                `${object?.gid.type} - ${object?.gid.company} - ${object?.gid.number} - ${object?.gid.counter}`
                                : t("Missing")}/>
        <UniversalValueView fieldName={"Owner"}
                            value={srcOrder.owner ?
                                `[${srcOrder.owner?.identificator}] ${srcOrder.owner?.name}`
                                : t("Missing")}/>
        <UniversalValueView fieldName={"Warehouse"}
                            value={srcOrder.warehouse ?
                                `[${srcOrder.warehouse?.code}] ${srcOrder.warehouse?.name}`
                                : t("Missing")}/>
        <UniversalInput key={"description"}
                        disabled={true}
                        fieldName={"description"} object={object || {} as LocalErpOrderDto}
                        setObject={setObject} valueType={UniversalInputType.TEXTAREA}/>

        <UniversalInput key={"deadline"}
                        disabled={true}
                        fieldName={"deadline"} object={object || {} as LocalErpOrderDto}
                        setObject={setObject} valueType={UniversalInputType.DATETIME_LOCAL}/>

        <div/>
    </Form>
}
