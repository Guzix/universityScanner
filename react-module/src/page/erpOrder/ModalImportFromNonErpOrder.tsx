import React from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {ListItemProperty, processRawResWithLoader, t} from "../../misc/misc";
import {
    AtomicOperationBasicDto,
    NonErpOrderBasicDto,
    ProductionOrderBasicDto
} from "../../openapi/models";
import {UniversalListArray} from "../UniversalListArray";
import {nonErpOrderApi, productionOrderApi} from "../../api/exports";
import {ModalNonErpOrderData} from "./ErpOrderView";

export const ModalImportFromNonErpOrder: React.FC<{ modalNonErpOrderData: ModalNonErpOrderData, handleClose: () => void, reloadLocalErpOrder: () => void }> =
    ({
         modalNonErpOrderData,
         handleClose, reloadLocalErpOrder
     }) => {
        const [nonErpOrders, setNonErpOrders] = React.useState<NonErpOrderBasicDto[]>([]);
        const [downloading, setDownloading] = React.useState<boolean>(false);
        const [selectedNonErpOrderId, setSelectedNonErpOrderId] = React.useState<number | undefined>();
        const [productionOrders, setProductionOrder] = React.useState<ProductionOrderBasicDto[]>([]);
        const [selectedProductionOrderId, setSelectedProductionOrderId] = React.useState<number | undefined>();

        React.useEffect(() => {
            setSelectedNonErpOrderId(undefined);
            setSelectedProductionOrderId(undefined);
            setProductionOrder([]);
        }, [modalNonErpOrderData])
        const downloadList = async () => {
            await processRawResWithLoader<AtomicOperationBasicDto[]>(setDownloading,
                () => nonErpOrderApi.noErOrGetObjectList(),
                async (result) => {
                    setNonErpOrders(result);
                })
        }
        const downloadListProductionOrders = async (nonErpOrderId: number) => {
            await processRawResWithLoader<ProductionOrderBasicDto[]>(setDownloading,
                () => productionOrderApi.getNonAssignedForNonErpOrder(nonErpOrderId),
                async (result) => {
                    setProductionOrder(result);
                })
        }
        const uploadChanges = async () => {
            await processRawResWithLoader<String>(setDownloading,
                () => productionOrderApi.assignLocalErpOrder(selectedProductionOrderId || 0,
                    modalNonErpOrderData.localErpOrderId || 0, modalNonErpOrderData.position || 0),
                async () => {
                }).then(() => {
                reloadLocalErpOrder();
                handleClose();
            })
        }

        React.useEffect(() => {
            downloadList();
        }, []);
        return <Modal show={modalNonErpOrderData.show} onHide={handleClose} animation={false}>
            <Modal.Header closeButton>
                <Modal.Title>{t("Import from Non-Erp Order")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {downloading && <Spinner animation="border"/>}
                <h6>{t("Non-ERP Orders")}</h6>
                <UniversalListArray hideLpColumn={true}
                                    onRowClick={obj => {
                                        setSelectedNonErpOrderId(obj.id);
                                        downloadListProductionOrders(obj.id);
                                    }} getChosenObjectId={selectedNonErpOrderId}
                                    hideAddButton={true} properties={[
                    {extractFunction: (object) => object.id, label: "Id"},
                    {extractFunction: (object) => object.orderNumber, label: t("orderNumber")},
                    {extractFunction: (object) => object.contractorAddress, label: t("contractorAddress")},
                    {extractFunction: (object) => object.contractorName, label: t("contractorName")},
                ] as ListItemProperty<NonErpOrderBasicDto>[]} getObjectArray={nonErpOrders}/>
                <h6>{t("Created Production Orders")}</h6>
                <UniversalListArray hideLpColumn={true}
                                    onRowClick={obj => {
                                        setSelectedProductionOrderId(obj.id);
                                    }} getChosenObjectId={selectedProductionOrderId}
                                    hideAddButton={true} properties={[
                    {extractFunction: (object) => object.id, label: "Id"},
                    {
                        extractFunction: (object) => object.atomicProductDefinition?.title,
                        label: t("Product Definitions")
                    },
                    {extractFunction: (object) => object?.amount, label: t("amount")},
                ] as ListItemProperty<ProductionOrderBasicDto>[]} getObjectArray={productionOrders}/>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t("Close")}</Button>
                <Button variant="primary" onClick={uploadChanges}
                        disabled={!selectedNonErpOrderId || !selectedProductionOrderId}>
                    {t("Save Changes")}
                </Button>
            </Modal.Footer>
        </Modal>
    }
