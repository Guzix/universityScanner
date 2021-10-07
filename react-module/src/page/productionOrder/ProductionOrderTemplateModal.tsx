import React, {useState} from "react";
import {Form, Modal, Table} from "react-bootstrap";
import {UniversalEdit} from "../UniversalEdit";
import {atomicProductTemplateApi} from "../../api/exports";
import {PathPage} from "../../App";
import {
    AtomicProductTemplateDto
} from "../../openapi/models";


export const ProductionOrderTemplateModal: React.FC<{
    showModal: boolean,
    setShowModal: () => void
}> = ({showModal, setShowModal}) => {
    const [isHide, setIsHide] = useState<boolean>(true);
    const [isHide1, setIsHide1] = useState<boolean>(true);
    const [isHide2, setIsHide2] = useState<boolean>(true);
    const [isHide3, setIsHide3] = useState<boolean>(true);
    return <Modal show={showModal} onHide={setShowModal} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Szablony zamówień</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <UniversalEdit getObjectViaApi={atomicProductTemplateApi.atPrTeGetObject}
                               save={atomicProductTemplateApi.atPrTeSaveObject as any}
                               formElements={(object: AtomicProductTemplateDto | undefined, setObject: (object: AtomicProductTemplateDto) => void) => <>
                                   {/*<UniversalSingleSelect fieldText={"Templates"} getObjectsViaApi={atomicProductTemplateApi.atPrTeGetObjectList}*/}
                                   {/*                       getValue={(object: AtomicProductTemplateDto) => `${object?.title}`}*/}
                                   {/*                       defaultValue={object?.title}*/}
                                   {/*                       updateObject={(selectObject: AtomicProductTemplateDto) => setObject({...object, title: selectObject})}/>*/}
                                   <Form.Label>Szablony</Form.Label>
                                   <Form.Control type="text" as="select" onChange={(a) => {
                                       if(a.currentTarget?.value === "Brak") {
                                           setIsHide(false);
                                           setIsHide1(true);
                                           setIsHide2(true);
                                           setIsHide3(true);
                                       } else if(a.currentTarget?.value === "1") {
                                           setIsHide(true);
                                           setIsHide1(false);
                                           setIsHide2(true);
                                           setIsHide3(true);
                                       } else if(a.currentTarget?.value === "2") {
                                           setIsHide(true);
                                           setIsHide1(true);
                                           setIsHide2(false);
                                           setIsHide3(true);
                                       } else if(a.currentTarget?.value === "3") {
                                           setIsHide(true);
                                           setIsHide1(true);
                                           setIsHide2(true);
                                           setIsHide3(false);
                                       }
                                   }}>
                                       <option>Brak</option>
                                       <option value="1">Szablon 1</option>
                                       <option value="2">Szablon szkła Polska</option>
                                       <option value="3">Szablon szkła Włochy</option>
                                   </Form.Control>
                                   <p>Lista operacji:</p>
                                   <MockupParametersArray4 isHide={isHide}/>
                                   <MockupParametersArray1 isHide={isHide1}/>
                                    <MockupParametersArray2 isHide={isHide2}/>
                                    <MockupParametersArray3 isHide={isHide3}/>

                               </>} primitiveKeys={[]}
                               onSubmitString={PathPage.PRODUCTION_ORDER_EDIT + "/new"}/>
            </Modal.Body>
        </Modal>
}

export const MockupParametersArray1: React.FC<{
    isHide: boolean,
}> = ({isHide}) => {

    return <>
        <Table bordered striped hover hidden={isHide}>
            <thead>
            <tr>
                <th>LP.</th>
                <th>Id</th>
                <th>Typ</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>1</td>
                <td>Cięcie</td>
            </tr>
            <tr>
                <td>2</td>
                <td>4</td>
                <td>Hartowanie</td>
            </tr>
            <tr>
                <td>3</td>
                <td>6</td>
                <td>Zespolenie</td>
            </tr>
            <tr>
                <td>4</td>
                <td>1</td>
                <td>Cięcie</td>
            </tr>
            <tr>
                <td>5</td>
                <td>3</td>
                <td>Pakowanie</td>
            </tr>
            </tbody>
        </Table>
    </>
}

export const MockupParametersArray2: React.FC<{
    isHide: boolean,
}> = ({isHide}) => {

    return <>
        <Table bordered striped hover hidden={isHide}>
            <thead>
            <tr>
                <th>LP.</th>
                <th>Id</th>
                <th>Typ</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>1</td>
                <td>Cięcie</td>
            </tr>
            <tr>
                <td>2</td>
                <td>3</td>
                <td>Pakowanie</td>
            </tr>
            </tbody>
        </Table>
    </>
}

export const MockupParametersArray3: React.FC<{
    isHide: boolean,
}> = ({isHide}) => {

    return <>
        <Table bordered striped hover hidden={isHide}>
            <thead>
            <tr>
                <th>LP.</th>
                <th>Id</th>
                <th>Typ</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>1</td>
                <td>1</td>
                <td>Cięcie</td>
            </tr>
            <tr>
                <td>2</td>
                <td>6</td>
                <td>Zespolenie</td>
            </tr>
            <tr>
                <td>3</td>
                <td>1</td>
                <td>Cięcie</td>
            </tr>
            <tr>
                <td>4</td>
                <td>3</td>
                <td>Pakowanie</td>
            </tr>
            </tbody>
        </Table>
    </>
}

export const MockupParametersArray4: React.FC<{
    isHide: boolean,
}> = ({isHide}) => {

    return <>
        <Table bordered striped hover hidden={isHide}>
            <thead>
            <tr>
                <th>LP.</th>
                <th>Id</th>
                <th>Typ</th>
            </tr>
            </thead>
        </Table>
    </>
}
