import React from "react";
import {UniversalList} from "../UniversalList";
import {PathPage} from "../../App";
import {ListItemProperty, t} from "../../misc/misc";
import {PackBasicDto} from "../../openapi/models";
import { packApi} from "../../api/exports";

export const PackList: React.FC<{}> = () => {
    return <UniversalList onClickString={(id) => `${PathPage.PACK_EDIT}/${id}`} properties={[
        {extractFunction: (object) => object.barcodeFromId, label: t("Barcode")},
        {extractFunction: (object) => `${object.weightNet}/${object.weightGross}`, label: t("WeightGross/WeightNet")},
        {extractFunction: (object) => `${object.contractor?.name1 || ''}`, label: t("contractor")},
        {extractFunction: (object) => `${t(object.packStatus || '') }`, label: t("Status")},
        {extractFunction: (object) => `${object.deliveryData || ''}`, label: t("deliveryData")},
        {extractFunction: (object) => `${object.inventory ? object.inventory.title : object.inventoryString || ''}`,
            label: t("inventory")},
        {extractFunction: (object) => object?.createdByMobileApp ? t("YES") : t("NO"),
            label: t("Android")},
        {extractFunction: (object) => object?.dimension ?
                `${object?.dimension?.width}x${object?.dimension?.height}x${object?.dimension?.length}` : '',
            label: t("Dimensions")}
    ] as ListItemProperty<PackBasicDto>[] }   getObjectViaApi={packApi.packGetObjectList}/>
}
