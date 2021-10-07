import React from "react";
import {UniversalEdit, UniversalInput, UniversalInputType} from "../UniversalEdit";
import {PrinterDto} from "../../openapi/models";
import {printerApi} from "../../api/exports";
import {PathPage} from "../../App";


export const PrinterEdit: React.FC<{}> = () => {

    return <UniversalEdit formElements={(object: PrinterDto | undefined, setObject: (object: PrinterDto) => void) => <></>}
                          getObjectViaApi={printerApi.printerGetObject}
                          save={printerApi.printerSaveObject as any}
                          primitiveKeys={[{key:"name" , htmlValueType:UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.PRINTER_LIST}
    />
}