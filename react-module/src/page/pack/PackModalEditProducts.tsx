import React from "react";
import {
    AtomicProductBasicDto,
    AtomicProductExtendedDto,
    PackExtendedDto,
    ProductionOrderBasicDto
} from "../../openapi/models";
import {Fas, ListItemProperty, t, withinGuard} from "../../misc/misc";
import {atomicProductApi, productionOrderApi} from "../../api/exports";
import {Badge, Button, Form, Modal, OverlayTrigger, Spinner, Tooltip} from "react-bootstrap";
import {UniversalListArray} from "../UniversalListArray";

export const PackModalEditProducts: React.FC<{
    showModal: boolean, handleClose: () => void, pack: PackExtendedDto | undefined,
    setDbAssignedProducts: (products: AtomicProductExtendedDto[]) => void
}> = ({
          showModal,
          handleClose,
          pack,
          setDbAssignedProducts
      }) => {
    const [products, setProducts] = React.useState<AtomicProductExtendedDto[]>([]);
    const [orders, setOrders] = React.useState<ProductionOrderBasicDto[]>([]);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const [chosenProducts, setChosenProducts] = React.useState<AtomicProductExtendedDto[]>([]);
    const [chosenProductionOrderId, setChosenProductionOrderId] = React.useState<number>();
    const chosenProductIds = chosenProducts.map(product => product.id);

    const downloadList = async (productionOrderId: number) => {
        return withinGuard(setDownloadingData, async () => {
            const response = await atomicProductApi.getAtomicProductsForProductionOrder(productionOrderId, pack?.id);
            const result = response.data;
            if (response.status === 200) {
                setProducts(result);
            }
        });
    }

    const downloadOrders = async () => {
        return withinGuard(setDownloadingData, async () => {
            const response = await productionOrderApi.getByContractor(pack?.contractor?.id);
            const result = response.data;
            if (response.status === 200) {
                setOrders(result);
            }
        })
    }

    React.useEffect(() => {
        pack && downloadOrders();
    }, [pack?.contractor]);

    React.useEffect(() => {
        setChosenProducts(pack?.products || []);
    }, [pack?.products]);

    return <Modal show={showModal} onHide={handleClose} backdrop="static" size="xl">
        <Modal.Header closeButton>
            <Modal.Title>{t("Product List Edit")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <h6>Lista Zleceń Produkcyjnych</h6>
            <h6> {`${t("contractor")}: ${pack?.contractor ? pack.contractor.name1 : "Brak"}`}</h6>
            <UniversalListArray
                hideAddButton={true} getChosenObjectId={chosenProductionOrderId} onRowClick={(object) => {
                !downloadingData && downloadList(object.id);
                !downloadingData && setChosenProductionOrderId(object.id);
            }}
                properties={[
                    {extractFunction: (object) => object.erpOrder?.orderNumber, label: t("erp order number")},
                    {extractFunction: (object) =>
                            object.erpOrder?.srcOrder?.order?.contractorData ?`${object.erpOrder?.srcOrder?.order?.contractorData?.name1} 
                            ${object.erpOrder?.srcOrder?.order?.contractorData?.postCode} ${object.erpOrder?.srcOrder?.order?.contractorData?.city} ${object.erpOrder?.srcOrder?.order?.contractorData?.street}` : "",
                        label: t("Contractor Data")},
                    {extractFunction: (object) => object.atomicProductDefinition?.title, label: t("Product Definition")},
                    {extractFunction: (object) => object.orderElementPosition, label: t("orderElementPosition")},
                    {
                        extractFunction: (object) => object.amount,
                        label: t("complete amount")
                    }] as ListItemProperty<ProductionOrderBasicDto>[]}
                getObjectArray={orders}/>
            <DivDivider/>
            <h6>Lista produktów z wybranego zlecenia</h6>
            {downloadingData ? <Spinner animation="border"/> : <UniversalListArray
                hideAddButton={true}
                properties={[
                    {
                        extractFunction: (object) => {
                            const isDeleteButton = chosenProductIds.includes(object.id);
                            return <Button size="sm" variant={isDeleteButton ? "danger" : "success"} onClick={() =>{
                                setChosenProducts(isDeleteButton ? chosenProducts.filter(product => product.id !== object.id) : Array.from(new Set(chosenProducts.concat(products.filter(product => product.id === object.id)))))

                            }}>
                                <Fas icon={isDeleteButton ? "trash-alt" : "plus"}/>
                            </Button>
                        }, label: ""
                    },
                    {
                        extractFunction: (object) => <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={<Tooltip id={`pack-modal-tooltip-l-${object.id}`}>
                                Id: {object.id} Uuid: {object.barcodeFromId}
                            </Tooltip>}>
                            <Badge variant="primary">Id/Uuid</Badge>
                        </OverlayTrigger>, label: "Id"
                    },
                    {
                        extractFunction: (object) => object.atomicProductDefinition?.title,
                        label: t("Product Definition")
                    },
                    {
                        extractFunction: (object) =>
                            object.layerShape ? `${object.layerShape?.rectangleShape?.width} x ${object.layerShape?.rectangleShape?.height}` : '',
                        label: t("Rectangle Shape")
                    },
                ] as ListItemProperty<AtomicProductExtendedDto>[]}
                getObjectArray={products}/>}
            <div style={{borderTop: "2px solid #fff ", marginLeft: 20, marginRight: 20}}/>
            <DivDivider/>
            <h6>Lista wybranych produktów</h6>
            <UniversalListArray
                hideAddButton={true}
                properties={[
                    {
                        extractFunction: (object) => <Button size="sm" variant="danger"
                                                             onClick={(e) => setChosenProducts(chosenProducts.filter(product => product.id !== object.id))}>
                            <Fas icon={"trash-alt"}/></Button>, label: ""
                    },
                    {
                        extractFunction: (object) => <OverlayTrigger
                            placement="top"
                            delay={{show: 250, hide: 400}}
                            overlay={<Tooltip id={`pack-modal-tooltip-l2-${object.id}`}>
                                Id: {object.id} Uuid: {object.barcodeFromId}
                            </Tooltip>}>
                            <Badge variant="primary">Id/Uuid</Badge>
                        </OverlayTrigger>, label: "Id"
                    },
                    {
                        extractFunction: (object) => object.atomicProductDefinition?.title,
                        label: t("Product Definition")
                    },
                    {
                        extractFunction: (object) =>
                            object.layerShape ? `${object.layerShape?.rectangleShape?.width} x ${object.layerShape?.rectangleShape?.height}` : '',
                        label: t("Rectangle Shape")
                    },
                ] as ListItemProperty<AtomicProductExtendedDto>[]}
                getObjectArray={chosenProducts}/>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>{t("Close")}</Button>
            <Button variant="primary" onClick={(e) => {
                setDbAssignedProducts(chosenProducts);
                handleClose();
            }}>{t("Confirm")}</Button>
        </Modal.Footer>
    </Modal>
}
const DivDivider = () => <>
    <div style={{borderTop: "2px solid #000 "}}/>
    <div className="mt-1" style={{borderTop: "2px solid #000 "}}/>
</>
