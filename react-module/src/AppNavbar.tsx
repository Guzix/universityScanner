import {Col, Menu, Row} from "antd";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useHistory} from "react-router-dom";
import {PagePath} from "./App";
import {CompassOutlined, DiffOutlined, HomeOutlined, TrophyOutlined, UnorderedListOutlined} from "@ant-design/icons";
import { Fas } from "./misc/misc";


export const AppNavbar: React.FC<{}>=()=>{
    const history= useHistory();
    return<>
            <Menu
                mode="horizontal"
            >
                <Menu.Item key={0} onClick={()=>history.push(PagePath.HOME)}><Fas icon={"graduation-cap"} /> UniversityScanner</Menu.Item>
                <Menu.Item key={1} onClick={()=>history.push(PagePath.HOME)}><HomeOutlined/> Strona domowa</Menu.Item>
                <Menu.Item key={2} onClick={()=>history.push(PagePath.LIST)}><UnorderedListOutlined/> Uczelnie</Menu.Item>
                {/*<Menu.Item key={3} onClick={()=>history.push(PagePath.MAP)}><CompassOutlined/> Mapa uczelni</Menu.Item>*/}
                <Menu.Item key={4} onClick={()=>history.push(PagePath.ADMIN_UNIVERSITY_LIST)}><CompassOutlined/> Admin</Menu.Item>
            </Menu>

    </>
}