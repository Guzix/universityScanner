import React from "react";
import {Content, Header} from "antd/es/layout/layout";
import {Carousel, Col, Image, notification, Row} from "antd";
import {ActionResourceListUniversityDtoActionResourceStatusEnum, UniversityDto} from "../../openapi/models";
import {universityApi} from "../../api/export";
import {useHistory} from "react-router-dom";
import {PagePath} from "../../App";


export const HomePage:React.FC<{}>=()=>{
    const history = useHistory();
    const [randomUniversity, setRandomUniversity] = React.useState<UniversityDto[]>([])

    const getRandomUniversity = async () => {
        const response = await universityApi.getRandomUniversity(4)
        if (response.status === 200 && response.data.actionResourceStatus === ActionResourceListUniversityDtoActionResourceStatusEnum.OK){
            setRandomUniversity(response.data.resource)
        } else {
            notification.error({message:"Nie pobrano danych do karuzeli"})
        }

    }

    console.log(randomUniversity)

    React.useEffect(() => {
        getRandomUniversity()
    }, [])
    return<>
        <Header  style={{color:"white", height:"230px", padding:15}}>
            <Carousel dots autoplay>
                {randomUniversity.map((rand:UniversityDto) => <div onClick={() => history.push(`${PagePath.UNIVERSITY}/${rand.id}`)}>
                    <h1 style={{
                        height: '200px',
                        color: '#fff',
                        lineHeight: '160px',
                        textAlign: 'center',
                        background: '#153775',
                        backgroundImage: rand.photoURL ? `url(${rand.photoURL})` : "",
                        backgroundSize: "cover",
                    }}
                    >
                        <div style={{

                        }}>
                            <p style={{fontSize: "2.5vw"}}>{rand.name}</p>
                        </div>
                    </h1>
                </div>)}
            </Carousel>

        </Header>
        <Content>
           {/*<Row>*/}
           {/*    <Col span={18} offset={3}>*/}

                    <div style={{textAlign:"center",
                        backgroundImage: `url("https://ocdn.eu/pulscms-transforms/1/sWpktkqTURBXy9hZjc3ZjM4MjQwYjI5Y2Y5MDIxNzQ3M2ZkY2I1YjcwZi5qcGVnkZUCzQSwAMLD")`,
                        backgroundSize: "cover",
                        height: 800,
                        color: "#fff",
                        fontFamily: 'Roboto Slab',
                        fontWeight: "bolder",
                        padding: "100px"
                    }}>
                        <div style={{color: "#fff", fontSize: "2.5vw",fontFamily: "Roboto Slab", fontWeight:"bold"}}>Witam na stronie UniversityScanner</div>
                        <div style={{color: "#fff", fontSize: "2vw",fontFamily: "Roboto Slab", fontWeight:"bold"}}>Dzięki tej witrynie znajdziesz wymarzony kierunek studiów</div>
                    </div>


           {/*    </Col>*/}
           {/*</Row>*/}
        </Content>
    </>
}