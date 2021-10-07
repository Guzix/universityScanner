import React, {FormEvent} from "react";
import {Button, Form, Table} from "react-bootstrap";
import {ErpOrderListProperties} from "../erpOrder/ErpOrderList";
import {t, withinGuard} from "../../misc/misc";
import {NonErpOrderExtendedDto} from "../../openapi/models";
import {UniversalInput, UniversalInputType} from "../UniversalEdit";
import {nonErpOrderApi} from "../../api/exports";
import {PathPage} from "../../App";
import {useHistory} from "react-router-dom";

export const NonErpOrderEditTable: React.FC<{ object: NonErpOrderExtendedDto | undefined, setObject: (object: NonErpOrderExtendedDto) => void, setDownloadingData: (downloadingData: boolean) => void }> = ({
                                                                                                                                                                                                                object,
                                                                                                                                                                                                                setObject,
                                                                                                                                                                                                                setDownloadingData
                                                                                                                                                                                                            }) => {

    const history = useHistory();
    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (object) {
            await withinGuard(setDownloadingData, async () => {
                const response = await nonErpOrderApi.noErOrSaveObject(object);
                const result = response.data;
                if (response.status === 200) {
                    //setMachine(result);
                    history.push(PathPage.NON_ERP_ORDER_LIST);
                }
            })
        } else {
            alert("Exception while sending data")
        }
    }

    return <Form onSubmit={handleOnSubmit}>
        <UniversalInput key={"orderNumber"}
                        disabled={false}
                        fieldName={"orderNumber"} object={object || {} as NonErpOrderExtendedDto}
                        setObject={setObject} valueType={UniversalInputType.TEXT}/>
        <UniversalInput key={"contractorName"}
                        disabled={false}
                        fieldName={"contractorName"} object={object || {} as NonErpOrderExtendedDto}
                        setObject={setObject} valueType={UniversalInputType.TEXT}/>
        <UniversalInput key={"contractorAddress"}
                        disabled={false}
                        fieldName={"contractorAddress"} object={object || {} as NonErpOrderExtendedDto}
                        setObject={setObject} valueType={UniversalInputType.TEXT}/>

        <Button variant="primary" type="submit">
            {t("Save")}
        </Button>
        <div/>
    </Form>
}
