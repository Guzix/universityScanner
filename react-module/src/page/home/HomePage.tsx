import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Carousel, Col, Row} from "antd";


export const HomePage:React.FC<{}>=()=>{

    return<>
        <Header  style={{color:"white"}}>
            Witam na stronie UniversityScanner. Dzięki tej witrynie znajdziesz wymarzony kierunek studiów
        </Header>
        <Content>
           <Row>
               <Col span={16} offset={4}>
                    <Carousel dots autoplay>
                        <div>
                            <h3 style={{
                                height: '160px',
                                color: '#fff',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                            }}>test1</h3>
                        </div>
                        <div>
                            <h3 style={{
                                height: '160px',
                                color: '#fff',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                            }}>test2</h3>
                        </div>
                        <div>
                            <h3 style={{
                                height: '160px',
                                color: '#fff',
                                lineHeight: '160px',
                                textAlign: 'center',
                                background: '#364d79',
                            }}>test3</h3>
                        </div>
                    </Carousel>
               </Col>
           </Row>
        </Content>
    </>
}