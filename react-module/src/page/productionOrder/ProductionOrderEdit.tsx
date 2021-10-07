import React from "react";
import {Col, Form, FormCheck, Row, Table} from "react-bootstrap";
import {atomicProductDefinitionApi, layerShapeApi, productionOrderApi} from "../../api/exports";
import {
    deriveLayerShapeLabel, FailableResource,
    Fas,
    MlConstants,
    processFr,
    processFrWithLoader,
    processRawRes,
    t,
    withinGuard
} from "../../misc/misc";
import {UniversalSingleSelect} from "../UniversalEdit";
import {Button as AntButton, Card, Checkbox, Empty, Modal, Progress, Radio, Space} from "antd";
import {OverlaySpinner, ProductTypeCreatorDialog, RectangleLayerShapeCreatorDialog, SpinCentered} from "../../CommonComponent";
import {OperationBuilderPagePrm} from "../operationBuilder/OperationBuilderPage";
import {
    AtomicProduct,
    AtomicProductDefinitionBasicDto,
    AtomicProductExtendedDto, CompletedProductWithProgress,
    LayerShapeBasicDto,
    ProductionOrderExtendedDto, ProductionOrderWithProgress
} from "../../openapi/models";
import {DiagramOperationBuilder} from "../operationBuilder/DiagramOperationBuilder";
import {DiagramCtxProvider} from "../../context/DiagramCtx";

export const ProductionOrderEdit: React.FC<{}> = () => {
    return (
        <div>
            Removed because of mapping issues and i'm not sure it is used at all in the previous form
        </div>
    )
}

// export const ProductionOrderEdit: React.FC<{}> = () => {
//     const [showModal, setShowModal] = React.useState<boolean>(false);
//     const [amountForProductGenerator, setAmountForProductGenerator] = React.useState<number>(1);
//
//     const createAtomicProductsFromProductTypes = async (productionOrderId: number, atomicProductTypeId: number) => {
//         const response = await productionOrderApi.createAndAddCompletedProductsFromType(
//             productionOrderId, atomicProductTypeId, amountForProductGenerator);
//         if(response.status === 200) {
//             window.location.reload();
//         }
//     }
//
//     return <>
//     <UniversalEdit
//         formElements={(object: ProductionOrderExtendedDto | undefined, setObject: (object: ProductionOrderExtendedDto) => void) =>
//             <>
//                 <UniversalSingleSelect getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
//                     updateObject={(selectObject: AtomicProductDefinitionBasicDto) => setObject({...object, atomicProductDefinition: selectObject})}
//                     defaultValue={object?.atomicProductDefinition}
//                     getItemLabel={(object: AtomicProductDefinitionBasicDto) => object?.title}
//                     fieldText={"Allowed Product Definitions"}/>
//                 {object?.id && <>
//                 <div style={{border: "1px solid red"}} className="p-2">
//
//                     <Form.Group>
//                         <Row>
//                             <Col sm={3}>
//                             <Form.Label>{t("Number of Complete Products To Create")}</Form.Label>
//                             </Col>
//                             <Col sm={1}>
//                                 <Form.Control
//                                     className="amountArea"
//                                     value={amountForProductGenerator}
//                                     min={1}
//                                     type="number"
//                                     onChange={e => setAmountForProductGenerator(parseInt(e.target.value))}
//                                 />
//                             </Col>
//                             <Col>
//                                 <Button variant="success" onClick={withPrvDflt(() => createAtomicProductsFromProductTypes(object?.id, object?.atomicProductDefinition?.id))}>
//                                     {t("Generate from product type")}
//                                 </Button>
//                             </Col>
//                         </Row>
//                     </Form.Group>
//                 </div>
//                 <br/>
//                 <h4>{t("Complete Products")}:</h4>
//                 <UniversalListArray getObjectArray={object?.completedProducts}
//                     onClickString={(id) => `${PathPage.ATOMIC_PRODUCT_EDIT}/${id}`}
//                     properties={[
//                         {extractFunction: (object) => object.id, label:"Id"},
//                         {extractFunction: (object) => object?.atomicProductDefinition?.title, label:t("Product title")},
//                     ] as ListItemProperty<ProductionOrderExtendedDto>[]}/>
//                 </>
//                 }
//                 <Row><p style={{marginLeft:"1rem"}}>Atomic operation</p>
//                     <Button variant="success" style={{marginLeft:"99rem"}} onClick={() => {setShowModal(true)}}>
//                         {t("Generate Atomic Operation")} (mockup)
//                     </Button>
//                 </Row>
//                 <UniversalTableSelect getObjectsViaApi={atomicOperationApi.atOpGetObjectList}
//                     selectedObjectList={object?.operationsList as AtomicOperationBasicDto[]}
//                     setSelectedObjectList={(selectedObjects => setObject({
//                         ...object,
//                         operationsList:selectedObjects
//                     }))}
//                     fieldText={t("Planned Operations")}
//                     properties={[
//                         {extractFunction: (object) => object.id, label:"Id"},
//                         {extractFunction: (object) => object.operationType?.title, label:t("Operation Type")},
//                         {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label:t("Operation Result")},
//                         {extractFunction: (object) => "", label:t("Input Products")},
//                         {extractFunction: (object) => "", label:t("Output Products")},
//                     ] as ListItemProperty<AtomicOperationBasicDto>[]}   editLink={PathPage.ATOMIC_OPERATION_EDIT}/>
//                 <UniversalTableSelect getObjectsViaApi={atomicProductApi.atPrGetObjectList}
//                     selectedObjectList={object?.completedProducts}
//                     setSelectedObjectList={(selectedObjects => setObject({
//                         ...object,
//                         completedProducts:selectedObjects
//                     }))}
//                     fieldText={t("Completed Products")}
//                     properties={[
//                         {extractFunction: (object) => object.uuid, label:"UUID"},
//                         {extractFunction: (object) => object.id, label:"Id"},
//                         {extractFunction: (object) => object?.atomicProductDefinition?.title, label:t("Product title")},
//                     ]} editLink={PathPage.ATOMIC_PRODUCT_EDIT}/>
//             </>
//         }
//         getObjectViaApi={productionOrderApi.prOrGetObject}
//         save={productionOrderApi.prOrSaveObject as any}
//         primitiveKeys={[
//             // {key: "title", htmlValueType: UniversalInputType.TEXT},
//             // {key: "orderNumber", htmlValueType: UniversalInputType.TEXT}
//         ]}
//         onSubmitString={PathPage.PRODUCTION_ORDER_LIST}/>
//
//         <ProductionOrderTemplateModal showModal={showModal} setShowModal={() =>{setShowModal(false)}}/>
//     </>
// }

export const ProductionOrderEditForHumans: React.FC<{productionOrderId: number}> = ({productionOrderId}) => {
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [object, setObject] = React.useState<ProductionOrderExtendedDto | null>(null);
    const [amountForProductGenerator, setAmountForProductGenerator] = React.useState<number>(1);
    const [generatingProducts, setGeneratingProducts] = React.useState<boolean>(false);
    const [saving, setSaving] = React.useState<boolean>(false);
    const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
    const [progress, setProgress] = React.useState<CompletedProductWithProgress[]>([]);
    const [deleting, setDeleting] = React.useState<boolean>(false);
    const [chosenCompletedProdIds, setChosenCompletedProdIds] = React.useState<number[]>([]);
    const [confirmDeleteModal, setConfirmDeleteModal] = React.useState<boolean>(false);

    const download = async () => {
        await withinGuard(setDownloading, async () => {
            await processRawRes<FailableResource<ProductionOrderWithProgress>>(
                () => productionOrderApi.getObjectWithProgress(productionOrderId) as any,
                async (actionResult) => {
                    const productionOrderWithProgress= actionResult.resource
                    setObject(productionOrderWithProgress.productionOrder);
                    setProgress(productionOrderWithProgress.progress);

                    if(MlConstants.isDev && productionOrderWithProgress.productionOrder?.completedProducts?.length > 0) {
                        const targetProduct = productionOrderWithProgress.productionOrder.completedProducts[0];
                        setSelectedProductId(targetProduct.id);
                    }
                }
            )
        });
    }

    const  deleteAllCompletedProduct = async () => {
        await withinGuard(setDeleting, async () => {
            await processFr(
                () => productionOrderApi.deleteManyCompletedProduct(chosenCompletedProdIds, object?.id) as any,
                async () => {
                    handleAfterProductDelete()
                }
            )
        });
    }

    const handleAfterProductDelete = () => {
        setSelectedProductId(null);
        setChosenCompletedProdIds([])
        download();
    }

    const save = async () => {
        await withinGuard(setSaving, async () => {
            await processFr<ProductionOrderExtendedDto>(
                () => productionOrderApi.saveProductionOrderShapeAndDef(object!) as any,
                async (prOrder) => {
                    setObject(prOrder);
                }
            )
        });
    }

    const createAtomicProductsFromProductTypes = async (productionOrderId: number, atomicProductTypeId: number) => {
        if(object == null) {
            return;
        }
        await withinGuard(setGeneratingProducts, async () => {
            const response = await productionOrderApi.createAndAddCompletedProductsFromType(productionOrderId, atomicProductTypeId, amountForProductGenerator);
            if(response.status === 200) {
                await download();
            }
        })
    }

    const createAtomicProductsFromCompleteProduct = async (productionOrderId: number, completedAtomicProductId: number) => {
        await processFrWithLoader(setGeneratingProducts,
            () => productionOrderApi.generateProductsFromCompleteProduct(productionOrderId, completedAtomicProductId, amountForProductGenerator) as any,
            async () => {
                await download();
            }
        )
    }

    React.useEffect(() => {
        download();
        setChosenCompletedProdIds([])
    }, [productionOrderId])

    const getRemainingAmountForGeneration = (object: ProductionOrderExtendedDto):number => {
        return object.amount - object.completedProducts.length;
    }

    const getPercent = (completedProductId: number) => {
        const percent = progress.find(pr => pr?.completedProductId== completedProductId)
        return percent != undefined ? percent.percent : 0 ;
    }

    return (
        <Card title={<><Fas icon={"edit"}/>&nbsp;Edycja Procesu Produkcyjnego dla Elementu</>} size={"small"}>
            {object == null ? <SpinCentered/> :
                <>
                    {downloading && <OverlaySpinner/>}
                    <Row>
                        <Col sm={6}>
                            <UniversalSingleSelect getObjectsViaApi={layerShapeApi.laShGetObjectList}
                                                   updateObject={(selectObject: LayerShapeBasicDto) => setObject({...object, layerShape: selectObject})}
                                                   defaultValue={object?.layerShape}
                                                   getItemLabel={(object: LayerShapeBasicDto) => deriveLayerShapeLabel(t, object)}
                                                   fieldText={t("Layer Shape")}
                                                   auxColumn={onDone => <RectangleLayerShapeCreatorDialog onDone={onDone}/>}
                            />

                            <UniversalSingleSelect getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                                   updateObject={(selectObject: AtomicProductDefinitionBasicDto) => setObject({...object, atomicProductDefinition: selectObject})}
                                                   defaultValue={object?.atomicProductDefinition}
                                                   getItemLabel={(object: AtomicProductDefinitionBasicDto) => object?.title}
                                                   fieldText={"Definicja produktu końcowego"}
                                                   auxColumn={onDone => <ProductTypeCreatorDialog onDone={onDone}/>}
                            />

                            <AntButton style={{marginBottom: "0.5em"}} loading={saving} onClick={save} block type={"primary"}
                                       disabled={object.atomicProductDefinition == null || object.layerShape == null}>
                                <Fas icon={"save"}/>&nbsp; Zapisz
                            </AntButton>
                        </Col>
                        <Col sm={6}>
                            <Card title={<><Fas icon={"plus-circle"}/>&nbsp;Wygeneruj Produkty Końcowe</>} size={"small"}>
                                <Space>
                                    <div> Ilość Produktów do Generacji: </div>
                                    <div>
                                        <Form.Control
                                            className="amountArea" min={1} type="number" size={"sm"}
                                            value={amountForProductGenerator}
                                            onChange={e => setAmountForProductGenerator(parseInt(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <AntButton type="primary" size={"middle"} disabled={object.atomicProductDefinition == null || !object.layerShape } loading={generatingProducts}
                                                   onClick={(e) => createAtomicProductsFromProductTypes(object.id, object.atomicProductDefinition?.id)}
                                        >
                                            <Fas icon={"plus"}/>&nbsp; Wygeneruj Z Typu Produktu
                                        </AntButton>
                                    </div>
                                    <div>
                                        <AntButton type="primary" size={"middle"} disabled={object.atomicProductDefinition == null || selectedProductId == null || !object.layerShape}
                                                   loading={generatingProducts} onClick={(e) => createAtomicProductsFromCompleteProduct(object.id, selectedProductId!)}
                                        >
                                            <Fas icon={"plus"}/>&nbsp; Wygeneruj z Wybranego Produktu Końcowego
                                        </AntButton>
                                    </div>
                                    <div>
                                        ({object.completedProducts.length} / {object.amount} - Pozostało do generacji: {getRemainingAmountForGeneration(object)})
                                    </div>
                                </Space>
                            </Card>
                            <Card title={<><Fas icon={"box"}/>&nbsp; Produkty Końcowe [{object.completedProducts.length}]</>} size={"small"} className={"mt-2 mb-2"}>
                                {deleting ? <SpinCentered/> :
                                    object.completedProducts.length === 0 ?
                                        <Empty description={"Brak produktów końcowych"}/> :
                                        <div>
                                            <div style={{textAlign: "end", marginBottom: "0.5em"}}>
                                                <AntButton danger type={"primary"}
                                                           disabled={chosenCompletedProdIds.length == 0}
                                                           onClick={() => setConfirmDeleteModal(true)}>
                                                    {t("Delete chosen")}
                                                </AntButton>
                                                <ConfirmDeleteModal visibleConfirmModal={confirmDeleteModal}
                                                                    setVisibleConfirmModal={() => setConfirmDeleteModal(false)}
                                                                    deleteHandle={deleteAllCompletedProduct}
                                                />
                                            </div>
                                            <Table striped bordered hover size={"sm"}>
                                                <thead>
                                                <tr>
                                                    <th style={{width: "5%"}}>Id</th>
                                                    <th>{t("Product Definition")}</th>
                                                    <th style={{width: "5%"}}>Selekcja</th>
                                                    <th style={{width: "15%"}}>Progres</th>
                                                    <th style={{width: "5%", textAlign: "center"}}>
                                                        <Checkbox onChange={(e) => e.target.checked ?
                                                            setChosenCompletedProdIds(object?.completedProducts.map((cpId: AtomicProduct) => cpId.id)) :
                                                            setChosenCompletedProdIds([])}
                                                                  checked={chosenCompletedProdIds.length == object.completedProducts.length}
                                                        />Operacja
                                                    </th>

                                                </tr>
                                                </thead>
                                                <tbody>
                                                {object.completedProducts.map((cp: AtomicProductExtendedDto) =>
                                                    <tr key={cp.id} style={{cursor: "pointer"}}
                                                        onClick={() => setSelectedProductId(cp.id)}
                                                    >
                                                        <td style={{whiteSpace: "pre-line"}} >{cp.id}</td>
                                                        <td style={{whiteSpace: "pre-line"}} >{cp.atomicProductDefinition?.title}</td>
                                                        <td style={{textAlign: "center"}} >
                                                            <Radio checked={selectedProductId == cp.id}/>
                                                        </td>
                                                        <td ><Progress type={"line"} percent={getPercent(cp?.id)}
                                                                      width={15}/></td>
                                                        <td style={{textAlign: "center"}}
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                e.preventDefault()
                                                                const listCp = chosenCompletedProdIds
                                                                const isChecked = chosenCompletedProdIds.includes(cp.id)
                                                                listCp.push(cp.id)
                                                                return isChecked ? setChosenCompletedProdIds(chosenCompletedProdIds.filter(cpId => cpId !== cp?.id)) :
                                                                    setChosenCompletedProdIds([...listCp])
                                                            }}
                                                        >
                                                            <Checkbox
                                                                checked={chosenCompletedProdIds?.includes(cp.id)}
                                                            />
                                                            {/*<DeleteCompletedProductComponent productionOrderId={object.id} productId={cp.id}*/}
                                                            {/*                                 afterDelete={handleAfterProductDelete}/>*/}
                                                        </td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </Table>
                                        </div>
                                }
                            </Card>
                        </Col>
                    </Row>
                    {selectedProductId &&
                        <DiagramCtxProvider>
                            {/*<OperationBuilderPagePrm selectedProductId={selectedProductId} productionOrderId={object.id} layerShape={object.layerShape}/>*/}
                            <DiagramOperationBuilder selectedProductId={selectedProductId} productionOrderId={object.id} layerShape={object.layerShape}/>
                        </DiagramCtxProvider>
                    }
                </>
            }
        </Card>
    )
}

export const CompletedProductProgressController : React.FC<{productId: number}> = ({productId}) => {
    return (
        <Card title={<><Fas icon={"list"}/>&nbsp; Progress </>}>
            {productId}
        </Card>
    )
}

const ConfirmDeleteModal : React.FC<{visibleConfirmModal:boolean, setVisibleConfirmModal:(visible:boolean)=>void, deleteHandle:()=>void}> =
    ({visibleConfirmModal,setVisibleConfirmModal,deleteHandle}) =>{

    return <Modal
        width={"100vh"}
        zIndex={100000}
        visible={visibleConfirmModal}
        closable={false}
        onCancel={() => setVisibleConfirmModal(false)}
        style={{top: "5vh"}}
        footer={[
            <AntButton
                onClick={() => setVisibleConfirmModal(false)}
            >{t("Cancel")}</AntButton>,
            <AntButton danger type={"primary"}
                    onClick={(e) => {
                        e.stopPropagation()
                        setVisibleConfirmModal(false)
                        deleteHandle()
                    }}
            >{t("Delete")}</AntButton>
        ]}
    >
        <h4>{t("Are you sure you want to delete this completed products?")}</h4>
    </Modal>
}
// export const DeleteCompletedProductComponent : React.FC<{productionOrderId: number, productId: number, afterDelete: () => void}> = ({productionOrderId, productId, afterDelete}) => {
//     const [deleting, setDeleting] = React.useState<boolean>(false);
//
//     const deleteProduct = async () => {
//         await withinGuard(setDeleting, async () => {
//             await processFr(
//                 () => productionOrderApi.deleteCompletedProduct(productionOrderId, productId) as any,
//                 async () => {
//                     afterDelete();
//                 }
//             )
//         });
//     }
//
//     return (
//         <AntButton type={"primary"} size={"small"} title={"Usuń"} danger={true} loading={deleting} disabled={deleting} onClick={deleteProduct}>
//             <Fas icon={"trash"}/>
//         </AntButton>
//     )
// }
