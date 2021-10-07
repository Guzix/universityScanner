import React from "react";
import {atomicProductDefinitionApi, storageAreaApi, warehouseApi} from "../../api/exports";
import {
    AtomicProductDefinitionBasicDto,
    IProductDefsWithStorageAmount,
    IProductDefsWithTotalAmount, StorageAreaBasicDto, ValueParamComparisonOperationEnum, WarehouseBasicDto
} from "../../openapi/models";
import {notification} from "antd";
import {processRawRes} from "../../misc/misc";


export type WarehouseProductReducerData = {
    products: IProductDefsWithTotalAmount[],
    storageAreas: StorageAreaBasicDto[],
    warehouses: WarehouseBasicDto[],
    productDefinitions: AtomicProductDefinitionBasicDto[],
    wrhProductsByDef: IProductDefsWithStorageAmount[],
    showDetails: boolean,
    showAddComponent: boolean,
    showFilterComponent: boolean,
    sortByValue: boolean,
    sortByName: boolean,
    chosenDefinitionId: number | undefined,
    filterParams: WarehouseFilters,
}

export type WarehouseFilters = {
    searchQuery?: string,
    searchByTotalAmount?: ValueParam,
    searchByThickness?: ValueParam,
    searchByHeight?: ValueParam,
    searchByWidth?: ValueParam,

}

type ValueParam = {
    enabled?: boolean;
    value1?: number;
    value2?: number;
    comparisonOperation?: ValueParamComparisonOperationEnum;
}

const defaultValueParam: ValueParam = {
    enabled: false,
    value1: 0,
    value2: 0,
    comparisonOperation: ValueParamComparisonOperationEnum.NOTSELECTED,
}

export const defaultWarehouseProductReducerData: WarehouseProductReducerData = {
    products: [],
    storageAreas: [],
    warehouses: [],
    productDefinitions: [],
    wrhProductsByDef: [],
    showDetails: false,
    showAddComponent: false,
    showFilterComponent: false,
    chosenDefinitionId: undefined,
    sortByValue: false,
    sortByName: true,
    filterParams:{
        searchQuery: "",
        searchByTotalAmount: defaultValueParam,
        searchByThickness: defaultValueParam,
        searchByHeight: defaultValueParam,
        searchByWidth: defaultValueParam,
    },
}

export type WarehouseProductReducerParams = {
    type: WarehouseProductOperationsEnum,
    chosenDefinitionId?: number,
    showAddComponent?: boolean,
    showFilterComponent?: boolean,
    sort?: boolean,
    searchFilteredData?: boolean,
    sortByValue?: boolean,
    sortByName?: boolean,
    filterParams?: WarehouseFilters,
}

export enum WarehouseProductOperationsEnum {
    Download,
    ChooseDefinitionAndDownloadWrhProducts,
    ShowAddComponent,
    DownloadDataAndCloseComponent,
    ShowFilterComponent,
    SetQueryParam,
    GetGFilteredData,
    DownloadAndSortData,
}

export async function warehouseProductReducer(state: WarehouseProductReducerData, action: WarehouseProductReducerParams) {
    switch (action.type) {
        case WarehouseProductOperationsEnum.Download: {
            const warehouseProductsResponse = await warehouseApi.getWarehouseProducts();
            const storageAreaResponse = await storageAreaApi.stArGetObjectList();
            const warehousesResponse = await warehouseApi.wrGetObjectList();
            const baseProductDefinitionsResponse = await atomicProductDefinitionApi.getAllDefinitionsWithBaseCategory();
            // processRawRes() dodatkowo zrefaktorować
            const wrhProducts = warehouseProductsResponse.data
            const areas = storageAreaResponse.data
            const warehouses = warehousesResponse.data
            const definitions = baseProductDefinitionsResponse.data

            const allDataStatus200 = (warehouseProductsResponse.status === 200) &&
                (storageAreaResponse.status === 200) &&
                (warehousesResponse.status === 200) &&
                (baseProductDefinitionsResponse.status === 200)

            if(allDataStatus200) {
                return {
                    ...state,
                    products: wrhProducts,
                    storageAreas: areas,
                    warehouses: warehouses,
                    productDefinitions: definitions
                }
            } else {
                notification.error({message: "Błąd pobierania danych."});
            }
            break;
        }
        case WarehouseProductOperationsEnum.ChooseDefinitionAndDownloadWrhProducts: {
            if(action.chosenDefinitionId) {
                const response = await warehouseApi.getWarehouseProductsByDefinition(action.chosenDefinitionId);
                const warehouseProductsResponse = await warehouseApi.getWarehouseProducts();
                const wrhProducts = warehouseProductsResponse.data
                const productsByDef = response.data;

                if(state?.sortByValue) {
                    productsByDef?.sort((a, b) => {
                        return (a.totalAmount < b.totalAmount) ? 1 : -1;})
                } else if(state?.sortByName) {
                    productsByDef?.sort((a, b) => {
                        return (a.defTitle < b.defTitle) ? -1 : 1;})
                }

                const allDataStatus200 = (warehouseProductsResponse.status === 200) && (response.status === 200)

                // processRawRes() dodatkowo zrefaktorować
                if (allDataStatus200) {
                    return {
                        ...state,
                        products: wrhProducts,
                        chosenDefinitionId: action.chosenDefinitionId,
                        wrhProductsByDef: productsByDef,
                        showDetails: true
                    }
                } else {
                    notification.error({message: "Błąd pobierania danych."});
                }
            } else {
                return {
                    ...state,
                    chosenDefinitionId: undefined,
                    wrhProductsByDef: undefined,
                    showDetails: false
                }
            }
            break;
        }
        case WarehouseProductOperationsEnum.ShowAddComponent: {
            if(action.showAddComponent) {
                return {
                    ...state,
                    showAddComponent: action.showAddComponent
                }
            }
            break;
        }
        case WarehouseProductOperationsEnum.DownloadDataAndCloseComponent: {
            const warehouseProductsResponse = await warehouseApi.getWarehouseProducts();
            // processRawRes() dodatkowo zrefaktorować
            const wrhProducts = warehouseProductsResponse.data

            if(warehouseProductsResponse.status === 200) {
                return {
                    ...state,
                    products: wrhProducts,
                    showAddComponent: false,
                }
            } else {
                notification.error({message: "Błąd pobierania danych."});
            }
            break;
        }
        case WarehouseProductOperationsEnum.ShowFilterComponent: {
            if(action.showFilterComponent) {
                return {
                    ...state,
                    showFilterComponent: action.showFilterComponent,
                    filterParams:{
                        ...state?.filterParams,
                        searchQuery: "",
                        searchByTotalAmount: defaultValueParam,
                        searchByThickness: defaultValueParam,
                        searchByHeight: defaultValueParam,
                        searchByWidth: defaultValueParam,
                    }
                }
            }
            break;
        }
        case WarehouseProductOperationsEnum.SetQueryParam: {

            if(action.filterParams?.searchQuery != undefined) {
                return {
                    ...state,
                    filterParams:{
                        ...state?.filterParams,
                        searchQuery: action.filterParams?.searchQuery
                    }
                }
            } else if(action.filterParams?.searchByTotalAmount?.enabled != undefined) {
                if(action.filterParams?.searchByTotalAmount?.enabled) {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByTotalAmount: {
                                ...state?.filterParams?.searchByTotalAmount,
                                enabled: action.filterParams?.searchByTotalAmount?.enabled,
                            }
                        }
                    }
                } else {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByTotalAmount: {
                                ...state?.filterParams?.searchByTotalAmount,
                                enabled: action.filterParams?.searchByTotalAmount?.enabled,
                                value1: 0,
                                value2: 0,
                                comparisonOperation: ValueParamComparisonOperationEnum.NOTSELECTED
                            }
                        }
                    }
                }
            } else if(action?.filterParams?.searchByHeight?.enabled != undefined) {
                if(action.filterParams?.searchByHeight?.enabled) {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByHeight: {
                                ...state?.filterParams?.searchByHeight,
                                enabled: action.filterParams?.searchByHeight?.enabled,
                            }
                        }
                    }
                } else {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByHeight: {
                                ...state?.filterParams?.searchByHeight,
                                enabled: action.filterParams?.searchByHeight?.enabled,
                                value1: 0,
                                value2: 0,
                                comparisonOperation: ValueParamComparisonOperationEnum.NOTSELECTED
                            }
                        }
                    }
                }
            } else if(action.filterParams?.searchByThickness?.enabled != undefined) {
                if(action.filterParams?.searchByThickness?.enabled) {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByThickness: {
                                ...state?.filterParams?.searchByThickness,
                                enabled: action.filterParams?.searchByThickness?.enabled,
                            }
                        }
                    }
                } else {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByThickness: {
                                ...state?.filterParams?.searchByThickness,
                                enabled: action.filterParams?.searchByThickness?.enabled,
                                value1: 0,
                                value2: 0,
                                comparisonOperation: ValueParamComparisonOperationEnum.NOTSELECTED
                            }
                        }
                    }
                }
            } else if(action.filterParams?.searchByWidth?.enabled != undefined) {
                if(action.filterParams?.searchByWidth?.enabled) {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByWidth: {
                                ...state?.filterParams?.searchByWidth,
                                enabled: action.filterParams?.searchByWidth?.enabled,
                            }
                        }
                    }
                } else {
                    return {
                        ...state,
                        filterParams: {
                            ...state?.filterParams,
                            searchByWidth: {
                                ...state?.filterParams?.searchByWidth,
                                enabled: action.filterParams?.searchByWidth?.enabled,
                                value1: 0,
                                value2: 0,
                                comparisonOperation: ValueParamComparisonOperationEnum.NOTSELECTED
                            }
                        }
                    }
                }
            } else if(state?.filterParams?.searchByTotalAmount?.enabled && action.filterParams?.searchByTotalAmount?.comparisonOperation != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByTotalAmount: {
                            ...state?.filterParams?.searchByTotalAmount,
                            comparisonOperation: action.filterParams?.searchByTotalAmount?.comparisonOperation
                        }
                    }
                }
            } else if(state?.filterParams?.searchByHeight?.enabled && action.filterParams?.searchByHeight?.comparisonOperation != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByHeight: {
                            ...state?.filterParams?.searchByHeight,
                            comparisonOperation: action.filterParams?.searchByHeight?.comparisonOperation
                        }
                    }
                }
            } else if(state?.filterParams?.searchByThickness?.enabled && action.filterParams?.searchByThickness?.comparisonOperation != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByThickness: {
                            ...state?.filterParams?.searchByThickness,
                            comparisonOperation: action.filterParams?.searchByThickness?.comparisonOperation
                        }
                    }
                }
            } else if(state?.filterParams?.searchByWidth?.enabled && action.filterParams?.searchByWidth?.comparisonOperation != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByWidth: {
                            ...state?.filterParams?.searchByWidth,
                            comparisonOperation: action.filterParams?.searchByWidth?.comparisonOperation
                        }
                    }
                }
            } else if(state?.filterParams?.searchByTotalAmount?.enabled &&
                state.filterParams?.searchByTotalAmount?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByTotalAmount?.value1 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByTotalAmount: {
                            ...state?.filterParams?.searchByTotalAmount,
                            value1: action.filterParams?.searchByTotalAmount?.value1
                        }
                    }
                }
            } else if(state?.filterParams?.searchByTotalAmount?.enabled &&
                state.filterParams?.searchByTotalAmount?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByTotalAmount?.value2 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByTotalAmount: {
                            ...state?.filterParams?.searchByTotalAmount,
                            value2: action.filterParams?.searchByTotalAmount?.value2
                        }
                    }
                }
            } else if(state?.filterParams?.searchByHeight?.enabled &&
                state.filterParams?.searchByHeight?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByHeight?.value1 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByHeight: {
                            ...state?.filterParams?.searchByHeight,
                            value1: action.filterParams?.searchByHeight?.value1
                        }
                    }
                }
            } else if(state?.filterParams?.searchByHeight?.enabled &&
                state.filterParams?.searchByHeight?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByHeight?.value2 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByHeight: {
                            ...state?.filterParams?.searchByHeight,
                            value2: action.filterParams?.searchByHeight?.value2
                        }
                    }
                }
            } else if(state?.filterParams?.searchByWidth?.enabled &&
                state.filterParams?.searchByWidth?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByWidth?.value1 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByWidth: {
                            ...state?.filterParams?.searchByWidth,
                            value1: action.filterParams?.searchByWidth?.value1
                        }
                    }
                }
            } else if(state?.filterParams?.searchByWidth?.enabled &&
                state.filterParams?.searchByWidth?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByWidth?.value2 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByWidth: {
                            ...state?.filterParams?.searchByWidth,
                            value2: action.filterParams?.searchByWidth?.value2
                        }
                    }
                }
            } else if(state?.filterParams?.searchByThickness?.enabled &&
                state.filterParams?.searchByThickness?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByThickness?.value1 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByThickness: {
                            ...state?.filterParams?.searchByThickness,
                            value1: action.filterParams?.searchByThickness?.value1
                        }
                    }
                }
            } else if(state?.filterParams?.searchByThickness?.enabled &&
                state.filterParams?.searchByThickness?.comparisonOperation !== ValueParamComparisonOperationEnum.NOTSELECTED &&
                action.filterParams?.searchByThickness?.value2 != undefined) {
                return {
                    ...state,
                    filterParams: {
                        ...state?.filterParams,
                        searchByThickness: {
                            ...state?.filterParams?.searchByThickness,
                            value2: action.filterParams?.searchByThickness?.value2
                        }
                    }
                }
            }
            break;
        }
        case WarehouseProductOperationsEnum.GetGFilteredData: {
            if (state?.filterParams?.searchQuery != undefined && state?.filterParams?.searchQuery?.length >= 0) {
                const filteredWarehouseProductsResponse = await warehouseApi.getFilteredWarehouseProducts(state?.filterParams);
                const wrhProducts = filteredWarehouseProductsResponse.data.resource

                if (action.searchFilteredData && filteredWarehouseProductsResponse.status === 200) {
                    return {
                        ...state,
                        products: wrhProducts,
                        showFilterComponent: true,
                    }
                } else {
                    notification.error({message: "Błąd pobierania danych."});
                }
            }
            break;
        }
        case WarehouseProductOperationsEnum.DownloadAndSortData: {
            if(state?.chosenDefinitionId && action.sortByValue !== undefined) {
                const response = await warehouseApi.getWarehouseProductsByDefinition(state?.chosenDefinitionId);
                const productsByDef = response.data;

                productsByDef?.sort((a, b) => {
                    return (a.totalAmount < b.totalAmount) ? 1 : -1;})

                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    return {
                        ...state,
                        sortByValue: action.sortByValue,
                        sortByName: false,
                        wrhProductsByDef: productsByDef,
                    }
                }
            } else if(state?.chosenDefinitionId && action.sortByName !== undefined) {
                const response = await warehouseApi.getWarehouseProductsByDefinition(state?.chosenDefinitionId);
                const productsByDef = response.data;

                productsByDef?.sort((a, b) => {
                    return (a.defTitle < b.defTitle) ? -1 : 1;})

                // processRawRes() dodatkowo zrefaktorować
                if (response.status === 200) {
                    return {
                        ...state,
                        sortByValue: false,
                        sortByName: action.sortByName,
                        wrhProductsByDef: productsByDef,
                    }
                }
            }
            break;
        }
    }
}