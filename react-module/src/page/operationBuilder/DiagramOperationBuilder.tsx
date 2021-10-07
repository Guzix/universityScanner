import {OperationBuilderProps} from "./OperationBuilderPage";
import {Fas, MiscUtils, MlConstants, useAsyncOp, useAsyncOpFr} from "../../misc/misc";
import {AtomicOperationExtendedDtoOperationResultEnum, ModelVoid, TreeNodeAtomicOperationExtendedDto} from "../../openapi/models";

import {atomicOperationApi} from "../../api/exports";
import React from "react";
import {OverlaySpinner, SpinCentered} from "../../CommonComponent";
import {Button, Card, Divider, notification, Tag} from "antd";
import {DagreEngine, DiagramEngine} from "@projectstorm/react-diagrams";
import {useTranslation} from "react-i18next";
import {CanvasWidget,} from "@projectstorm/react-canvas-core";
import {colorMap} from "./DiagramRenderer";
import {DiagramCtx} from "../../context/DiagramCtx";
import {createEngineFromTree, extractOperationDiagramData} from "./DiagramComponents";
import {
    AddInputProductModal,
    AddOperationModal,
    DeleteOperationModal,
    DeleteProductModal,
    ModifyInputProductModal,
    ModifyOperationModal
} from "./DiagramModals";

export const DiagramWithOpsRenderer: React.FC<{ tree: TreeNodeAtomicOperationExtendedDto }> = ({tree}) => {
    const [engine, setEngine] = React.useState<DiagramEngine | null>(null);
    const [rootId, setRootId] = React.useState<number | null>(null);

    React.useEffect(() => {
        const newRootId = tree.node.outputProducts[0].id;
        const newEngine = createEngineFromTree(tree, engine, newRootId != rootId);

        setRootId(newRootId)
        /*  operations with engine */
        setEngine(newEngine)
    }, [tree])

    const zoom = (multiplier: number) => {
        if (!engine) {
            return;
        }
        const model = engine.getModel();

        model.setZoomLevel(model.getZoomLevel() * multiplier)
        engine.repaintCanvas();
    }

    const redistribute = () => {
        if (!engine) {
            return;
        }

        const model = engine.getModel();
        const margin = 0;
        const dagreEngine = new DagreEngine({
            graph: {
                rankdir: 'LR',
                ranker: 'longest-path',
                marginx: margin,
                marginy: margin,
            },
            includeLinks: false
        });
        dagreEngine.redistribute(model);
        engine.repaintCanvas();
    }

    const {executing, execute: saveDiagramData} = useAsyncOpFr<ModelVoid>(
        // @ts-ignore
        () => atomicOperationApi.setOperationDiagramData(extractOperationDiagramData(engine), tree.node.outputProducts[0].id),
        () => {
            notification.success({message: "Zapisano Poprawnie"});
        }
    );

    const {t} = useTranslation();

    return (
        <Card title={
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <Fas icon={"project-diagram"}/>&nbsp;Diagram Operacji dla Produktu
                </div>
                <div>
                    <Button size={"small"} onClick={redistribute}><Fas icon={"broom"}/></Button>
                    &nbsp;
                    <Button size={"small"} onClick={() => zoom(1.1)}><Fas icon={"search-plus"}/></Button>
                    &nbsp;
                    <Button size={"small"} onClick={() => zoom(0.9)}><Fas icon={"search-minus"}/></Button>
                    &nbsp;
                    <Button size={"small"} onClick={saveDiagramData} title={"Zapisz Dane Diagramu"} type={"primary"} loading={executing}>
                        <Fas icon={"save"}/>
                    </Button>
                </div>
            </div>}
              size={"small"} style={{marginBottom: "10em"}}>
            <div className={"graph-container"}>
                {engine && <CanvasWidget engine={engine as any} className={"diagram-test"}/>}
            </div>
            <Divider><Fas icon={"flag"}/>&nbsp;{t("Legend")} </Divider>
            <div>
                {Object.values(AtomicOperationExtendedDtoOperationResultEnum).map(ao =>
                    <Tag color={colorMap[ao as AtomicOperationExtendedDtoOperationResultEnum]}>
                        {t(`OperationResult.${MiscUtils.enumToPrettyStr(ao)}`)}
                    </Tag>
                )}
            </div>
        </Card>
    )
}


const getDepthMap = (operations: TreeNodeAtomicOperationExtendedDto, depth: number): Record<number, number> => {
    let result = {[operations.node.id]: depth};
    operations.subNodes.map((sn: TreeNodeAtomicOperationExtendedDto) => getDepthMap(sn, depth + 1))
        .forEach((dp: any) => result = {...result, ...dp});
    return result;
}

export const withNullify = async (f: (v: null) => void, post: () => Promise<void>) => {
    f(null);
    await post();
}

const BlockPageScroll: React.FC<{}> = ({ children }) => {
    const scrollRef = React.useRef(null)
    React.useEffect(() => {
        const scrollEl = scrollRef.current
        // @ts-ignore
        scrollEl.addEventListener('wheel', stopScroll)
        // @ts-ignore
        return () => scrollEl.removeEventListener('wheel', stopScroll)
    }, [])
    const stopScroll = (e:any) => e.preventDefault()
    return (
        <div ref={scrollRef}>
            {children}
        </div>
    )
}


export const DiagramOperationBuilder: React.FC<OperationBuilderProps> = ({productionOrderId, selectedProductId, layerShape}) => {
    const {res: operations, executing: loading, execute: getInitData} =
        useAsyncOp<TreeNodeAtomicOperationExtendedDto>(() => atomicOperationApi.getOpSetForProduct(selectedProductId));

    React.useEffect(() => {
        getInitData();
    }, [selectedProductId]);

    const {
        operationIdForInputProductCreate, operationIdForDeletion,
        productIdForOperationCreate, productIdForDeletion,
        operationToModify, productToModify
    } = React.useContext(DiagramCtx)!;
    const [productIdForOperation, setProductIdForOperation] = React.useState<number | null>(null);

    const createEndOperation = async () => {
        setProductIdForOperation(selectedProductId);
    }

    React.useEffect(() => {
        if (MlConstants.isDev && false) {
            setProductIdForOperation(selectedProductId)
        }
    }, []);

    return (
        <>
            {operations == null ? <SpinCentered/> :
                <BlockPageScroll>
                    {loading && <OverlaySpinner/>}
                    {operations ?
                        <DiagramWithOpsRenderer tree={operations}/> :
                        <Button block type={"primary"} onClick={createEndOperation}>
                            <Fas icon={"plus-circle"}/>&nbsp;Utwórz Operacje Końcową
                        </Button>
                    }
                    {productIdForOperation != null &&
                    <AddOperationModal productId={productIdForOperation} productionOrderId={productionOrderId}
                                       onDone={() => withNullify(setProductIdForOperation, getInitData)}
                                       onClose={() => setProductIdForOperation(null)}/>
                    }
                    {productIdForOperationCreate.v != null &&
                    <AddOperationModal productId={productIdForOperationCreate.v} productionOrderId={productionOrderId}
                                       onDone={() => withNullify(productIdForOperationCreate.sv, getInitData)}
                                       onClose={() => productIdForOperationCreate.sv(null)}/>
                    }
                    {operationIdForInputProductCreate.v != null &&
                    <AddInputProductModal operationId={operationIdForInputProductCreate.v} productionOrderId={productionOrderId}
                                          layerShape={layerShape}
                                          onDone={() => withNullify(operationIdForInputProductCreate.sv, getInitData)}
                                          onClose={() => operationIdForInputProductCreate.sv(null)}/>
                    }
                    {operationIdForDeletion.v != null &&
                    <DeleteOperationModal operationId={operationIdForDeletion.v}
                                          onDone={() => withNullify(operationIdForDeletion.sv, getInitData)}
                                          onClose={() => operationIdForDeletion.sv(null)}/>
                    }
                    {productIdForDeletion.v != null &&
                    <DeleteProductModal productId={productIdForDeletion.v}
                                        onDone={() => withNullify(productIdForDeletion.sv, getInitData)}
                                        onClose={() => productIdForDeletion.sv(null)}/>
                    }
                    {productToModify.v != null &&
                    <ModifyInputProductModal product={productToModify.v}
                                             onDone={() => withNullify(productToModify.sv, getInitData)}
                                             onClose={() => productToModify.sv(null)}/>
                    }
                    {operationToModify.v != null &&
                    <ModifyOperationModal operation={operationToModify.v}
                                        onDone={() => withNullify(operationToModify.sv, getInitData)}
                                        onClose={() => operationToModify.sv(null)}/>
                    }
                </BlockPageScroll>
            }
        </>
    )
}

