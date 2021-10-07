import React from "react";
import {MachineDto} from "../../openapi/models";
import {ListItemProperty, t} from "../../misc/misc";
import {machineApi} from "../../api/exports";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";

export const MachineList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.MACHINE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.title, label: t("Name")},
    ] as ListItemProperty<MachineDto>[] }   getObjectViaApi={machineApi.maGetObjectList}/>
}