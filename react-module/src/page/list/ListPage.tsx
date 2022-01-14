import React from "react";
import {Card, Col, notification, Row, Spin} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {ActionResourcePageUniversityDtoActionResourceStatusEnum, UniversityDto} from "../../openapi/models";
import {PagePath} from "../../App";
import {universityApi} from "../../api/export";
import {useHistory} from "react-router-dom";
import { Fas } from "./../../misc/misc";


export const ListPage:React.FC<{}>=()=>{
    const history = useHistory();
    const [universityList, setUniversityList] = React.useState<UniversityDto[]>([]);
    const [pageNumber, setPageNumber] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(9);
    const [totalPages, setTotalPages] = React.useState<number>(0);
    const [totalElements, setTotalElements] = React.useState<number>(0);
    const [downloading, setDownloading] = React.useState<boolean>(false);

    const downloadList = async () => {
        setDownloading(true)
        const response = await universityApi.getListDto(pageNumber,pageSize)
        if (response.status === 200){
            if (response.data.actionResourceStatus === ActionResourcePageUniversityDtoActionResourceStatusEnum.OK){
                const result = response.data.resource
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

    const changePageNumber = (page:number) => {
        if (pageNumber === 0 && page === -1){
            setPageNumber(totalPages-1)
        } else if (pageNumber === totalPages-1 && page === 1){
            setPageNumber(0)
        } else {
            setPageNumber(pageNumber+page)
        }
    }


    React.useEffect(()=>{
        downloadList().finally(() => setDownloading(false))
    },[pageNumber])

    return<Spin spinning={downloading}>
        <Header style={{color:"white", textAlign:"center"}}>
            <h2 style={{color:"white"}}>Lista uczelni</h2>
        </Header>
        <Content style={{
            backgroundImage: `url("https://www.imperial.ac.uk/ImageCropToolT4/imageTool/uploaded-images/HQ_Lecture_Theatre--tojpeg_1417530678776_x2--tojpeg_1473850590128_x2.jpg")`,
            backgroundSize: "cover"
        }}>
            <Row>
                <Col span={2} className={"pageArrows"} onClick={() => changePageNumber(-1)} >

                        <Fas icon={"arrow-left"} size={"5x"} className={"pageArrow"}/>

                </Col>
                <Col span={18} offset={1}>
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
                <Col span={2} offset={1}  className={"pageArrows"}  onClick={() => changePageNumber(1)} >
                        <Fas icon={"arrow-right"} size={"5x"}  className={"pageArrow"}/>
                </Col>
            </Row>
            <Row>
                <Col span={6} offset={9} style={{textAlign:"center", color:"#fff"}} >
                    <div>Strona {pageNumber+1} z {totalPages}</div>
                    <div>Elemetów {pageSize} z {totalElements}</div>
                </Col>
            </Row>
        </Content>
    </Spin>
}