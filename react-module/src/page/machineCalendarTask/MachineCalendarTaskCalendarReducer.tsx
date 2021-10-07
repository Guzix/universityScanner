import {useState} from "react";
import {
    AtomicOperationProductionOrderLocalErpOrderDto,
    CustomFile, IdAndTitle, LayerShapeBasicDto, LocalErpOrderCalendarDto,
    MachineCalendarTaskCalendarDto,
    MachineCalendarTaskCalendarDtoPlanningStatusEnum, MachineCalendarTaskCalendarDtoProductionStatusEnum,
    OperationTypeBasicDto
} from "../../openapi/models";
import {fileApi, machineApi, machineCalendarTaskApi, operationTypeApi} from "../../api/exports";
import {notification} from "antd";
import {FileData} from "../operationsOfMachine/OperationsOfMachinesReducer";
import {t} from "../../misc/misc";
import moment from "moment";
import {isEmpty} from "lodash";

export type MachineTaskWithStatus = {
    machineTask: MachineCalendarTaskCalendarDto,
    isEdited: boolean,
    isChecked: boolean,
    erpAndShapes?: ErpAndShapes[],
}

export type ErpAndShapes = {
    erpOrder: LocalErpOrderCalendarDto,
    layerShape: LayerShapeBasicDto[],
}

export type CalendarFilterData = {
    startDateFilter: Date,
    endDateFilter: Date,
    searchPhrase: string,
    operationTypes: OperationTypeBasicDto[],
    erpUniques: LocalErpOrderCalendarDto[],
    clientUniques: IdAndTitle[],
    machines: IdAndTitle[],
    planningStatuses: MachineCalendarTaskCalendarDtoPlanningStatusEnum[],
    productionStatuses: MachineCalendarTaskCalendarDtoProductionStatusEnum[],
}

const initialCalendarFilterData = {
    startDateFilter: moment().startOf("day").subtract(1, "days").toDate(),
    endDateFilter: moment().endOf("day").add(7, "days").toDate(),
    searchPhrase: "",
    operationTypes: [],
    erpUniques: [],
    clientUniques: [],
    machines: [],
    planningStatuses: [],
    productionStatuses: [],
} as CalendarFilterData

export type MachineTaskReducerData = {
    machines: IdAndTitle[],
    chosenMachine: IdAndTitle,
    machineTasksWithStatus: MachineTaskWithStatus[],
    chosenMachineTaskWithStatus: MachineTaskWithStatus,
    operationTypes: OperationTypeBasicDto[],
    groupComponent: boolean,
    showFilters: boolean,
    filters: CalendarFilterData,
    fileList:any[],
    chosenFile:FileData,
    fileModal:boolean,
    erpUniqueList: LocalErpOrderCalendarDto[],
    clientUniqueList: IdAndTitle[],
    checkAllStatus: boolean,
}

export const defaultMachineTaskReducerData = {
    machines: [],
    chosenMachine: undefined,
    machineTasksWithStatus: [],
    chosenMachineTaskWithStatus: undefined,
    operationTypes: [],
    groupComponent: false,
    showFilters: true,
    filters: initialCalendarFilterData,
    fileList:[],
    chosenFile:undefined,
    fileModal:false,
    erpUniqueList: [],
    clientUniqueList: [],
    checkAllStatus: false,
} as unknown as MachineTaskReducerData

export type MachineTaskReducerParams = {
    type: MachineTaskOperationsEnum,
    machineTaskId?: number,
    changedMachineTasks?: MachineCalendarTaskCalendarDto[]
    changedMachineTaskSingle?: MachineCalendarTaskCalendarDto,
    machineId?: number,
    changedMachineTaskWithStatus?: MachineTaskWithStatus,
    changedMachineTasksWithStatus?: MachineTaskWithStatus[],
    changedFilters?: CalendarFilterData,
    fileData?: FileData,
}

export enum MachineTaskOperationsEnum {
    Download,
    UpdateTask,
    UpdateTasks,
    UnAssignTask,
    PostSingleEdited,
    PostMultipleEdited,
    UndoSingleEdited,
    ChooseMachineTask,
    ChooseMachine,
    ChangeFilterVisibility,
    UpdateFilters,
    ResetFilters,
    GroupComponentStatus,
    PlanningStatusPlanned,
    ToggleIsChecked,
    DeleteFile,
    ChooseFile,
    CheckAll,
}

export function useAsyncReducer(reducer: any, initState: any){
    const [state, setState]= useState(initState),
        dispatchState = async(action: any) => setState(await reducer(state, action));
    return [state, dispatchState];
}

export async function machineTaskReducer(state: MachineTaskReducerData, action: MachineTaskReducerParams) {
    function updateMachineTask(changedMachineTaskWithStatus: MachineTaskWithStatus): MachineTaskReducerData {
        const newList = state.machineTasksWithStatus.map(machineTask => {
            if (machineTask.machineTask.id === changedMachineTaskWithStatus.machineTask.id) {
                return {machineTask: changedMachineTaskWithStatus.machineTask, isEdited: changedMachineTaskWithStatus.isEdited,
                    isChecked: changedMachineTaskWithStatus.isChecked, erpAndShapes: machineTask.erpAndShapes} as MachineTaskWithStatus
            }
            return machineTask as MachineTaskWithStatus;
        });
        return {
            ...state,
            machineTasksWithStatus: newList,
            chosenMachineTaskWithStatus: undefined,
        }  as unknown as MachineTaskReducerData
    }
    function updateMachineTasks(changedMachineTasksWithStatus: MachineTaskWithStatus[]): MachineTaskReducerData {
        const selectedIds = changedMachineTasksWithStatus?.map(selectedObject => selectedObject.machineTask.id);
        const newList = state.machineTasksWithStatus.map(({machineTask, isEdited, isChecked, erpAndShapes}) => {
            if (selectedIds.includes(machineTask.id)) {
                const editedMachineTask = changedMachineTasksWithStatus.find(machine => machine.machineTask.id === machineTask.id);
                return {machineTask: editedMachineTask?.machineTask, isEdited: editedMachineTask?.isEdited,
                    isChecked: editedMachineTask?.isChecked, erpAndShapes: erpAndShapes} as MachineTaskWithStatus
            }
            return {machineTask: machineTask, isEdited: isEdited, isChecked: isChecked, erpAndShapes: erpAndShapes} as MachineTaskWithStatus;
        });
        return {
            ...state,
            machineTasksWithStatus: newList,
        }
    }
    function operationListErpAndShapesUnique(operationList: any[]) {
        let list: ErpAndShapes[] = [];
        const productionOrders = operationList?.map(o => o?.productionOrder)
        if (productionOrders?.length === 1) {
            productionOrders?.map(pO => list?.push({erpOrder: pO?.erpOrder, layerShape: [pO?.layerShape]}))
        } else {
            const erpUniques = productionOrders?.filter((v, i, a) => a?.findIndex(pO => (pO?.erpOrder?.id === v?.erpOrder?.id)) === i)
            const shapeUniques = productionOrders?.filter((v, i, a) => a?.findIndex(pO => (pO?.layerShape?.id === v?.layerShape?.id)) === i)
            erpUniques?.map(pO => list?.push({erpOrder: pO?.erpOrder, layerShape: shapeUniques?.filter(shapePO => shapePO?.erpOrder?.id === pO?.erpOrder?.id).map(v => v?.layerShape)}))
        }
        return list
    }
    switch (action.type) {
        case MachineTaskOperationsEnum.Download: {
            const machinesResponse = await machineApi.maGetObjectList();
            const operationTypesResponse = await operationTypeApi.opTyGetObjectList();
            const machineTasksResponse = await machineCalendarTaskApi
                .getFilteredListForCalendar({startDate: state.filters.startDateFilter, endDate: state.filters.endDateFilter});
            const machineTasksWithStatus = machineTasksResponse.data.resource
                .map((machineTask: any) => ({machineTask, isEdited: false, isChecked: false, erpAndShapes: operationListErpAndShapesUnique(machineTask.operationList)}));
            const updatedMachineTasksList = state.machineTasksWithStatus.filter(machineTasksWithStatus => machineTasksWithStatus.isEdited || machineTasksWithStatus.isChecked);
            const ids = updatedMachineTasksList.map(({machineTask}) => machineTask.id)
            if(machinesResponse.status == 200 && machineTasksResponse.status == 200 && operationTypesResponse.status == 200) {
                return {
                    ...state,
                    machines: machinesResponse?.data,
                    operationTypes: operationTypesResponse?.data,
                    machineTasksWithStatus: updatedMachineTasksList?.concat(machineTasksWithStatus?.filter((mT: any) => mT?.isEdited === ids?.includes(mT?.machineTask?.id))),
                    erpUniqueList: machineTasksResponse?.data?.resource?.flatMap((machineTask: MachineCalendarTaskCalendarDto) =>
                        machineTask.operationList?.map((oL: AtomicOperationProductionOrderLocalErpOrderDto) => oL?.productionOrder?.erpOrder))
                        .filter((v: any, i: any, a: any[]) => a?.findIndex(t => (t?.orderNumber === v?.orderNumber)) === i),
                    clientUniqueList: machineTasksResponse?.data?.resource?.flatMap((machineTask: MachineCalendarTaskCalendarDto) =>
                        machineTask?.operationList?.map((oL: AtomicOperationProductionOrderLocalErpOrderDto) => oL?.productionOrder?.erpOrder?.srcOrder?.order?.contractorData?.name1))
                        .filter((v: any, i: any, a: any[]) => a?.findIndex(t => (t === v)) === i).map((cUL: string, index: number) => {
                            return {id: index + 1, title: cUL} as IdAndTitle
                        }),
                } as MachineTaskReducerData
            } else {
                notification.error({message: "Błąd pobierania danych."});
            }
            break;
        }
        case MachineTaskOperationsEnum.PostSingleEdited: {
            if (!isNaN(action.machineTaskId as number)) {
                const machineTaskWithStatus =  state.machineTasksWithStatus.find(({machineTask}) => {
                    return machineTask.id === action.machineTaskId
                })
                if (machineTaskWithStatus?.machineTask) {
                    const response = await machineCalendarTaskApi.updateAll([machineTaskWithStatus.machineTask as any]);
                    if (response.status === 200) {
                        notification.success({message: "Zapisano zmiany."});
                        return updateMachineTask({
                            ...machineTaskWithStatus,
                            isEdited: false,
                            isChecked: false,
                        });
                    } else {
                        notification.error({message: "Błąd zapisu."});
                    }
                }
            }
            break;
        }
        case MachineTaskOperationsEnum.PostMultipleEdited: {
            const editedMachineTasks = state.machineTasksWithStatus.filter(machineTaskWithStatus => machineTaskWithStatus.isEdited)
                .map(machineTaskWithStatus => machineTaskWithStatus.machineTask)
            const response = await machineCalendarTaskApi.updateAll(editedMachineTasks as any);
            if(response.status == 200) {
                notification.success({message: "Zapisano zmiany."});
                const changedMachineTasksIdList = editedMachineTasks.map(machineTask => machineTask.id);
                return {
                    ...state, machineTasksWithStatus: state.machineTasksWithStatus.map(machineTaskWithStatus => {
                        if (changedMachineTasksIdList.includes(machineTaskWithStatus.machineTask.id)) {
                            return {...machineTaskWithStatus, isEdited: false, isChecked: false} as MachineTaskWithStatus;
                        }
                        return machineTaskWithStatus;
                    })
                } as MachineTaskReducerData;
            } else {
                notification.error({message: "Błąd zapisu"});
            }
            break;
        }
        case MachineTaskOperationsEnum.UpdateTask: {
            if(action.changedMachineTaskWithStatus) {
                return updateMachineTask(action.changedMachineTaskWithStatus);
            }
            break;
        }
        case MachineTaskOperationsEnum.UpdateTasks: {
            if(action.changedMachineTasksWithStatus) {
                return updateMachineTasks(action.changedMachineTasksWithStatus)
            }
            break;
        }
        case MachineTaskOperationsEnum.UnAssignTask: {
            if (!isNaN(action.machineTaskId as number)) {
                const machineTaskWithStatus =  state.machineTasksWithStatus.find(({machineTask}) => {
                    return machineTask.id === action.machineTaskId
                })
                if (machineTaskWithStatus) {
                    return updateMachineTask({
                        ...machineTaskWithStatus,
                        machineTask: {
                            ...machineTaskWithStatus.machineTask,
                            machine: null
                        },
                        isEdited: true,
                        isChecked: false,
                    })
                }
            }
            break;
        }
        case MachineTaskOperationsEnum.ChooseMachineTask: {
            if (!isNaN(action.machineTaskId as number)) {
                const machineTaskWithStatus =  state.machineTasksWithStatus.find(({machineTask}) => {
                    return machineTask.id === action.machineTaskId
                })
                const filesResponse =  machineTaskWithStatus && await fileApi.getMachineCalendarTask(machineTaskWithStatus.machineTask.id)
                const files =filesResponse && filesResponse.data.resource
                const fileList:FileData[]=files.map((file: CustomFile, index:number )=>{
                    return {
                        id:index,
                        fileName:file.filename,
                        path:file.path,
                        extension:file.extension
                    }
                })
                return {
                    ...state,
                    chosenMachineTaskWithStatus: machineTaskWithStatus,
                    fileList:fileList
                } as MachineTaskReducerData
            } else {
                return {
                    ...state,
                    chosenMachineTaskWithStatus: undefined
                } as unknown as MachineTaskReducerData
            }
        }
        case MachineTaskOperationsEnum.GroupComponentStatus: {
            return {
                ...state,
                groupComponent: !state.groupComponent,
            } as unknown as MachineTaskReducerData
        }
        case MachineTaskOperationsEnum.ChooseMachine: {
            if (!isNaN(action.machineId as number)) {
                const machine =  state.machines.find((machine) => {
                    return machine.id === action.machineId
                })
                return {
                    ...state,
                    chosenMachine: machine,
                } as MachineTaskReducerData
            } else {
                return {
                    ...state,
                    chosenMachine: undefined
                } as unknown as MachineTaskReducerData
            }
        }
        case MachineTaskOperationsEnum.ChangeFilterVisibility: {
            return {
                ...state,
                showFilters: !state.showFilters,
            } as unknown as MachineTaskReducerData
        }
        case MachineTaskOperationsEnum.PlanningStatusPlanned: {
            const checkedMachineTasksWithStatus = state.machineTasksWithStatus.filter(machineTaskWithStatus => machineTaskWithStatus.isChecked
                && machineTaskWithStatus.machineTask.planningStatus === MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED)
            if (isEmpty(checkedMachineTasksWithStatus)) {
                if (action.changedMachineTaskWithStatus) {
                    return updateMachineTask({
                        ...action.changedMachineTaskWithStatus,
                        machineTask: {
                            ...action.changedMachineTaskWithStatus.machineTask,
                            planningStatus: MachineCalendarTaskCalendarDtoPlanningStatusEnum.CONFIRMED
                        },
                        isEdited: true,
                        isChecked: false,
                    } as MachineTaskWithStatus)
                }
            } else {
                return updateMachineTasks(checkedMachineTasksWithStatus
                    .map((currentTask) => {
                        return {
                            ...currentTask,
                            machineTask: {
                                ...currentTask?.machineTask,
                                planningStatus: MachineCalendarTaskCalendarDtoPlanningStatusEnum.CONFIRMED,
                            },
                            isEdited: true,
                            isChecked: false,
                        } as MachineTaskWithStatus
                    })
                )
            }

            break;
        }
        case MachineTaskOperationsEnum.ToggleIsChecked: {
            if (action.changedMachineTaskWithStatus) {
                const value = action.changedMachineTaskWithStatus;
                return updateMachineTask({
                    ...value,
                    isChecked: !value.isChecked,
            } as MachineTaskWithStatus)
            }
            break;
        }
        case MachineTaskOperationsEnum.DeleteFile:{
            const response =  await fileApi.deleteFile({filePath:action.fileData?.path, fileName:action.fileData?.fileName})
            if (response.data == "OK"){
                notification.success({message: t("File deleted")})
                return {
                    ...state,
                    fileList:state.fileList.filter(file => file.filename != action.fileData?.fileName && file.path != action.fileData?.path),

                }as MachineTaskReducerData
            }else {
                notification.error({message:"Error"})
                return {
                    ...state,
                    deleteApproveModal:false,
                }as MachineTaskReducerData
            }

        }
        case MachineTaskOperationsEnum.ChooseFile:{
            return {
                ...state,
                chosenFile:action.fileData,
                fileModal:!!action.fileData,
            }as MachineTaskReducerData
        }
        case MachineTaskOperationsEnum.UpdateFilters: {
            if (action.changedFilters) {
                return {
                    ...state,
                    filters: action.changedFilters,
                } as MachineTaskReducerData
            }
            break;
        }
        case MachineTaskOperationsEnum.CheckAll: {
            const machineTasksWithStatusToCheckIds = state.machineTasksWithStatus
                .filter(({machineTask}) => (!machineTask.machine || (!machineTask.startDatePlanned || !machineTask.endDatePlanned) ||
                    machineTask.planningStatus === MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED))
                .filter(mTWS => isEmpty(state?.filters?.erpUniques) ? mTWS : state.filters?.erpUniques
                    .map(eU => eU.id).some(someErpU => mTWS.machineTask?.operationList
                        .map((oL: AtomicOperationProductionOrderLocalErpOrderDto) => oL.productionOrder?.erpOrder?.id)
                        .indexOf(someErpU) >= 0) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state?.filters?.clientUniques) ? mTWS : state.filters?.clientUniques
                    .map(cU => cU.title).some(someTitle => mTWS.machineTask?.operationList
                        .map((oL: AtomicOperationProductionOrderLocalErpOrderDto) => oL.productionOrder?.erpOrder?.srcOrder?.order?.contractorData?.name1)
                        .indexOf(someTitle) >= 0) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state.filters?.operationTypes) ? mTWS :
                    state.filters?.operationTypes?.map(oT => oT.id).includes(mTWS.machineTask?.operationType?.id) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state.filters?.machines) ? mTWS :
                    state.filters?.machines.map(m => m.id).includes(mTWS.machineTask?.machine?.id) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state.filters?.planningStatuses) ? mTWS :
                    Object.values(state.filters?.planningStatuses).includes(mTWS.machineTask?.planningStatus as any) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state.filters?.productionStatuses) ? mTWS :
                    Object.values(state.filters?.productionStatuses).includes(mTWS.machineTask?.productionStatus as any) || mTWS.isEdited || mTWS.isChecked)
                .filter(mTWS => isEmpty(state.filters?.searchPhrase) ? mTWS : mTWS.machineTask?.operationList
                    .map((oL: AtomicOperationProductionOrderLocalErpOrderDto) => oL?.productionOrder?.erpOrder)
                    .find((v: LocalErpOrderCalendarDto) => v.orderNumber.toLowerCase().includes(state?.filters?.searchPhrase.toLowerCase() as string) ||
                        v.srcOrder?.order?.contractorData?.name1.toLowerCase().includes(state?.filters?.searchPhrase.toLowerCase() as string) ||
                        v.srcOrder?.order?.contractorData?.name2.toLowerCase().includes(state?.filters?.searchPhrase.toLowerCase() as string) ||
                        v.srcOrder?.order?.contractorData?.name3.toLowerCase().includes(state?.filters?.searchPhrase.toLowerCase() as string)) || mTWS.isEdited || mTWS.isChecked)
                .map(mTWS => mTWS.machineTask.id)
            return {
                ...state,
                machineTasksWithStatus: state.machineTasksWithStatus.map(mTWS => {
                    if (machineTasksWithStatusToCheckIds.includes(mTWS.machineTask.id)) {
                        return {
                            ...mTWS,
                            isChecked: !state.checkAllStatus,
                        } as MachineTaskWithStatus
                    } else {
                        return mTWS
                    }
                }),
                checkAllStatus: !state.checkAllStatus
            } as MachineTaskReducerData
        }
        case MachineTaskOperationsEnum.UndoSingleEdited: {
            if (action.changedMachineTaskWithStatus) {
                const machineTaskFromDB = await machineCalendarTaskApi.maCaTaGetObject(action.changedMachineTaskWithStatus.machineTask.id);
                const value = action.changedMachineTaskWithStatus;
                return updateMachineTask({
                    ...value,
                    machineTask: machineTaskFromDB.data as MachineCalendarTaskCalendarDto,
                    isChecked: false,
                    isEdited: false,
                    erpAndShapes: action.changedMachineTaskWithStatus.erpAndShapes,
                } as MachineTaskWithStatus)
            }
            break;
        }
        case MachineTaskOperationsEnum.ResetFilters:{
            return {
                ...state,
                filters: {
                    ...state.filters,
                    searchPhrase: "",
                    operationTypes: [],
                    erpUniques: [],
                    clientUniques: [],
                    machines: [],
                    planningStatuses: [],
                    productionStatuses: [],
                },
            } as MachineTaskReducerData
        }
    }
}
