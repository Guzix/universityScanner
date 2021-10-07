import React from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import {
    CalendarFilterData,
    MachineTaskOperationsEnum,
    MachineTaskReducerData,
    MachineTaskReducerParams
} from "./MachineCalendarTaskCalendarReducer";
import "moment-timezone/index";
import {getDateTimeWithCorrectTimeZone} from "./MachineCalendarTaskCalendar";
import moment, {Moment} from "moment";
import {t} from "../../misc/misc";
import {
    IdAndTitle,
    LocalErpOrderCalendarDto,
    MachineCalendarTaskCalendarDtoPlanningStatusEnum, MachineCalendarTaskCalendarDtoProductionStatusEnum,
    OperationTypeBasicDto
} from "../../openapi/models";
import {
    UniversalEnumMultiSelect,
    UniversalMultiSimpleSelect,
} from "../UniversalEdit";

export const getDateFromTimeZoneToUTC = (stringDate: string): Moment => moment.tz(stringDate, 'Europe/Warsaw').tz('UTC');

export const MachineTaskFilterList: React.FC<{state: MachineTaskReducerData, dispatch: (action: MachineTaskReducerParams) => void}> =
    ({ state, dispatch}) => {
    const startDatePlannedString = getDateTimeWithCorrectTimeZone(state?.filters?.startDateFilter.toDateString()).format('YYYY-MM-DD');
    const endDatePlannedString = getDateTimeWithCorrectTimeZone(state?.filters?.endDateFilter.toDateString()).format('YYYY-MM-DD');

    return(
        <Form className={"filter-calendar"} style={{width: "100%"}} hidden={!state.showFilters}>
            <Form.Group style={{marginBottom: "1rem"}}>
                <Row>
                    <Col sm={6} style={{paddingRight: ".125rem"}}>
                        <Form.Control type="date"
                            size={"sm"}
                            value={startDatePlannedString}
                            onChange={(event) => {
                                const editedDateUTC = getDateFromTimeZoneToUTC(event.target.value).toDate();
                                dispatch({
                                    type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                        ...state?.filters,
                                        startDateFilter: editedDateUTC > state?.filters?.endDateFilter ? state?.filters?.startDateFilter:  editedDateUTC
                                    } as CalendarFilterData
                            })
                            }}/>
                    </Col>
                    <Col sm={6} style={{paddingLeft: ".125rem"}}>
                        <Form.Control type="date"
                            size={"sm"}
                            value={endDatePlannedString}
                            onChange={(event) => {
                                const editedDateUTC = getDateFromTimeZoneToUTC(event.target.value).add(23, "hours").add(59, "minutes").toDate();
                                dispatch({
                                    type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                        ...state?.filters,
                                        endDateFilter: editedDateUTC < state?.filters?.startDateFilter ? state?.filters?.endDateFilter : editedDateUTC
                                    } as CalendarFilterData
                                })
                            }}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Button size={"sm"} style={{width: "100%", marginTop: ".25rem"}}
                                         onClick={() => {dispatch({type: MachineTaskOperationsEnum.Download})}}
                        >{t("Accept Dates")}</Button>
                    </Col>
                    <Col sm={12} style={{marginTop: ".25rem"}}>
                        <UniversalMultiSimpleSelect fieldText={""}
                                                    className={"mb-1"}
                                                    getObjects={state?.erpUniqueList}
                                                    defaultValues={state?.filters?.erpUniques}
                                                    getValue={(object: LocalErpOrderCalendarDto) => object?.orderNumber}
                                                    updateObject={(selectedObjects: LocalErpOrderCalendarDto[]) => {
                                                        dispatch({
                                                            type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                                ...state?.filters,
                                                                erpUniques: selectedObjects
                                                            } as CalendarFilterData
                                                        })
                                                    }}
                                                    placeholder={t("Order Number")}
                        />
                    </Col>
                    <Col sm={12}>
                        <UniversalMultiSimpleSelect fieldText={""}
                                                    className={"mb-1"}
                                                    getObjects={state?.clientUniqueList}
                                                    defaultValues={state?.filters?.clientUniques}
                                                    getValue={(object: IdAndTitle) => object?.title}
                                                    updateObject={(selectedObjects: IdAndTitle[]) => {
                                                        dispatch({
                                                            type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                                ...state?.filters,
                                                                clientUniques: selectedObjects
                                                            } as CalendarFilterData
                                                        })
                                                    }}
                                                    placeholder={t("Client")}
                        />
                    </Col>
                    <Col sm={12}>
                        <UniversalMultiSimpleSelect fieldText={""}
                                                    className={"mb-1"}
                                                    getObjects={state?.operationTypes}
                                                    defaultValues={state?.filters?.operationTypes}
                                                    getValue={(object: OperationTypeBasicDto) => object?.title}
                                                    updateObject={(selectedObjects: OperationTypeBasicDto[]) => {
                                                        dispatch({
                                                            type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                                ...state?.filters,
                                                                operationTypes: selectedObjects
                                                            } as CalendarFilterData
                                                        })
                                                    }}
                                                    placeholder={t("Operation Types")}/>
                    </Col>
                    <Col sm={12}>
                        <UniversalMultiSimpleSelect fieldText={""}
                                                    className={"mb-1"}
                                                    getObjects={state?.machines}
                                                    defaultValues={state?.filters?.machines}
                                                    getValue={(object: IdAndTitle) => object?.title}
                                                    updateObject={(selectedObjects: IdAndTitle[]) => {
                                                        dispatch({
                                                            type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                                ...state?.filters,
                                                                machines: selectedObjects
                                                            } as CalendarFilterData
                                                        })
                                                    }}
                                                    placeholder={t("Machine")}/>
                    </Col>
                    <Col sm={12}>
                        <UniversalEnumMultiSelect fieldText={""}
                                                  className={"mb-1"}
                                                  getObjects={Object.values(MachineCalendarTaskCalendarDtoPlanningStatusEnum)}
                                                  defaultValues={state?.filters?.planningStatuses}
                                                  getValue={(object: MachineCalendarTaskCalendarDtoPlanningStatusEnum) => object}
                                                  updateObject={(selectedObjects: MachineCalendarTaskCalendarDtoPlanningStatusEnum[]) => {
                                                      dispatch({
                                                          type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                              ...state?.filters,
                                                              planningStatuses: selectedObjects
                                                          } as CalendarFilterData
                                                      })
                                                  }}
                                                  placeholder={t("Planning Status")}/>
                    </Col>
                    <Col sm={12}>
                        <UniversalEnumMultiSelect fieldText={""}
                                                  className={"mb-1"}
                                                  getObjects={Object.values(MachineCalendarTaskCalendarDtoProductionStatusEnum)}
                                                  defaultValues={state?.filters?.productionStatuses}
                                                  getValue={(object: MachineCalendarTaskCalendarDtoProductionStatusEnum) => object}
                                                  updateObject={(selectedObjects: MachineCalendarTaskCalendarDtoProductionStatusEnum[]) => {
                                                      dispatch({
                                                          type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                              ...state?.filters,
                                                              productionStatuses: selectedObjects
                                                          } as CalendarFilterData
                                                      })
                                                  }}
                                                  placeholder={t("Production Status")}/>
                    </Col>
                    <Col sm={12}>
                        <Form.Control type={"text"}
                                      className={"mb-1"}
                                      value={state.filters.searchPhrase as unknown as string}
                                      defaultValue={state.filters.searchPhrase}
                                      name={state.filters.searchPhrase.toString()}
                                      placeholder={t("Search")}
                                      onChange={(e) => {
                                          e.preventDefault()
                                          dispatch({
                                              type: MachineTaskOperationsEnum.UpdateFilters, changedFilters: {
                                                  ...state?.filters,
                                                  searchPhrase: e.target.value
                                              } as CalendarFilterData
                                          })
                                      }}
                        />
                    </Col>
                    <Col sm={12}>
                        <Button size={"sm"} style={{width: "100%"}}
                                onClick={() => {dispatch({type: MachineTaskOperationsEnum.ResetFilters})}}
                        >{t("Reset Filters")}</Button>
                    </Col>
                </Row>
            </Form.Group>
        </Form>
    )
}