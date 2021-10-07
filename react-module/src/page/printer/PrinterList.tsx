import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty, t} from "../../misc/misc";
import {PrinterDto, WorkPlaceDto} from "../../openapi/models";
import {printerApi, workPlaceApi} from "../../api/exports";


export const PrinterList: React.FC<{}> =() =>{

    return<UniversalList onClickString={(id) => `${PathPage.PRINTER_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.name, label:t("Name")},
    ] as ListItemProperty<PrinterDto>[]} getObjectViaApi={printerApi.printerGetObjectList}
    />


}