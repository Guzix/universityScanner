import React from "react";
import {Card, Col, notification, Row} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {ActionResourcePageUniversityDtoActionResourceStatusEnum, UniversityDto} from "../../openapi/models";
import {PagePath} from "../../App";
import {universityApi} from "../../api/export";
import {useHistory} from "react-router-dom";


export const ListPage:React.FC<{}>=()=>{
    const history = useHistory();
    const [universityList, setUniversityList] = React.useState<UniversityDto[]>([]);
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(9);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalElements, setTotalElements] = React.useState<number>(0);
    const downloadList = async () => {


        const response = await universityApi.getListDto(pageNumber,pageSize)
        if (response.status === 200){
            if (response.data.actionResourceStatus === ActionResourcePageUniversityDtoActionResourceStatusEnum.OK){
                const result = response.data.resource
                console.log(response.data.resource)
                setUniversityList(result.content)
                setPageNumber(result.pageable.pageNumber)
                setPageSize(result.pageable.pageSize)
                setTotalPages(result.totalPages)
                setTotalElements(result.totalElements)
            } else {
                notification.error({message: "Błąd pobierania"})
            }
        } else {
            notification.error({message: "Błąd połączenia"})
        }
    }


    React.useEffect(()=>{
        downloadList()
    },[])

    return<>
        <Header style={{color:"white", textAlign:"center"}}>
            <h2 style={{color:"white"}}>Lista uczelni</h2>
        </Header>
        <Content style={{
            backgroundImage: `url("https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/HQ_Lecture_Theatre--tojpeg_1417530678776_x2--tojpeg_1473850590128_x2.jpg")`,
            backgroundSize: "cover"
        }}>
            {/*<Table*/}
            {/*    dataSource={universityList}*/}
            {/*    bordered*/}
            {/*    onRow={(university: UniversityDto) => {*/}
            {/*        return {*/}
            {/*            onClick: () => history.push(`${PagePath.UNIVERSITY}/${university.id}`),*/}
            {/*            onAuxClick: () => window.open(`${AppPage.UNIVERSITY}/${university.id}`)*/}
            {/*        };*/}
            {/*    }}*/}
            {/*    columns={[*/}
            {/*        {dataIndex: "id", title: "id"},*/}
            {/*        {dataIndex: "summary", title: "Skrót"},*/}
            {/*        {dataIndex: "name", title: "Nazwa"},*/}
            {/*        {dataIndex: "universityType", title: "Typ", render: function get(universityType) {return enumToPrettyString(universityType)}},*/}
            {/*        {dataIndex: "address", title: "Miasto", render: function get(address: AddressDto) { return address.city}},*/}

            {/*    ]}*/}
            {/*/>*/}
            <Row>
                <Col span={18} offset={3}>
                    <Row>
                        {universityList.map((univ:UniversityDto) => <Col span={8} >
                                <Card title={<>{univ.summary}</>}
                                      className={"univList"}
                                      onClick={() => history.push(`${PagePath.UNIVERSITY}/${univ.id}`)}


                                >
                                    <div>{univ.name}</div>
                                    <div>{univ.universityType}</div>
                                    <div>{univ.address.city}</div>
                                </Card>
                            </Col>
                        )}
                    </Row>
                </Col>
            </Row>
        </Content>
    </>
}