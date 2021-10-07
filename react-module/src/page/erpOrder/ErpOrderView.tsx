import React, {useEffect} from "react";
import {
    ActionResourceListCustomFileActionResourceStatusEnum,
    AtomicOperationBasicDto,
    AtomicOperationBasicDtoOperationResultEnum,
    CustomFile,
    FailableResourceInteger,
    GidDto,
    LocalErpOrderProgress,
    LocalProductionOrderWithProgress, OperationType,
    OrderWithElements,
    OrderWithElementsAndLocalData,
    OrderWithSingleElement,
    ProductionOrder,
    ProductionOrderBasicDto,
    ProductWithAmount
} from "../../openapi/models";
import { Fas, MlConstants, processFr, t, withinGuard} from "../../misc/misc";
import {erpOrderApi, fileApi, localErpOrderApi, uploadLocalErpOrderFile} from "../../api/exports";
import {Form, Table} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {ErpOrderListProperties} from "./ErpOrderList";
import {Col, Descriptions, notification, Progress, Row, Tabs} from "antd";
import {Alert, Button, Divider, InputNumber, Modal, Radio, Spin, Table as AntTable} from "antd";
import {SpinCentered} from "../../CommonComponent";
import find from "lodash/find";
import {ProductionOrderEditForHumans} from "../productionOrder/ProductionOrderEdit";
import {FileData} from "../operationsOfMachine/OperationsOfMachinesReducer";
import {FileCardComponent} from "../FileCardComponent";
import Dropzone from "react-dropzone";

import {useTranslation} from "react-i18next";
import {ModalImportFromNonErpOrder} from "./ModalImportFromNonErpOrder";

export type ModalNonErpOrderData = {
    show: boolean,
    position?: number,
    localErpOrderId?: number
}

export const GenerateProductOrderWithThicknessComponent : React.FC<{generate: (thickness?: number) => Promise<void>}> = ({generate}) => {
    const {t} = useTranslation();
    const [opened, setOpened] = React.useState<boolean>(false);
    const [thickness, setThickness] = React.useState<number>(5);
    const [generating, setGenerating] = React.useState<boolean>(false);

    const generateProxy = async () => {
        await withinGuard(setGenerating, async () => {
            await generate(thickness);
        });
    }

    return (
        <>
            <Button onClick={() => setOpened(true)} size={"small"} type={"primary"}>
                <Fas icon={"plus"}/>&nbsp;{t("Start procedure for order element")}
            </Button>
            <Modal title={<><Fas icon={"ruler-combined"}/>&nbsp;Wprowadź grubość elementu końcowego</>}
                   visible={opened} onCancel={() => setOpened(false)}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <InputNumber<string>
                    style={{width: "100%"}}
                    value={thickness + ""}
                    min="0.01"
                    step="0.01"
                    onChange={val => setThickness(parseFloat(val))}
                    stringMode
                />

                <Button size={"middle"} type={"primary"} style={{marginTop: "1em"}} block onClick={generateProxy} loading={generating}>
                    <Fas icon={"check"}/>&nbsp; Potwierdź grubość ({thickness})
                </Button>
            </Modal>
        </>
    )
}

export const ProductElementAmountDisplay : React.FC<{prd: ProductWithAmount}> = ({prd}) => {
    const [downloading, setDownloading] = React.useState<boolean>(false);
    const [result, setResult] = React.useState<FailableResourceInteger | null>(null);

    const downloadCorrectAmount = async () => {
        await withinGuard(setDownloading, async () => {
            const {data} = await erpOrderApi.extractAmountFromOrderElement(prd);
            setResult(data);
        });
    }

    React.useEffect(() => {
        if(["m2"].includes(prd.unitOfMeasure)) {
            downloadCorrectAmount();
        }
    }, [prd]);

    return (
        <div>
            {(result && result.success) ? `${result.resource} (${prd.amount})` : prd.amount}&nbsp;{downloading && <Spin/>}
            {result && !result.success && <Alert message={result.error} type={"error"} style={{marginTop: "0.5em"}} showIcon/>}
        </div>
    )
}

export const ErpOrderView: React.FC<{}> = () => {

    const [erpOrderWithLocalData, setErpOrderWithLocalData] = React.useState<OrderWithElementsAndLocalData | null>(null);
    const [downloadingData, setDownloadingData] = React.useState<boolean>(false);
    const [creatingLocalOrder, setCreatingLocalOrder] = React.useState<boolean>(false);
    const [productionOrderId, setProductionOrderId] = React.useState<number | null>(null);
    const [files, setFiles] = React.useState<FileData[]>([]);
    const [progress, setProgress] = React.useState<LocalErpOrderProgress>();
    const [plannedEndDate, setPlannedEndDate] = React.useState<Date>();

    const [atOpModalVisible, setAtOpModalVisible] = React.useState<boolean>(false);
    const [modalNonErpOrderData, setModalNonErpOrderData] = React.useState<ModalNonErpOrderData>({show: false});

    const {type, company, number, counter}: {
        type: string | undefined, company: string | undefined,
        number: string | undefined, counter: string | undefined
    } = useParams();

    const getParsedGid = ():GidDto => {
        return {
            type : Number(type),
            company: Number(company),
            number: Number(number),
            counter: Number(counter)
        }
    }

    const downloadOrder = async () => {
        const gid = getParsedGid();
        return withinGuard(setDownloadingData, async () => {
            await processFr<OrderWithElementsAndLocalData>(
                () => erpOrderApi.getErpOrderWithLocalData(gid.type, gid.company, gid.number, gid.counter) as any,
                async result => {
                    setErpOrderWithLocalData(result);
                    setProgress(result.localErpOrderProgress);
                    setPlannedEndDate(result.plannedEndDate)
                    if(MlConstants.isDev && result.localErpOrder && result.localErpOrder.productionOrders.length > 0) {
                        const targetProductionOrder = result.localErpOrder.productionOrders[0];
                        setProductionOrderId(targetProductionOrder.id);
                    }
                }
            );
        })
    }

    const downloadFile = async (id:number) => {
        return withinGuard(setDownloadingData, async () => {
            const response = await fileApi.getLocalErpOrderFile(id);
            const result= response.data.resource
            const fileList:FileData[]=result.map((file: CustomFile, index:number )=>{
                return {
                    id:index,
                    fileName:file.filename,
                    path:file.path,
                    extension:file.extension
                }
            })
            setFiles(fileList)
        })
    }

    const deleteFile = async (fileToDelete:FileData) => {
        return withinGuard(setDownloadingData, async () => {
            const response = await fileApi.deleteFile({filePath:fileToDelete?.path, fileName:fileToDelete?.fileName});
            if (response.data == ActionResourceListCustomFileActionResourceStatusEnum.OK){
                notification.success({message:t("File deleted")})
                setFiles(files.filter(file => file.fileName!=fileToDelete?.fileName && file.path != fileToDelete?.path))
            }else {
                notification.error({message:"Error"})
            }
        })
    }

    const uploadFile = async (file: File) => {
        const result = erpOrderWithLocalData?.localErpOrder && file && await uploadLocalErpOrderFile(erpOrderWithLocalData?.localErpOrder.id, file);
        if (result === "OK") {
            notification.success({message: t("File added")})
            erpOrderWithLocalData?.localErpOrder.id && downloadFile(erpOrderWithLocalData?.localErpOrder.id)
        } else {
            notification.error({message:t("Error")})
        }
    }

    const createLocalOrder = async () => {
        const gid = getParsedGid();
        await withinGuard(setCreatingLocalOrder, async () => {
            await processFr<string>(
                () => erpOrderApi.createLocalErpOrder(gid) as any,
                async () => {
                    await downloadOrder();
                }
            )
        });
    }

    const updateDeadline = async () => {
        const gid = getParsedGid();
        await processFr<string>(
            () => localErpOrderApi.updateDeadline({gid: gid, deadline: erpOrderWithLocalData?.localErpOrder.deadline}) as any,
            async () => {
                notification.success({message: "Zapisano zmiany."});
            }
        )
    }

    function handleKeyEnterPressDateDeadline(target: any)  {
        if(target.charCode===13){
            updateDeadline();
        }
    }

    React.useEffect(() => {
        erpOrderWithLocalData?.localErpOrder?.id && downloadFile(erpOrderWithLocalData?.localErpOrder.id)
    }, [erpOrderWithLocalData?.localErpOrder?.id])

    React.useEffect(() => {
        downloadOrder();
    }, []);

    // NOTE(jbi): Logic might a bit confusing but it is as follows. We use local copy of order if it was created.
    // Nested ternaries - I know
    const erpOrder: OrderWithElements | null = erpOrderWithLocalData ?
        (erpOrderWithLocalData.localErpOrder ? erpOrderWithLocalData.localErpOrder.srcOrder : erpOrderWithLocalData.orderWithElements) :
        null

    const procedureStarted = erpOrderWithLocalData && erpOrderWithLocalData.localErpOrder != null;

    const generateProductOrder = async(object: ProductWithAmount, thickness?: number) => {
        if(!erpOrder) {
            return;
        }
        const generatedObject:OrderWithSingleElement = {
            order   : erpOrder.order,
            element : object
        }
        return withinGuard(setDownloadingData, async () => {
            await processFr<number>(
                // @ts-ignore
                () => erpOrderApi.generateProductOrder(generatedObject, thickness) as any,
                async productionOrderId => {
                    await downloadOrder();
                    setProductionOrderId(productionOrderId);
                }
            )
        })
    }

    const getProductionOrderForElement = (object: ProductWithAmount) => {
        if(!procedureStarted || erpOrderWithLocalData == null) {
            return null;
        }

        return find(erpOrderWithLocalData.localErpOrder.productionOrders,
            (po: ProductionOrderBasicDto) => po.orderElementPosition == object.position)
    }

    const renderOperationCell = (object: ProductWithAmount) => {
        if(!procedureStarted) {
            return <></>
        }
        const productionOrderForElement = getProductionOrderForElement(object);

        return (
            <td>
                {
                    productionOrderForElement != null ?
                        <Radio checked={productionOrderId === productionOrderForElement.id}
                            // onClick={() => setProductionOrderId(productionOrderForElement.id)}
                        >
                            <Fas icon={"edit"}/>&nbsp;{t("Edit")}
                        </Radio> :
                        <div className="d-flex flex-row" style={{gap: "0.5rem"}}>
                            <GenerateProductOrderWithThicknessComponent
                                generate={async (thickness) => generateProductOrder(object, thickness)}
                            />
                            <Button loading={creatingLocalOrder} block size={"small"}
                                    type={"primary"}
                                    onClick={() => setModalNonErpOrderData({
                                        ...modalNonErpOrderData,
                                        show: true,
                                        position: object.position,
                                        localErpOrderId: erpOrderWithLocalData?.localErpOrder?.id
                                    })}>
                                <Fas icon={"paperclip"}/>&nbsp;{t("Import from Non-Erp Order")}
                            </Button>
                        </div>
                }


            </td>
        )
    }

    const getPercent = (elementPosition: number) => {
        const productOrder = erpOrderWithLocalData?.localErpOrder?.productionOrders?.find((po:ProductionOrder) => po?.orderElementPosition==elementPosition)
        const percent = progress?.localProductionOrderWithProgress?.find((pr:LocalProductionOrderWithProgress) => pr?.productionOrderId== productOrder?.id)
        return percent != undefined ? percent.percent : 0 ;
    }

    return <>
        {(!erpOrder || downloadingData) ? <SpinCentered/> :
            <>
                <Divider orientation={"left"}><Fas icon={"search"}/>&nbsp;Podgląd Zamówienia Erp {procedureStarted ? "(Snapshot)" : ""} </Divider>
                <Table striped bordered size={"sm"}>
                    <tbody>
                        {ErpOrderListProperties(t).map((property) =>
                        <tr key={property.label}>
                            <td style={{whiteSpace: "pre-line", inlineSize: 250}}>{t(property.label)}</td>
                            <td style={{whiteSpace: "pre-line"}}>{property.extractFunction(erpOrder?.order)}</td>
                        </tr>
                        )}
                    </tbody>
                </Table>
                <Table striped bordered size={"sm"} style={{marginBottom: "0.3rem"}}>
                    <tbody>
                    <tr key={"Deadline"}>
                        <td style={{whiteSpace: "pre-line", inlineSize: 250}}>{t("Deadline")}</td>
                        <td style={{whiteSpace: "pre-line", display: "flex"}}>
                            <Form.Control type={procedureStarted ? "datetime-local" : "date"}
                                          size={"sm"} style={{inlineSize: 216, marginRight: 5}}
                                          value={procedureStarted ?
                                              erpOrderWithLocalData?.localErpOrder?.deadline :
                                              erpOrderWithLocalData?.orderWithElements?.order?.executionDate}
                                          disabled={!procedureStarted}
                                          onChange={(e) => {
                                              setErpOrderWithLocalData({...erpOrderWithLocalData, localErpOrder:
                                                      {...erpOrderWithLocalData?.localErpOrder, deadline: e.target.value}
                                              })
                                          }}
                                          onKeyPress={handleKeyEnterPressDateDeadline}
                            />
                            <Button type={"primary"} onClick={updateDeadline} hidden={!erpOrderWithLocalData?.localErpOrder}>
                                <Fas icon={"save"}/>&nbsp;{t("Save Date")}
                            </Button>
                        </td>
                    </tr>
                    </tbody>
                </Table>
                <Divider orientation={"left"}><Fas icon={"file"}/>&nbsp; {t("Order Files")} [{files.length}]</Divider>
                <Row>
                    {erpOrderWithLocalData?.localErpOrder ?
                        <Dropzone onDrop={(e) => uploadFile(e[0])}>
                            {({getRootProps, getInputProps}) => (
                                <div  {...getRootProps()} className={"dropzone"}
                                      style={{
                                          width: "100%",
                                          minHeight: 100,
                                          display: "flex",
                                          border: "2px dashed #4aa1f3",
                                          // border: files.length < 1 ? " 2px dashed #4aa1f3" : "none",
                                          alignItems: "center",
                                          textAlign: "center",
                                          cursor: "pointer"
                                      }}
                                >
                                    <input {...getInputProps()} onClick={(e) => e.defaultPrevented}/>
                                    {files.length > 0 ?
                                        <Row style={{width: "100%", padding: 5}}>
                                            {files.map((file, index) =>
                                                <Col offset={index == 0 ? 0 : 1} onClick={(e) => e.stopPropagation()}>
                                                    <FileCardComponent file={file} deletedButtonVisible={true} deleteFile={(fileToDelete) => deleteFile(fileToDelete)}/>
                                                </Col>
                                            )}
                                        </Row> : <Col style={{fontSize: "17px"}} span={24}>
                                            <Fas icon={"upload"}/>&nbsp; Przeciągnij pliki by dodać do zamówienia
                                        </Col>
                                    }
                                </div>
                            )}
                        </Dropzone> :
                        <Alert message={t("Files available after creating the planning procedures")} type={"warning"}/>
                    }
                </Row>
                {procedureStarted && <>
                    <Divider orientation={"left"}><Fas icon={"list-alt"}/>&nbsp; Operacje dla Zamówienia </Divider>
                    <AtomicOperationForLocalErpOrderModal localErpOrderId={erpOrderWithLocalData?.localErpOrder.id} modalVisible={atOpModalVisible} closeModal={() => setAtOpModalVisible(false)}/>
                    <Descriptions bordered>
                        <Descriptions.Item label={t("Completed Operation")}>{progress?.allCompletedOperation}</Descriptions.Item>
                        <Descriptions.Item label={t("All Operations")}>{progress?.allOperation}</Descriptions.Item>
                        <Descriptions.Item label={t("Order Progress")}>
                            <Progress percent={Number.parseInt((progress?.allCompletedOperation/progress?.allOperation*100).toFixed(0))} type={"circle"} width={45}/>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("See all operations")}>
                            <Button onClick={() => setAtOpModalVisible(true)}>{t("Show All Operations")}</Button>
                        </Descriptions.Item>
                        <Descriptions.Item label={t("Planned End Date")}>{plannedEndDate ? plannedEndDate.toString().replace("T"," ") : "Nie zaplanowano jeszcze wszystkiego"}</Descriptions.Item>
                    </Descriptions>
                    <ModalImportFromNonErpOrder modalNonErpOrderData={modalNonErpOrderData}
                                                handleClose={() => setModalNonErpOrderData({
                                             ...modalNonErpOrderData, show: false })}
                                                reloadLocalErpOrder={downloadOrder}
                    />
                </>
                }
            <Divider orientation={"left"}><Fas icon={"list"}/>&nbsp; Elementy Zamówienia [{erpOrder.elements.length}]</Divider>
            {/*<h2>Production Orders: {erpOrderWithLocalData && erpOrderWithLocalData.localErpOrder.productionOrders.length}</h2>*/}
            <AntTable
                size={"small"} bordered={true}
                dataSource={erpOrder.elements}
                rowClassName={"cursor-pointer"}
                style={{marginBottom: "1em"}}
                onRow={(object) => {
                    const productionOrderForElement = getProductionOrderForElement(object);
                    return {
                        onClick: () => {
                            // history.push(`${PathPage.ERP_ORDER_VIEW}/${object.gid.type}/${object.gid.company}/${object.gid.number}/${object.gid.counter}`)
                            setProductionOrderId(productionOrderForElement ? productionOrderForElement.id : productionOrderId);
                        }
                    };
                }}
                pagination={false}
                columns={[
                    {
                        title: t("Position"),
                        dataIndex: "position",
                    },
                    {
                        title: t("Ean"),
                        dataIndex: "ean",
                    },
                    {
                        title: t("Amount"),
                        // dataIndex: "amount",
                        // render: (row: ProductWithAmount) => row.amount,
                        render: (prd: ProductWithAmount) => <ProductElementAmountDisplay prd={prd}/>,
                    },
                    {
                        title: t("Unit of measure"),
                        dataIndex: "unitOfMeasure",
                    },
                    {
                        title: t("Product Name"),
                        dataIndex: "productName",
                    },
                    {
                        title: t("Product Code"),
                        dataIndex: "productCode",
                    },
                    {
                        title: t("Characteristic"),
                        dataIndex: "characteristic",
                    },
                    {
                        title: t("Progress"),
                        render: function getProgress(row) {
                            return <Progress type={"line"} percent={getPercent(row.elementIndex)} />
                        }
                    },
                    {
                        title: t("Selection"),
                        render: function renderOpCell(row: ProductWithAmount) {
                            return renderOperationCell(row);
                        }
                    },
                ]}
            />


                <Divider orientation={"left"}><Fas icon={"wrench"}/>&nbsp; {t("Planning Operations")} </Divider>

                {!procedureStarted &&
                <div>
                    <Alert message={"Procedura planowania nie została rozpoczęta dla wybranego zamówienia"} type={"info"} showIcon/>
                    <Button loading={creatingLocalOrder} block style={{marginTop: "0.5em"}} type={"primary"} onClick={createLocalOrder}>
                        <Fas icon={"play"}/>&nbsp;Rozpocznij procedure planowania
                    </Button>
                </div>
            }

            {productionOrderId && <>
                <ProductionOrderEditForHumans productionOrderId={productionOrderId}/>
            </>}
        </>
        }
    </>
}


const AtomicOperationForLocalErpOrderModal: React.FC<{
    localErpOrderId: number,
    modalVisible: boolean,
    closeModal: () => void,
}> = ({
          localErpOrderId,
          modalVisible,
          closeModal,
      }) => {
    const [downloading, setDownloading] = React.useState(false);
    const [operationList, setOperationList] = React.useState<AtomicOperationBasicDto[]>([]);
    const [operationTypes, setOperationTypes] = React.useState<OperationType[]>([]);

    const downloadAtomicOperation = async () => {
        await withinGuard(setDownloading, async () => {
            const response = await erpOrderApi.getAllAtomicOperationByLocalOrder(localErpOrderId)
            const result = response.data.resource
            setOperationList(result)
            getUniqueOperationTypes(result)
        })
    }

    const getUniqueOperationTypes = (atomicOp: AtomicOperationBasicDto[]) => {
        const uniqueOpType: OperationType[] = []
        atomicOp.map(atOp => {
            const el = uniqueOpType.find(x => x.id === atOp.operationType.id)
            if (!el) {
                uniqueOpType.push(atOp.operationType)
            }
        })
        setOperationTypes(uniqueOpType)
    }

    useEffect(() => {
        downloadAtomicOperation()
    }, [])


    return <>
        <Modal
            visible={modalVisible}
            onCancel={closeModal}
            closable={false}
            width={1000}
            footer={[
                <Button onClick={closeModal}>{t("Close")}</Button>
            ]}
        >
            {downloading ? <SpinCentered/> : <>
                <AntTable
                    size={"small"} bordered={true}
                    dataSource={operationTypes}
                    rowClassName={"cursor-pointer"}
                    style={{marginBottom: "1em"}}
                    pagination={false}
                    scroll={{y: 500}}
                    columns={[
                        {
                            title: t("Operation Type"),
                            dataIndex: "title"
                        },
                        {
                            title: t(AtomicOperationBasicDtoOperationResultEnum.COMPLETED) + " [" + operationList.filter(opL =>
                                opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.COMPLETED
                            ).length + "]",
                            render: function (row) {
                                return operationList.filter(opL =>
                                    opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.COMPLETED && opL.operationType.id === row.id
                                ).length
                            }
                        },
                        {
                            title: t(AtomicOperationBasicDtoOperationResultEnum.ISRUNNING) + " [" + operationList.filter(opL =>
                                opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.ISRUNNING
                            ).length + "]",
                            render: function (row) {
                                return operationList.filter(opL =>
                                    opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.ISRUNNING && opL.operationType.id === row.id
                                ).length
                            }
                        },
                        {
                            title: t(AtomicOperationBasicDtoOperationResultEnum.ASSIGNED) + " [" + operationList.filter(opL =>
                                opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.ASSIGNED
                            ).length + "]",
                            render: function (row) {
                                return operationList.filter(opL =>
                                    opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.ASSIGNED && opL.operationType.id === row.id
                                ).length
                            }
                        },
                        {
                            title: t(AtomicOperationBasicDtoOperationResultEnum.NOTASSIGNED) + " [" + operationList.filter(opL =>
                                opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.NOTASSIGNED
                            ).length + "]",
                            render: function (row) {
                                return operationList.filter(opL =>
                                    opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.NOTASSIGNED && opL.operationType.id === row.id
                                ).length
                            }
                        },
                        {
                            title: t(AtomicOperationBasicDtoOperationResultEnum.BROKEN) + " [" + operationList.filter(opL =>
                                opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.BROKEN
                            ).length + "]",
                            render: function (row) {
                                return operationList.filter(opL =>
                                    opL.operationResult === AtomicOperationBasicDtoOperationResultEnum.BROKEN && opL.operationType.id === row.id
                                ).length
                            }
                        },

                    ]}
                />
            </>}
        </Modal>
    </>
}
