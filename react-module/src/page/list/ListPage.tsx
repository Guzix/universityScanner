import React from "react";
import {notification, Table} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {ActionResourceListUniversityDtoActionResourceStatusEnum, AddressDto, UniversityDto} from "../../openapi/models";
import {AppPage, PagePath} from "../../App";
import {universityApi} from "../../api/export";
import {useHistory} from "react-router-dom";



export const ListPage:React.FC<{}>=()=>{
    const history = useHistory();
    const [universityList, setUniversityList] = React.useState<UniversityDto[]>([]);

    const downloadList = async () => {
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
        downloadList()
    },[])

    return<>
        <Header style={{color:"white"}}>
            Ośrodki narciarskie
        </Header>
        <Content>
            <Table
                dataSource={universityList}
                bordered
                onRow={(university: UniversityDto) => {
                    return {
                        onClick: () => history.push(`${PagePath.UNIVERSITY}/${university.id}`),
                        onAuxClick: () => window.open(`${AppPage.UNIVERSITY}/${university.id}`)
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
        </Content>
    </>
}