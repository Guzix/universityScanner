import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Table} from "antd";


export const SkiSkannerTopPage:React.FC<{}>=()=>{

    return<>
        <Header>
            Top 10 najwyżej ocenianych ośrodków
        </Header>
        <Content>
            <Table>

            </Table>
        </Content>

    </>
}