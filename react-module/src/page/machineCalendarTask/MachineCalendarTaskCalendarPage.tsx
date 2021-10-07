import React, {useEffect} from "react";
import {MachineCalendarTaskCalendar, prepareDraggableElements} from "./MachineCalendarTaskCalendar";
import {
    defaultMachineTaskReducerData,
    MachineTaskOperationsEnum,
    machineTaskReducer,
    useAsyncReducer
} from "./MachineCalendarTaskCalendarReducer";
import {Col, Container, Row} from "react-bootstrap";
import {MachineCalendarTaskCalendarList} from "./MachineCalendarTaskCalendarList";
import {PathPage} from "../../App";
import {AtomicOperationAssignList} from "../atomicOperation/AtomicOperationAssignList";
import {LegendColors} from "../../misc/miscComponents";
import {MachineModal, MachineTaskModal} from "./MachineCalendarTaskCalendarModal";
import {t} from "../../misc/misc";
import {MachineTaskFilterList} from "./MachineCalendarTaskCalendarFilters";

export const MachineCalendarTaskCalendarPage: React.FC = () => {
    const [state, dispatch] = useAsyncReducer(machineTaskReducer, defaultMachineTaskReducerData);

    useEffect(() => {
        dispatch({type: MachineTaskOperationsEnum.Download}).then(prepareDraggableElements)
    },[]);

    return <>
        <Container fluid style={{marginTop:"1rem"}}>
            {state.groupComponent &&
                <AtomicOperationAssignList path={PathPage.MACHINE_CALENDAR_TASK_CALENDAR} show={state.groupComponent}/>
            }
            <Row>
                {state.showFilters &&
                <Col xs={2} style={{paddingRight: ".25rem", paddingLeft: 0}}>
                    <MachineTaskFilterList state={state} dispatch={dispatch}/>
                </Col>
                }
                <Col xs={2} style={{paddingLeft: 0, paddingRight: ".125rem"}}>
                    <MachineCalendarTaskCalendarList state={state} dispatch={dispatch}/>
                </Col>
                <Col style={{paddingLeft: 5, paddingRight: 0}}>
                    <MachineCalendarTaskCalendar state={state} dispatch={dispatch}/>
                    <LegendColors title={"Legenda: "} bgColorsDescriptions={[
                        {backgroundColor: "pink", textColor: "white", description: t("Init")},
                        {backgroundColor: "#008ae6", textColor: "white", description: t("Planned")},
                        {backgroundColor: "#39ac39", textColor: "white", description: t("Confirmed")},
                        {backgroundColor: "gray", textColor: "white", description: t("Finished")},
                        {backgroundColor: "gold", textColor: "white", description: t("Deleted")},
                        {backgroundColor: "red", textColor: "white", description: t("Fault")},
                        {backgroundColor: "white", borderColor: "red", textColor: "black", description: t("Unsupported Operation Type")}
                    ]}/>
                </Col>
            </Row>
        </Container>
        <MachineTaskModal state={state} dispatch={dispatch}/>
        <MachineModal state={state} dispatch={dispatch}/>
    </>
}
