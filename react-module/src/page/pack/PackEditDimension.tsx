import React from "react";
import {PackDimension} from "../../openapi/models";
import {UniversalInput, UniversalInputType} from "../UniversalEdit";
import {Col, Row} from "react-bootstrap";

export const PackEditDimension: React.FC<{ packDimension: PackDimension | undefined, setPackDimension: (packDimension: PackDimension) => void }> = ({
                                                                                                                                                        packDimension,
                                                                                                                                                        setPackDimension
                                                                                                                                                    }) => {
    return <div className="p-2 mt-1" style={{border: '1px solid lightgrey', borderRadius: '1rem'}}>
        <Row>
            <Col sm={4}>
                <UniversalInput key={"width"} formLabelColSize={3}
                                fieldName={"width"} object={packDimension || {} as PackDimension}
                                setObject={setPackDimension} valueType={UniversalInputType.NUMBER}/></Col>

            <Col sm={4}><UniversalInput key={"height"} formLabelColSize={3}
                                        fieldName={"height"} object={packDimension || {} as PackDimension}
                                        setObject={setPackDimension} valueType={UniversalInputType.NUMBER}/></Col>
            <Col sm={4}>
                <UniversalInput key={"length"} formLabelColSize={3}
                                fieldName={"length"} object={packDimension || {} as PackDimension}
                                setObject={setPackDimension} valueType={UniversalInputType.NUMBER}/>
            </Col>
        </Row>
    </div>
}
