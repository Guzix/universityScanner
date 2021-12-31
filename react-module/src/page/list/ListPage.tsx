import React from "react";
import {Table} from "antd";
import {Content, Header} from "antd/es/layout/layout";
import {skiResortApi} from "../../api/export";
import {SkiResort} from "../../openapi/models";
import {SkiResortControllerApi} from "../../openapi";


export const ListPage:React.FC<{}>=()=>{
    const [skiResorts, setSkiResorts] = React.useState<SkiResort[]>([]);

    const download = async () => {
        const result = await skiResortApi.getSkiResortList()
        console.log(result)
        setSkiResorts(result.data)
    }

    React.useEffect(() => {
        download()
    }, [])
    return<>
        <Header style={{color:"white"}}>
            Ośrodki narciarskie
        </Header>
        <Content>
            <Table
                dataSource={skiResorts}
                columns={[
                    {dataIndex:"id", title:"id"},
                    {dataIndex:"name", title:"Nazwa"},
                    {dataIndex:"isOpen", title:"Otwarte"},
                    {dataIndex:"address", title: "Lokalizacja"},
                    {dataIndex: "opinion", title: "Ocena"}
                ]}
            />
        </Content>
    </>
}