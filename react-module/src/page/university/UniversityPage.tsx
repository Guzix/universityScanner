import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Button, Card, Col, Descriptions, notification, Row, Table} from "antd";
import Editor from "@monaco-editor/react";
import {
    ActionResourceUniversityDtoActionResourceStatusEnum,
    FieldOfStudyDto,
    UniversityDto
} from "../../openapi/models";
import {useHistory, useParams} from "react-router-dom";
import {universityApi} from "../../api/export";
import {PagePath} from "../../App";
import {enumToPrettyString} from "../misc";

import { Fas } from "../../misc/misc";


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
                <Col span={17} >
                    <Card title={"Kierunki studiów"}>
                        <Row>
                            {!university.fieldOfStudies ? <Col>
                                Brak kierunków
                                </Col> :
                                university?.fieldOfStudies?.map((fos: FieldOfStudyDto) =>
                                    <Col span={7} offset={1}>
                                        <Card title={<>{fos.name}</>}  className={"fieldList"}  >
                                            <Descriptions>
                                                <Descriptions.Item label={""} span={3}>{enumToPrettyString(fos.fieldOfStudyType)}</Descriptions.Item>
                                                <Descriptions.Item label={""} span={3}>{enumToPrettyString(fos.fieldOfStudyLevel)}</Descriptions.Item>
                                                <Descriptions.Item label={"Ilość semestrów"} span={3}>{fos.numberOfSemesters}</Descriptions.Item>
                                            </Descriptions>
                                        </Card>
                                    </Col>
                                )
                            }

                        </Row>
                    </Card>
                </Col>
                <Col span={6} offset={1}>
                    <Card title={<div>
                        <div style={{
                            height: 100,
                            backgroundImage: university.logoURL ? `url(${university.logoURL})` : "",
                            backgroundSize: "contain",
                            backgroundRepeat: "no-repeat"
                        }}/>
                        <div>
                            Infornacje o uczelni
                        </div>
                    </div>} >
                        <Descriptions>
                            <Descriptions.Item label={"Skrót"} span={3}>{university?.summary}</Descriptions.Item>
                            <Descriptions.Item label={"Miasto"} span={3}>{university?.address?.city}</Descriptions.Item>
                            <Descriptions.Item label={"Województwo"} span={3}>{enumToPrettyString(university?.address?.province)}</Descriptions.Item>
                            <Descriptions.Item label={"Rodzaj uczelni"} span={3}>{enumToPrettyString(university?.universityType)}</Descriptions.Item>
                            {university.website &&
                            <Descriptions.Item label={"Strona uczelni"} span={3} >
                                <Button onClick={() => window.open(university.website)} style={{width: "100%"}}><Fas icon={"globe"}/></Button>
                            </Descriptions.Item>
                            }
                        </Descriptions>
                    </Card>
                </Col>
            </Row>
        </Content>

    </>
}