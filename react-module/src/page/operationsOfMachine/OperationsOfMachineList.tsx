import React from "react";
import {fixDtStr, t} from "../../misc/misc";
import {
    OperationsOfMachineData,
    OperationsOfMachineParams,
    OperationsOfMachinesTaskEnum
} from "./OperationsOfMachinesReducer";
import {enumToPrettyString} from "../UniversalEdit";
import {format as durationFormat} from "pomeranian-durations";
import {Button as AntButton, Button, Col, Input, Modal, Row, Table as AntTable} from "antd";
import {SmallEmpty} from "../erpOrder/ErpOrderList";


const SearchTaskByNumberModal: React.FC<{
    dispatch: (action: OperationsOfMachineParams) => void
    state: OperationsOfMachineData,
}> = ({state, dispatch}) => {
    const [productNumber, setProductNumber] = React.useState<string>();

    return <>
        <Modal
            visible={state.pageSettings.showSearchByProductModal}
            closable={false}
            width={700}
            onCancel={() => {
                setProductNumber("")
                dispatch({
                    type: OperationsOfMachinesTaskEnum.ShowModal,
                    pageSettings: {
                        ...state.pageSettings,
                        showSearchByProductModal: false
                    }
                })
            }}
            onOk={() => dispatch({
                type: OperationsOfMachinesTaskEnum.SearchByProductNumber,
                productNumber:productNumber
            })}
            footer={[
                <Button size={"large"} style={{padding: 55, paddingTop: 30, marginBottom: 5, marginTop: 5}}
                           onClick={() => dispatch({
                               type: OperationsOfMachinesTaskEnum.ShowModal,
                               pageSettings: {
                                   ...state.pageSettings,
                                   showSearchByProductModal: false
                               }
                           })}
                >{t("Cancel")}</Button>,
                <Button size={"large"} style={{padding: 55, paddingTop: 30, marginBottom: 5, marginTop: 5, marginLeft: 50}}
                        disabled={productNumber?.length==0} type={"primary"}
                        onClick={() => dispatch({type: OperationsOfMachinesTaskEnum.SearchByProductNumber, productNumber:productNumber})}
                >{t("Search")}</Button>
            ]}
        >
            {t("Product Number")}:
            <Input placeholder={t("Product Number")} size={"large"} autoFocus={true} allowClear value={productNumber} onChange={(e) => {
                if (e.target.value.length>=14){
                    dispatch({type: OperationsOfMachinesTaskEnum.SearchByProductNumber, productNumber:e.target.value})
                }
                setProductNumber(e.target.value)
            }} />

        </Modal>
    </>
}

export const OperationsOfMachineList: React.FC<{
    dispatch: (action: OperationsOfMachineParams) => void
    state: OperationsOfMachineData,
}> = ({state, dispatch}) => {


    return <>
        <SearchTaskByNumberModal dispatch={dispatch} state={state}/>
        <Row style={{marginTop: "1rem", marginBottom:"2rem"}}>
            <Col span={8} style={{marginLeft: "3rem"}}>
                <Row>
                    <Col>
                        <h2>{t("Machine")}: {state.chosenMachine.title}</h2>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {state.pageSettings.historyView ?
                            <Button size={"large"} type={"primary"} onClick={() => dispatch({type:OperationsOfMachinesTaskEnum.ChooseMachine, chosenMachine:state.chosenMachine})}>
                                {t("Current Tasks")}
                            </Button> :
                            <Button size={"large"} type={"primary"} onClick={() => dispatch({type:OperationsOfMachinesTaskEnum.ChangeToHistory})}>
                                {t("History")}
                            </Button>
                        }
                    </Col>
                </Row>
            </Col>

            {state.pageSettings.historyView ?
                <Col span={10} className={"text-center"}><h2>{t("Today history")}</h2></Col> :
                state.machineTaskList?.length > 0 ? <>
                    <Col span={5} className={"text-center"}>
                        <Button type={"primary"} style={{padding: 55, paddingTop: 30}} size={"large"}
                                onClick={() => dispatch({type: OperationsOfMachinesTaskEnum.StartNewUserWorkTime,})}
                        >{t("Start next task")}</Button>
                    </Col>
                    <Col span={5} className={"text-center"}>
                        <Button type={"primary"} style={{padding: 55, paddingTop: 30}} size={"large"}
                                onClick={() => dispatch({
                                    type: OperationsOfMachinesTaskEnum.ShowModal,
                                    pageSettings: {
                                        ...state.pageSettings,
                                        showSearchByProductModal: true
                                    }
                                })}
                        >{t("Start by product")}</Button>
                    </Col>
                </> : <Col span={10}/>
            }
            <Col span={5}  className={"text-right"}>
                <Row >
                    <Col span={24} >
                        {t("Username")+": "+state.userMl.username}
                    </Col>

                </Row>
                <Row>
                    <Col span={24}>
                        <Button type={"primary"}  danger style={{padding:55, paddingTop:30}} size={"large"} onClick={() => dispatch(
                            {
                                type: OperationsOfMachinesTaskEnum.Logout
                            }
                        )}>{t("Logout")}</Button>
                    </Col>
                </Row>
            </Col>
        </Row>
        <AntTable
            dataSource={state.machineTaskList}
            rowClassName={" table-operator-height cursor-pointer"}
            locale={{emptyText: <SmallEmpty description={t("No attributes found")}/>}}
            pagination={false}
            bordered
            scroll={{y: "67vh"}}
            style={{height:80}}
            onRow={(record) => {
                return {
                    onClick: (e) => {
                        return dispatch({
                            type: OperationsOfMachinesTaskEnum.ChooseMachineTask,
                            chosenMachineTask: record
                        })
                    }
                }
            }}
            columns={[
                {
                    title: "Id",
                    dataIndex: "id"
                },
                {
                    title: t("Order Number"),
                    dataIndex: "operationList",
                    render: function (operationList) {
                        return operationList[0]?.productionOrder?.erpOrder?.orderNumber
                    }
                },
                {
                    title: t("Client"),
                    dataIndex: "operationList",
                    width: "20%",
                    className:"basic-v-margin",
                    render: function (operationList) {
                        return operationList[0]?.productionOrder?.erpOrder?.srcOrder?.order?.contractorData?.name1 + " " +
                            operationList[0]?.productionOrder?.erpOrder?.srcOrder?.order?.contractorData?.name2 + " " +
                            operationList[0]?.productionOrder?.erpOrder?.srcOrder?.order?.contractorData?.name3
                    }
                },
                {
                    title: t("Planned Start Date"),
                    dataIndex: "startDatePlanned",
                    render: function (startDatePlanned) {
                        return fixDtStr(startDatePlanned)
                    }
                },
                {
                    title: `${t("Estimated Time")} (HH:MM)`,
                    dataIndex: "estimatedTime",
                    render: function (estimatedTime) {
                        return estimatedTime ? durationFormat('%hh:%mm', estimatedTime) : ""
                    }
                },
                {
                    title: t("Planned End Date"),
                    dataIndex: "endDatePlanned",
                    render: function (endDatePlanned) {
                        return fixDtStr(endDatePlanned)
                    }
                },
                // {
                //     title: t("Machine"),
                //     dataIndex: "machine",
                //     render: function (machine) {
                //         return machine?.title
                //     }
                // },
                {
                    title: t("Operation Type"),
                    dataIndex: "operationType",
                    render: function (operationType) {
                        return operationType?.title
                    }
                },
                {
                    title: t("Planning Status"),
                    dataIndex: "planningStatus",
                    render: function (planningStatus) {
                        return t(enumToPrettyString(planningStatus?.valueOf()))
                    }
                },
                {
                    title: t("Production Status"),
                    dataIndex: "productionStatus",
                    render: function (productionStatus) {
                        return t(enumToPrettyString(productionStatus?.valueOf()))
                    }
                },
            ]}
        />
    </>
}
