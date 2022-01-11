import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Button, Col, notification, Row, Spin, Table} from "antd";
import {ActionResourceListUniversityDtoActionResourceStatusEnum, AddressDto, UniversityDto} from "../../openapi/models";
import {useHistory} from "react-router-dom";
import {AppPage, PagePath} from "../../App";
import {universityApi} from "../../api/export";

export const UniversityList:React.FC<{}>=()=>{
    const history = useHistory();
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [universityList, setUniversityList] = React.useState<UniversityDto[]>([])

    const downloadList = async () => {
        setDownloading(true)
        const response = await universityApi.getListDto()
        if (response.status === 200){
            if (response.data.actionResourceStatus === ActionResourceListUniversityDtoActionResourceStatusEnum.OK){

                setUniversityList(response.data.resource)
            } else {
                notification.error({message: "Błąd pobierania"})
            }
        } else {
            notification.error({message: "Błąd połączenia"})
        }
    }
    
    React.useEffect(()=>{
     downloadList().finally(() => setDownloading(false))
    },[])
    return<Spin spinning={downloading}>
        <Header>
            Skrypty dla web scrappera
        </Header>
        <Content>
            <Row>
                <Col>
                    <Button type={"primary"} size={"large"}
                            onClick={() => history.push(`${PagePath.ADMIN_UNIVERSITY_EDIT}/new`)}
                    >
                        Dodaj Uczelnie
                    </Button>
                </Col>
            </Row>
            <Row >
                <Col span={24}>
                        <Table
                            dataSource={universityList}
                            bordered
                            onRow={(university: UniversityDto) => {
                                return {
                                    onClick: () => history.push(`${PagePath.ADMIN_UNIVERSITY_EDIT}/${university.id}`),
                                    onAuxClick: () => window.open(`${AppPage.ADMIN_UNIVERSITY_EDIT}/${university.id}`)
                                };
                            }}
                            columns={[
                                {dataIndex: "id", title: "id"},
                                {dataIndex: "summary", title: "Skrót"},
                                {dataIndex: "name", title: "Nazwa"},
                                {dataIndex: "universityType", title: "Typ"},
                                {dataIndex: "address", title: "Miasto", render: function get(address: AddressDto) { return address.city}},

                            ]}

                        />
                </Col>
            </Row>
        </Content>

    </Spin>
}