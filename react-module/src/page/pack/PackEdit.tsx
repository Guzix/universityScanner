import React, {FormEvent} from "react";
import {
    UniversalInput,
    UniversalInputType, UniversalSingleSelect
} from "../UniversalEdit";
import {
    AtomicProductExtendedDto, ContractorDto, FailableResourcePackExtendedDtoStatusEnum, ForPack, PackExtendedDto
} from "../../openapi/models";
import {
    atomicProductApi,
    contractorApi,
    packApi,
} from "../../api/exports";
import {PathPage} from "../../App";
import {useHistory, useParams} from "react-router-dom";
import {Fas, ListItemProperty, PrimitiveKeyWithHtmlType, t, withinGuard} from "../../misc/misc";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {UniversalListArray} from "../UniversalListArray";
import {PackPrint} from "./PackPrint";
import {PackModalEditProducts} from "./PackModalEditProducts";
import {PackProgress} from "./PackProgress";
import {PackInventorySelect} from "./PackInventorySelect";
import {notification} from "antd";
import {ForeignProductAction, PackModalScannedBarcodes} from "./PackModalScannedBarcodes";
import {PackEditDimension} from "./PackEditDimension";
import {PackTableForeignProducts} from "./PackTableForeignProducts";

export const packPrimitiveKeys = [
    {key: "weightNet", htmlValueType: UniversalInputType.NUMBER},
    {key: "weightGross", htmlValueType: UniversalInputType.NUMBER},
    {key: "deliveryData", htmlValueType: UniversalInputType.TEXT},
] as PrimitiveKeyWithHtmlType<PackExtendedDto> []
const Barcode = require('react-barcode');


export const PackEdit: React.FC<{}> = () => {
    const history = useHistory();
    const [object, setObject] = React.useState<PackExtendedDto>({});
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const {id}: { id: string | undefined } = useParams();
    const [isEditPage] = React.useState<boolean>(!isNaN(Number(id)));
    const [showModalEditProducts, setShowModalEditProducts] = React.useState<boolean>(false);
    const [showModalScannedBarcodes, setShowModalScannedBarcodes] = React.useState<boolean>(false);
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await packApi.packGetObject(Number(id));
            const result = response.data;
            if (response.status === 200) {
                setObject(result);
            }
        })
    }

    const checkScannedBarcodes = () => {
        const chosenProductsUuids: string[] = object?.products?.map((product: ForPack) => product.barcodeFromId) || [];
        const scannedUuids: string[] = object?.scannedBarcodes || [];
        return scannedUuids.reduce((a, b) => {
            return a && chosenProductsUuids.includes(b)
        }, true);

    }
    const checkedScannerBarcodesValue = checkScannedBarcodes();

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (object) {
            await withinGuard(setDownloadingData, async () => {
                const response = await packApi.packSaveObject(object);
                if (response.status === 200 && response.data.status === FailableResourcePackExtendedDtoStatusEnum.OK) {
                    history.push(PathPage.PACK_LIST);
                } else {
                    notification.open({
                        message: t('Error'),
                        description:
                            t('Error writing changes. Contact administrator.'),
                    });
                }
            })
        } else {
            alert("Exception while sending data");
        }
    }

    React.useEffect(() => {
        if (isEditPage) {
            downloadList();
        }
    }, []);

    const handleClose = () => setShowModalEditProducts(false);
    const handleShow = () => setShowModalEditProducts(true);
    const assignAtomicProduct = async (barcode: string) => {
        const response = await atomicProductApi.getByBarcodeForPack(barcode);
        if (response.status === 200 && response.data) {
            setObject({
                ...object, products: object.products ? [...object.products, response.data] : [response.data]
            })
        }
    }

    return <div className="container-fluid">
        <div className="print-visible">
            <PackPrint pack={object || {}}/>
        </div>
        {downloadingData ? <Spinner animation="border"/> :
            <div className="print-invisible">
                <h1 className="d-print-none">{t("Edit Packing List")}</h1>
                <Form onSubmit={handleOnSubmit}>
                    <div className="container">
                        <Row>
                            <Col sm={2} style={{display: "flex", alignItems: "center"}}>
                                <Form.Label>{t("Barcode")}</Form.Label>
                            </Col>
                            <Col>
                                <Barcode value={object?.barcodeFromId} width={1.8} height={50}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2} style={{display: "flex", alignItems: "center"}}>
                                <Form.Label>{t("Amount")}</Form.Label>
                            </Col>
                            <Col>
                                <p>{object?.products?.length}</p>
                            </Col>
                        </Row>
                        {packPrimitiveKeys.map(primitiveKey =>
                            <UniversalInput key={primitiveKey.key.toString()}
                                            disabled={primitiveKey.disabled}
                                            fieldName={primitiveKey.key} object={object || {} as PackExtendedDto}
                                            setObject={setObject} valueType={primitiveKey.htmlValueType}/>)}
                        <UniversalSingleSelect fieldText={"contractor"}
                                               getObjectsViaApi={contractorApi.contractorGetObjectList}
                                               getItemLabel={(objectContractor: ContractorDto) => objectContractor?.name1}
                                               defaultValue={object?.contractor}
                                               updateObject={(selectedObject: ContractorDto) => setObject({
                                                   ...object,
                                                   contractor: selectedObject
                                               })}
                        />
                        <PackInventorySelect object={object} setObject={setObject}/>
                        <PackEditDimension packDimension={object?.dimension} setPackDimension={(dimension) => {
                            setObject({...object, dimension})
                        }}/>
                        {object?.packStatus && <Row>
                            <PackProgress packStatus={object?.packStatus}
                                          setPackStatus={(packStatus) => setObject({...object, packStatus})}/>
                        </Row>}
                    </div>
                    <div className="d-print-none">
                        <Button className="mr-4" onClick={() => history.goBack()}><Fas
                            icon="arrow-alt-circle-left"/></Button>
                        <Button className="mr-4" type="submit">
                            {t("Save")} <Fas icon="save"/>
                        </Button>
                        <Button className="mr-2" onClick={handleShow}>{t("Edit List")} <Fas
                            icon="edit"/></Button>
                        {object?.scannedBarcodes && <Button variant={checkedScannerBarcodesValue ? "success" : "danger"}
                                                            className="mr-2"
                                                            onClick={() => setShowModalScannedBarcodes(true)}>
                            {t("Edit Scanned")} <Fas
                            icon={checkedScannerBarcodesValue ? "check" : "edit"}/> </Button>}
                        <Button variant="primary" onClick={() => {
                            window.print()
                        }}>{t("Print")} <Fas icon="print"/>
                        </Button>
                    </div>

                </Form>

                <Row>
                    <Col>
                        <UniversalListArray
                            hideAddButton={true}
                            properties={[
                                {
                                    extractFunction: (object) => <>
                                        <Barcode value={object.barcodeFromId} width={0.7} height={25}
                                                 fontSize={15}/>
                                        {/*{object.barcodeEndProduct &&*/}
                                        {/*<Barcode value={object.barcodeEndProduct} width={0.7} height={25}*/}
                                        {/*         fontSize={15}/>}*/}
                                    </>, label: t("Barcode")
                                },
                                {
                                    extractFunction: (object) => {
                                        const rectangleShape = object.layerShape ? `${object.layerShape?.rectangleShape?.width} x ${object.layerShape?.rectangleShape?.height}` : ''
                                        return `Nazwa: ${object.atomicProductDefinition?.title} \n Wymiary: ${rectangleShape} \n Zamówienie: ${object.productionOrder?.erpOrder?.orderNumber && object.productionOrder?.erpOrder?.orderNumber}`
                                    },
                                    label: t("Parameters")
                                },

                            ] as ListItemProperty<ForPack>[]}
                            getObjectArray={object?.products}/>

                    </Col>
                    <Col>
                        <PackTableForeignProducts approvedForeignProducts={object?.approvedForeignProducts}/>
                        <div className="d-print-none">
                            <PackModalEditProducts handleClose={handleClose} showModal={showModalEditProducts}
                                                   pack={object}
                                                   setDbAssignedProducts={(chosenProducts) => setObject({
                                                       ...object,
                                                       products: chosenProducts
                                                   })}/>
                            <PackModalScannedBarcodes handleClose={() => setShowModalScannedBarcodes(false)}
                                                      showModal={showModalScannedBarcodes}
                                                      pack={object} actionOnForeignProduct={
                                ((action, foreignProduct) => {
                                    switch (action) {
                                        case ForeignProductAction.ASSIGN: {
                                            setObject(
                                                {
                                                    ...object,
                                                    approvedForeignProducts: [...(object?.approvedForeignProducts || []), foreignProduct]
                                                })
                                            break;
                                        }

                                        case ForeignProductAction.REVOKE: {

                                            setObject(
                                                {
                                                    ...object,
                                                    approvedForeignProducts: ((object?.approvedForeignProducts || []) as string[])
                                                        .filter(assignedForeignProduct => assignedForeignProduct !== foreignProduct)
                                                })
                                            break;
                                        }
                                    }
                                })} assignAtomicProduct={assignAtomicProduct}/>
                        </div>
                    </Col>
                </Row>

            </div>}
    </div>
}

