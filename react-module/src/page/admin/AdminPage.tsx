import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Col, Row, Table} from "antd";
import Editor from "@monaco-editor/react";

export const AdminPage:React.FC<{}>=()=>{
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [universityList, setUniversityList] = React.useState<any[]>([])
    const [chosenUniversity, setChosenUniversity] = React.useState<any | null>(null);

    React.useEffect(()=>{
        setUniversityList([
            {
                id:1,
                name:"WSIZ",
            },
            {
                id:2,
                name:"PRZ",
            },
            {
                id:3,
                name:"URZ",
            },
            {
                id:4,
                name:"WSPIE",
            },
        ])
    },[])
    return<div >
        <Header>
            Skrypty dla web scrappera
        </Header>
        <Content>

            <Row >
                <Col span={8}>
                    {chosenUniversity ?
                        <>{chosenUniversity?.name}</>
                        :
                        <Table
                            dataSource={universityList}
                            bordered
                            columns={[
                                {dataIndex: "id", title: "id"},
                                {dataIndex: "name", title: "name"},
                            ]}

                        />
                    }
                </Col>
                <Col span={16} >
                    <Editor

                        defaultLanguage={"javascript"}
                    />
                </Col>
            </Row>
        </Content>

    </div>
}