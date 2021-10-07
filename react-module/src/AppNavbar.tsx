import {Menu} from "antd";
import React from "react";
import Sider from "antd/es/layout/Sider";
import {useHistory} from "react-router-dom";
import {PagePath} from "./App";
import {CompassOutlined, DiffOutlined, HomeOutlined, TrophyOutlined, UnorderedListOutlined} from "@ant-design/icons";
import { Fas } from "./misc/misc";


export const AppNavbar: React.FC<{}>=()=>{
    const history= useHistory();
    return<>
        <div style={{marginTop:15, padding:10, textAlign:"center", color:"white" }} onClick={()=>history.push(PagePath.HOME)}>
            <Fas icon={"skiing"} size={"9x"}/>
        </div>
        <Menu
            mode="inline"
            theme={"dark"}

        >
            <Menu.Item key={1} onClick={()=>history.push(PagePath.HOME)}><HomeOutlined/> Strona domowa</Menu.Item>
            <Menu.Item key={2} onClick={()=>history.push(PagePath.SKI_RESORT_LIST)}><UnorderedListOutlined/> Ośrodki narciarskie</Menu.Item>
            <Menu.Item key={3} onClick={()=>history.push(PagePath.TOP_SKI_RESORT)}><TrophyOutlined/> Top 10 ośrodków</Menu.Item>
            <Menu.Item key={4} onClick={()=>history.push(PagePath.MAP)}><CompassOutlined/> Mapa ośrodków</Menu.Item>
            <Menu.Item key={5} onClick={()=>history.push(PagePath.COMPARE_SKI_RESORT)}><DiffOutlined/> Porównania</Menu.Item>
        </Menu>
    </>
}