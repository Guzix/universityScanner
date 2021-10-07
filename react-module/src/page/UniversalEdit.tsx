import React, {FormEvent, PropsWithChildren, useEffect} from "react";
import {antFilterFunction, EditProps, Fas, processRawResWithLoader, t, withinGuard} from "../misc/misc";
import {useHistory, useParams} from "react-router-dom";
import {Button, Col, Form, FormGroup, InputGroup, Row} from "react-bootstrap";
import {AxiosResponse} from "axios";
import Select from 'react-select';
import {Card, Select as AntSelect} from "antd";
import {SpinCentered} from "../CommonComponent";
import {toFragments, toIso} from "pomeranian-durations";

type UniversalInputParameters<ObjectType> = {
    object: ObjectType,
    setObject: (object: ObjectType) => void,
    fieldName: keyof ObjectType;
    valueType: string;
    disabled?: boolean;
    formLabelColSize?: number;
}

type UniversalValueViewParameters<ObjectType> = {
    value: string,
    fieldName: string;
    formLabelColSize?: number;
}

type UniversalMultiSelectParameters<ObjectType> = {
    getObjectsViaApi: () => Promise<AxiosResponse<ObjectType[]>>;
    updateObject: (selectedObjects: ObjectType[]) => void,
    defaultValues?: ObjectType[],
    getValue: (object: ObjectType) => string,
    fieldText?: string;
    placeholder?: string;
    className?: string,
}

type UniversalMultiSimpleSelectParameters<ObjectType> = {
    getObjects: ObjectType[];
    updateObject: (selectedObjects: ObjectType[]) => void,
    defaultValues?: ObjectType[],
    getValue: (object: ObjectType) => string,
    fieldText: string,
    placeholder?: string,
    useEffect?: boolean;
    className?: string,
}

type UniversalSingleSelectParameters<ObjectType> = {
    getObjectsViaApi: () => Promise<AxiosResponse<ObjectType[]>>;
    onChangeFunction?: (object?: ObjectType) => void;
    updateObject: (selectedObjects: ObjectType) => void,
    defaultValue?: ObjectType | null,
    getItemLabel: (object: ObjectType) => string,
    fieldText?: string;
    classNameOverride?: string;
    placeholder?: string;
    disabled?: boolean;
    auxColumn?: (onDone: () => void) => React.ReactElement;
    onLoad?: (objectList: ObjectType[], setObject: (object: ObjectType) => void) => void;
    nullable?:boolean;
}
type UniversalSingleSelectSimpleParameters<ObjectType> = {
    getObjects: ObjectType[];
    useEffect?: boolean;
    updateObject?: (selectedObjects: ObjectType) => void,
    defaultValue?: ObjectType,
    getValue: (object: ObjectType) => string,
    fieldText: string;
    classNameOverride?: string;
    placeholder?:string;
    disabled?:boolean;
    customSizeCol?:number;
    filedSizeCol?:number;
    auxColumn?: (onDone: () => void) => React.ReactElement;
    fontWeight?: any;
}

type UniversalEnumSelectParameters<ObjectType> = {
    objectList: ObjectType[];
    updateObject: (selectedObjects: ObjectType | undefined) => void;
    currentValue: ObjectType | undefined;
    fieldText: string;
    disabled?: boolean;
}

type UniversalEnumMultiSelectParameters<ObjectType> = {
    getObjects: ObjectType[];
    updateObject: (selectedObjects: ObjectType[]) => void;
    defaultValues?: ObjectType[];
    getValue: (object: ObjectType) => string,
    fieldText: string;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    useEffect?: boolean;
}

export enum UniversalInputType {
    TEXT = "text",
    TEXTAREA = "textarea",
    DATETIME_LOCAL = "datetime-local",
    SWITCH = "switch",
    NUMBER = "number",
    GID = "gid",
    DURATION = "duration",
}

export function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const enumToPrettyString = (enumV: any) => enumV?.split("_")
    .map((part: string) => capitalize(part.toLowerCase()))
    .join(" ")

export const UniversalEnumSelect = <ObjectType, >(props: PropsWithChildren<UniversalEnumSelectParameters<ObjectType>>) => {
    const options = props.objectList?.map(object => {
        return {label: t(enumToPrettyString(object)), value: object}
    });
    return <Form.Group className="mb-3" controlId={"unknown"}>
        <Row>
            {!(props.fieldText.length === 0) &&
            <Col sm={2}>
                <Form.Label>{t(props.fieldText)}</Form.Label>
            </Col>}
            <Col>
                <Select placeholder={t("Select")}
                        isDisabled={props.disabled}
                        value={options?.find(option => option.value === props.currentValue)}
                        options={options} onChange={(e) => {
                    props.updateObject(e?.value);
                }}/>
            </Col>
        </Row>
    </Form.Group>
}

export const UniversalEnumMultiSelect = <ObjectType,>(props: PropsWithChildren<UniversalEnumMultiSelectParameters<ObjectType>>) => {
    const [selectedObjectList, setSelectedObjectList] = React.useState<ObjectType[]>();

    React.useEffect(() => {
        setSelectedObjectList(props.defaultValues)
    }, [props.defaultValues]);

    const options = props.getObjects.map(object => {
        return {label: t(enumToPrettyString(object)), value: object}
    });

    return <Form.Group className={props.className ? props.className : "mb-3"} controlId={"unknown"}>
        <Row>
            {!(props.fieldText.length === 0) &&
            <Col sm={2}>
                <Form.Label>{t(props.fieldText)}</Form.Label>
            </Col>
            }
            <Col>
                <Select placeholder={props.placeholder ? t(props.placeholder.toString()) : t("Select")}
                        value={options.filter(option => selectedObjectList?.includes(option.value))}
                        isDisabled={props.disabled} closeMenuOnSelect={false} isMulti
                        options={options}
                        onChange={(e) => {
                            const updatedSelectedObjects = props.getObjects.filter(object => e.map(element => element.value).includes(object))
                            setSelectedObjectList(updatedSelectedObjects)
                            props.updateObject(updatedSelectedObjects);
                }}/>
            </Col>
        </Row>
    </Form.Group>
}

export const UniversalSingleSelect = <ObjectType extends { id?: any }>(props: PropsWithChildren<UniversalSingleSelectParameters<ObjectType>>) => {
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const [selectedObject, setSelectedObject] = React.useState<ObjectType>();

    const downloadList = async () => {
        await processRawResWithLoader<ObjectType[]>(setDownloadingData,
            () => props.getObjectsViaApi() as any,
            async (result) => {
                setObjectList(result);
                props.onLoad && props.onLoad(result, setSelectedObjectInt);
            }
        )
    };
    React.useEffect(() => {
        downloadList();
    }, []);

    React.useEffect(() => {
        if (props.defaultValue) {
            setSelectedObject(props.defaultValue)
        }
    }, [props.defaultValue]);

    const setSelectedObjectInt = (obj: ObjectType) => {
        setSelectedObject(obj);
        props.updateObject(obj);
    }

    return (
        <Form.Group className={props.classNameOverride ? props.classNameOverride : "mb-3"}
                    controlId={props.fieldText && props.fieldText.toString()}>
            <Row>
                {props.fieldText && props.fieldText.length !== 0 &&
                <Col sm={2} style={{display: "flex", alignItems: "center"}}>
                    {t(props.fieldText)}
                </Col>}
                <Col style={{display: "flex", alignItems: "center"}}>
                    <AntSelect
                        disabled={props.disabled}
                        placeholder={props.placeholder ? t(props.placeholder.toString()) : t("Select")}
                        value={selectedObject?.id}
                        style={{width: "100%"}}
                        loading={downloadingData}
                        showSearch={true}
                        filterOption={antFilterFunction}
                        onChange={(v, option) => {
                            // @ts-ignore
                            const updatedSelectedObject = objectList?.find(object => object.id === v);
                            if (updatedSelectedObject) {
                                setSelectedObjectInt(updatedSelectedObject);

                                if (props.onChangeFunction) {
                                    props.onChangeFunction()
                                }

                            }
                            // TODO(jbi): Clear selection handling
                        }}
                    >
                        {objectList?.map(obj => <AntSelect.Option value={obj.id}
                                                                 key={obj.id}> {props.getItemLabel(obj)} </AntSelect.Option>)}
                    </AntSelect>
                </Col>
                {props.auxColumn &&
                <Col sm={1} style={{display: "flex", alignItems: "center"}}>
                    {props.auxColumn(downloadList)}
                </Col>
                }
            </Row>
        </Form.Group>
    )
}

export const UniversalSingleSimpleSelect = <ObjectType extends { id?: any }>(props: PropsWithChildren<UniversalSingleSelectSimpleParameters<ObjectType>>) => {
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [selectedObject, setSelectedObject] = React.useState<ObjectType>();

    const downloadList = async () => {
        if (props.useEffect) {
            setObjectList(props.getObjects);
        }
    };
    React.useEffect(() => {
        downloadList();
    }, []);

    React.useEffect(() => {
        setSelectedObject(props.defaultValue)
    }, [props.defaultValue]);
    const options = props.useEffect ? objectList?.map(object => {
            return {label: props.getValue(object), value: object.id}
        }) :
        props.getObjects?.map(object => {
            return {label: props.getValue(object), value: object.id}
        });

    // const auxColumnExist = props.auxColumn != null;
    return (
        <Form.Group className={props.classNameOverride ? props.classNameOverride : "mb-3"}
                    controlId={props.fieldText.toString()}>
            <Row>
                {!(props.fieldText.length === 0) &&
                <Col sm={props.filedSizeCol ? props.filedSizeCol : 1}
                     style={{display: "flex", alignItems: "center", fontWeight: props.fontWeight ? props.fontWeight : "bold"}}>
                    <Form.Label>{t(props.fieldText)}</Form.Label>
                </Col>}
                <Col sm={props.customSizeCol ? props.customSizeCol : 2}>
                    <Select isDisabled={props.disabled}
                            placeholder={props.placeholder ? t(props.placeholder.toString()) : t("Select")}
                            value={options?.find(option => selectedObject?.id === option.value)} options={options}
                            onChange={(e) => {
                                const updatedSelectedObject = props.useEffect ? objectList?.find(object => object.id === e?.value) :
                                    props.getObjects?.find(object => object.id === e?.value);
                                if (!updatedSelectedObject) {
                                    alert("Select can be empty!")
                                } else if (props.updateObject) {
                                    setSelectedObject(updatedSelectedObject);
                                    props.updateObject(updatedSelectedObject);
                                }
                            }}/>
                </Col>
                {props.auxColumn &&
                <Col sm={1} style={{display: "flex", alignItems: "center"}}>
                    {props.auxColumn(downloadList)}
                </Col>
                }
            </Row>
        </Form.Group>
    )
}

export const UniversalMultiSelect = <ObjectType extends { id?: any }>(props: PropsWithChildren<UniversalMultiSelectParameters<ObjectType>>) => {
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [selectedObjectList, setSelectedObjectList] = React.useState<ObjectType[]>();
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await props.getObjectsViaApi();
            const result = response.data;
            if (response.status === 200) {
                setObjectList(result);
            }
        })
    };
    React.useEffect(() => {
        downloadList();
    }, []);
    React.useEffect(() => {
        setSelectedObjectList(props.defaultValues)
    }, [props.defaultValues]);

    const options = objectList?.map(object => {
        return {label: props.getValue(object), value: object.id}
    });
    const selectedIds = selectedObjectList?.map(selectedObject => selectedObject.id);

    return <Form.Group className={props.className ? props.className : "mb-3"} controlId={props.fieldText && props.fieldText.toString()}>
        <Row>
            {props.fieldText &&
                <Col sm={2}>
                    <Form.Label>{t(props.fieldText)}</Form.Label>
                </Col>
            }
            <Col>
                <Select placeholder={props.placeholder ? t(props.placeholder.toString()) : t("Select")} value={options.filter(option => selectedIds?.includes(option.value))}
                        options={options} closeMenuOnSelect={false} isMulti onChange={(e) => {
                    const selectedOptionIds = e?.map(element => element.value);
                    const updatedSelectedObjects = objectList.filter(object => selectedOptionIds.includes(object.id))
                    setSelectedObjectList(updatedSelectedObjects);
                    props.updateObject(updatedSelectedObjects);
                }}/>
            </Col>
        </Row>
    </Form.Group>
}

export const UniversalMultiSimpleSelect = <ObjectType extends { id?: any }>(props: PropsWithChildren<UniversalMultiSimpleSelectParameters<ObjectType>>) => {
    const [objectList, setObjectList] = React.useState<ObjectType[]>([]);
    const [selectedObjectList, setSelectedObjectList] = React.useState<ObjectType[]>();

    const downloadList = async () => {
        if (props.useEffect) {
            setObjectList(props.getObjects);
        }
    };

    React.useEffect(() => {
        downloadList();
    }, []);

    React.useEffect(() => {
        setSelectedObjectList(props.defaultValues)
    }, [props.defaultValues]);

    const options = props.useEffect ? objectList.map(object => {
            return {label: props.getValue(object), value: object?.id}
        }) :
        props.getObjects.map(object => {
            return {label: props.getValue(object), value: object?.id}
        });

    const selectedIds = selectedObjectList?.map(selectedObject => selectedObject.id);

    return <Form.Group className={props.className ? props.className : "mb-3"} controlId={props.fieldText && props.fieldText.toString()}>
        <Row>
            {!(props.fieldText.length === 0) &&
            <Col sm={2}>
                <Form.Label>{t(props.fieldText)}</Form.Label>
            </Col>
            }
            <Col>
                <Select placeholder={props.placeholder ? t(props.placeholder.toString()) : t("Select")}
                        value={options.filter(option => selectedIds?.includes(option.value))}
                        options={options} closeMenuOnSelect={false} isMulti
                        onChange={(e) => {
                            const selectedOptionIds = e.map(element => element?.value);
                            const updatedSelectedObjects = props.useEffect ? objectList.filter(object => selectedOptionIds.includes(object?.id)) :
                                props.getObjects.filter(object => selectedOptionIds.includes(object?.id))
                            setSelectedObjectList(updatedSelectedObjects);
                            props.updateObject(updatedSelectedObjects);
                }}/>
            </Col>
        </Row>
    </Form.Group>
}

// export const GidEditComponent:React.FC<{gid:ProductionGid, onChangeGid:(e: ProductionGid) => void}> = (gid,onChangeGid) =>{
//     const [editedGid, setEditedGid] = React.useState<ProductionGid>();
//
//     useEffect(() =>{
//         setEditedGid({...gid.gid})
//     }, [gid.gid])
//     return<>
//         <FormGroup>
//             <InputGroup>
//                 <Form.Control type="number" value={editedGid?.type} placeholder={t("Type")}
//                               onChange={(e) => gid.onChangeGid({...editedGid,type:Number(e.target.value)})}
//                 />
//                 <InputGroup.Text> - </InputGroup.Text>
//                 <Form.Control type="number" value={editedGid?.company} placeholder={t("Company")}
//                               onChange={(e) => gid.onChangeGid({...editedGid,company:Number(e.target.value)})}
//                 />
//                 <InputGroup.Text> - </InputGroup.Text>
//                 <Form.Control type="number" value={editedGid?.number} placeholder={t("Number")}
//                               onChange={(e) => gid.onChangeGid({...editedGid,number:Number(e.target.value)})}
//                 />
//                 <InputGroup.Text> - </InputGroup.Text>
//                 <Form.Control type="number" value={editedGid?.counter} placeholder={t("Counter")}
//                               onChange={(e) => gid.onChangeGid({...editedGid,counter:Number(e.target.value)})}
//                 />
//             </InputGroup>
//         </FormGroup>
//     </>
// }

export const UniversalInput = <ObjectType, >(props: PropsWithChildren<UniversalInputParameters<ObjectType>>) => {
    // function setChangeGid(gid:ProductionGid){
    //     props.setObject({...props.object,gid:gid})
    // }
    return <Form.Group className="mb-3" controlId={props.fieldName.toString()}>
        <Row>
            <Col sm={props.formLabelColSize || 2}>
                <Form.Label>{t(props.fieldName.toString())}</Form.Label>
            </Col>
            {
                props.valueType === UniversalInputType.SWITCH ?
                    <Col>
                        <Form.Check
                            type={props.valueType} checked={props.object[props.fieldName] as unknown as boolean}
                            name={props.fieldName.toString()}
                            disabled={props.disabled}
                            onChange={(e) => {
                                props.setObject({...props.object, [e.target.name]: e.target.checked})
                            }}
                        />
                    </Col> : props.valueType === UniversalInputType.TEXTAREA ?
                    <Col>
                        <Form.Control type={props.valueType}
                                      value={props.object[props.fieldName] as unknown as string}
                                      name={props.fieldName.toString()}
                                      placeholder={!props.disabled ? t("Enter value") : ""}
                                      disabled={props.disabled}
                                      onChange={(e) => {
                                          props.setObject({...props.object, [e.target.name]: e.target.value})
                                      }}
                                      as={"textarea"}
                                      rows={3}
                        />
                    </Col> : props.valueType === UniversalInputType.DURATION ?
                        <Col>
                            <Row xs={6}>
                                <Col>
                                    <Form.Control type={"number"} min={0}
                                                  value={toFragments(props.object[props.fieldName] as unknown as string).hours}
                                                  name={props.fieldName.toString()}
                                                  disabled={props.disabled}
                                                  onChange={(e) => {
                                                      props.setObject({...props.object, [e.target.name]: toIso({hours: e.target.value,
                                                              minutes: toFragments(props.object[props.fieldName] as unknown as string).minutes})})
                                                  }}
                                    />
                                </Col>
                                <Col>
                                    <Form.Control type={"number"} min={0} max={59}
                                                  value={toFragments(props.object[props.fieldName] as unknown as string).minutes}
                                                  name={props.fieldName.toString()}
                                                  disabled={props.disabled}
                                                  onChange={(e) => {
                                                      props.setObject({...props.object, [e.target.name]: toIso({minutes: e.target.value,
                                                              hours: toFragments(props.object[props.fieldName] as unknown as string).hours})})
                                                  }}
                                    />
                                </Col>
                            </Row>
                        </Col>
                            :
                            <Col>
                                <Form.Control type={props.valueType}
                                              value={props.object[props.fieldName] as unknown as string}
                                              name={props.fieldName.toString()}
                                              placeholder={t("Enter value")}
                                              disabled={props.disabled}
                                              onChange={(e) => {
                                                  props.setObject({...props.object, [e.target.name]: e.target.value})
                                              }}
                                />
                            </Col>
            }
        </Row>
    </Form.Group>
}

export const UniversalValueView = <ObjectType, >(props: PropsWithChildren<UniversalValueViewParameters<ObjectType>>) => {
    return <Form.Group className="mb-3" controlId={props.fieldName}>
        <Row>
            <Col sm={props.formLabelColSize || 2}>
                <Form.Label>{t(props.fieldName)}</Form.Label>
            </Col>
            <Col>
                <Form.Control type={UniversalInputType.TEXT}
                              value={props.value}
                              name={props.fieldName}
                              placeholder={t("Enter value")}
                              disabled={true}
                />
            </Col>
        </Row>
    </Form.Group>
}

export const UniversalEdit = <ObjectType extends { id?: any }, >(props: PropsWithChildren<EditProps<ObjectType>>) => {
    const history = useHistory();
    const [object, setObject] = React.useState<ObjectType | undefined>(props.defaultCreateValue);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const {id}: { id: string | undefined } = useParams();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await props.getObjectViaApi(Number(id));
            const result = response.data;
            if (response.status === 200) {
                setObject(result);
            }
        })
    }

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (object) {
            await withinGuard(setDownloadingData, async () => {
                const response = await props.save(object as ObjectType);
                const result = response.data;
                if (response.status === 200) {
                    //setMachine(result);
                    history.push(props.onSubmitString);
                }
            })
        } else {
            alert("Exception while sending data")
        }
    }

    const handleOnDelete = async () => {
        if (object && props.delete) {
            await withinGuard(setDownloadingData, async () => {
               if (props.delete) {
                   const response = await props.delete(object?.id);
                   if (response.status === 200) {
                       history.push(props.onSubmitString)
                   }
               }
            })
        }
    }

    React.useEffect(() => {
        if (isEditPage) {
            downloadList();
        }
    }, []);


    return (
        <Card title={isEditPage ? <><Fas icon={"edit"}/>&nbsp;{t("Edit")}</> : <><Fas
            icon={"plus-circle"}/>&nbsp;{t("Add")}</>}
              style={{marginTop: "0.5em"}}>
            {downloadingData ? <SpinCentered/> :
                <Form onSubmit={handleOnSubmit}>
                    {props.primitiveKeys?.map(primitiveKey =>
                        <UniversalInput key={primitiveKey.key.toString()}
                                        disabled={primitiveKey.disabled}
                                        fieldName={primitiveKey.key} object={object || {} as ObjectType}
                                        setObject={setObject} valueType={primitiveKey.htmlValueType}/>)}
                    <div>
                        {props.formElements(object, setObject)}
                    </div>
                    <br/>
                    {props.saveButtonVisible === undefined || props.saveButtonVisible ?
                        <Button variant="primary" type="submit" className={"mr-5"}>
                            {t("Save")}
                        </Button> : <div/>}
                    {props.delete !== undefined && !isNaN(Number(id)) ?
                        <Button variant={"danger"} onClick={handleOnDelete}>
                            {t("Delete")}
                        </Button> : <div/>}
                </Form>
            }
        </Card>
    )
}
