import React from "react";
import {
    AtomicOperationExtendedDto, AtomicProductExtendedDto,
    DefaultInputProductData,
    FailableResourceAtomicOperationExtendedDto,
    FailableResourceDefaultInputProductData, FailableResourceVoid,
    LayerShapeBasicDto,
    ModelVoid,
    OperationTypeBasicDto
} from "../../openapi/models";
import {Fas, useAsyncOp, useAsyncOpFr, useRw} from "../../misc/misc";
import {atomicOperationApi, productionOrderApi} from "../../api/exports";
import {Button, Input, InputNumber, Modal, notification, Space} from "antd";
import {useTranslation} from "react-i18next";
import {SpinCentered} from "../../CommonComponent";
import {MlInputLabel} from "../atomicOperation/AtomicOperationCutAndAssignList";
import {OperationTypeSelect} from "../../misc/miscComponents";

export const AddInputProductModal: React.FC<{
    operationId: number, productionOrderId: number, layerShape: LayerShapeBasicDto,
    onDone: () => void, onClose: () => void
}> =
    ({operationId, productionOrderId, layerShape, onDone, onClose}) => {

        const [productName, setProductName] = React.useState<string>("");
        const [width, setWidth] = React.useState<number>(layerShape.rectangleShape.width);
        const [height, setHeight] = React.useState<number>(layerShape.rectangleShape.height);
        const [thickness, setThickness] = React.useState<number>(layerShape.thickness);

        const {execute, executing} = useAsyncOp<FailableResourceDefaultInputProductData>(
            () => atomicOperationApi.getDefaultInputProductDataForOperation(operationId),
            v => {
                if (v.success) {
                    const inputProductData: DefaultInputProductData = v.resource;

                    setProductName(inputProductData.name);
                    setWidth(inputProductData.dims.width);
                    setHeight(inputProductData.dims.height);
                    setThickness(inputProductData.dims.thickness);

                } else {
                    notification.error({
                        message: "Couldn't retrieve default name",
                        description: v.error
                    });
                }
            }
        );

        const {executing: saving, execute: save} = useAsyncOpFr(() => atomicOperationApi.addNewInputProduct({
            operationId,
            productionOrderId,
            productDefName: productName,
            dims: {
                width, height, thickness
            }
        }) as any, onDone);

        React.useEffect(() => {
            execute();
        }, []);

        React.useEffect(() => {
            setWidth(layerShape.rectangleShape.width);
            setHeight(layerShape.rectangleShape.height);
            setThickness(layerShape.thickness);
        }, [layerShape]);

        const {t} = useTranslation();

        return (
            <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Add Product")}</>} visible={true} onCancel={onClose} width={"40vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                {executing ? <SpinCentered/> :
                    <div>
                        <Space direction={"vertical"} style={{width: "100%"}}>
                            <div>
                                <MlInputLabel>{t("Name")}</MlInputLabel>
                                <Input value={productName} onChange={evt => setProductName(evt.target.value)} spellCheck={false}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Width")}</MlInputLabel>
                                <InputNumber<number> value={width} onChange={setWidth}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Height")}</MlInputLabel>
                                <InputNumber<number> value={height} onChange={setHeight} width={"100%"}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Thickness")}</MlInputLabel>
                                <InputNumber<number> value={thickness} onChange={setThickness}/>
                            </div>
                        </Space>

                        <Button type={"primary"} onClick={save} disabled={productName.trim() === ""} loading={saving} block style={{marginTop: "1em"}}>
                            <Fas icon={"plus"}/>&nbsp;{t("Add Product")}
                        </Button>
                    </div>
                }
            </Modal>
        )
    }

export const ModifyInputProductModal: React.FC<{
    product: AtomicProductExtendedDto,
    onDone: () => void, onClose: () => void
}> = ({product, onDone, onClose}) => {
        const layerShape = product.layerShape;

        const [productName, setProductName] = React.useState<string>(product.atomicProductDefinition.title);
        const [width, setWidth] = React.useState<number>(layerShape.rectangleShape.width);
        const [height, setHeight] = React.useState<number>(layerShape.rectangleShape.height);
        const [thickness, setThickness] = React.useState<number>(layerShape.thickness);

        const {executing: saving, execute: save} = useAsyncOpFr(() => atomicOperationApi.modifyInputProduct({
            productId: product.id,
            productDefName: productName,
            dims: {
                width, height, thickness
            }
        }) as any, onDone);

        React.useEffect(() => {
            setWidth(layerShape.rectangleShape.width);
            setHeight(layerShape.rectangleShape.height);
            setThickness(layerShape.thickness);
        }, [layerShape]);

        const {t} = useTranslation();

        return (
            <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Modify Product")}</>} visible={true} onCancel={onClose} width={"40vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <div>
                    <Space direction={"vertical"} style={{width: "100%"}}>
                        <div>
                            <MlInputLabel>{t("Name")}</MlInputLabel>
                            <Input value={productName} onChange={evt => setProductName(evt.target.value)} spellCheck={false}/>
                        </div>
                        <div>
                            <MlInputLabel>{t("Width")}</MlInputLabel>
                            <InputNumber<number> value={width} onChange={setWidth}/>
                        </div>
                        <div>
                            <MlInputLabel>{t("Height")}</MlInputLabel>
                            <InputNumber<number> value={height} onChange={setHeight} width={"100%"}/>
                        </div>
                        <div>
                            <MlInputLabel>{t("Thickness")}</MlInputLabel>
                            <InputNumber<number> value={thickness} onChange={setThickness}/>
                        </div>
                    </Space>

                    <Button type={"primary"} onClick={save} disabled={productName.trim() === ""} loading={saving} block style={{marginTop: "1em"}}>
                        <Fas icon={"plus"}/>&nbsp;{t("Modify Product")}
                    </Button>
                </div>
            </Modal>
        )
    }

export const AddOperationModal: React.FC<{ productId: number, productionOrderId: number, onDone: () => void, onClose: () => void }> =
    ({productId, productionOrderId, onDone, onClose}) => {
        const operationType = useRw<OperationTypeBasicDto | null>(null);
        const {res, executing, execute} = useAsyncOp<FailableResourceAtomicOperationExtendedDto>(
            async () => atomicOperationApi.addOperationWithEndProduct(operationType.v!.id, productId, productionOrderId),
            res => {
                onDone();
            }
        )
        const {t} = useTranslation();

        return (
            <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Add Operation")}</>} visible={true} onCancel={onClose} width={"40vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <OperationTypeSelect operationType={operationType}/>
                <Button block type={"primary"} style={{marginTop: "1em"}} disabled={operationType.v == null} loading={executing} onClick={execute}>
                    <Fas icon={"plus-circle"}/>&nbsp;{t("Add Operation")}
                </Button>
            </Modal>
        )
    }

export const ModifyOperationModal: React.FC<{ operation: AtomicOperationExtendedDto, onDone: () => void, onClose: () => void }> =
    ({operation, onDone, onClose}) => {

        const operationType = useRw<OperationTypeBasicDto | null>(null);
        const {res, executing, execute} = useAsyncOp<FailableResourceVoid>(
            async () => atomicOperationApi.changeOperationType(operation.id, operationType.v!.id),
            res => {
                onDone();
            }
        )
        const {t} = useTranslation();
        React.useEffect(() => {
            operationType.sv(operation.operationType);
        }, [operation]);

        return (
            <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Modify Operation")}</>} visible={true} onCancel={onClose} width={"40vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <OperationTypeSelect operationType={operationType}/>
                <Button block type={"primary"} style={{marginTop: "1em"}} disabled={operationType.v == null} loading={executing} onClick={execute}>
                    <Fas icon={"plus-circle"}/>&nbsp;{t("Modify Operation")}
                </Button>
            </Modal>
        )
    }

export const DeleteOperationModal: React.FC<{ operationId: number, onDone: () => void, onClose: () => void }> = ({operationId, onDone, onClose}) => {
    const {res, executing, execute} = useAsyncOpFr<ModelVoid>(
        // @ts-ignore
        async () => atomicOperationApi.deleteOperationsWithSubEntities(operationId),
        res => {
            onDone();
        }
    )
    const {t} = useTranslation();

    return (
        <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Delete Operation")}</>} visible={true} onCancel={onClose} width={"40vw"}
               okButtonProps={{hidden: false, loading: executing, title: "Usuń", danger: true}}
               okText={"Usuń"} cancelText={"Anuluj"}
               cancelButtonProps={{hidden: false}}
               onOk={execute}
        >
            Czy na pewno chcesz usunąć operacje wraz z wszystkimi operacjami pochodnymi ?
        </Modal>
    )
}
export const DeleteProductModal: React.FC<{ productId: number, onDone: () => void, onClose: () => void }> = ({productId, onDone, onClose}) => {
    const {res, executing, execute} = useAsyncOpFr<ModelVoid>(
        // @ts-ignore
        async () => productionOrderApi.deleteProductWithSubEntities(productId),
        res => {
            onDone();
        }
    )
    const {t} = useTranslation();

    return (
        <Modal title={<><Fas icon={"plus"}/>&nbsp;{t("Delete Product")}</>} visible={true} onCancel={onClose} width={"40vw"}
               okButtonProps={{hidden: false, loading: executing, title: "Usuń", danger: true}}
               okText={"Usuń"} cancelText={"Anuluj"}
               cancelButtonProps={{hidden: false}}
               onOk={execute}
        >
            Czy na pewno chcesz usunąć produkt wraz z pochodnymi obiektami ?
        </Modal>
    )
}
