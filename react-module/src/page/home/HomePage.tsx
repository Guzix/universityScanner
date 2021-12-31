import React from "react";
import {Content, Header} from "antd/es/layout/layout";


export const HomePage:React.FC<{}>=()=>{

    return<>
        <Header  style={{color:"white"}}>
            Witam na stronie SkiSkanner.
        </Header>
        <Content>
            Dzięki tej witrynie będziesz mógł podjąć właściwą decyzje o wyborze stoku narciarskiego który chesz wybrać.

            Tutaj pojawi się kilka obrazków
        </Content>
    </>
}