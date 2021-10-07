import React from "react";
import {AtomicProductBasicDto, AtomicProductExtendedDto, PackExtendedDto} from "../../openapi/models";
import {Card, Col, Form, Row, Table} from "react-bootstrap";
import {ListItemProperty, t} from "../../misc/misc";
import {UniversalListArray} from "../UniversalListArray";
import {packPrimitiveKeys} from "./PackEdit";

const Barcode = require('react-barcode');

interface AtomicProductExtendedDtoWithIndex extends AtomicProductExtendedDto {
    index: number;
}

export const PackPrint: React.FC<{ pack: PackExtendedDto | undefined }> = ({pack}) => {
    const chunkProducts = (): AtomicProductExtendedDtoWithIndex[][][] => {
        let index;
        const packWithIndex = ((pack?.products || []) as AtomicProductExtendedDto[]).map((product, index) => {
            return {...product, index: index + 1}
        });
        let arrayLength = packWithIndex.length || 0;
        let tempArray = [];
        const chunkSize = 10;
        const columnsSize = 2;
        for (index = 0; index < arrayLength; index += chunkSize) {
            tempArray.push(packWithIndex.slice(index, index + chunkSize));
        }
        let chunkArrayLength = tempArray.length;
        let tempArraySplit = [];
        for (index = 0; index < chunkArrayLength; index += columnsSize) {
            tempArraySplit.push(index + 1 < chunkArrayLength ? [tempArray[index], tempArray[index + 1]] : [tempArray[index]])
        }
        return tempArraySplit;
    }
    const additionalHeader = <div className="container print-margin-top">
        <Row>
            <Col>
                <h4>Packing List</h4>
            </Col>
        </Row>
        <Row className="mb-3">
            <Col sm={4}>
                <Card border="light" className="h-100">
                    <Card.Header>{t("Barcode")}</Card.Header>
                    <Card.Text><Barcode value={pack?.barcodeFromId} width={2} height={50}/></Card.Text>
                </Card>
            </Col>
            <Col sm={4}>
                <Card border="light" className="h-100">
                    <Card.Header>{t("Amount")}</Card.Header>
                    <Card.Text>{pack?.products?.length}</Card.Text>
                </Card>
            </Col>
            <Col sm={4}>
                <Card border="light" className="h-100">
                    <Card.Header>{t("Inventory")}</Card.Header>
                    <Card.Text>{pack?.inventory?.title || pack?.inventoryString}</Card.Text>
                </Card>
            </Col>
            <Col sm={4}>
                <Card border="light" className="h-100">
                    <Card.Header>{t("contractor")}</Card.Header>
                    {pack?.contractor && <><Card.Text>{`${pack?.contractor?.name1 || ""}`}</Card.Text>
                        {pack?.contractor.nip && <Card.Text>NIP: {pack?.contractor.nip}</Card.Text>}
                        {pack?.contractor.personalIdNumber &&
                        <Card.Text>PESEL: {pack?.contractor.personalIdNumber}</Card.Text>}
                    </>}
                </Card>
            </Col>
            {packPrimitiveKeys.map(primitiveKey =>
                <Col sm={primitiveKey.key.toString() === "deliveryData" ? 12 : 4}>
                    <Card border="light" className="h-100">
                        <Card.Header>{t(primitiveKey.key.toString())}</Card.Header>
                        <Card.Text>{pack && pack[primitiveKey.key]}</Card.Text>
                    </Card>
                </Col>
            )}
        </Row>
    </div>;
    return <>
        {chunkProducts().map(productChunk => <>
            <Table size={"sm"} style={{tableLayout: 'fixed'}}>
                <thead>
                <th colSpan={2}>{additionalHeader}</th>
                </thead>
                <tbody>
                <tr>
                    {productChunk.map(singleProductChunk => {
                        return <td><UniversalListArray hideLpColumn={true}
                                                       hideAddButton={true} additionalHeader={additionalHeader}
                                                       properties={[
                                                           {
                                                               extractFunction: (object) => object.index,
                                                               label: t("Lp.")
                                                           },
                                                           {
                                                               extractFunction: (object) => <Barcode
                                                                   value={object.barcodeFromId}
                                                                   width={1} height={25}
                                                                   fontSize={17}/>,
                                                               label: t("Barcode")
                                                           },
                                                           {
                                                               extractFunction: (object) => {
                                                                   const rectangleShape = object.layerShape ? `${object.layerShape?.rectangleShape?.width} x ${object.layerShape?.rectangleShape?.height}` : ''
                                                                   return `Nazwa: ${object.atomicProductDefinition?.title} \n Wymiary: ${rectangleShape} \n Zamówienie: ${object.productionOrder?.erpOrder?.orderNumber && object.productionOrder?.erpOrder?.orderNumber}`
                                                               },
                                                               label: t("Parameters")
                                                           },

                                                       ] as ListItemProperty<AtomicProductExtendedDtoWithIndex>[]}
                                                       getObjectArray={singleProductChunk}/></td>
                    })}
                </tr>
                </tbody>

            </Table>
            <div className="print-page-break"/>
        </>)}
        {pack?.approvedForeignProducts && pack?.approvedForeignProducts.length > 0 &&
        <>
            {additionalHeader}
            <Row><Col><h5 className="text-center">{t("Foreign Products")}</h5></Col>

            </Row>
            <Row>
                {pack?.approvedForeignProducts.map((foreignProduct: string) => <Col sm={3}>
                    <Barcode
                        value={foreignProduct}
                        width={1} height={25}
                        fontSize={17}/>
                </Col>)}
            </Row> </>}
    </>
}
