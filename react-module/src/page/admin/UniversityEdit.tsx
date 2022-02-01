import React from "react";
import Editor from "@monaco-editor/react";
import {Button, Col, Divider, Form, Input, Modal, notification, Row, Select, Spin, Table} from "antd";
import {
    ActionResourceUniversityDtoActionResourceStatusEnum,
    AddressDtoProvinceEnum,
    FieldOfStudyDto,
    FieldOfStudyDtoFieldOfStudyLevelEnum,
    FieldOfStudyDtoFieldOfStudyTypeEnum,
    UniversityDto,
    UniversityDtoUniversityTypeEnum
} from "../../openapi/models";
import {Content, Header} from "antd/es/layout/layout";
import {useHistory, useParams} from "react-router-dom";
import {enumToPrettyString} from "../misc";
import {scrapperApi, universityApi} from "../../api/export";
import {PagePath} from "../../App";


export const UniversityEdit:React.FC<{}>=()=> {
    const history = useHistory();
    const {id}: { id: string | undefined } = useParams();
    const [form] = Form.useForm();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [university, setUniversity] = React.useState<UniversityDto>({});
    const [listModalVisible, setListModalVisible] = React.useState<boolean>(false);


    const download = async (numberId:number) =>{
        if (numberId) {
            setDownloading(true)
            const response = await universityApi.getUniversity(numberId)
            if (response.status === 200) {
                if (response.data.actionResourceStatus === ActionResourceUniversityDtoActionResourceStatusEnum.OK) {
                    const result = response.data.resource
                    setUniversity(response.data.resource)
                    form.setFieldsValue({
                        name: result.name,
                        summary: result.summary,
                        universityType: result.universityType,
                        city: result.address.city,
                        street: result.address.street,
                        postalCode: result.address.postalCode,
                        buildingNumber: result.address.buildingNumber,
                        province: result.address.province,
                        logoURL: result.logoURL,
                        photoURL: result.photoURL,
                        website: result.website,
                    })
                } else {
                    notification.error({message: "Błąd pobieramnia"})
                }
            } else {
                notification.error({message: "Błąd połączenia"})
            }
        }
    }

    const onSubmit = async (values:any) => {
       const response = await universityApi.saveDto({
           ...university,
           name: values.name,
           summary: values.summary,
           universityType: values.universityType,
           logoURL: values.logoURL,
           photoURL: values.photoURL,
           website: values.website,
           scriptJS: university.scriptJS ? university.scriptJS : "",
           address:{
               ...university.address,
               city: values.city,
               buildingNumber: values.buildingNumber,
               postalCode: values.postalCode,
               province: values.province,
               street: values.street
           }
       }, university.id )
        if (response.status === 200) {
            if (response.data.actionResourceStatus === ActionResourceUniversityDtoActionResourceStatusEnum.OK){
                setUniversity(response.data.resource)
                notification.success({message:"Zapisano"})
                if (!isEditPage) {
                    history.push(PagePath.ADMIN_UNIVERSITY_LIST)
                }

            } else {
                notification.error({message: "Błąd zapisu"})
            }
        } else {
            notification.error({message: "Błąd zapisu"})
        }
    }

    const onDelete = async () => {
        setDownloading(true)
        const response = await universityApi.deleteUniversity(university.id)
        if (response.status === 200  && response.data === "OK"){
            history.push(PagePath.ADMIN_UNIVERSITY_LIST)
            notification.success({message:"Poprawne usunięcie"})
        } else {
            notification.error({message: "Błąd połączenia"})
        }
    }

    const onScriptExecute = async () => {
        setDownloading(true)
        const response = await scrapperApi.scrapFieldOfStudies(university.id)
        if (response.status === 200  && response.data === "OK"){
            window.location.reload()
            notification.success({message:"Poprawne usunięcie"})
        } else if (response.data === "REPLY_TIMEOUT"){
            notification.error({message: "Błąd wykonywania skryptu"})
        }else {
            notification.error({message: "Błąd połączenia"})
        }
    }

    React.useEffect(() => {
        if (isEditPage) {
            download(Number(id)).finally(() => setDownloading(false));
        }
    }, []);

    return<Spin spinning={downloading}>
        <UniversityEditFieldsOfStudiesList university={university}
                                           modalVisible={listModalVisible}
                                           setModalVisible={setListModalVisible}
                                           setUniversity={setUniversity}
        />
        <Header>
            <Row>
                <Col span={20} >
                    { isEditPage ? "Edycja uczelni" : "Dodawanie nowej uczelni"}
                </Col>
                <Col span={4} className={"headerButton"}>
                    <Button onClick={() => history.push(PagePath.ADMIN_UNIVERSITY_LIST)}>
                        Powrót do listy
                    </Button>
                </Col>
            </Row>
        </Header>
        <Content>
            <Row>
                <Col span={18} offset={3}>
                    <Form labelCol={{span:6}}  form={form} initialValues={university}
                          onFinish={onSubmit} scrollToFirstError
                    >
                        <Form.Item>
                            <Row>
                                <Col span={8} style={{textAlign:"center"}}>
                                    <Button type={"primary"} htmlType={"submit"} >
                                        Zapisz
                                    </Button>
                                </Col>
                                <Col span={8} style={{textAlign:"center"}}>
                                    <Button type={"primary"} danger hidden={!university.id}
                                            onClick={() => onDelete().finally(() => setDownloading(false))}
                                    >
                                        Usuń
                                    </Button>
                                </Col>
                            </Row>
                        </Form.Item>

                        <Form.Item label={"Nazwa"} name={"name"}  required rules={[{required:true, message: "Prosze podać nazwę uczelni"}]} hasFeedback>
                            <Input />
                        </Form.Item>

                        <Form.Item label={"Skrót"} name={"summary"}  required rules={[{required:true, message: "Prosze podać skrót uczelni"}]} hasFeedback>
                            <Input />
                        </Form.Item>

                        <Form.Item label={"Typ uczelni"} name={"universityType"} required rules={[{required:true, message: "Prosze wybrać typ uczelni"}]} hasFeedback>
                            <Select value={university?.universityType} >
                                {Object.values(UniversityDtoUniversityTypeEnum).map(typ =>
                                    <Select.Option value={typ} >
                                        {enumToPrettyString(typ)}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item label={"Miasto"} name={"city"} required rules={[{required:true, message: "Prosze podać miasto uczelni"}]} hasFeedback>
                            <Input value={university?.address?.city} />
                        </Form.Item>

                        <Form.Item label={"Ulica"} name={"street"} required rules={[{required:true, message: "Prosze podać ulice uczelni"}]} hasFeedback>
                            <Input value={university?.address?.street}/>
                        </Form.Item>

                        <Form.Item label={"Kod poczyowy"} name={"postalCode"} required rules={[
                            {required:true, message: "Prosze podać kod pocztowy uczelni"},
                            () => ({
                                validator(_, value) {
                                    if (!value || value.length === 6 && value[2] === "-") {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Format jest nie poprawny'));
                                },
                            }),
                        ]} hasFeedback>
                            <Input value={university?.address?.postalCode}/>
                        </Form.Item>

                        <Form.Item label={"Numer budynku"} name={"buildingNumber"} required rules={[{required:true, message: "Prosze podać numer budynku uczelni"}]} hasFeedback>
                            <Input value={university?.address?.buildingNumber}/>
                        </Form.Item>

                        <Form.Item label={"Województwo"} name={"province"} required rules={[{required:true, message: "Prosze wybrać województwo uczelni"}]} hasFeedback>
                            <Select value={university?.address?.province} >
                                {Object.values( AddressDtoProvinceEnum).map(typ =>
                                    <Select.Option value={typ} >
                                        {enumToPrettyString(typ)}
                                    </Select.Option>
                                )}
                            </Select>
                        </Form.Item>

                        <Form.Item label={"URL Loga"} name={"logoURL"}  hasFeedback>
                            <Input value={university?.logoURL}/>
                        </Form.Item>

                        <Form.Item label={"URL Zdjęcia"} name={"photoURL"}  hasFeedback>
                            <Input value={university?.photoURL}/>
                        </Form.Item>

                        <Form.Item label={"URL Strony"} name={"website"}  hasFeedback>
                            <Input value={university?.photoURL}/>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
                    <div hidden={!isEditPage}>
                        <Divider orientation={"left"}>Lista kierunków</Divider>
                        <Button type={"primary"} onClick={() => setListModalVisible(true)}>
                            Lista kierunków
                        </Button>
                        <Divider orientation={"left"}>Skrypt JS</Divider>

                        <Row>
                            <Col span={22} offset={1}>
                                <Editor
                                    value={university.scriptJS}
                                    height={550}
                                    defaultLanguage={"javascript"}
                                    onChange={(e) => {
                                        setUniversity({...university, scriptJS:e})
                                    }}
                                />
                            </Col>
                        </Row>
                        <Button type={"dashed"} danger onClick={() => onScriptExecute().finally(() => setDownloading(false))} style={{textAlign:"center", margin:15}} >
                            Wykonaj skrtpy
                        </Button>
                    </div>



        </Content>

    </Spin>
}


export  const UniversityEditFieldsOfStudiesList:React.FC<{
    university: UniversityDto
    modalVisible: boolean
    setModalVisible: (value: boolean) => void
    setUniversity: (value: UniversityDto) => void
}>=({university, modalVisible, setModalVisible, setUniversity})=> {
    const [editModalVisible, setEditModalVisible] = React.useState<boolean>(false);
    const [chosenField, setChosenField] = React.useState<FieldOfStudyDto | undefined>(undefined)
    return <>
        <UniversityEditFieldsOfStudiesEdit fieldOfStudies={chosenField}
                                           modalVisible={editModalVisible}
                                           setModalVisible={setEditModalVisible}
                                           universityId={university.id}
                                           setChosenField={setChosenField}
                                           setUniversity={setUniversity}
        />
        <Modal
            visible={modalVisible}
            onCancel={() => setModalVisible(false)}
            width={"80vw"}
            footer={[]}
        >
            <Divider orientation={"left"}>Lista kierunków</Divider>
            <Button type={"primary"} onClick={() => setEditModalVisible(true)} style={{marginBottom:15}}>
                Dodaj ręcznie
            </Button>
            <Table
                dataSource={university.fieldOfStudies || []}
                onRow={(row) => {
                    return {
                        onClick: () => {
                            setChosenField(row)
                            setEditModalVisible(true)
                        }
                    }

                }}
                columns={[
                    {title:"id", dataIndex:"id"},
                    {title:"Nazwa", dataIndex: "name"},
                    {title:"Liczba semestrów", dataIndex: "numberOfSemesters"},
                    {title: "Typ kierunku", dataIndex: "fieldOfStudyType", render: function get(fieldOfStudyType) {return enumToPrettyString(fieldOfStudyType)}},
                    {title: "Poziom kierunku", dataIndex: "fieldOfStudyLevel", render: function get(fieldOfStudyLevel) {return enumToPrettyString(fieldOfStudyLevel)}}
                ]}
            />

        </Modal>
    </>
}

export  const UniversityEditFieldsOfStudiesEdit:React.FC<{
    fieldOfStudies: FieldOfStudyDto | undefined
    universityId: number
    modalVisible: boolean
    setModalVisible: (value: boolean) => void
    setChosenField: (value: FieldOfStudyDto | undefined) => void
    setUniversity: (value: UniversityDto) => void
}>=({fieldOfStudies, universityId, modalVisible, setModalVisible, setChosenField, setUniversity})=> {
    const [form] = Form.useForm();
    const [downloading, setDownloading] = React.useState<boolean>(false);


    const saveField = async (values: any) => {
        setDownloading(true)
        const response = await universityApi.addOrSaveFieldOfStudy({
            ...fieldOfStudies,
            name:values.name,
            numberOfSemesters: values.numberOfSemesters,
            fieldOfStudyType: values.fieldOfStudyType,
            fieldOfStudyLevel: values.fieldOfStudyLevel
        }, universityId).finally(() => setDownloading(false))
        if (response.status === 200){
            if (response.data.actionResourceStatus === ActionResourceUniversityDtoActionResourceStatusEnum.OK){
                notification.success({message:"Zapisano kierunek"})
                onClose()
                setUniversity(response.data.resource)
            } else {
                notification.error({message: "Błąd zapisu"})
            }
        } else {
            notification.error({message: "Błąd zapisu"})
        }
    }

    const deleteField = async () => {
        setDownloading(true)
        const response = await universityApi.deleteFieldOfStudy(universityId, fieldOfStudies?.id)
        if (response.status == 200 && response.data.actionResourceStatus === ActionResourceUniversityDtoActionResourceStatusEnum.OK) {
            onClose()
            setUniversity(response.data.resource)
        }
    }

    const onClose = () => {
        setModalVisible(false)
        setChosenField(undefined)
        form.setFieldsValue({
            name:undefined,
            numberOfSemesters:undefined,
            fieldOfStudyType: undefined,
            fieldOfStudyLevel:undefined
        })
    }

    React.useEffect(() => {
        form.setFieldsValue({
            name:fieldOfStudies?.name,
            numberOfSemesters:fieldOfStudies?.numberOfSemesters,
            fieldOfStudyType: fieldOfStudies?.fieldOfStudyType,
            fieldOfStudyLevel:fieldOfStudies?.fieldOfStudyLevel
        })
    }, [fieldOfStudies])

    return <>
        <Modal
            visible={modalVisible}
            onCancel={onClose}
            width={"70vw"}
            footer={[]}
        >
            <Divider orientation={"left"}>Edycja kierunku</Divider>
            <Form onFinish={saveField} form={form}>
                <Form.Item  >
                    <Row>
                        <Col span={8}>
                            <Button type={"primary"} htmlType={"submit"} loading={downloading}>
                                Zapisz
                            </Button>
                        </Col>
                        <Col span={8} style={{textAlign: "center"}}>
                            <Button type={"primary"} danger hidden={!fieldOfStudies?.id}  loading={downloading}
                                    onClick={() => deleteField().finally(() => setDownloading(false))}
                            >
                                Usuń
                            </Button>
                        </Col>
                        <Col span={8} style={{textAlign: "right"}}>
                            <Button onClick={onClose} loading={downloading}>
                                Anuluj
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label={"Nazwa kierunku"} name={"name"} required rules={[{required:true, message: "Prosze podać nazwe kierunku"}]} hasFeedback>
                    <Input value={fieldOfStudies?.name}/>
                </Form.Item>

                <Form.Item label={"Liczba semestrów"} name={"numberOfSemesters"} >
                    <Input value={fieldOfStudies?.numberOfSemesters} type={"number"}/>
                </Form.Item>

                <Form.Item label={"Poziom kierunku"} name={"fieldOfStudyLevel"} required rules={[{required:true, message: "Prosze wybrać poziom kierunku"}]} hasFeedback>
                    <Select value={fieldOfStudies?.fieldOfStudyLevel} >
                        {Object.values( FieldOfStudyDtoFieldOfStudyLevelEnum).map(typ =>
                            <Select.Option value={typ} >
                                {enumToPrettyString(typ)}
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>

                <Form.Item label={"Rodzaj kierunku"} name={"fieldOfStudyType"} required rules={[{required:true, message: "Prosze wybrać rodzaj kierunku"}]} hasFeedback>
                    <Select value={fieldOfStudies?.fieldOfStudyType} >
                        {Object.values( FieldOfStudyDtoFieldOfStudyTypeEnum).map(typ =>
                            <Select.Option value={typ} >
                                {enumToPrettyString(typ)}
                            </Select.Option>
                        )}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    </>
}