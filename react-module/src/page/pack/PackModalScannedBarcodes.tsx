import React from "react";
import {Button, Modal, Spinner, Table} from "react-bootstrap";
import {t, withinGuard} from "../../misc/misc";
import {
    ForPack,
    PackExtendedDto,
    ScannedBarcodeVerification,
    ScannedBarcodeVerificationStatusEnum
} from "../../openapi/models";
import {packApi} from "../../api/exports";
import {PathPage} from "../../App";

export enum ForeignProductAction {
    ASSIGN = 'ASSIGN',
    REVOKE = 'REVOKE'
}

export const PackModalScannedBarcodes: React.FC<{
    showModal: boolean, handleClose: () => void,
    pack: PackExtendedDto | undefined,
    actionOnForeignProduct: (action: ForeignProductAction, foreignProduct: string) => void,
    assignAtomicProduct: (barcode: string) => void
}> = ({
          showModal,
          handleClose,
          pack,
          actionOnForeignProduct,
          assignAtomicProduct
      }) => {
    const [packBarcodeStatus, setPackBarcodeStatus] = React.useState<ScannedBarcodeVerification[]>();
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const downloadList = async () => {
        return withinGuard(setDownloadingData, async () => {
            if (pack && showModal) {
                const chosenProducts = pack.products.map((product: ForPack) => product.id);
                const response = await packApi.calculateStatusForProducts(pack.id, chosenProducts);
                const result = response.data;
                if (response.status === 200) {
                    setPackBarcodeStatus(result?.resource);
                }
            }
        })
    }

    React.useEffect(() => {
        downloadList();
    }, [showModal])

    const generateActionButtons = (scannedData: ScannedBarcodeVerification) => {
        switch (scannedData?.status) {
            case ScannedBarcodeVerificationStatusEnum.DOESNOTEXIST:
                const assign = !pack?.approvedForeignProducts?.includes(scannedData?.barcode)
                console.log()
                    return <Button size="sm"
                                   onClick={() => actionOnForeignProduct(assign ? ForeignProductAction.ASSIGN : ForeignProductAction.REVOKE, scannedData?.barcode)}>
                        {t(assign ? "Add to foreign" : "Remove from foreign")}
                    </Button>
            case ScannedBarcodeVerificationStatusEnum.CANBEASSIGNED:
                if (!pack?.products?.find((product: ForPack) => product.barcodeFromId === scannedData?.barcode)) {
                    return <Button size="sm"
                                   onClick={() => assignAtomicProduct(scannedData?.barcode)}>{t("Add")}</Button>
                }
                break;
            case ScannedBarcodeVerificationStatusEnum.ASSIGNEDTOANOTHERPACK:
                if (scannedData.assignedPackIfDiffersId) {
                    return <Button size="sm" onClick={() =>
                        window.open(`${PathPage.PACK_EDIT}/${scannedData.assignedPackIfDiffersId}`, "_blank")}>
                        {t("Open Pack")}</Button>
                }
        }
        return '';
    }

    return <Modal show={showModal} onHide={handleClose} backdrop="static" size="xl">
        <Modal.Header closeButton>
            <Modal.Title>{t("Scanned Barcodes")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {downloadingData ?
                <Spinner animation="border"/> :
                <>
                    <h1 className="d-print-none"> {t("Edit Scan")}</h1>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>{t("Barcode")}</th>
                            <th>{t("Status")}</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {packBarcodeStatus && packBarcodeStatus.map((scannedData, index) => <tr>
                            <td>{index + 1}</td>
                            <td>{scannedData?.barcode}</td>
                            <td>{t(scannedData?.status || "")}</td>
                            <td>{generateActionButtons(scannedData)}</td>
                        </tr>)}
                        </tbody>
                    </Table>
                </>}
        </Modal.Body>
    </Modal>
}
