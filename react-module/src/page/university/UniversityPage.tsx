import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Button, Card, Col, Descriptions, notification, Row, Table} from "antd";
import Editor from "@monaco-editor/react";
import {ActionResourceUniversityDtoActionResourceStatusEnum, UniversityDto} from "../../openapi/models";
import {useHistory, useParams} from "react-router-dom";
import {universityApi} from "../../api/export";
import {PagePath} from "../../App";

export const UniversityPage:React.FC<{}>=()=>{
    const history = useHistory();
    const [university, setUniversity] = React.useState<UniversityDto>({})
    const {id}: { id: string | undefined } = useParams();

    const download = async () => {
        if (id) {
            const response = await universityApi.getUniversity(Number.parseInt(id))
            if (response.status === 200) {
                if (response.data.actionResourceStatus === ActionResourceUniversityDtoActionResourceStatusEnum.OK) {
                    setUniversity(response.data.resource)

                } else {
                    notification.error({message: "Błąd pobieramnia"})
                }
            } else {
                notification.error({message: "Błąd połączenia"})
            }
        }
    }

    React.useEffect(() => {
        download();
    }, []);
    return<>
        <Header>
            <Row>
                <Col span={20}>
                    {university.name}
                </Col>
                <Col span={4} className={"headerButton"}>
                    <Button onClick={() => history.push(PagePath.LIST)}>
                        Powrót do listy
                    </Button>
                </Col>
            </Row>


        </Header>
        <Content>
            <Row>
                <Col span={8}>
                   <Card title={"Infornacje o uczelni"} >
                        <Descriptions>
                            <Descriptions.Item label={"Skrót"} span={3}>{university?.summary}</Descriptions.Item>
                            <Descriptions.Item label={"Miasto"} span={3}>{university?.address?.city}</Descriptions.Item>
                            <Descriptions.Item label={"Województwo"} span={3}>{university?.address?.province}</Descriptions.Item>
                            <Descriptions.Item label={"Rodzaj uczelni"} span={3}>{university?.universityType}</Descriptions.Item>
                        </Descriptions>
                   </Card>
                </Col>
                <Col span={15} offset={1}>
                    <Card title={"Kierunki studiów"}>
                        <Row>
                            <Col>

                                <Card title={<>Nazwa kierunku</>} style={{background:"#c23a7b"}}>
                                    Stacjonarne
                                    I stopnia
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Content>

    </>
}