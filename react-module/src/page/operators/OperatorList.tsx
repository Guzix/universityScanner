import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty, t} from "../../misc/misc";
import {UserMLDto} from "../../openapi/models";
import {userMLApi} from "../../api/exports";


export const OperatorList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.OPERATORS_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.username, label: "Username"},
        {extractFunction: (object) => object.firstName, label: t("First name")},
        {extractFunction: (object) => object.lastName, label: t("Last name")},
        {extractFunction: (object) => object.rfidNumber, label: t("Rfid number")}
    ] as ListItemProperty<UserMLDto>[]} getObjectViaApi={userMLApi.usMlGetObjectList}/>
}