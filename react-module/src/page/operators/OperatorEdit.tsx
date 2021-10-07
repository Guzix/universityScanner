import React from "react";
import {UniversalEdit, UniversalInputType} from "../UniversalEdit";
import {userMLApi} from "../../api/exports";
import {PathPage} from "../../App";


export const OperatorEdit: React.FC<{}> = () => {
    return <UniversalEdit
        formElements={() =>
            <></>
        }
        getObjectViaApi={userMLApi.usMlGetObject}
        save={userMLApi.usMlSaveObject as any}
        primitiveKeys={[
            {key: "username", htmlValueType: UniversalInputType.TEXT},
            {key: "firstName", htmlValueType: UniversalInputType.TEXT},
            {key: "lastName", htmlValueType: UniversalInputType.TEXT},
            {key: "rfidNumber", htmlValueType: UniversalInputType.TEXT},
            {key: "active", htmlValueType: UniversalInputType.SWITCH}
        ]}
        onSubmitString={PathPage.OPERATORS_LIST}/>
}

