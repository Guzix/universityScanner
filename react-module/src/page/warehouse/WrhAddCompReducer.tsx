import React from "react";
import {
    atomicProductApi,
} from "../../api/exports";
import {
    AtomicProductDefinitionBasicDto,
    StorageAreaBasicDto, WarehouseBasicDto
} from "../../openapi/models";
import {notification} from "antd";
import {processRawRes} from "../../misc/misc";


export type WrhAddCompReducerData = {
    newProductsAmount: number,
    warehouse: WarehouseBasicDto,
    productDefinition: AtomicProductDefinitionBasicDto,
    storageArea: StorageAreaBasicDto,
}

export const defaultWrhAddCompReducerData = {
    newProductsAmount: 1,
    warehouse: undefined,
    productDefinition: undefined,
    storageArea: undefined,
} as unknown as WrhAddCompReducerData

export type WrhAddCompReducerParams = {
    type: WrhAddCompOperationsEnum,
    amount: number,
    chosenWarehouse: WarehouseBasicDto,
    chosenProductDefinition: AtomicProductDefinitionBasicDto,
    chosenArea: StorageAreaBasicDto,
}

export enum WrhAddCompOperationsEnum {
    Choose,
    AddNewProducts
}

export async function wrhAddCompReducer(state: WrhAddCompReducerData, action: WrhAddCompReducerParams) {

    switch (action.type) {
        case WrhAddCompOperationsEnum.Choose: {

            if(action.chosenWarehouse) {
                return {
                    ...state,
                    warehouse: action.chosenWarehouse
                }
            } else if(action.chosenProductDefinition) {
                return {
                    ...state,
                    productDefinition: action.chosenProductDefinition
                }
            } else if(action.chosenArea) {
                return {
                    ...state,
                    storageArea: action.chosenArea
                }
            } else if(action.amount) {
                return {
                    ...state,
                    newProductsAmount: action.amount
                }
            }
            break;
        }
        case WrhAddCompOperationsEnum.AddNewProducts: {
            const allDataIsNotNull = !isNaN(state?.productDefinition.id as number) && !isNaN(state?.storageArea.id as number) && !isNaN(state?.newProductsAmount as number)
            if (allDataIsNotNull) {
                const response = await atomicProductApi.createNewAtomicProductFromWarehouse(
                    state?.productDefinition.id,
                    state?.storageArea.id,
                    state?.newProductsAmount);
                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    notification.success({message: "Dodano nowe produkty"});
                    return {
                        ...state,
                        warehouse: undefined,
                        productDefinition: undefined,
                        storageArea: undefined,
                        newProductsAmount: 1,
                    }
                } else {
                    notification.error({message: "Błąd zapisu."});
                }
            }
            break;
        }
    }
}