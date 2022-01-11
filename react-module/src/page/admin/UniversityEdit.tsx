import React from "react";
import Editor from "@monaco-editor/react";
import {Button, Col, Divider, Form, Input, notification, Row, Select, Space, Spin, Table} from "antd";
import {
    ActionResourceUniversityDtoActionResourceStatusEnum,
    AddressDtoProvinceEnum,
    UniversityDto,
    UniversityDtoUniversityTypeEnum
} from "../../openapi/models";
import {Content, Header} from "antd/es/layout/layout";
import {useHistory, useParams} from "react-router-dom";
import {enumToPrettyString} from "../misc";
import {universityApi} from "../../api/export";
import {PagePath} from "../../App";


export const UniversityEdit:React.FC<{}>=()=> {
    const history = useHistory();
    const {id}: { id: string | undefined } = useParams();
    const [form] = Form.useForm();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [university, setUniversity] = React.useState<UniversityDto>({});

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
                        province: result.address.province
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

    React.useEffect(() => {
        if (isEditPage) {
            download(Number(id)).finally(() => setDownloading(false));
        }
    }, []);

    return<Spin spinning={downloading}>
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
            <Form labelCol={{span:6}} wrapperCol={{span: 12}} form={form} initialValues={university}
                  onFinish={onSubmit} scrollToFirstError
            >
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} >
                        Zapisz
                    </Button>
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

            </Form>
            <div hidden={!isEditPage}>
                <Divider orientation={"left"}>Skrypt JS</Divider>
                {/*<Table*/}
                {/*    dataSource={university?.fieldOfStudies}*/}
                {/*    columns={[*/}
                {/*        {title: "id", dataIndex: "id"},*/}
                {/*        {title: "Nazwa", dataIndex: "name"}*/}
                {/*    ]}*/}
                {/*/>            */}
                <Row>
                    <Col span={18} offset={3}>
                        <Editor
                            value={university.scriptJS}
                            height={550}
                            defaultLanguage={"typescript"}
                            onChange={(e) => {
                                setUniversity({...university, scriptJS:e})
                            }}
                        />
                    </Col>
                </Row>

            </div>

        </Content>

    </Spin>
}