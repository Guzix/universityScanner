import React from "react";
import {Button, Card, Form, ListGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import 'moment/locale/pl';
import {
    MachineTaskOperationsEnum,
    MachineTaskReducerData,
    MachineTaskReducerParams
} from "./MachineCalendarTaskCalendarReducer";
import {ButtonVariant} from "react-bootstrap/types";
import {Placement} from "react-bootstrap/Overlay";
import {deriveLayerShapeLabel, Fas, fixDtStr, t} from "../../misc/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {
    AtomicOperationProductionOrderLocalErpOrderDto,
    LayerShapeBasicDto, LocalErpOrderCalendarDto,
    MachineCalendarTaskCalendarDtoPlanningStatusEnum,
} from "../../openapi/models";
import {getMachineTaskStatusColor} from "./MachineCalendarTaskCalendar";
import {Divider} from "antd";
import {isEmpty} from "lodash";
import './MachineCalendarTask.css'

export const MachineCalendarTaskCalendarList: React.FC<{
    state: MachineTaskReducerData, dispatch: (action: MachineTaskReducerParams) => void
}> = ({state, dispatch}) => {

    const amountOfEditedMachineTasks = state.machineTasksWithStatus.filter((machineTaskWithStatus: { isEdited: any; }) => machineTaskWithStatus.isEdited).length
    const amountOfCheckedMachineTasks = state.machineTasksWithStatus.filter((machineTaskWithStatus: { isChecked: any; }) => machineTaskWithStatus.isChecked).length

    return (
        <>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: '0.3rem'}}>
            <Button size="sm" style={{marginBottom: ".25rem", width: "50%"}} className="btn-info"
                onClick={(e) => {
                    e.currentTarget.blur()
                    dispatch({type: MachineTaskOperationsEnum.ChangeFilterVisibility})
                }}><FontAwesomeIcon icon={faFilter}/> {(state.showFilters ? "Ukryj " : "Pokaż ") + " Filtry"}
            </Button>
            <Button size="sm" style={{marginBottom: ".25rem", width: "50%"}} disabled={amountOfEditedMachineTasks === 0}
                    onClick={() => {
                        dispatch({type: MachineTaskOperationsEnum.PostMultipleEdited})
                    }}>
                <i className="fas fa-save"/>{t("Save Changes")}
                <span className="badge badge-info ml-1">{amountOfEditedMachineTasks}</span>
            </Button>
        </div>
        <div style={{paddingBottom: ".25rem"}}>
            <Button size={"sm"} style={{width: "100%"}} variant={state.checkAllStatus ? "danger" : "success"}
                    onClick={(e) => {
                        e.currentTarget.blur()
                        dispatch({type: MachineTaskOperationsEnum.CheckAll})
                    }}
            >{state.checkAllStatus ? t("Unselect All") : t("Select All")}
                <span className="badge badge-info ml-1">{amountOfCheckedMachineTasks}</span>
            </Button>
        </div>
        <ListGroup as="ul" id="tasks-container" style={{maxHeight: '84vh', overflow: 'auto'}}>
        {state.machineTasksWithStatus
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
            .sort((a, b) => {
                return (a.isChecked > b.isChecked) ? 1 : -1;})
            .sort((a, b) => {
                return (a.isEdited < b.isEdited) ? 1 : -1;})
            .map(({machineTask, isEdited, isChecked, erpAndShapes}) =>
            <ListGroup.Item key={machineTask.id} as="li" style={{padding: 7}} action onClick={(event) => {
                dispatch({
                    type: MachineTaskOperationsEnum.ChooseMachineTask,
                    machineTaskId: machineTask.id
                } as MachineTaskReducerParams)
            }}>
                <Card id={machineTask.id} style={{
                    padding: "0.5rem",
                    border: `solid 4px ${getMachineTaskStatusColor(machineTask?.planningStatus, machineTask?.productionStatus)}`,
                    backgroundColor: isEdited || isChecked ? '#00BFFF' : '',
                }}>
                    <Card.Title
                        style={{display: "flex", justifyContent: "space-between", marginBottom: 0}}>
                        <div>{machineTask?.machine ? machineTask?.machine?.title.substring(0, 25) :
                            <span style={{color: 'darkred'}}>{t("Unassigned")}</span>
                        }
                        </div>
                        {machineTask.machine &&
                        <Button variant={"danger"} size={"sm"}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    dispatch({
                                        type: MachineTaskOperationsEnum.UnAssignTask,
                                        machineTaskId: machineTask.id
                                    } as MachineTaskReducerParams)
                                }}><Fas icon={"calendar-minus"}/>
                        </Button>
                        }
                    </Card.Title>
                    {/*<Card.Subtitle className="text-muted" style={{marginBottom: 0}}>*/}
                    {/*    {machineTask?.operationType?.title}*/}
                    {/*</Card.Subtitle>*/}
                    {/*<Card.Text style={machineTask.executed ? {pointerEvents: 'none', opacity: '0.4'} : {}}>*/}
                    <Card.Text>
                        {/*<div>*/}
                        {/*    <small>{t("Task Number")}: {machineTask?.id}</small>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <small>{t("Planned Start")}: {machineTask?.startDatePlanned &&*/}
                        {/*    // getDateTimeWithCorrectTimeZone(machineTask?.startDatePlanned).format(PreferredDateFormat)}*/}
                        {/*    fixDtStr(machineTask?.startDatePlanned).substring(0, 16)}*/}
                        {/*    </small>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <small>*/}
                        {/*        {t("estimatedTime")}: {machineTask?.estimatedTime ? durationFormat('%hh:%mm', machineTask?.estimatedTime) : ""}*/}
                        {/*    </small>*/}
                        {/*</div>*/}
                        {/*<div>*/}
                        {/*    <small>*/}
                        {/*        {t("Planned End")}: {machineTask?.endDatePlanned &&*/}
                        {/*    // getDateTimeWithCorrectTimeZone(machineTask?.endDatePlanned).format(PreferredDateFormat)}*/}
                        {/*    fixDtStr(machineTask?.endDatePlanned).substring(0, 16)}*/}
                        {/*    </small>*/}
                        {/*</div>*/}
                        {erpAndShapes && erpAndShapes.map((erpAndShape, index, array) =>
                            <div>
                                {erpAndShape?.erpOrder?.orderNumber &&
                                <div>
                                    <small>
                                        <b>{t("Order Number")}:</b> {erpAndShape?.erpOrder?.orderNumber}
                                    </small>
                                </div>}
                                {erpAndShape.erpOrder?.srcOrder?.order?.contractorData &&
                                <div>
                                    <small>
                                        <b>{t("Client")}: </b>
                                        {`${erpAndShape.erpOrder?.srcOrder?.order?.contractorData?.name1} 
                                        ${erpAndShape.erpOrder?.srcOrder?.order?.contractorData?.name2} 
                                        ${erpAndShape.erpOrder?.srcOrder?.order?.contractorData?.name3}`}
                                    </small>
                                </div>}
                                {erpAndShape.erpOrder?.deadline &&
                                <div>
                                    <small>
                                        <b>{t("Deadline")}:</b> {fixDtStr(erpAndShape.erpOrder?.deadline).substring(0, 16)}
                                    </small>
                                </div>}
                                {erpAndShape.layerShape && erpAndShape.layerShape.map((layerShape: LayerShapeBasicDto) =>
                                <div>
                                    <small>
                                        <b>{t("Layer Shape")}:</b> {deriveLayerShapeLabel(t, layerShape)}
                                    </small>
                                </div>
                                )}
                                {array.length > 1 && array.length > index + 1 && <Divider style={{margin: 0, backgroundColor: "darkgrey"}}/>}
                            </div>
                        )}
                        <div style={{display: "flex", justifyContent: "space-between", columnGap: "1rem"}}>
                            <div style={{display: "flex", justifyContent: "start"}}>
                                {(!machineTask.machine || (!machineTask.startDatePlanned || !machineTask.endDatePlanned) ||
                                    machineTask.planningStatus === MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED) &&
                                    <div onClick={e => {e.stopPropagation()}}>
                                        <Form.Check type="checkbox" checked={isChecked} className={"checkbox-lg"}
                                                    style={{paddingLeft: 25, paddingTop: 3}}
                                                    onChange={(e) => {
                                                        dispatch({type: MachineTaskOperationsEnum.ToggleIsChecked,
                                                            changedMachineTaskWithStatus: {machineTask, isEdited, isChecked}})
                                                    }}/>
                                    </div>
                                }
                                {(!machineTask.machine || (!machineTask.startDatePlanned || !machineTask.endDatePlanned)) &&
                                    <div className="fc-event" data-taskid={machineTask.id}
                                         data-title={machineTask.operationType?.title}
                                         style={{pointerEvents: amountOfCheckedMachineTasks > 0 && !isChecked ? "none" : "auto",
                                             opacity: amountOfCheckedMachineTasks > 0 && !isChecked ? 0.7 : 1, marginRight: ".25rem"}}
                                    >
                                        <Fas className={"fa-2x"} icon={"hand-point-up"}/>
                                    </div>
                                }
                                {machineTask.planningStatus === MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED &&
                                    <Button variant={"success"} size={"sm"}
                                            disabled={amountOfCheckedMachineTasks > 0 && !isChecked}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch({ type: MachineTaskOperationsEnum.PlanningStatusPlanned,
                                                    changedMachineTaskWithStatus: {machineTask, isEdited, isChecked}})
                                            }}>{t("Confirm")}
                                    </Button>
                                }
                            </div>
                            <div style={{display: "flex", justifyContent: "end"}}>
                                <Button variant={"primary"} size={"sm"} hidden={!isEdited} style={{marginRight: ".125rem"}}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch({ type: MachineTaskOperationsEnum.UndoSingleEdited,
                                                changedMachineTaskWithStatus: {machineTask, isEdited, isChecked}
                                            } as MachineTaskReducerParams)
                                        }}><Fas icon={"undo"}/>
                                </Button>
                                <Button variant={"primary"} size={"sm"} hidden={!isEdited}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            dispatch({type: MachineTaskOperationsEnum.PostSingleEdited,
                                                machineTaskId: machineTask.id
                                            } as MachineTaskReducerParams)
                                        }}><Fas icon={"save"}/>
                                </Button>
                            </div>
                        </div>
                    </Card.Text>
                </Card>
            </ListGroup.Item>
        )}
    </ListGroup>
    </>)
}

export const CalendarButton: React.FC<{
    variant?: ButtonVariant, size?: 'sm' | 'lg', placement?: Placement, disabled?: boolean, hidden?: boolean,
    innerHtml?: JSX.Element, translation: string, target?: any, href? : string, btnTitle? : string,
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
}> =
    ({variant, size= "sm",  placement= "bottom", disabled, hidden,
         innerHtml, translation, target, href, btnTitle,
         onClick}) => {
        const renderTooltip = (props: any) => (
            <Tooltip {...props}>
                {t(translation)}
            </Tooltip>
        );

        return (
            <OverlayTrigger delay={{show: 100, hide: 100}} overlay={renderTooltip} placement={placement}>
                <Button variant={variant} size={size} onClick={onClick} target={target} href={href} disabled={disabled} hidden={hidden}>
                    {innerHtml}
                    {btnTitle}
                </Button>
            </OverlayTrigger>
        )
    }

export const HtmlTooltip: React.FC<{innerHtml: JSX.Element, translation: string, placement?: Placement
}> = ({innerHtml, translation, placement= "bottom"}) => {
    const renderTooltip = (props: any) => (
        <Tooltip {...props}>
            {t(translation)}
        </Tooltip>
    );
    return (
        <OverlayTrigger delay={{show: 100, hide: 100}} overlay={renderTooltip} placement={placement}>
            {innerHtml}
        </OverlayTrigger>
    )
}
