import {enumToPrettyString} from "../UniversalEdit";
import {ActionResourceStatus, fixDtStr, processRawRes, t, withinGuard} from "../../misc/misc";
import {
    ActionResourceMachineCalendarTaskWithUserWorkTimeActionResourceStatusEnum,
    AtomicOperationExtendedDto,
    AtomicOperationExtendedDtoOperationResultEnum,
    AtomicProductExtendedDto, FailableResourceWorkPlaceDtoStatusEnum,
    UserWorkTimeDtoEndWorkTimeReasonEnum,
} from "../../openapi/models";
import moment from "moment";
import {
    OperationsOfMachineData,
    OperationsOfMachineParams,
    OperationsOfMachinesTaskEnum
} from "./OperationsOfMachinesReducer";
import Select from "react-select";
import {FileCardComponent} from "../FileCardComponent";
import React, {useEffect} from "react";
import {SwpeRenderer} from "../machineCalendarTask/MachineCalendarTaskEdit";
import {
    Button as AntButton,
    Col as AntCol,
    Divider,
    Form as AntForm,
    Input as AntInput,
    Modal as AntModal, notification,
    Radio,
    Row as AntRow,
    Table as AntTable, Tooltip,
} from "antd";
import {SmallEmpty} from "../erpOrder/ErpOrderList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {printApi, workPlaceApi} from "../../api/exports";

export const Fas = FontAwesomeIcon;


const MachineCalendarTaskChoseFinishReasonModal: React.FC<{
    state: OperationsOfMachineData,
    dispatch: (action: OperationsOfMachineParams) => void
}> = ({state, dispatch}) => {
    const [buttonDisabled, setButtonDisabled] = React.useState<boolean>(true);
    const options = [
        {value: UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHWORKDAY, label: t("Finish work day")},
        {value: UserWorkTimeDtoEndWorkTimeReasonEnum.BREAKTIME, label: t("Brake time")},
        {value: UserWorkTimeDtoEndWorkTimeReasonEnum.MACHINEEMERGENCY, label: t("Machine emergency")},
        {value: UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHMACHINECALENDARTASK, label: t("Finish task")},
    ]

    const isButtonOk = () => {
        switch (state.currentUserWorkTime?.endWorkTimeReason){
            case UserWorkTimeDtoEndWorkTimeReasonEnum.MACHINEEMERGENCY:
            case UserWorkTimeDtoEndWorkTimeReasonEnum.BREAKTIME:
            case UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHWORKDAY:{
                setButtonDisabled(false)
                break;
            }
            case UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHMACHINECALENDARTASK:{
                const result = state.chosenMachineTask.operationList.map((atOp: AtomicOperationExtendedDto) =>
                    atOp.operationResult === AtomicOperationExtendedDtoOperationResultEnum.COMPLETED ||
                        atOp.operationResult === AtomicOperationExtendedDtoOperationResultEnum.BROKEN)
                if (!result.includes(false)){
                    setButtonDisabled(false)
                } else {
                    setButtonDisabled(true)
                }
                break;
            }
            default:{
                setButtonDisabled(true)
            }

        }
    }

    useEffect(()=> {isButtonOk()}, [state])

    return <>
        <AntModal
            visible={state.pageSettings.showStopReasonModal}
            closable={false}
            onCancel={() => {
                dispatch({
                    type: OperationsOfMachinesTaskEnum.ShowModal,
                    pageSettings: {
                        ...state.pageSettings,
                        showStopReasonModal: false
                    }
                })
            }}
            width={1000}
            footer={[
                <AntButton size={"large"} style={{padding: 55, paddingTop: 30, marginBottom: 5, marginTop: 5}}
                           onClick={() => dispatch({
                               type: OperationsOfMachinesTaskEnum.ShowModal,
                               pageSettings: {
                                   ...state.pageSettings,
                                   showStopReasonModal: false
                               }
                           })}
                >{t("Cancel")}</AntButton>,
                <Tooltip   visible={buttonDisabled && state.currentUserWorkTime.endWorkTimeReason===UserWorkTimeDtoEndWorkTimeReasonEnum.FINISHMACHINECALENDARTASK}
                          placement={"bottom"} title={buttonDisabled ? t("Complete all operation first") : ""}>
                    <AntButton size={"large"} style={{padding: 55, paddingTop: 30, marginBottom: 5, marginTop: 5, marginLeft: 50}}
                               disabled={buttonDisabled} type={"primary"} onClick={() => dispatch({
                                    type: OperationsOfMachinesTaskEnum.ShowModal,
                                    pageSettings: {
                                        ...state.pageSettings,
                                        showStopReasonModal: false,
                                        showApproveStopModal: true
                                    }})
                               }
                    >{t("Approve")}</AntButton>
                </Tooltip>
            ]}>
            <h2>{t("Select why you want to stop the task")}</h2>
            <h2>
                <Select options={options} placeholder={t("Select reason")}
                        onChange={(e) => {
                            if (e !== null) {
                                dispatch({
                                    type: OperationsOfMachinesTaskEnum.UpdateUserWorkTimeLocal,
                                    userWorkTime: {
                                        ...state.currentUserWorkTime,
                                        endWorkTimeReason: e.value
                                    }
                                })
                            }
                        }}/>
            </h2>
        </AntModal>
    </>
}


const MachineCalendarTaskFinishQuestionModal: React.FC<{
    state: OperationsOfMachineData,
    dispatch: (action: OperationsOfMachineParams) => void
}> = ({state, dispatch}) => {

    return <>
        <AntModal
            visible={state.pageSettings.showApproveStopModal}
            closable={false}
            onCancel={() => dispatch({
                type: OperationsOfMachinesTaskEnum.ShowModal,
                pageSettings: {
                    ...state.pageSettings,
                    showApproveStopModal: false
                }})}
            width={1000}
            footer={[
                <AntButton  size={"large"} style={{padding:55, paddingTop:30, marginBottom:5, marginTop:5}} danger onClick={() => dispatch({
                    type: OperationsOfMachinesTaskEnum.ShowModal,
                    pageSettings: {
                        ...state.pageSettings,
                        showApproveStopModal: false
                    }})}>{t("No")}</AntButton>,
                <AntButton  size={"large"} style={{padding:55, paddingTop:30, marginBottom:5, marginTop:5, marginLeft:50}} disabled={state.currentUserWorkTime?.endWorkTimeReason == null}
                            type={"primary"}  onClick={() => dispatch({
                    type: OperationsOfMachinesTaskEnum.StopOperation,
                    pageSettings: {
                        ...state.pageSettings,
                        showApproveStopModal: false
                    },
                    userWorkTime: {
                        ...state.currentUserWorkTime,
                        endWorkTime: moment().format("YYYY-MM-DDTHH:mm:ss")
                    },
                })}>{t("Yes")}</AntButton>
            ]}>
            <h2>{t("Are you sure you want to finish this task?")}</h2>
            <h4>{t("Chosen Reason")}:&nbsp;{state.currentUserWorkTime.endWorkTimeReason && t(state.currentUserWorkTime.endWorkTimeReason)}</h4>
        </AntModal>
    </>
}


export const OperationsOfMachineEdit: React.FC<{
    state: OperationsOfMachineData,
    dispatch: (action: OperationsOfMachineParams) => void
}> = ({state, dispatch}) => {
    const [printButtonLoading, setPrintButtonLoading] = React.useState<boolean>(false);


    const printLabel= async (operation:AtomicOperationExtendedDto)=>{
        withinGuard(setPrintButtonLoading, async () => {
            await processRawRes<ActionResourceMachineCalendarTaskWithUserWorkTimeActionResourceStatusEnum>(
                () => printApi.print(operation, operation.outputProducts[0].id) as any,
                async (result) => {
                    if (result === ActionResourceMachineCalendarTaskWithUserWorkTimeActionResourceStatusEnum.OK) {
                        notification.success({message: t("Success Connection")})
                    } else if (result === ActionResourceMachineCalendarTaskWithUserWorkTimeActionResourceStatusEnum.OBJECTDOESNOTEXIST) {
                        notification.error({
                            message: t("Printer doesn't assign"),
                            description: t("Contact with manager"),
                        })
                    } else {
                        notification.error({message: t("Error Connection")})
                    }
                }
            )
        })
    }

    return <div>
        <MachineCalendarTaskChoseFinishReasonModal state={state} dispatch={dispatch}/>
        <MachineCalendarTaskFinishQuestionModal state={state} dispatch={dispatch}/>
        <AntRow style={{width: "100%"}}>
            <AntCol flex={"auto"}>
                <Divider orientation={"left"}><Fas icon={"info-circle"}/>&nbsp; {t("Task Info")}</Divider>
            </AntCol>
            <AntCol span={!state.currentUserWorkTime.startWorkTime ? 3 : 0}>
                <AntButton hidden={state.currentUserWorkTime.startWorkTime} type={"primary"} size={"large"} style={{padding:55, paddingTop:30, marginBottom:5, marginTop:5}}
                           onClick={() => dispatch({
                               type: OperationsOfMachinesTaskEnum.BackToTaskList,
                               chosenMachineTask: undefined,
                               userWorkTime: undefined
                           })}
                >
                    {t("Back to list")}
                </AntButton>
            </AntCol>
        </AntRow>


        <AntForm size={"large"} layout={"horizontal"} labelCol={{span:8}} >
            <AntRow style={{width: "100%"}}>
                <AntCol  span={16}>
                    <AntRow style={{width: "100%"}}>
                        <AntCol span={12}>
                            <AntForm.Item label={t("startDatePlanned")}> <AntInput readOnly value={fixDtStr(state?.chosenMachineTask?.startDatePlanned)}/></AntForm.Item>
                        </AntCol>
                        <AntCol span={12}>
                            <AntForm.Item label={t("endDatePlanned")}> <AntInput  readOnly value={fixDtStr(state?.chosenMachineTask?.endDatePlanned)}/></AntForm.Item>
                        </AntCol>
                    </AntRow>
                    <AntRow style={{width: "100%"}}>
                        <AntCol span={24}>
                            <AntForm.Item labelCol={{ span: 4 }}  wrapperCol={{ span: 20 }}  label={t("info")}> <AntInput.TextArea style={{height:112}} readOnly value={state?.chosenMachineTask?.info}/></AntForm.Item>
                        </AntCol>
                    </AntRow>
                </AntCol>
                <AntCol  span={8} style={{alignItems:"right"}}>
                    <AntRow style={{width: "100%"}}>
                        <AntCol span={24}>
                            <AntForm.Item labelCol={{span:10}}    label={t("startDate")}> <AntInput readOnly  value={fixDtStr(state?.chosenMachineTask?.startDate)}/></AntForm.Item>
                        </AntCol>
                    </AntRow>
                    <AntRow style={{width: "100%"}}>
                        <AntCol span={24}>
                            <AntForm.Item labelCol={{span:10}}   label={t("Planning Status")}> <AntInput readOnly value={t(enumToPrettyString(state.chosenMachineTask?.planningStatus?.valueOf()))}/></AntForm.Item>
                        </AntCol>
                    </AntRow>
                    <AntRow style={{width: "100%"}}>
                        <AntCol span={24}>
                            <AntForm.Item labelCol={{span:10}}   label={t("Production Status")} > <AntInput readOnly value={t(enumToPrettyString(state.chosenMachineTask?.productionStatus?.valueOf()))}/></AntForm.Item>
                        </AntCol>
                    </AntRow>
                </AntCol>
            </AntRow>

            {state.pageSettings.historyView ? <div/> : <div>
            <Divider orientation={"left"}><Fas icon={"wrench"}/>&nbsp; Planowanie operacji </Divider>
            <AntRow style={{width: "100%"}}>
                <AntCol span={8}>
                    <AntForm.Item label={t("Current start work time")}> <AntInput readOnly  value={ fixDtStr(state?.currentUserWorkTime?.startWorkTime)} /></AntForm.Item>
                </AntCol>
                <AntCol span={15} offset={1}>
                    <div className={"d-flex justify-content-center"}>
                        {state.currentUserWorkTime?.startWorkTime == null ?
                            <AntButton style={{padding:55, paddingTop:30, marginBottom:5, marginTop:5, width:"100%"}} type={"primary"}
                                    onClick={() => {
                                        const date = moment().format("YYYY-MM-DDTHH:mm:ss")
                                        dispatch({
                                            type: OperationsOfMachinesTaskEnum.UserWorkTimeUpdate,
                                            userWorkTime: {
                                                ...state.currentUserWorkTime,
                                                startWorkTime: date
                                            },

                                        })
                                    }}
                            >Start</AntButton> :
                            <AntButton style={{padding:55, paddingTop:30, marginBottom:5, marginTop:5, width:"100%"}}  type={"primary"} danger
                                    onClick={() => dispatch({
                                        type: OperationsOfMachinesTaskEnum.ShowModal,
                                        pageSettings: {
                                            ...state.pageSettings,
                                            showStopReasonModal: true
                                        }
                                    })
                                    }
                            >{t("Finish")}</AntButton>
                        }
                    </div>
                </AntCol>
            </AntRow>
            </div>
            }
        </AntForm>
        {state.fileList.length > 0 && <Divider orientation={"left"}><Fas icon={"file"}/>&nbsp; {t("Files")}</Divider>}
        <AntRow style={{width: "100%"}}>
            {state.fileList.map(file =>
                <AntCol span={3}>
                    <FileCardComponent file={file} deletedButtonVisible={false}
                                       chooseFile={() => dispatch({
                                           type: OperationsOfMachinesTaskEnum.ChooseFile,
                                           fileData: file
                                       })}
                    />
                </AntCol>
            )}
        </AntRow>
        {state.chosenMachineTask?.spe  && <>
            <Divider orientation={"left"}><Fas icon={"cut"}/>&nbsp; {t("Cutting view")}</Divider>
            <SwpeRenderer swpe={state.chosenMachineTask?.spe}/>
        </>}
        <Divider orientation={"left"}><Fas icon={"tools"}/>&nbsp; {t("Operations To Do")}</Divider>
        <AntTable
            dataSource={state.chosenMachineTask?.operationList}
            rowClassName={"table-operator-height cursor-pointer"}
            locale={{emptyText: <SmallEmpty description={"No attributes found"}/>}}
            pagination={false}
            bordered
            columns={[
                {
                    title: "Id",
                    width: "5%",
                    dataIndex: "id"
                },
                {
                    title: t("Operation Type"),
                    dataIndex: "operationType",
                    render: function (operationType) {
                        return operationType?.title
                    }
                },

                {
                    title: t("Operation Result"),
                    dataIndex: "operationResult",
                    render: function (operationResult) {
                        return t(operationResult)
                    }
                },

                {
                    title: t("Input Products"),
                    dataIndex: "inputProducts",
                    render: function (inputProducts) {
                        const result = inputProducts?.map((ip: AtomicProductExtendedDto)=> ip.atomicProductDefinition.title + " id: " + ip.id + "\n")
                        return result
                    }
                },

                {
                    title: t("Output Products"),
                    dataIndex: "outputProducts",
                    render: function (outputProducts) {
                        const result = outputProducts?.map((ip: AtomicProductExtendedDto)=> ip.atomicProductDefinition.title + " id: " + ip.id + "\n")
                        return result
                    }
                },
                {
                    title: t("Order Number"),
                    dataIndex: "productionOrder",
                    render: function (productionOrder) {
                        return productionOrder?.erpOrder?.orderNumber
                    }
                },
                {
                    title: t("Operations"),
                    width: "20%",
                    render: function (row) {
                        return state?.originalAtomicOperation?.find(atOp => atOp.id === row?.id)?.operationResult === AtomicOperationExtendedDtoOperationResultEnum.BROKEN ||
                        state?.originalAtomicOperation?.find(atOp => atOp.id === row?.id)?.operationResult === AtomicOperationExtendedDtoOperationResultEnum.COMPLETED ||
                            !state.currentUserWorkTime.startWorkTime ?
                            <div style={{textAlign: "center"}}>{
                                row.operationResult == AtomicOperationExtendedDtoOperationResultEnum.COMPLETED ?
                                    <Fas icon={"check-circle"} size={"4x"} style={{color: "rgb(69,229,67)"}}/> :
                                    row.operationResult == AtomicOperationExtendedDtoOperationResultEnum.BROKEN ?
                                        <Fas icon={"times-circle"} size={"4x"} style={{color: "rgb(227,27,8)"}}/> :
                                        <Fas icon={"question-circle"} size={"4x"} style={{color: "rgb(0,192,255)"}}/>
                            }
                            </div> :
                            <AntRow>
                                <AntCol>
                                    <Radio.Group defaultValue={state.originalAtomicOperation?.find(atOp => atOp.id === row.id)?.operationResult}
                                        size={"large"} buttonStyle={"solid"}
                                    >
                                        <Radio.Button value={state.originalAtomicOperation?.find(atOp => atOp.id === row.id)?.operationResult} onClick={() => dispatch({
                                            type: OperationsOfMachinesTaskEnum.SetOperationResult,
                                            atomicOperation: state.originalAtomicOperation?.find(atOp => atOp.id === row.id)

                                        })}
                                        >{t("No Change")}</Radio.Button>
                                        <Radio.Button value={AtomicOperationExtendedDtoOperationResultEnum.COMPLETED} onClick={() =>dispatch({
                                            type: OperationsOfMachinesTaskEnum.SetOperationResult,
                                            atomicOperation: {
                                                ...row,
                                                operationResult: AtomicOperationExtendedDtoOperationResultEnum.COMPLETED
                                            }
                                        })}
                                        >{t("Done")}</Radio.Button>
                                        <Radio.Button value={AtomicOperationExtendedDtoOperationResultEnum.BROKEN} onClick={() =>dispatch({
                                            type: OperationsOfMachinesTaskEnum.SetOperationResult,
                                            atomicOperation: {
                                                ...row,
                                                operationResult: AtomicOperationExtendedDtoOperationResultEnum.BROKEN
                                            }
                                        })}
                                        >{t("Destroyed")}</Radio.Button>
                                    </Radio.Group>
                                </AntCol>
                            </AntRow>

                    }
                },
                {
                    title: "",
                    width: "7%",
                    render:function (row) {
                        return <div style={{textAlign: "center"}}>
                            <AntButton style={{paddingBottom: 55, paddingTop: 10,}} size={"large"}
                                       disabled={row.operationResult !== AtomicOperationExtendedDtoOperationResultEnum.COMPLETED &&
                                                        row.operationResult !== AtomicOperationExtendedDtoOperationResultEnum.BROKEN
                                       }
                                       onClick={()=> {
                                           setPrintButtonLoading(true)
                                           printLabel(row)
                                       }}
                                       loading={printButtonLoading}
                            >
                                <Fas icon={"print"} size={"3x"} />
                            </AntButton>

                        </div>
                    }
                },

                ]}
        />

    </div>
}
