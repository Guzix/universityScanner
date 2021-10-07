import {
    MachineCalendarTaskControllerApi,
    AtomicProductDefinitionControllerApi,
    MachineControllerApi,
    ProductionOrderControllerApi,
    OperationTypeControllerApi,
    AtomicOperationControllerApi,
    AtomicProductControllerApi,
    RectangleShapeControllerApi,
    LayerShapeControllerApi,
    CuttingLogicControllerApi,
    UserMlControllerApi,
    UserWorkTimeControllerApi,
    AtomicProductTemplateControllerApi,
    AtomicProductParameterControllerApi,
    AtomicProductParameterTypeControllerApi,
    ErpOrderControllerApi,
    MiscControllerApi,
    StorageAreaControllerApi,
    WarehouseControllerApi,
    LocalErpOrderControllerApi,
    FileControllerApi,
    PackControllerApi,
    InventoryControllerApi,
    ContractorControllerApi,
    NonErpOrderControllerApi,
    PrintControllerApi,
    WorkPlaceControllerApi,
    PrinterControllerApi
} from "../openapi";

function autobind<T>(obj:T):T {
    // Get all defined class methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj));

    // Bind all methods
    methods
        .filter(method => (method !== 'constructor'))
        // @ts-ignore
        .forEach((method) => { obj[method] = obj[method].bind(obj); });
    return obj;
}

const rootPath = `http://${window.location.host}`;

export const machineApi = autobind(new MachineControllerApi({basePath: rootPath}));
export const operationTypeApi = autobind(new OperationTypeControllerApi({basePath: rootPath}));
export const machineCalendarTaskApi = autobind(new MachineCalendarTaskControllerApi({basePath: rootPath}));
export const atomicProductDefinitionApi = autobind(new AtomicProductDefinitionControllerApi({basePath: rootPath}));
export const productionOrderApi = autobind(new ProductionOrderControllerApi({basePath: rootPath}));
export const atomicOperationApi = autobind(new AtomicOperationControllerApi({basePath: rootPath}));
export const atomicProductApi = autobind(new AtomicProductControllerApi({basePath: rootPath}));
export const rectangleShapeApi = autobind(new RectangleShapeControllerApi({basePath: rootPath}));
export const layerShapeApi = autobind(new LayerShapeControllerApi({basePath: rootPath}));
export const atomicProductTemplateApi = autobind(new AtomicProductTemplateControllerApi({basePath: rootPath}));
export const erpOrderApi = autobind(new ErpOrderControllerApi({basePath: rootPath}));
export const localErpOrderApi = autobind(new LocalErpOrderControllerApi({basePath: rootPath}));
export const atomicProductParametersApi = autobind(new AtomicProductParameterControllerApi({basePath: rootPath}));
export const atomicProductParameterTypeApi = autobind(new AtomicProductParameterTypeControllerApi({basePath: rootPath}));
export const miscApi = autobind(new MiscControllerApi({basePath: rootPath}));
export const cuttingApi = autobind(new CuttingLogicControllerApi({basePath: rootPath}));
export const userMLApi = autobind(new UserMlControllerApi({basePath:rootPath}));
export const userWorkTimeApi = autobind(new UserWorkTimeControllerApi({basePath: rootPath}));
export const storageAreaApi = autobind(new StorageAreaControllerApi({basePath:rootPath}));
export const warehouseApi = autobind(new WarehouseControllerApi({basePath:rootPath}));
export const fileApi= autobind(new FileControllerApi({basePath:rootPath}));
export const packApi = autobind(new PackControllerApi({basePath: rootPath}));
export const inventoryApi = autobind(new InventoryControllerApi({basePath: rootPath}));
export const contractorApi = autobind(new ContractorControllerApi({basePath: rootPath}));
export const nonErpOrderApi = autobind(new NonErpOrderControllerApi({basePath: rootPath}));
export const printApi = autobind(new PrintControllerApi({basePath: rootPath}));
export const workPlaceApi = autobind(new WorkPlaceControllerApi({basePath: rootPath}));
export const printerApi = autobind(new PrinterControllerApi({basePath: rootPath}))


async function uploadFile(targetPath:string, formData:FormData){
    const result = await fetch(targetPath, {
        method: "POST",
        body: formData
    });
    if (!result.ok) {
        console.error(result);
    }
    return await result.json();
}

export const uploadMachineCalendarTaskFile = async (taskId: number, file: File) => {
    const targetPath = "/api/file/machine-calendar-task=" + taskId + "/upload-file";
    const formData = new FormData();
    formData.append('files', file, file.name);
    return uploadFile(targetPath,formData)
}
export const uploadLocalErpOrderFile = async (id: number, file: File) => {
    const targetPath = "/api/file/local-erp-order=" + id + "/upload-file";
    const formData = new FormData();
    formData.append('files', file, file.name);
    return uploadFile(targetPath,formData)
}
