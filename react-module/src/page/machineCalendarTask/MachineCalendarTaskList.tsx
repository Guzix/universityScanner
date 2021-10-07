import React from "react";
import {
    MachineCalendarTaskBasicFilteredDto,
    MachineDto,
    OperationTypeBasicDto
} from "../../openapi/models";
import {fixDtStr, ListItemProperty, t, withinGuard} from "../../misc/misc";
import {machineApi, machineCalendarTaskApi, operationTypeApi} from "../../api/exports";
import {PathPage} from "../../App";
import {UniversalListArray} from "../UniversalListArray";
import {enumToPrettyString, UniversalMultiSelect} from "../UniversalEdit";
import {UniversalPagination} from "../UniversalPagination";
import {format as durationFormat} from "pomeranian-durations";


export const MachineCalendarTaskList: React.FC<{}> = () => {
    const [objectList, setObjectList] = React.useState<MachineCalendarTaskBasicFilteredDto[]>([]);
    const [selectedMachine, setSelectedMachine] = React.useState<MachineDto[]>([]);
    const [selectedOperationType, setSelectedOperationType] = React.useState<OperationTypeBasicDto[]>([]);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const [sortBy, setSortBy] = React.useState<string>("id");
    const [direction, setDirection] = React.useState("DESC");
    const [pageSize, setPageSize] = React.useState<number>(25);
    const [totalElements, setTotalElements] = React.useState<number>(1);
    const [pageNumber, setPageNumber] = React.useState<number>(1);
    const [totalPages, setTotalPages] = React.useState<number>(1);
    const downloadList = async (machine: MachineDto[], operationType: OperationTypeBasicDto[]) => {
        return withinGuard(setDownloadingData, async () => {
            const response = await machineCalendarTaskApi.getFilteredList(
                {
                    machineDtoList: machine,
                    operationTypeBasicDtoList: operationType
                }, sortBy, direction, pageSize, pageNumber);
            const result = response.data.resource;
            if (response.status === 200) {
                setObjectList(result.page.content);
                setPageSize(result.page.size);
                setTotalElements(result.totalElements);
                setPageNumber(result.page.number);
                setTotalPages(result.numberOfPages);
            }
        })
    }


    React.useEffect(() => {
        downloadList(selectedMachine, selectedOperationType);
    }, [selectedMachine, selectedOperationType, sortBy, direction, pageNumber, pageSize, totalElements])

    return <>

        <div className={"d-flex justify-content-around mt-5"}>
            <div style={{width: "37%"}}>
                <UniversalMultiSelect getObjectsViaApi={machineApi.maGetObjectList}
                                      updateObject={(selectedObject: MachineDto[]) => setSelectedMachine(selectedObject)}
                                      defaultValues={selectedMachine}
                                      getValue={(object: MachineDto) => object.title}
                                      fieldText={"Machine"}
                />
            </div>
            <div style={{width: "37%"}}>
                <UniversalMultiSelect getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                      updateObject={(selectedObject: OperationTypeBasicDto[]) => setSelectedOperationType(selectedObject)}
                                      defaultValues={selectedOperationType}
                                      getValue={(object: OperationTypeBasicDto) => object.title}
                                      fieldText={"Operation Type"}
                />
            </div>
        </div>
        <UniversalPagination recordsPerPage={pageSize}
                             pageNumber={pageNumber}
                             totalElements={totalElements}
                             pageSize={pageSize}
                             placeFooter={false}
                             setPage={(page) => setPageNumber(page)}
                             setPageSize={(size) => setPageSize(size)}
        />
        <UniversalListArray onClickString={(id) => `${PathPage.MACHINE_CALENDAR_TASK_EDIT}/${id}`}
                            hideAddButton={false} properties={[
            {extractFunction: (object) => object.id, label: "Id"},
            {extractFunction: (object) => fixDtStr(object.startDatePlanned), label: t("Planned Start Date")},
            {extractFunction: (object) => object.estimatedTime ? durationFormat('%hh:%mm', object.estimatedTime) : "", label: `${t("Estimated Time")} (HH:MM)`},
            {extractFunction: (object) => fixDtStr(object.startDate), label: t("Start Date")},
            {extractFunction: (object) => object.duration, label: t("Duration")},
            {extractFunction: (object) => object.machine?.title, label: t("Machine")},
            {extractFunction: (object) => object.operationType?.title, label: t("Operation Type")},
            {extractFunction: (object) => t(enumToPrettyString(object.planningStatus?.valueOf())), label: t("Planning Status")},
            {extractFunction: (object) => t(enumToPrettyString(object.productionStatus?.valueOf())), label: t("Production Status")},
        ] as ListItemProperty<MachineCalendarTaskBasicFilteredDto>[]} getObjectArray={objectList}/>

        <UniversalPagination recordsPerPage={pageSize}
                             pageNumber={pageNumber}
                             totalElements={totalElements}
                             pageSize={pageSize}
                             placeFooter={true}
                             setPage={(page) => setPageNumber(page)}
                             setPageSize={(size) => setPageSize(size)}
        />
    </>
}