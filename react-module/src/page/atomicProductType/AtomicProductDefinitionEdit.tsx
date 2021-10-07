import React from "react";
import {
    UniversalEnumSelect,
    UniversalInputType,
    UniversalSingleSimpleSelect
} from "../UniversalEdit";
import {
    atomicProductDefinitionApi,
    atomicProductParameterTypeApi,
} from "../../api/exports";
import {PathPage} from "../../App";
import {Button, Form} from "react-bootstrap";
import {Fas, ListItemProperty, t} from "../../misc/misc";
import {
    AtomicProductDefinitionExtendedDto,
    AtomicProductDefinitionExtendedDtoCategoryEnum,
    AtomicProductParameterBasicDto,
    AtomicProductParameterExtendedDto,
    AtomicProductParameterTypeBasicDto,
} from "../../openapi/models";
import {UniversalSimpleObjectEdit} from "../UniversalSimpleObjectEdit";
import {useParams} from "react-router-dom";
import {UniversalListArray} from "../UniversalListArray";
import {Button as AntButton, Col, Modal, notification, Row} from "antd";
import {ParameterTypeCreatorDialog} from "./ParameterTypeCreatorDialog";

export const AtomicProductDefinitionEdit: React.FC<{
    openInModal?: boolean, editDefIdByModal?:number, closeModal?: () => void, loadData?: () => void,
}> = ({openInModal,editDefIdByModal,closeModal,loadData}) => {

    const [parameterKeys, setParameterKeys] = React.useState<AtomicProductParameterTypeBasicDto[]>([])
    const [stringParameters, setStringParameters] = React.useState<string>()
    const [chosenParameterKey, setChosenParameterKey] = React.useState<AtomicProductParameterTypeBasicDto>()
    const [atomicProductDefinition, setAtomicProductDefinition] = React.useState<AtomicProductDefinitionExtendedDto>()
    const [showAddNewParamCom, setShowAddNewParamCom] = React.useState<boolean>(false)
    const [confirmModal, setConfirmModal] = React.useState<boolean>(false)
    const [editParameter, setEditParameter] = React.useState<boolean>(false)
    const [chosenParameterToEdit, setChosenParameterToEdit] = React.useState<AtomicProductParameterBasicDto>()
    const [chosenParameterToRemove, setChosenParameterToRemove] = React.useState<AtomicProductParameterBasicDto>()
    const [editParamValue, setEditParamValue] = React.useState<string>()
    const {id}: { id: string | undefined } = useParams();

    const downloadAtomicProdDef = async () => {
        const response = (openInModal && editDefIdByModal) ? await atomicProductDefinitionApi.atPrTyGetObject(editDefIdByModal) : await atomicProductDefinitionApi.atPrTyGetObject(Number(id));
        const result = response.data;
        if (response.status === 200) {
            setAtomicProductDefinition(result);
        }
    }


    const downloadParameterKeys = async () => {
        const response = await atomicProductParameterTypeApi.atPrPaTyGetObjectList();
        const result = response.data;
        if (response.status === 200) {
            setParameterKeys(result);
        }
    }

    const newParameters: AtomicProductParameterExtendedDto = {
        value:stringParameters,
        key:chosenParameterKey
    }

    const postParameters = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (atomicProductDefinition) {
            const defId = atomicProductDefinition?.id;
                const response = await atomicProductDefinitionApi.saveDefinitionWithNewParameters(newParameters,defId);
                if (response.status === 200) {
                    notification.success({message: "Zapisano zmiany."})
                    setTimeout(() => {
                        setShowAddNewParamCom(false)
                        setStringParameters("");
                        setChosenParameterKey(undefined);
                        downloadAtomicProdDef()},1000)
                }
        } else {
            notification.error({message: "Błąd zapisu."});
        }
    }
    const saveEditedParam = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (atomicProductDefinition && chosenParameterToEdit) {
            const defId: number = atomicProductDefinition?.id;
            const paramId: number = chosenParameterToEdit?.id;
            const newValue: string = editParamValue ? editParamValue : "";
            const response = await atomicProductDefinitionApi.saveParamValueForDefinition(defId,paramId,newValue);
            if (response.status === 200) {
                notification.success({message: "Zapisano zmiany."})
                setTimeout(() => {
                    setEditParameter(false);
                    setChosenParameterToEdit(undefined);
                    setEditParamValue("")
                    downloadAtomicProdDef()},1000)
            }
        } else {
            notification.error({message: "Błąd zapisu."});
        }
    }
    const removedChosenParam = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        if (atomicProductDefinition && chosenParameterToRemove) {
            const defId: number = atomicProductDefinition?.id;
            const removeParamId: number = chosenParameterToRemove?.id;
            const response = await atomicProductDefinitionApi.deleteParamFromDefinition(defId,removeParamId);
            if (response.status === 200) {
                notification.success({message: "Poprawnie usunięto parametr."})
                setTimeout(() => {
                    setConfirmModal(false);
                    setChosenParameterToRemove(undefined);
                    downloadAtomicProdDef()},1000)
            }
        } else {
            notification.error({message: "Błąd usunięcia parametru."});
        }
    }
    React.useEffect(() => {
        downloadParameterKeys();
        downloadAtomicProdDef();
    }, [editDefIdByModal]);


    return <>
    <div style={{marginTop:"10px"}}>
    <UniversalSimpleObjectEdit
            formElements={ (object:AtomicProductDefinitionExtendedDto | undefined, setObject:(object: AtomicProductDefinitionExtendedDto) => void ) => <>
            <Form.Group>
                <Form.Label className="mr-2">{t("Category Product")}:</Form.Label>
                <UniversalEnumSelect
                    updateObject={(selectObject) => setObject({...object, category: selectObject})}
                    currentValue={object?.category} objectList={Object?.values(AtomicProductDefinitionExtendedDtoCategoryEnum)}
                    fieldText={""}/>

                <Button style={{marginBottom:"10px"}} variant="primary" type="button" onClick={() => {
                    setShowAddNewParamCom(!showAddNewParamCom);
                }}>
                    {t("Adding New Parameter")}
                </Button>
            <div style={{border:"solid green 2px", padding:"2px"}}>
                { showAddNewParamCom &&
                <div style={{border:"solid lightblue 2px", padding:"2px"}}>
                    <Form.Label className="mr-2">{t("New Parameter")}:</Form.Label>
                        <UniversalSingleSimpleSelect
                            customSizeCol={openInModal ? 4 : undefined}
                            filedSizeCol={openInModal ? 1 : undefined}
                            getObjects={parameterKeys}
                            updateObject={(selectedObject: AtomicProductParameterTypeBasicDto) => setChosenParameterKey(selectedObject)}
                            defaultValue={chosenParameterKey?.title}
                            getValue={(parameterKey: AtomicProductParameterTypeBasicDto) => parameterKey?.title}
                            fieldText={t("Name")}
                            auxColumn={onDone => <ParameterTypeCreatorDialog onDone={() => downloadParameterKeys()}/>}/>
                        <Row>
                            <Col sm={2} style={{display: "flex", alignItems: "center", fontWeight:"bold"}}>
                                <Form.Label>{t("Value")}</Form.Label>
                            </Col>
                            <Col sm={openInModal ? 9 : 5}>
                                <Form.Control type={"text"}
                                              value={stringParameters}
                                              style={openInModal ? {marginLeft:"2px"} : {marginLeft:"3px"}}
                                              name={"parameterValue"}
                                              placeholder={t("Enter value")}
                                              onChange={(e) => {
                                                  setStringParameters(e.target.value)
                                              }}
                                              as={"textarea"}
                                              rows={1}
                                />
                            </Col>
                        </Row>
                        <Button variant="primary" type="button" onClick={(e) => {
                            postParameters(e);
                        }}>
                            {t("Add")}
                        </Button>
                </div>}
                <Form.Label className="mr-2">{t("Parameter List")}:</Form.Label>
                <UniversalListArray
                    customStyle={{border:"1px solid darkgrey"}}
                    hideAddButton={true}
                    properties={[
                        {extractFunction: (object) => object?.key?.title, label:t("Name")},
                        {extractFunction: (object) => (editParameter && (chosenParameterToEdit === object)) ? <>
                                <Form.Control type={"text"}
                                              value={!editParamValue ? object?.value : editParamValue}
                                              name={"parameterValueEdit"}
                                              onChange={(e) => {
                                                  setEditParamValue(e.target.value)
                                              }}
                                              as={"textarea"}
                                              rows={1}
                                />
                            </> : object?.value, label:t("Value")},
                        {extractFunction: (object) => <>
                                <Row>
                                    { (!editParameter || (editParameter && (chosenParameterToEdit !== object))) &&
                                    <Col>
                                        <AntButton size={"middle"}
                                                   type={"primary"}
                                                   disabled={(chosenParameterToEdit && chosenParameterToEdit !== object) || (chosenParameterToRemove && chosenParameterToRemove !== object)}
                                                   onClick={() => {
                                            setEditParameter(true)
                                            setChosenParameterToEdit(object)
                                        }}>
                                            <Fas icon={"edit"}/>
                                        </AntButton>
                                    </Col>}
                                    {(editParameter && (chosenParameterToEdit === object)) &&
                                        <Col>
                                            <AntButton size={"middle"}
                                                       type={"primary"}
                                                       disabled={!editParamValue}
                                                       onClick={(e) => {
                                                saveEditedParam(e);
                                            }}>
                                                <Fas icon={"save"}/>
                                            </AntButton>
                                        </Col>}
                                    {(editParameter && (chosenParameterToEdit === object)) &&
                                        <Col style={{marginLeft:"5px"}}>
                                            <AntButton size={"middle"}
                                                       type={"default"}
                                                       disabled={!!editParamValue}
                                                       onClick={(e) => {
                                                           setEditParameter(false);
                                                           setChosenParameterToEdit(undefined);
                                                           setEditParamValue("")
                                            }}>
                                                <Fas icon={"window-close"}/>
                                            </AntButton>
                                        </Col>}
                                    { (!editParameter || (editParameter && (chosenParameterToEdit !== object))) &&
                                    <Col style={{marginLeft:"5px"}}>
                                        <AntButton size={"middle"}
                                                   className={"ant-btn-danger"}
                                                   disabled={(chosenParameterToEdit && chosenParameterToEdit !== object) || (chosenParameterToRemove && chosenParameterToRemove !== object)}
                                                   onClick={() => {
                                                       setChosenParameterToRemove(object)
                                                       setConfirmModal(true)
                                                   }}>
                                            <Fas icon={"minus-circle"}/>
                                        </AntButton>
                                    </Col>}
                                </Row>
                            </>,customStyle:{width:"115px", border:"1px solid darkgrey"}},
                    ] as ListItemProperty<AtomicProductParameterBasicDto>[]}
                    getObjectArray={atomicProductDefinition?.parameters.sort((a: { id: number; }, b: { id: number; }) => {
                        return (a.id < b.id) ? -1 : 1;})}/>
            </div>
            </Form.Group>

            </>}
           getSimpleObject={atomicProductDefinition}
           addCloseButton={openInModal}
           onClose={closeModal}
           save={atomicProductDefinitionApi.atPrTySaveObject as any}
           primitiveKeys={[
               {key:"title", htmlValueType: UniversalInputType.TEXT}
           ]}
           onSubmitString={!openInModal ? PathPage.ATOMIC_PRODUCT_TYPE_LIST : undefined}
           onSubmitLoadData={loadData}/>
    </div>
        <RemovedParamConfirmModal paramToRemove={chosenParameterToRemove}
                                  showModal={confirmModal}
                                  setShowModal={() => setConfirmModal(false)}
                                  removeFunction={(e) => removedChosenParam(e)}
                                  uncheckParam={() => setChosenParameterToRemove(undefined)}/>
  </>
}
export const RemovedParamConfirmModal: React.FC<{
    paramToRemove?: AtomicProductParameterBasicDto,
    showModal:boolean,
    setShowModal:() => void,
    removeFunction:(e: React.MouseEvent<HTMLElement>) => void,
    uncheckParam:() => void,
}> = ({paramToRemove, showModal, setShowModal, removeFunction, uncheckParam}) => {
    return <Modal
        visible={showModal} title={<><Fas icon={"trash"}/> {t("Confirm remove param")}:<div style={{whiteSpace: "pre-line"}}> {paramToRemove?.value}</div></>}
            onCancel={() => {
               setShowModal()
               uncheckParam()
            }}
            okButtonProps={{hidden: true}}
            cancelButtonProps={{hidden: true}}
            centered={true}
            width={360}
    >
        <Row>
            <Col style={{marginLeft:"5rem"}}>
                <AntButton size={"middle"}
                           className={"ant-btn-danger"}
                           onClick={(e) => {
                               removeFunction(e)
                           }}>
                    <Fas icon={"check-circle"}/>
                </AntButton>
            </Col>
            <Col style={{marginLeft:"1rem"}}>
                <AntButton size={"middle"}
                           className={"ant-btn-secondary"}
                           onClick={() => {
                               setShowModal()
                               uncheckParam()
                           }}>
                    <Fas icon={"times-circle"}/>
                </AntButton>
            </Col>
        </Row>
    </Modal>
}
