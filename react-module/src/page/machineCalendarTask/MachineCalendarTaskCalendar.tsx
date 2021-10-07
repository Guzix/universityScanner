import React from "react";
import moment, {Moment} from "moment";
import FullCalendar, {EventInput} from "@fullcalendar/react";
import interactionPlugin, {Draggable, DropArg} from "@fullcalendar/interaction";
import bootstrapPlugin from "@fullcalendar/bootstrap";
import resourceTimeLinePlugin from "@fullcalendar/resource-timeline";
import {t} from "../../misc/misc";
import {
    ErpAndShapes,
    MachineTaskOperationsEnum,
    MachineTaskReducerData,
    MachineTaskReducerParams, MachineTaskWithStatus
} from "./MachineCalendarTaskCalendarReducer";
import {
    MachineCalendarTaskCalendarDto,
    MachineCalendarTaskCalendarDtoPlanningStatusEnum,
    MachineCalendarTaskCalendarDtoProductionStatusEnum,
    IdAndTitle
} from "../../openapi/models";
import "moment-timezone/index";
import {addToDate} from "pomeranian-durations";
import {isEmpty} from "lodash";
import tippy from "tippy.js";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';

export function getDateTimeWithCorrectTimeZone (stringDate: string ) : Moment {
    return moment.utc(stringDate).tz('Europe/Warsaw')
}

export const PreferredDateFormat = "ddd LLL";

export const prepareDraggableElements = () => {
    const draggableEl = document.getElementById("tasks-container");
    if (draggableEl) {
        new Draggable(draggableEl, {
            itemSelector: ".fc-event",
            eventData: eventElement => {
                const id = eventElement.getAttribute("data-taskid");
                const title = eventElement.getAttribute("data-title");
                return {title, id, create: false}
            },
        })
    }
}

const getResource = (machines: IdAndTitle[] | undefined) => {
    return machines?.map(machine => ({
        id: machine.id.toString(),
        title: machine?.title,
    }));
}

export const getMachineTaskStatusColor = (planningStatus: MachineCalendarTaskCalendarDtoPlanningStatusEnum | undefined,
                                          productionStatus: MachineCalendarTaskCalendarDtoProductionStatusEnum | undefined) => {
    switch (productionStatus) {
        case MachineCalendarTaskCalendarDtoProductionStatusEnum.FAULT: return "red"
    }
    switch (planningStatus) {
        case MachineCalendarTaskCalendarDtoPlanningStatusEnum.INIT: return "pink"
        case MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED: return "#008ae6"
        case MachineCalendarTaskCalendarDtoPlanningStatusEnum.CONFIRMED: return "#39ac39"
        case MachineCalendarTaskCalendarDtoPlanningStatusEnum.FINISHED: return "gray"
        case MachineCalendarTaskCalendarDtoPlanningStatusEnum.DELETED: return "gold"
    }
}

const getEvents = (tasks: MachineTaskWithStatus[]): EventInput[] => {
    return tasks?.map(task => ({
            id: task.machineTask.id.toString(),
            resourceId: task?.machineTask.machine?.id,
            title: task?.machineTask.operationType?.title ? `${task?.machineTask.id} ${task?.machineTask.operationType?.title}` : '',
            start: getDateTimeWithCorrectTimeZone(task?.machineTask.startDatePlanned).toISOString(),
            end: getDateTimeWithCorrectTimeZone(task?.machineTask.endDatePlanned).toISOString(),
            color: task.isEdited || task.isChecked ? '#00BFFF' : getMachineTaskStatusColor(task?.machineTask.planningStatus, task?.machineTask.productionStatus),
            borderColor: !task.machineTask.machine?.operationTypeList?.map((type: { id: any; }) => type?.id).includes(task?.machineTask.operationType?.id) ? "red" : "",
        }));
}

export const MachineCalendarTaskCalendar: React.FC<{state: MachineTaskReducerData, dispatch: (action: MachineTaskReducerParams) => void,
}> = ({state, dispatch}) => {
    const eventDropAndResize = (event: DropArg | any) => {
        const startDateStr = event.event.start?.toISOString().substring(0, 16);
        const endDateStr = event.event.end?.toISOString().substring(0, 16);
        const currentTask = state.machineTasksWithStatus.find(task => task.machineTask.id.toString() === event.event.id);
        const machine = state.machines.find(machine => machine.id == event.newResource?.id);
        dispatch({
            type: MachineTaskOperationsEnum.UpdateTask, changedMachineTaskWithStatus: {
                ...currentTask,
                machineTask: {
                    ...currentTask?.machineTask,
                    endDatePlanned: endDateStr,
                    startDatePlanned: startDateStr,
                    machine: machine ? machine : currentTask?.machineTask.machine
                },
                isEdited: true,
                isChecked: false
            } as MachineTaskWithStatus
        });
    };

    function handleDropEvent(event: DropArg): void {
        const taskId = event.draggedEl.attributes.getNamedItem("data-taskid")?.value;
        const date = event.date;
        const startDate = date.toISOString().substring(0, 16);
        const machine = state.machines.find(machine => machine.id == event?.resource?.id);
        const checkedMachineTasksWithStatus = state.machineTasksWithStatus.filter(machineTaskWithStatus => machineTaskWithStatus.isChecked
            && machineTaskWithStatus.machineTask.planningStatus !== MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED)
        if (isEmpty(checkedMachineTasksWithStatus)) {
            const currentTask = state.machineTasksWithStatus.find(task => task.machineTask.id == taskId);
            const estimatedTimeTemp = currentTask?.machineTask?.estimatedTime !== null ? currentTask?.machineTask?.estimatedTime : "PT1H";
            const startDatePlanned = currentTask?.machineTask?.startDatePlanned;
            const endDatePlanned = currentTask?.machineTask?.endDatePlanned;
            dispatch({
                type: MachineTaskOperationsEnum.UpdateTask, changedMachineTaskWithStatus: {
                    ...currentTask,
                    machineTask: {
                        ...currentTask?.machineTask,
                        startDatePlanned: startDatePlanned ? startDatePlanned : startDate,
                        endDatePlanned: (endDatePlanned && startDatePlanned) ? endDatePlanned : (!endDatePlanned && startDatePlanned) ?
                                moment(addToDate(estimatedTimeTemp, startDatePlanned)).add(2, "h").toISOString().substring(0, 16) :
                                moment(addToDate(estimatedTimeTemp, date)).toISOString().substring(0, 16),
                        machine: currentTask?.machineTask?.machine ? currentTask.machineTask?.machine : machine,
                        planningStatus: MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED,
                        estimatedTime: estimatedTimeTemp,
                    },
                    isEdited: true,
                    isChecked: false
                } as MachineTaskWithStatus
            })
        } else {
            let start = date;
            let end: Date;
            dispatch({type: MachineTaskOperationsEnum.UpdateTasks, changedMachineTasksWithStatus: checkedMachineTasksWithStatus
                    .map((currentTask, index) => {
                        const startDatePlanned = currentTask?.machineTask?.startDatePlanned;
                        const endDatePlanned = currentTask?.machineTask?.endDatePlanned;
                        const estimatedTimeTemp = currentTask?.machineTask?.estimatedTime !== null ? currentTask?.machineTask?.estimatedTime : "PT1H";
                        start = startDatePlanned ? startDatePlanned : (index === 0) ? date.toISOString().substring(0, 16) : end;
                        end = (endDatePlanned && startDatePlanned) ? endDatePlanned : (!endDatePlanned && startDatePlanned) ?
                                moment(addToDate(estimatedTimeTemp, startDatePlanned)).add(2, "h").toISOString().substring(0, 16) :
                                moment(addToDate(estimatedTimeTemp, new Date(start))).add(2, "h").toISOString().substring(0, 16);
                return {
                    ...currentTask,
                    machineTask: {
                        ...currentTask?.machineTask,
                        startDatePlanned: start,
                        endDatePlanned: end,
                        machine: currentTask?.machineTask?.machine ? currentTask.machineTask?.machine : machine,
                        planningStatus: MachineCalendarTaskCalendarDtoPlanningStatusEnum.PLANNED,
                        estimatedTime: estimatedTimeTemp,
                    },
                    isEdited: true,
                    isChecked: currentTask.machineTask.planningStatus === MachineCalendarTaskCalendarDtoPlanningStatusEnum.INIT,
                }})
            })
        }
    }

    return <>
        <div>
            <FullCalendar
                plugins={[resourceTimeLinePlugin, bootstrapPlugin, interactionPlugin]}
                initialView="resourceTimelineDay"
                headerToolbar={{
                    left: "groupOperation",
                    center: "title",
                    right: "m2,m5,m10,m20,m30,h1,h2 today prev,next resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth"
                }}
                schedulerLicenseKey="0587052898-fcs-1620335271"
                themeSystem="bootstrap"
                nowIndicator={true}
                selectable={true}
                selectMirror={true}
                editable={true}
                droppable={true}
                stickyFooterScrollbar={true}
                eventOverlap={false}
                locale="pl"
                timeZone="GTC+2"
                events={getEvents(state?.machineTasksWithStatus?.filter(value => value?.machineTask?.endDatePlanned || value?.machineTask?.machine))}
                resourceAreaHeaderContent={t("Machines")}
                resourceAreaWidth={170}
                contentHeight={'81vh'}
                firstDay={1}
                scrollTime={moment().format("HH:mm")}
                refetchResourcesOnNavigate={true}
                resources={getResource(state?.machines)}
                buttonText={{
                    today: "Dzisiaj",
                    day: "Dzień",
                    week: "Tydzień",
                    month: "Miesiąc",
                    prev: "<",
                    next: ">"
                }}
                customButtons={{
                    groupOperation: {
                        text: `${(state?.groupComponent ? "Ukryj " : "Pokaż ") + t("Operation Assignment")}`,
                        themeIcon: "",
                        click() {
                            dispatch({type: MachineTaskOperationsEnum.GroupComponentStatus})
                        }
                    }
                }}
                views={{
                    m2: {
                        buttonText: '2m',
                        type: 'resourceTimeline',
                        slotDuration: '00:02',
                    },
                    m5: {
                        buttonText: '5m',
                        type: 'resourceTimeline',
                        slotDuration: '00:05'
                    },
                    m10: {
                        buttonText: '10m',
                        type: 'resourceTimeline',
                        slotDuration: '00:10'
                    },
                    m20: {
                        buttonText: '20m',
                        type: 'resourceTimeline',
                        slotDuration: '00:20'
                    },
                    m30: {
                        buttonText: '30m',
                        type: 'resourceTimeline',
                        slotDuration: '00:30'
                    },
                    h1: {
                        buttonText: '1h',
                        type: 'resourceTimeline',
                        slotDuration: '01:00'
                    },
                    h2: {
                        buttonText: '2h',
                        type: 'resourceTimeline',
                        slotDuration: '02:00'
                    }
                }}
                eventResize={eventDropAndResize}
                eventDrop={eventDropAndResize}
                eventClick={(event) => {
                    dispatch({type: MachineTaskOperationsEnum.ChooseMachineTask, machineTaskId: parseInt(event.event.id)} as MachineTaskReducerParams)
                }}
                drop={(dropArgs) => {
                    handleDropEvent(dropArgs);
                }}
                resourceLabelDidMount={(info) => {
                    info.el.addEventListener('click', function () {
                        dispatch({
                            type: MachineTaskOperationsEnum.ChooseMachine,
                            machineId: parseInt(info.resource.id)
                        } as MachineTaskReducerParams)
                    })
                }}
                eventMouseEnter={(info) => {
                    const machineTask = state.machineTasksWithStatus.find(({machineTask}) => {return machineTask.id == info.event.id})
                    tippy(info.el, {
                        allowHTML: true,
                        content: `<div>${machineTask?.erpAndShapes?.map(e => `${e.erpOrder?.orderNumber}<br>`).join('')}</div>`,
                        theme: 'material',
                    });
                }}
            />
        </div>
    </>
}
