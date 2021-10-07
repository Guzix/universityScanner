import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {WorkPlaceDto} from "../../openapi/models";
import {ListItemProperty, t} from "../../misc/misc";
import {workPlaceApi} from "../../api/exports";


export const WorkPlaceList: React.FC<{}> =() =>{

    return<UniversalList onClickString={(id) => `${PathPage.WORK_PLACE_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object?.id, label: "Id"},
        {extractFunction: (object) => object?.machine?.title, label:t("Machine")},
        {extractFunction: (object) => object?.printer?.name, label:t("Printer")},
    ] as ListItemProperty<WorkPlaceDto>[]} getObjectViaApi={workPlaceApi.wrkPlcGetObjectList}
    />


}