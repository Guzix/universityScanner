import {
    defaultOperationsOfMachineDate,
    operationsOfMachineReducer, OperationsOfMachinesTaskEnum,
    useOperationsOfMachineAsyncReducer
} from "./OperationsOfMachinesReducer";
import React from "react";
import {OperationsOfMachineList} from "./OperationsOfMachineList";
import {OperationsOfMachineEdit} from "./OperationsOfMachineEdit";
import {machineApi} from "../../api/exports";
import {MachineDto} from "../../openapi/models";
import {UniversalSingleSelect} from "../UniversalEdit";
import {t} from "../../misc/misc";
import {Button, Input} from "antd";


export const OperationsOfMachinePage: React.FC<{}> = () => {
    const [state, dispatch] = useOperationsOfMachineAsyncReducer(operationsOfMachineReducer, defaultOperationsOfMachineDate)
    const [rfidNumber, setRfidNumber] = React.useState<string>();
    return <>
        {state?.pageSettings?.activeUser ?
            state?.chosenMachine ? <div>
                    {state?.chosenMachineTask ?
                        <OperationsOfMachineEdit dispatch={dispatch} state={state}/>
                        :
                        <OperationsOfMachineList dispatch={dispatch} state={state}/>
                    }
                </div>
                :
                <div style={{margin: "auto", marginTop: "10%", width: "50%"}}>
                    <h5>{t("Please select machine")}</h5>
                    <h4> <UniversalSingleSelect fieldText={""}
                                           placeholder={"Machine"}
                                           getObjectsViaApi={machineApi.maGetObjectList}
                                           getItemLabel={(objectMachine: MachineDto) => objectMachine?.title}
                                           defaultValue={state.chosenMachine?.title}
                                           updateObject={(selectedObject: MachineDto) => dispatch(
                                               {
                                                   type: OperationsOfMachinesTaskEnum.ChooseMachine,
                                                   chosenMachine: selectedObject,
                                                   pageSettings: state.pageSettings
                                               })}
                    /></h4>
                </div>
            :
            <div style={{margin: "auto", marginTop: "10%", width: "50%"}}>
                <Input.Password placeholder={"RFID"} autoFocus={true} allowClear  onChange={(e) => {
                    if (e.target.value.length>=10){
                        dispatch({type: OperationsOfMachinesTaskEnum.Login, userRfid: e.target.value})
                    }
                    setRfidNumber(e.target.value)
                }}/>
                <Button type={"primary"} style={{marginTop:15, width:150, height:75}}  size={"large"} onClick={() => {
                    dispatch(
                        {type: OperationsOfMachinesTaskEnum.Login, userRfid: rfidNumber})
                }}>{t("Login")}</Button>

            </div>
        }
    </>
}
