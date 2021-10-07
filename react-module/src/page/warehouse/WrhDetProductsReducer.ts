import React from "react";
import {StorageAreaExtendedDto, WarehouseBasicDto
} from "../../openapi/models";
import {processRawRes} from "../../misc/misc";
import {atomicProductApi} from "../../api/exports";
import {notification} from "antd";

export type WrhDetProductsReducerData = {
    movedProductsAmount: number,
    warehouse: WarehouseBasicDto,
    storageAreaIdFrom: number,
    storageAreaTo: StorageAreaExtendedDto,
    startAddProduct: boolean,
    startPickProduct: boolean,
    startMoveProduct: boolean,
    startBookProduct: boolean,
    clickedConfirm: boolean,
    showDefEditComp: boolean,
    addBooking: boolean
}

export const defaultWrhDetProductsReducerData = {
    movedProductsAmount: 1,
    warehouse: undefined,
    storageAreaIdFrom: undefined,
    storageAreaTo: undefined,
    startAddProduct: false,
    startPickProduct: false,
    startMoveProduct: false,
    startBookProduct: false,
    clickedConfirm: false,
    showDefEditComp: false,
    addBooking: true
} as unknown as WrhDetProductsReducerData

export type WrhDetProductsReducerParams = {
    type: WrhDetProductsOperationsEnum,
    movedProductsAmount: number,
    chosenWarehouse: WarehouseBasicDto,
    chosenDefinitionId: number,
    chosenStorageAreaIdFrom: number,
    chosenStorageAreaTo: StorageAreaExtendedDto,
    startAddProduct: boolean,
    startPickProduct: boolean,
    startMoveProduct: boolean,
    startBookProduct: boolean,
    clickedConfirm: boolean,
    showDefEditComp: boolean,
    addBooking: boolean
}

export enum WrhDetProductsOperationsEnum {
    Choose,
    ChooseBetweenOptions,
    AddProducts,
    ReleaseProducts,
    TransferProducts,
    BookProducts
}

export async function wrhDetProductsReducer(state: WrhDetProductsReducerData, action: WrhDetProductsReducerParams) {
    switch (action.type) {

        case WrhDetProductsOperationsEnum.Choose: {

            if(action.chosenStorageAreaIdFrom) {
                return {
                    ...state,
                    storageAreaIdFrom: action.chosenStorageAreaIdFrom
                }
            } else if(action.chosenWarehouse) {
                return {
                    ...state,
                    warehouse: action.chosenWarehouse
                }
            } else if(action.chosenStorageAreaTo) {
                return {
                    ...state,
                    storageAreaTo: action.chosenStorageAreaTo
                }
            } else if(action.movedProductsAmount !== undefined) {
                return {
                    ...state,
                    movedProductsAmount: action.movedProductsAmount
                }
            } else if(action.addBooking !== undefined) {
                return {
                    ...state,
                    addBooking: action.addBooking
                }
            } else if(action.clickedConfirm) {
                return {
                    ...state,
                    clickedConfirm: action.clickedConfirm
                }
            } else if(action.showDefEditComp) {
                return {
                    ...state,
                    showDefEditComp: action.showDefEditComp
                }
            }
            break;
        }
        case WrhDetProductsOperationsEnum.ChooseBetweenOptions: {

            if(action.startAddProduct) {
                return {
                    ...state,
                    startAddProduct: action.startAddProduct,
                    startPickProduct: false,
                    startMoveProduct: false,
                    startBookProduct: false,
                    warehouse: undefined,
                    storageAreaIdFrom: undefined,
                    storageAreaTo: undefined,
                    addBooking: true,
                    movedProductsAmount: action.movedProductsAmount,
                }
            } else if(action.startPickProduct) {
                return {
                    ...state,
                    startAddProduct: false,
                    startPickProduct: action.startPickProduct,
                    startMoveProduct: false,
                    startBookProduct: false,
                    warehouse: undefined,
                    storageAreaIdFrom: undefined,
                    storageAreaTo: undefined,
                    addBooking: true,
                    movedProductsAmount: action.movedProductsAmount,
                }
            } else if(action.startMoveProduct) {
                return {
                    ...state,
                    startAddProduct: false,
                    startPickProduct: false,
                    startMoveProduct: action.startMoveProduct,
                    startBookProduct: false,
                    warehouse: undefined,
                    storageAreaIdFrom: undefined,
                    storageAreaTo: undefined,
                    addBooking: true,
                    movedProductsAmount: action.movedProductsAmount,
                }
            } else if(action.startBookProduct) {
                return {
                    ...state,
                    startAddProduct: false,
                    startPickProduct: false,
                    startMoveProduct: false,
                    startBookProduct: action.startBookProduct,
                    warehouse: undefined,
                    storageAreaIdFrom: undefined,
                    storageAreaTo: undefined,
                    addBooking: true,
                    movedProductsAmount: action.movedProductsAmount,
                }
            }
            break;
        }
        case WrhDetProductsOperationsEnum.AddProducts: {
            const allDataIsNotNull = !isNaN(action?.chosenDefinitionId as number) && !isNaN(state?.storageAreaTo.id as number) && !isNaN(state?.movedProductsAmount as number)
            if (allDataIsNotNull) {
                const response = await atomicProductApi.createNewAtomicProductFromWarehouse(
                    action?.chosenDefinitionId,
                    state?.storageAreaTo.id,
                    state?.movedProductsAmount);
                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    notification.success({message: "Pomyślnie dodano nowe produkty"});
                    return {
                        ...state,
                        warehouse: undefined,
                        storageAreaIdFrom: undefined,
                        storageAreaTo: undefined,
                        addBooking: true,
                        clickedConfirm: false,
                        startAddProduct: false
                    }
                } else {
                    notification.error({message: "Błąd zapisu."});
                }
            } else {
                notification.error({message: "Błędne dane."});
            }
            break;
        }
        case WrhDetProductsOperationsEnum.ReleaseProducts: {
            const allDataIsNotNull = !isNaN(action?.chosenDefinitionId as number) && !isNaN(state?.storageAreaIdFrom as number) && !isNaN(state?.movedProductsAmount as number)
            if (allDataIsNotNull) {
                const response = await atomicProductApi.issueAtomicProductList(
                    state?.storageAreaIdFrom,
                    state?.movedProductsAmount,
                    action?.chosenDefinitionId);
                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    notification.success({message: "Pomyślnie wydano produkty"});
                    return {
                        ...state,
                        warehouse: undefined,
                        storageAreaIdFrom: undefined,
                        storageAreaTo: undefined,
                        addBooking: true,
                        clickedConfirm: false,
                        startPickProduct: false
                    }
                } else {
                    notification.error({message: "Błąd wydania."});
                }
            } else {
                notification.error({message: "Błędne dane."});
            }
            break;
        }
        case WrhDetProductsOperationsEnum.TransferProducts: {
            const allDataIsNotNull = !isNaN(action?.chosenDefinitionId as number) && !isNaN(state?.storageAreaTo.id as number) && !isNaN(state?.movedProductsAmount as number) && !isNaN(state?.storageAreaIdFrom as number)
            if (allDataIsNotNull) {
                const response = await atomicProductApi.transferAtomicProductsList(
                    state?.storageAreaIdFrom,
                    state?.storageAreaTo.id,
                    state?.movedProductsAmount,
                    action?.chosenDefinitionId);
                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    notification.success({message: "Pomyślnie przesunięto produkty"});
                    return {
                        ...state,
                        warehouse: undefined,
                        storageAreaIdFrom: undefined,
                        storageAreaTo: undefined,
                        addBooking: true,
                        clickedConfirm: false,
                        startMoveProduct: false
                    }
                } else {
                    notification.error({message: "Błąd przesunięcia."});
                }
            } else {
                notification.error({message: "Błędne dane."});
            }
            break;
        }
        case WrhDetProductsOperationsEnum.BookProducts: {
            const allDataIsNotNull = !isNaN(action?.chosenDefinitionId as number) && !isNaN(state?.storageAreaIdFrom as number) && !isNaN(state?.movedProductsAmount as number)
            if (allDataIsNotNull) {
                const response = await atomicProductApi.bookAtomicProductsList(
                    state?.addBooking,
                    state?.storageAreaIdFrom,
                    state?.movedProductsAmount,
                    action?.chosenDefinitionId);
                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    if(state?.addBooking) {
                        notification.success({message: "Pomyślnie zarezerwowano produkty"});
                    } else {
                        notification.success({message: "Pomyślnie anulowano rezerwację"});
                    }
                    return {
                        ...state,
                        warehouse: undefined,
                        storageAreaIdFrom: undefined,
                        storageAreaTo: undefined,
                        addBooking: true,
                        clickedConfirm: false,
                        startBookProduct: false
                    }
                } else {
                    notification.error({message: "Błąd rezerwacji."});
                }
            } else {
                notification.error({message: "Błędne dane."});
            }
            break;
        }
    }
}