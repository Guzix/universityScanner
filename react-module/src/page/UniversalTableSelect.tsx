import React, {PropsWithChildren} from "react";
import {AxiosResponse} from "axios";
import {Fas, ListItemProperty, t, withinGuard} from "../misc/misc";
import {Button, Form, Table} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {useTranslation} from "react-i18next";

type UniversalTableSelectParameters<ObjectType> = {
    getObjectsViaApi: () => Promise<AxiosResponse<ObjectType[]>>;
    selectedObjectList: ObjectType[];
    setSelectedObjectList: (selectedObjects: ObjectType[]) => void;
    fieldText: React.ReactNode;
    properties: ListItemProperty<ObjectType> [];
    editLink: string;
    disabledIds?: number[];
    hideAuxButtons?: boolean;
}

const UniversalTableSelectHeader = <ObjectType, >(props: PropsWithChildren<{ title: string, titleNode?: React.ReactNode, headerProperties: ListItemProperty<ObjectType>[] }>) => {
    const {t} = useTranslation();
    return <thead>
    <tr>
        <th colSpan={props.headerProperties.length + 1}>{props.titleNode ? props.titleNode : t(props.title)}</th>
    </tr>
    <tr>
        <th/>
        {props.headerProperties.map((property: { label: string }) => <th
            key={property.label}>{t(property.label)}</th>)}
    </tr>
    </thead>
}

type UniversalTableSelectBodyParams<ObjectType> = {
    objectList: ObjectType[];
    selectedTableIds: number[];
    setSelectedTableIds: (objects: number[]) => void;
    properties: ListItemProperty<ObjectType>[];
    disabledIds?: number[];
}

const UniversalTableSelectBody = <ObjectType extends { id?: any }>
({
     objectList,
     selectedTableIds,
     setSelectedTableIds,
     properties,
     disabledIds
 }: PropsWithChildren<UniversalTableSelectBodyParams<ObjectType>>) => {
    return <tbody>
    {objectList?.map((object: ObjectType) =>
        <tr onClick={() => {
            if(disabledIds === undefined || !disabledIds.includes(object.id)) {
                setSelectedTableIds(!selectedTableIds.includes(object.id) ? selectedTableIds.concat(object.id) : selectedTableIds.filter(selectedId => selectedId !== object.id))
            }}} key={object.id} style={{cursor: "pointer"}}>
            <td style={{textAlign: "center"}}>
                {disabledIds === undefined || !disabledIds.includes(object.id) ?
                    <Form.Check type="checkbox" checked={selectedTableIds.includes(object.id)}/> :
                    <FontAwesomeIcon icon={["fas", "lock"]}/>
                }

                {/*<i className={"fas fa-lock"}/>*/}
            </td>
            {properties.map((property: ListItemProperty<ObjectType>) => {
                    return <td style={{whiteSpace: "pre-line"}}
                               key={`${property.label}-${object.id}`}>{property.extractFunction(object)}</td>
                }
            )}
        </tr>
    )}
    </tbody>
}

export const UniversalTableSelect = <ObjectType extends { id?: any }>(props: PropsWithChildren<UniversalTableSelectParameters<ObjectType>>) => {
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const [selectedIdsForAdding, setSelectedIdsForAdding] = React.useState<number[]>([]);
    const [selectedIdsForRemoval, setSelectedIdsForRemoval] = React.useState<number[]>([]);
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await props.getObjectsViaApi();
            const result = response.data;
            if (response.status === 200) {
                setObjectList(result);
            }
        })
    }

    React.useEffect(() => {
        downloadList();
    }, []);

    const selectedIds = props.selectedObjectList?.map(selectedObject => selectedObject.id);
    return <><p>{props.fieldText}</p>
        <div className="d-flex" style={{alignItems: "flex-start", gap: "1rem"}}>
            <div className="flex-column table-responsive" style={{maxHeight: "20vh", overflowY: "auto"}}>
            <Table striped bordered hover size="sm" >
                <UniversalTableSelectHeader title="All" titleNode={<><Fas icon="list"/> Wszystkie</>} headerProperties={props.properties}/>
                <UniversalTableSelectBody objectList={objectList.filter(object => !selectedIds?.includes(object.id))}
                                          selectedTableIds={selectedIdsForAdding}
                                          setSelectedTableIds={setSelectedIdsForAdding}
                                          properties={props.properties}/>
            </Table>
            </div>
            <div className="flex-column d-flex" style={{gap: "0.3rem"}}>
                <Button variant="primary" size="sm" style={{whiteSpace: "nowrap"}} onClick={() => {
                    props.setSelectedObjectList((props.selectedObjectList || []).concat(objectList.filter(object => selectedIdsForAdding.includes(object.id))));
                    setSelectedIdsForAdding([]);
                }} title={"Dodaj"}><Fas icon={"arrow-circle-right"}/>
                </Button>
                <Button variant="danger" size="sm" style={{whiteSpace: "nowrap"}} onClick={() => {
                    props.setSelectedObjectList(props.selectedObjectList.filter(object => !selectedIdsForRemoval.includes(object.id)));
                    setSelectedIdsForRemoval([])
                }} title={"Usuń"}> <Fas icon={"arrow-circle-left"}/>
                </Button>
                <div className="pb-2"/>
                {!props.hideAuxButtons &&
                    <div className="d-flex justify-content-between">
                        <Button variant="success" size="sm" style={{whiteSpace: "nowrap"}} onClick={() => {
                            window.open(`${props.editLink}/new`, "_blank");
                        }}
                        >+
                        </Button>
                        &nbsp;
                        <Button variant="success" size="sm" style={{whiteSpace: "nowrap"}} onClick={() => {
                            downloadList();
                            setSelectedIdsForAdding([]);
                            setSelectedIdsForRemoval([]);
                        }}
                        >🗘
                        </Button>
                    </div>
                }
            </div>
            <div className="flex-column table-responsive" style={{maxHeight: "20vh", overflowY: "auto"}}>
            <Table striped bordered hover size="sm" >
                <UniversalTableSelectHeader title="Chosen" titleNode={<><Fas icon="check"/> Wybrane</>} headerProperties={props.properties}/>
                <UniversalTableSelectBody objectList={props.selectedObjectList}
                                          selectedTableIds={selectedIdsForRemoval}
                                          setSelectedTableIds={setSelectedIdsForRemoval}
                                          properties={props.properties}
                                          disabledIds={props.disabledIds}
                />
            </Table>
            </div>
        </div>
    </>
}
