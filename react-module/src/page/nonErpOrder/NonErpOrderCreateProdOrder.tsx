import React, {FormEvent} from "react";
import {
    ActionResourceMachinesAndOperationTypesPageActionResourceStatusEnum,
    NonErpProductionOrderParams
} from "../../openapi/models";
import {UniversalInput, UniversalInputType} from "../UniversalEdit";
import {Button, Form} from "react-bootstrap";
import {t} from "../../misc/misc";
import {productionOrderApi} from "../../api/exports";
import {notification} from "antd";

export const NonErpOrderCreateProdOrder: React.FC<{
    object: NonErpProductionOrderParams,
    setObject: (object: NonErpProductionOrderParams) => void, reloadObject: () => void
}> = ({
          object,
          setObject, reloadObject
      }) => {
    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await productionOrderApi.generateForNonErp(object);
        const result = response.data as unknown as ActionResourceMachinesAndOperationTypesPageActionResourceStatusEnum;
        if (response.status === 200 && result === ActionResourceMachinesAndOperationTypesPageActionResourceStatusEnum.OK) {
            reloadObject();
            notification.success({
                message: t("Success")
            });
        } else {
            notification.error({
                message: t("Error"),
                description:
                    t("Error writing changes. Contact administrator.")
            });
        }
    }

    return <Form onSubmit={handleOnSubmit}>
        <UniversalInput key={"amount"}
                        disabled={false}
                        fieldName={"amount"} object={object || {} as NonErpProductionOrderParams}
                        setObject={setObject} valueType={UniversalInputType.NUMBER}/>
        <Button variant="primary" type="submit">
            {t("Create")}
        </Button>
        <div/>
    </Form>
}
