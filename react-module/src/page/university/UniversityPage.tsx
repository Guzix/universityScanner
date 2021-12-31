import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Col, Row, Table} from "antd";
import Editor from "@monaco-editor/react";

export const UniversityPage:React.FC<{}>=()=>{

    return<>
        <Header>
            Mapa ośrodków narciarskich w Polsce
            Nazwa ośrodka
        </Header>
        <Content>
            <Row>
                <Col span={8}>
                    list with universities
                </Col>
                <Col span={16} >
                    <Editor
                        height={"500px"}
                        defaultLanguage={"javascript"}
                    />
                </Col>
            </Row>

        </Content>

    </>
}