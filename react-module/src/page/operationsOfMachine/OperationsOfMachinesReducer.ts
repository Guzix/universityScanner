import {useState} from "react";
import {
    ActionResourceMachineCalendarTaskWithUserWorkTimeActionResourceStatusEnum,
    ActionResourceUserMLDtoActionResourceStatusEnum,
    AtomicOperationExtendedDto,
    CustomFile,
    FailableResourceMachineCalendarTaskWithUserWorkTime,
    FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum,
    MachineCalendarTaskExtendedDto,
    MachineDto,
    UserMLDto,
    UserWorkTimeDto,
    UserWorkTimeDtoEndWorkTimeReasonEnum
} from "../../openapi/models";
import {fileApi, machineApi, machineCalendarTaskApi, printApi, printerApi, userMLApi} from "../../api/exports";
import {notification} from "antd";
import {AxiosResponse} from "axios";
import {t} from "../../misc/misc";

export enum OperationsOfMachinesTaskEnum {
    Login,
    Logout,
    ChooseMachine,
    ChooseMachineTask,
    UserWorkTimeUpdate,
    StopOperation,
    ShowModal,
    StartNewUserWorkTime,
    UpdateUserWorkTimeLocal,
    ChooseFile,
    BackToTaskList,
    SetOperationResult,
    SearchByProductNumber,
    ReturnDefault,
    ChangeToHistory,
    ChangeToCurrentTask,
}

export type OperationsOfMachineData = {
    machineTaskList: MachineCalendarTaskExtendedDto[],
    machines: MachineDto[],
    currentUserWorkTime: UserWorkTimeDto,
    chosenMachine: MachineDto,
    chosenMachineTask: MachineCalendarTaskExtendedDto,
    userMl: UserMLDto,
    pageSettings: OperationsOfMachinePageSettings,
    fileList:any[],
    chosenFile:FileData,
    originalAtomicOperation: AtomicOperationExtendedDto[]
}

export const defaultOperationsOfMachineDate = {
    machineTaskList: [],
    machines: [],
    currentUserWorkTime:undefined,
    chosenMachine: undefined,
    chosenMachineTask: undefined,
    userMl: undefined,
    fileList:[],
    chosenFile:undefined,
    originalAtomicOperation:[],
    pageSettings: {
        activeUser: false,
        showStopReasonModal: false,
        showApproveStopModal: false,
        showFileDataModal:false,
        userRfid:undefined,
        showSearchByProductModal:false,
        historyView: false,
        printing: false,
    }
} as unknown as OperationsOfMachineData

export type OperationsOfMachineParams = {
    type: OperationsOfMachinesTaskEnum,
    pageSettings?: OperationsOfMachinePageSettings,
    chosenMachineTask?: MachineCalendarTaskExtendedDto,
    userRfid?: string,
    chosenMachine?: MachineDto,
    userWorkTime?:UserWorkTimeDto,
    fileData?:FileData,
    atomicOperation?: AtomicOperationExtendedDto,
    productNumber?: string
}

export type OperationsOfMachinePageSettings = {
    activeUser: boolean
    showStopReasonModal: boolean
    showApproveStopModal: boolean
    showFileDataModal:boolean
    userRfid:string
    showSearchByProductModal: boolean
    historyView: boolean
    printing:boolean
}

export type FileData ={
    id:number,
    fileName:string,
    path:string,
    extension:string,
}

export function useOperationsOfMachineAsyncReducer(reducer: any, initState: any) {
    const [state, setState] = useState(initState),
        dispatchState = async (action: any) => setState(await reducer(state, action));
    return [state, dispatchState];
}

export async function operationsOfMachineReducer(state: OperationsOfMachineData, action: OperationsOfMachineParams) {
    async function getMachineTask(id:number){
        const response = await machineCalendarTaskApi.getMachineTaskListByMachine(id);
        return response.data.resource;
    }

    async function returnDefault(){
        return {
            ...state,
            pageSettings:{
                ...state.pageSettings,
                showSearchByProductModal:false,
            }
        } as OperationsOfMachineData
    }

    async function setUserWorkTime(response: AxiosResponse<FailableResourceMachineCalendarTaskWithUserWorkTime>) {

        if(response.status != 200) {
            notification.error({
                message: `Invalid response status: ${response.status} - ${response.statusText}`,
                description: JSON.stringify(response.data)
            })
        } else {
            if(!response.data == null) {
                notification.error({
                    message: "Data not found",
                })
            } else {
                const status = response.data.status
                const result = response.data.resource
                switch (status){
                    case undefined: {
                        return returnDefault()
                    }
                    case  FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.OKCONTAINSWRONGPRODUCTS: {
                        notification.error({
                            message: t("This product is assigned to another machine"),
                            description: t("Contact with manager")
                        })
                        return returnDefault()
                    }
                    case  FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.UNKNOWN: {
                        notification.error({
                            message: t("Wrong barcode")
                        })
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.OBJECTDOESNOTEXIST: {
                        notification.error({
                            message: t("This product is not assigned to any task"),
                            description: t("Contact with manager")
                        })
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.UNEXPECTEDERROR: {
                        notification.error({message: t("Error")})
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.TOMANYOBJECTS: {
                        notification.error({
                            message: t("Too many unfinished operations in this task"),
                            description: t("Contact with manager")
                        })
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.WRONGUSER: {
                        notification.error({
                            message: t("Someone did not finish the task"),
                            description: t("Contact with manager")
                        })
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.WRONGSTATUS: {
                        notification.error({
                            message: t("Task not yet planned"),
                            description: t("Contact with manager")
                        })
                        return returnDefault()
                    }
                    case FailableResourceMachineCalendarTaskWithUserWorkTimeStatusEnum.PARTIALSUCCESS: {
                        notification.warning({
                            message: t("You didn't finish the task last time"),
                            description: t("If necessary") + " " + t("Contact with manager")
                        })
                    }

                }

                const filesResponse = await fileApi.getMachineCalendarTask(result.machineCalendarTask.id)
                const files = filesResponse.data.resource
                const fileList: FileData[] = files.map((file: CustomFile, index: number) => {
                    return {
                        id: index,
                        fileName: file.filename,
                        path: file.path,
                        extension: file.extension
                    }
                })

                return {
                    ...state,
                    chosenMachineTask: result.machineCalendarTask,
                    currentUserWorkTime: result.userWorkTime,
                    fileList: fileList,
                    originalAtomicOperation: result.machineCalendarTask.operationList,
                } as OperationsOfMachineData
            }
        }
    }


    //-------------------------------OperationsOfMachinesTaskEnum--------------------------------
    switch (action.type) {
        //------------ChooseMachineTask-----------
        case OperationsOfMachinesTaskEnum.ChooseMachineTask: {
            const response = await machineCalendarTaskApi.getNewUserWorkTime(action.chosenMachineTask?.id, state.userMl.id)
            return setUserWorkTime(response)
        }
        //------------StartNewUserWorkTime-----------
        case OperationsOfMachinesTaskEnum.StartNewUserWorkTime:{
            const response = await machineCalendarTaskApi.getLastMachineTaskByMachine(state.chosenMachine.id, state.userMl.id)
            return setUserWorkTime(response)
        }
        //------------SearchByProductNumber-----------
        case OperationsOfMachinesTaskEnum.SearchByProductNumber:{
            const response = await  machineCalendarTaskApi.getMachineTaskBySerialNumber(state.chosenMachine.id, state.userMl.id, action.productNumber ? action.productNumber : "")
            return setUserWorkTime(response)
        }
        //------------Login-----------
        case OperationsOfMachinesTaskEnum.Login: {
            if (action.userRfid) {
                const rfid = action.userRfid.split("@@");
                if(rfid.length>1){
                    const response = await userMLApi.getUserByRfid(rfid[0])
                    const result = response.data.resource;
                    const machineResponse = await machineApi.maGetObject(Number.parseInt(rfid[1]))
                    if (machineResponse.status != 200){
                        notification.error({message:t("Server Error")})
                        return {
                            ...defaultOperationsOfMachineDate
                        }
                    }
                    const taskResult =await getMachineTask(Number.parseInt(rfid[1]))

                    if (response.data.actionResourceStatus === ActionResourceUserMLDtoActionResourceStatusEnum.OK ) {
                        return {
                            ...state,
                            userMl: result,
                            pageSettings: {...action.pageSettings, activeUser: true},
                            chosenMachine: machineResponse.data,
                            machineTaskList: taskResult,
                        }
                    }else if (response.data.actionResourceStatus === ActionResourceUserMLDtoActionResourceStatusEnum.OBJECTDOESNOTEXIST){
                        notification.error({
                            message: t("User don't exist"),
                            description:t("Contact with manager")
                        })
                    }
                }else {
                    const response = await userMLApi.getUserByRfid(action.userRfid)
                    const result = response.data.resource;

                    if (response.data.actionResourceStatus === ActionResourceUserMLDtoActionResourceStatusEnum.OK) {
                        return {
                            ...state,
                            userMl: result,
                            pageSettings: {...action.pageSettings, activeUser: true}
                        }
                    }else if (response.data.actionResourceStatus === ActionResourceUserMLDtoActionResourceStatusEnum.OBJECTDOESNOTEXIST){
                        notification.error({
                            message: t("User don't exist"),
                            description:t("Contact with manager")
                        })
                    }
                }
            }
            break;
        }
        //------------Logout-----------
        case OperationsOfMachinesTaskEnum.Logout: {
            return {
                ...defaultOperationsOfMachineDate
            }
        }
        //------------ChooseMachine-----------
        case OperationsOfMachinesTaskEnum.ChooseMachine: {
            const result =await getMachineTask(action.chosenMachine?.id)

            return {
                ...state,
                chosenMachine: action.chosenMachine,
                machineTaskList: result,
                pageSettings: {
                    ...state.pageSettings,
                    activeUser: true,
                    historyView: false
                }
            }
        }
        //------------ChangeToHistory-----------
        case OperationsOfMachinesTaskEnum.ChangeToHistory:{
            const result = await machineCalendarTaskApi.getHistoryMachineTaskListByMachine(state.chosenMachine.id);
            return {
                ...state,
                chosenMachine: state.chosenMachine,
                machineTaskList: result.data.resource,
                pageSettings: {
                    ...state.pageSettings,
                    historyView: true
                }
            } as OperationsOfMachineData
        }
        //------------UserWorkTimeUpdate-----------
        case OperationsOfMachinesTaskEnum.UserWorkTimeUpdate: {
            if (state.chosenMachineTask!=null) {
                const response = await machineCalendarTaskApi.saveWithUserWorkTime({
                    machineCalendarTask: {
                        ...state.chosenMachineTask,
                        completed: state?.currentUserWorkTime?.endWorkTimeReason === UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHMACHINECALENDARTASK
                    },
                    userWorkTime:action.userWorkTime
                })
                const result = response.data.resource

                if (response.status === 200) {
                    notification.success({message:t("Start new work")})

                    return {
                        ...state,
                        chosenMachineTask: result.machineCalendarTask,
                        currentUserWorkTime:result.userWorkTime,
                        pageSettings: action.pageSettings ? action.pageSettings : state.pageSettings,
                    }
                } else {
                    notification.error({message: t("Error")})
                }
            }
            return {...state}
        }
        //------------ShowModal-----------
        case OperationsOfMachinesTaskEnum.ShowModal:{
            return {
                ...state,
                pageSettings:action.pageSettings
            }
        }
        //------------StopOperation-----------
        case OperationsOfMachinesTaskEnum.StopOperation:{
            if (state.chosenMachineTask!=null) {
                const response = await machineCalendarTaskApi.saveWithUserWorkTime({
                    machineCalendarTask: {
                        ...state.chosenMachineTask,
                    },
                    userWorkTime:action.userWorkTime
                })

                const taskList = await  getMachineTask(state.chosenMachine.id)
                if (response.status === 200) {
                    return {
                        ...state,
                        chosenMachineTask: undefined,
                        currentUserWorkTime:undefined,
                        pageSettings: action.pageSettings ? action.pageSettings : {...state.pageSettings, showSearchByProductModal:false},
                        machineTaskList:taskList,

                    }
                }
            }
            break;
        }
        //------------UpdateUserWorkTimeLocal-----------
        case OperationsOfMachinesTaskEnum.UpdateUserWorkTimeLocal:{
            return {...state,currentUserWorkTime:action.userWorkTime}
        }
        //------------ChoseFile-----------
        case OperationsOfMachinesTaskEnum.ChooseFile:{
            return {
                ...state,
                chosenFile:action.fileData,
                pageSettings:{
                    ...state.pageSettings,
                    showFileDataModal:!!action.fileData,
                }
            }as OperationsOfMachineData
        }
        //------------BackToTaskList-----------
        case OperationsOfMachinesTaskEnum.BackToTaskList:{
            return {
                ...state,
                chosenMachineTask: action.chosenMachineTask,
                currentUserWorkTime:action.userWorkTime,
                pageSettings:{
                    ...state.pageSettings,
                    showSearchByProductModal:false
                }
            } as OperationsOfMachineData
        }
        //------------SetOperationResult-----------
        case OperationsOfMachinesTaskEnum.SetOperationResult:{
            return {
                ...state,
                chosenMachineTask:{
                    ...state.chosenMachineTask,
                    operationList:state.chosenMachineTask.operationList.map((atOp: AtomicOperationExtendedDto) =>
                        atOp.id===action.atomicOperation?.id ? action.atomicOperation : atOp)
                }
            } as OperationsOfMachineData
        }
    }
}
