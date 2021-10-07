import React from "react";
import {UniversalList} from "../UniversalList";
import {ListItemProperty, t} from "../../misc/misc";
import {AtomicProductBasicDto} from "../../openapi/models";
import {atomicProductApi} from "../../api/exports";
import {PathPage} from "../../App";

export const AtomicProductList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.id, label: "Id"},
        {extractFunction: (object) => object.barcodeFromId, label: "Barcode"},
        {extractFunction: (object) => object.atomicProductDefinition?.title, label: "Product Definition Name"},
        {extractFunction: (object) => object.layerNumber, label: "layerNumber"},
    ] as ListItemProperty<AtomicProductBasicDto>[]} getObjectViaApi={atomicProductApi.atPrGetObjectList}/>
}
