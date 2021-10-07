import React from "react";
import {UniversalEdit, UniversalInputType} from "../UniversalEdit";
import {atomicProductParameterTypeApi} from "../../api/exports";
import {PathPage} from "../../App";

export const AtomicProductParameterTypeEdit: React.FC<{}> = () => {
    return <UniversalEdit
                          formElements={ () => <></> }
                          getObjectViaApi={atomicProductParameterTypeApi.atPrPaTyGetObject}
                          save={atomicProductParameterTypeApi.atPrPaTySaveObject as any}

                          primitiveKeys={[{key:"title", htmlValueType: UniversalInputType.TEXT}]}
                          onSubmitString={PathPage.ATOMIC_PRODUCT_PARAMETER_TYPE_LIST}/>
}
