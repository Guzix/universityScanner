import React from "react";
import {
    AtomicOperationExtendedDto,
    AtomicOperationExtendedDtoOperationResultEnum,
    AtomicProductDefinitionBasicDto,
    AtomicProductExtendedDto,
    LayerShapeBasicDto,
    PossibleOperationPathToCopyFrom,
    TreeNodeAtomicOperationExtendedDto
} from "../../openapi/models";

import {Fas, processFr, useAsyncOp, withinGuard} from "../../misc/misc";
import {atomicOperationApi, atomicProductApi, atomicProductDefinitionApi} from "../../api/exports";
import flatMap from "lodash/flatMap";
import {UniversalSingleSelect} from "../UniversalEdit";
import find from "lodash/find";
import fromPairs from "lodash/fromPairs";
import toPairs from "lodash/toPairs";
import max from "lodash/maxBy";
import {Badge, Button, Table} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import {InlineProductAdder, OverlaySpinner, SpinCentered} from "../../CommonComponent";
import {Alert, Badge as AntBadge, Button as AntButton, Card, Col, Divider, Empty, Modal, notification, Row, Select} from "antd";
import {DiagramRenderer} from "./DiagramRenderer";
import {OperationTypeSelect} from "../../misc/miscComponents";

export const AddProductDialog : React.FC<{opened: boolean, close: () => void, onAddedProduct: (prd: AtomicProductExtendedDto) => void}> = ({opened, close, onAddedProduct}) => {
    const [object, setObject] = React.useState<AtomicProductExtendedDto>({

    });

    const [saving, setSaving] = React.useState<boolean>(false);
    const {t} = useTranslation();

    const addProduct = async () => {
        await withinGuard(setSaving, async () => {
            const response = await atomicProductApi.atPrSaveObject(object);
            if(response.status == 200) {
                if(!response.data.success) {
                    notification.error({
                        message: "Failed to save object",
                        description: response.data.error
                    })
                } else {
                    // response.data.resource
                    onAddedProduct(response.data.resource);
                }
            } else {
                notification.error({
                    message: "Unhandled server error",
                    description: response.data
                });
            }
        });
    }

    return (
        <div>
            <Modal visible={opened} onCancel={close} title={<><Fas icon={"plus"}/>&nbsp; {t("Add Product")}</>} width={"60vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                {saving && <OverlaySpinner/>}
                <UniversalSingleSelect fieldText={"Type"} getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                       getItemLabel={(objectMachine: AtomicProductDefinitionBasicDto) => objectMachine?.title}
                                       defaultValue={object?.atomicProductDefinition}
                                       updateObject={(selectedObject: AtomicProductDefinitionBasicDto ) => setObject({...object, atomicProductDefinition: selectedObject })}
                />
                <Button block size={"sm"} disabled={object.atomicProductDefinition == null} onClick={addProduct}>
                    <Fas icon={"plus"}/> {t("Add")}
                </Button>
            </Modal>
        </div>
    )
}

enum AddProductDialogType {
    INPUT, OUTPUT
}

export const AtomicProductList: React.FC<{products: AtomicProductExtendedDto[], label: React.ReactNode, lockedProductIds: number[], onDelete: (productId: number) => void}> =
    ({products, label, lockedProductIds, onDelete}) => {

    const {t} = useTranslation();
    return (
        <>
            <Divider orientation={"left"}>{label} [{products.length}]</Divider>
            <Table striped bordered size={"sm"} >
                <thead>
                <tr>
                    {/*<th>Id</th>*/}
                    <th>{t("Product Definition")}</th>
                    <th style={{width: "5%"}}>Op</th>
                </tr>
                </thead>
                <tbody>
                {products.map((prd: AtomicProductExtendedDto) =>
                    <tr key={prd.id}>
                        {/*<td>{prd.id}</td>*/}
                        <td>{prd.atomicProductDefinition?.title}</td>
                        <td>
                            {lockedProductIds.includes(prd.id) ?
                                <AntButton type={"text"} disabled size={"small"}><Fas icon={"lock"}/></AntButton> :
                                <AntButton onClick={() => onDelete(prd.id)} size={"small"} type={"text"} title={"Delete"}>
                                    <Fas icon={"times-circle"} color={"red"}/>
                                </AntButton>
                            }
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </>
    )
}

type AddOperationDialogProps = {
    endProduct:AtomicProductExtendedDto;
    opened: boolean;
    close: () => void;
    onAdded: () => void;
    layerShape: LayerShapeBasicDto | null;
    productionOrderId: number;
}

export const AddOperationDialog : React.FC<AddOperationDialogProps> =
    ({endProduct, opened, close, onAdded, layerShape, productionOrderId}) => {

        const initObject: AtomicOperationExtendedDto = {
        productionOrder: {
            id: productionOrderId
        },
        inputProducts: [],
        outputProducts: [endProduct],
        operationResult: AtomicOperationExtendedDtoOperationResultEnum.NOTASSIGNED
    };

    const [object, setObject] = React.useState<AtomicOperationExtendedDto>(initObject);
    const [saving, setSaving] = React.useState<boolean>(false);

    const handleAddedProduct = (prd: AtomicProductExtendedDto, addProductDialogType: AddProductDialogType) => {
        if(addProductDialogType == null) {
            return;
        }
        // TODO(jbi): Type-safety I'm sure it's possible
        const fieldName  = addProductDialogType === AddProductDialogType.INPUT ? "inputProducts" : "outputProducts";
        setObject({
           ...object,
           [fieldName]: [...object[fieldName] , prd]
        });
    }

    const addOperation = async () => {
        if(object.inputProducts.length == 0 && !window.confirm("Czy na pewno chcesz dodać operacje bez produktu wejściowego ?")) {
            return
        }
        await withinGuard(setSaving, async () => {
            await processFr<AtomicOperationExtendedDto>(
                () => atomicOperationApi.atOpSaveObject(object) as any,
                async (op) => {
                    onAdded();
                }
            )
        });
    }

    const removeInputProduct = async (productId: number) => {
        setObject({
            ...object,
            inputProducts: object.inputProducts.filter((prd: AtomicProductExtendedDto) => prd.id !== productId)
        });
    }

    const removeOutputProduct = async (productId: number) => {
        setObject({
            ...object,
            outputProducts: object.outputProducts.filter((prd: AtomicProductExtendedDto) => prd.id !== productId)
        });
    }

    const {t} = useTranslation();

    return (
        <div>
            <Modal visible={opened} onCancel={close} className="modal-90w" title={<><Fas icon={"plus"}/>&nbsp; {t("Add Operation")}</>} width={"80vw"}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                {saving && <OverlaySpinner/>}
                <OperationTypeSelect operationType={{v: object?.operationType, sv: v => setObject({...object, operationType: v})}}/>

                <Row style={{marginTop: "-1.0em"}} gutter={[5,5]}>
                    <Col sm={12}>
                        <AtomicProductList products={object?.inputProducts} label={<><Fas icon={"arrow-circle-right"}/>&nbsp;Produkty Wejściowe</>}
                                           lockedProductIds={[]}
                                           onDelete={removeInputProduct}
                        />
                    </Col>
                    <Col sm={12}>
                        <AtomicProductList products={object?.outputProducts} label={<><Fas icon={"arrow-circle-left"}/>&nbsp;Produkty Wyjściowe</>}
                                           lockedProductIds={[endProduct.id]}
                                           onDelete={removeOutputProduct}
                        />
                    </Col>
                </Row>
                <Row style={{marginTop: "1.0em"}} gutter={[5,5]}>
                    <Col sm={12}>
                        <InlineProductAdder onAddedProduct={prd => handleAddedProduct(prd, AddProductDialogType.INPUT)} layerShape={layerShape}/>
                    </Col>
                    <Col sm={12}>
                        <InlineProductAdder onAddedProduct={prd => handleAddedProduct(prd, AddProductDialogType.OUTPUT)} layerShape={layerShape}/>
                    </Col>
                </Row>
                <Button size={"sm"} block={true} className={"mt-3"} onClick={addOperation} variant={"success"} disabled={object?.operationType == null}>
                    <Fas icon={"plus-circle"}/>&nbsp;{t("Add Operation")}
                </Button>
                {!object.operationType && <Alert message={"Nie wybrano operacji"} showIcon={true} type={"warning"} className={"mt-2"}/>}
            </Modal>
        </div>
    )
}

export const flatMapTreeNode = (node: TreeNodeAtomicOperationExtendedDto): AtomicOperationExtendedDto[] => [...flatMap(node.subNodes, flatMapTreeNode), node.node]

/*
NOTE(jbi):
    1. For which input product do we allow creation of atomic operation.
        - Only inputs products
        - Only those that don't have sub-operations
    2. Creating operation.
        - Requires control with build in lock for output product - won't work
*/

const findInTree = (tree: TreeNodeAtomicOperationExtendedDto, nodeCriteria: (v: TreeNodeAtomicOperationExtendedDto) => boolean) : TreeNodeAtomicOperationExtendedDto | null => {
    if(nodeCriteria(tree)) {
        return tree;
    }
    const subNodes : TreeNodeAtomicOperationExtendedDto[] = tree.subNodes;
    for (const subNode of subNodes) {
        const subNodeResult = findInTree(subNode, nodeCriteria);
        if(subNodeResult != null) {
            return subNodeResult;
        }
    }
    return null;
}

const isInputProductDetachedFromOperations = (product: AtomicProductExtendedDto, operations: TreeNodeAtomicOperationExtendedDto):boolean => {
    const treeNode = findInTree(operations, tree => {
        return tree.node.outputProducts.filter((prd: AtomicProductExtendedDto) => prd.id === product.id).length > 0;
    });
    return treeNode == null;
}

const invertPath = (path: Record<number, number>):Record<number, number> => {
    const arrValues = toPairs(path);
    const maxValue = max(arrValues.map(v => v[1])) || 0;
    console.log({arrValues, maxValue});
    // @ts-ignore
    return fromPairs(arrValues.map(v => [v[0], maxValue - v[1] + 1]));
    // return {};
}

export const getOperationPath = (operationsFlat: AtomicOperationExtendedDto[], inputProductId: number, depth: number): Record<number, number> => {
    // @ts-ignore
    const operation: AtomicOperationExtendedDto | null = find(operationsFlat, (op:AtomicOperationExtendedDto) => find(op.outputProducts, (opp:AtomicProductExtendedDto) => opp.id === inputProductId));

    if(operation) {
        const inputProductIds: number[] = operation.inputProducts.map((ip:AtomicProductExtendedDto) => ip.id);
        // @ts-ignore
        const subObj = fromPairs(flatMap(inputProductIds, ipId => toPairs(getOperationPath(operationsFlat, ipId, depth + 1))));
        return {
            [operation.id]: depth,
            ...subObj
        };
    } else {
        return {}
    }
}

export const OperationPathCopyComponent: React.FC<{productId: number, onDone: () => void}> = ({productId, onDone}) => {
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [copying, setCopying] = React.useState<boolean>(false);
    const [possibleOps, setPossibleOps] = React.useState<PossibleOperationPathToCopyFrom[] | null>(null);
    const [selectedTargetOp, setSelectedTargetOp] = React.useState<number | null> (null);

    const downloadInitData = async () => {
        await withinGuard(setDownloading, async () => {
            const response = await atomicOperationApi.getPossibleOperationPathsToCopyFrom(productId);
            const {data} = response;

            setPossibleOps(data);
        });
    };

    const copyProcessFromProduct = async (srcProductId: number) => {
        await withinGuard(setCopying, async () => {
            await processFr(
                () => atomicOperationApi.copyOperationProcedure(srcProductId, productId) as any,
                async (val:string) => {
                    onDone();
                }
            );
        });
    }

    React.useEffect(() => {
        downloadInitData();
    }, [productId]);

    return (
        <Row>
            <Col sm={24} offset={0}>
                <Card title={<><Fas icon={"copy"}/>&nbsp;Kopiuj proces z innej pozycji</>} size={"small"} style={{marginBottom: "2em"}}>
                    {(downloading || !possibleOps) ? <SpinCentered/> :
                        <>
                            {/*
                    // @ts-ignore */}
                            <Select value={selectedTargetOp} onChange={setSelectedTargetOp} style={{width: "100%", marginBottom: "0.5em"}} size={"small"}>
                                {possibleOps.map(possibleOp =>
                                    <Select.Option key={possibleOp.completedProductId} value={possibleOp.completedProductId}>
                                        {possibleOp.completedProductId} | {possibleOp.resultProduct.atomicProductDefinition?.title} | {possibleOp.operationCount} Operacji
                                    </Select.Option>
                                )}
                            </Select>
                            <AntButton size={"small"} block disabled={selectedTargetOp == null || copying} type={"primary"} loading={copying}
                                       onClick={() => copyProcessFromProduct(selectedTargetOp!)}>
                                <Fas icon={"copy"}/>&nbsp; Kopiuj
                            </AntButton>
                        </>
                    }
                </Card>
            </Col>
        </Row>
    )
}

export type OperationBuilderProps = { selectedProductId: number, productionOrderId: number, layerShape: LayerShapeBasicDto};

export const OperationBuilderPagePrm : React.FC<OperationBuilderProps> =
    ({selectedProductId, productionOrderId, layerShape}) => {

    const {res: operations, executing: loading, execute: getInitData} =
        useAsyncOp<TreeNodeAtomicOperationExtendedDto>(() => atomicOperationApi.getOpSetForProduct(selectedProductId));

    React.useEffect(() => {
        getInitData();
    }, [selectedProductId]);

    const [productForOperation, setProductForOperation] = React.useState<AtomicProductExtendedDto | null> (null);
    const [productIdForPath   , setProductIdForPath] = React.useState<number | null>(null);

    const operationsFlat : AtomicOperationExtendedDto[] | null = operations ? flatMapTreeNode(operations) : [];
    const operationPath = productIdForPath ? getOperationPath(operationsFlat, productIdForPath, 1) : {};

    const {t} = useTranslation();

    const handleAdded = () => {
        setProductForOperation(null);
        getInitData();
    }

    const startCreateStartOperation = async () => {
        const response = await atomicProductApi.atPrGetObject(selectedProductId);
        if(response.data) {
            setProductForOperation(response.data);
        } else {
            notification.error({
                message: "Something fucky's going on"
            })
        }
    }

    return (
        <Card title={<><Fas icon={"clipboard-list"}/>&nbsp;Operacje dla produktu [{operationsFlat.length}]</>} size={"small"}>
            {(loading || operations == null) ? <SpinCentered/> :
                <div>
                    {operationsFlat.length === 0 ? <Empty description={t("No operations")}/> :
                        <table className={"table table-sm table-bordered table-striped"}>
                            <thead>
                            <tr>
                                {/*<th>Id</th>*/}
                                <th>{t("Type")}</th>
                                <th>{t("Input Products")}</th>
                                <th>{t("Output Products")}</th>
                                {productIdForPath && <th style={{width: "5%"}}>{t("Path")}</th> }
                            </tr>
                            </thead>
                            <tbody>
                            {operationsFlat.map(op =>
                                <tr id={op.id}>
                                    {/*<td>{op.id}</td>*/}
                                    <td>{op.operationType?.title}</td>
                                    <td>
                                        {op.inputProducts.map((prd:AtomicProductExtendedDto) =>
                                            <div key={prd.id}>
                                                {isInputProductDetachedFromOperations(prd, operations) ?
                                                    <Badge variant={"secondary"} style={{cursor: "pointer", fontSize: "1em"}} title={"Create operation for selected product"}
                                                           onClick={() => setProductForOperation(prd)}
                                                    >
                                                        <Fas icon={"edit"}/>&nbsp;{/*prd.id*/} {prd.atomicProductDefinition?.title}
                                                    </Badge> :
                                                    <AntButton type={productIdForPath === prd.id ? "primary" : "text"} size={"small"}
                                                               onClick={() => setProductIdForPath(productIdForPath == prd.id ? null : prd.id)}>
                                                        {prd.atomicProductDefinition?.title}
                                                    </AntButton>
                                                }
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {op.outputProducts.map((prd:AtomicProductExtendedDto) =>
                                            <div key={prd.id}>{prd.atomicProductDefinition?.title}</div>
                                        )}
                                    </td>
                                    {productIdForPath && <td> <AntBadge count={operationPath[op.id] as any} /> </td>}
                                </tr>
                            )}
                            </tbody>
                        </table>
                    }
                    {operationsFlat.length === 0 &&
                        <Row gutter={5}>
                            <Col sm={12}>
                                <Button size={"sm"} block={true} onClick={startCreateStartOperation} className={'mt-2 mb-2'}>
                                    <Fas icon={"plus"}/>&nbsp;Dodaj operacje końcową
                                </Button>
                            </Col>
                            <Col sm={12}>
                                <OperationPathCopyComponent productId={selectedProductId} onDone={getInitData}/>
                            </Col>
                        </Row>
                    }
                    <div>
                        {productForOperation &&
                        <AddOperationDialog
                            layerShape={layerShape}
                            endProduct={productForOperation}
                            opened={true}
                            close={() => setProductForOperation(null)}
                            onAdded={handleAdded}
                            productionOrderId={productionOrderId}
                        />
                        }
                    </div>
                    {operations != "" &&
                    <div className={"m-2"}>
                        <DiagramRenderer tree={operations}/>
                    </div>
                    }
                </div>
            }
        </Card>
    )
}


