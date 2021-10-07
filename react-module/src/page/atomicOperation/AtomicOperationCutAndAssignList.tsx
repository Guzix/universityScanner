import React from "react";
import {
    AsyncOpResult,
    Fas,
    ListItemProperty,
    MlConstants,
    processFrWithLoader,
    processRawResWithLoader,
    Rw,
    t,
    useAsyncOp,
    useRw,
    withinGuard
} from "../../misc/misc";
import {
    AtomicOperationBasicDto,
    AtomicOperationExtendedDto,
    AtomicProductBasicDto,
    CalculatePathsRequest,
    InputEntity,
    IProductDefsWithTotalAmount,
    OperationTypeBasicDto,
    ResultPath,
    SurfaceWithPlacedEntities
} from "../../openapi/models";
import {atomicOperationApi, cuttingApi, operationTypeApi, warehouseApi} from "../../api/exports";
import {FormCheck} from "react-bootstrap";
import {enumToPrettyString, UniversalSingleSelect} from "../UniversalEdit";
import {UniversalListArray} from "../UniversalListArray";
import {useHistory} from "react-router-dom";
import {
    displayFillRatio,
    DownloadDxfButton,
    getWasteFromSurfaces,
    getWasteWithFormat,
    SpacedBetween,
    SpinCentered,
    SurfaceWithEntitiesRenderer
} from "../../CommonComponent";
import find from "lodash/find";
import flatMap from "lodash/flatMap";
import max from "lodash/max";
import range from "lodash/range";
import toPairs from "lodash/toPairs";
import groupBy from "lodash/groupBy";
import mapValues from "lodash/mapValues";
import {Alert, Button, Card, Col, Empty, Input, notification, Row, Space, Table, Tooltip} from "antd";
import {useTranslation} from "react-i18next";

export const AtomicOperationCutAndAssignList: React.FC<{ path?: string, show?: boolean }> = ({path, show}) => {
    const [atomicOperationsId, setAtomicOperationsId] = React.useState<number[]>([]);
    const [operation, setOperation] = React.useState<AtomicOperationExtendedDto | null>();
    const [atomicOperationList, setAtomicOperationList] = React.useState<AtomicOperationBasicDto[] | null>();
    const [downloading, setDownloading] = React.useState<boolean>(false);

    const history = useHistory();

    const downloadList = async () => {
        await processRawResWithLoader<AtomicOperationBasicDto[]>(setDownloading,
            () => atomicOperationApi.getAtomicOperationsWithNotStartedResult() as any,
            async (result) => {
                setAtomicOperationList(result);
                if(MlConstants.isDev) {
                    setAtomicOperationsId(result.filter(rt => rt.operationType.title.includes("Ciecie")).map(rt => rt.id) as number[]);
                }
            })
    }

    React.useEffect(() => {
        downloadList();
    }, []);

    const mainPath = history.location.pathname != path;
    const shouldRender = show || mainPath;

    const filteredList = atomicOperationList?.filter(atomicOp => operation?.operationType?.id ? atomicOp?.operationType?.id === operation?.operationType?.id : atomicOp);

    const selectFilteredOps = () => {
        if(!filteredList) {
            return;
        }
        setAtomicOperationsId(filteredList.map(obj => obj.id));
    }

    return (
        <>
            {downloading && <SpinCentered/>}
            {shouldRender && !downloading && atomicOperationList != null && <>
                <Row style={{marginTop: "1rem"}}>
                    <Col sm={5}>
                        <UniversalSingleSelect fieldText={"Typ Operacji"} placeholder={"Type"}
                                               getObjectsViaApi={operationTypeApi.opTyGetObjectList}
                                               getItemLabel={(operationType: OperationTypeBasicDto) => operationType?.title}
                                               defaultValue={operation?.operationType}
                                               updateObject={(selectedObject: OperationTypeBasicDto) => {
                                                   setOperation({...operation, operationType: selectedObject})
                                               }}
                                               onLoad={(items, setItem) => {
                                                   const targetItem = find(items, it => it.title.includes("Ciecie"));
                                                   targetItem && setItem(targetItem as any);
                                               }}
                        />
                    </Col>
                </Row>
                <UniversalListArray
                    onRowClick={obj =>
                        setAtomicOperationsId(atomicOperationsId.includes(obj.id) ?
                            atomicOperationsId.filter(id => id !== obj.id) :
                            [...atomicOperationsId, obj.id]
                        )
                    }
                    hideAddButton={true} properties={[
                    {extractFunction: (object) => <><FormCheck type="checkbox" checked={atomicOperationsId.includes(object?.id)}/></>},
                    {extractFunction: (object) => object.id, label: "Id"},
                    {extractFunction: (object) => object.operationType?.title, label: t("Operation Type")},
                    {extractFunction: (object) => t(enumToPrettyString(object.operationResult?.valueOf())), label: t("Operation Result")},
                    {extractFunction: (object) => object.priority, label: t("Priority")},
                    {
                        extractFunction: (object) => object.inputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`),
                        label: t("Input Products")
                    },
                    {
                        extractFunction: (object) => object.outputProducts?.map((product: AtomicProductBasicDto) => `${product.atomicProductDefinition?.title} id ${product.id} \n`),
                        label: t("Output Products")
                    }, ,
                    {extractFunction: (object) => object.productionOrder?.erpOrder?.orderNumber, label: t("Order Number")},

                ] as ListItemProperty<AtomicOperationBasicDto>[]} getObjectArray={filteredList}/>

                <OperationCutAndAssignComponent operations={atomicOperationList.filter(ao => atomicOperationsId.includes(ao.id))}
                                                deselectOp={console.log}
                />
            </>
            }
        </>
    )
}

type GlassSheet = {
    id: number;
    srcId: number;
    name: string;

    width: number;
    height: number;
    thickness: number;
}

export const MlInputLabel : React.FC<{}> = ({children}) => <div style={{marginBottom: "0.25em"}}>{children}</div>;

export const GlassSheetEditor : React.FC<{sheets: GlassSheet[], setSheets: (sheets: GlassSheet[]) => void}> = ({sheets, setSheets}) => {
    const {t} = useTranslation();

    const [name, setName] = React.useState<string>("");
    const [width, setWidth] = React.useState<number>(1000);
    const [height, setHeight] = React.useState<number>(1000);
    const [thickness, setThickness] = React.useState<number>(5);

    const addSheet = () => {
        const maxId = max(sheets.map(sh => sh.id));
        const newId = maxId ? maxId + 1 : 1;
        const newSheet: GlassSheet = {
            id: newId,
            srcId: 1,
            name,
            width, height,
            thickness
        };
        setSheets([...sheets, newSheet]);
    }

    const deleteSheet = (sheetId: number) => {
        setSheets(sheets.filter(sh => sh.id !== sheetId));
    }

    return (
        <div>
            <Card title={<><Fas icon={"layer-group"}/>&nbsp;Tafle [{sheets.length}]</>} size={"small"}>
                <Space direction={"vertical"} style={{width: "100%"}}>
                    <Table size={"small"} bordered={true} dataSource={sheets}
                           columns={[
                               {title: "Id", dataIndex: "id"},
                               {title: t("Name"), dataIndex: "name"},
                               {title: t("Width"), dataIndex: "width"},
                               {title: t("Height"), dataIndex: "height"},
                               {title: t("Thickness"), dataIndex: "thickness"},
                               {title: "Ops", render: function renderButtons(row) {
                                   return (
                                       <Button danger type={"primary"} title={"Delete"} size={"small"} onClick={() => deleteSheet(row.id)}>
                                           <Fas icon={"trash"}/>
                                       </Button>
                                   )
                               }}
                           ]} pagination={false}
                    />
                    <Card title={<><Fas icon={"plus-circle"}/>&nbsp;Dodaj Tafle</>} size={"small"}>
                        <Space direction={"vertical"} style={{width: "100%"}}>
                            <div>
                                <MlInputLabel>{t("Name")}</MlInputLabel>
                                <Input value={name} onChange={evt => setName(evt.target.value)} size={"small"}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Width")}</MlInputLabel>
                                <Input value={width} onChange={evt => setWidth(parseInt(evt.target.value))} size={"small"}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Height")}</MlInputLabel>
                                <Input value={height} onChange={evt => setHeight(parseInt(evt.target.value))} size={"small"}/>
                            </div>
                            <div>
                                <MlInputLabel>{t("Thickness")}</MlInputLabel>
                                <Input value={thickness} onChange={evt => setThickness(parseFloat(evt.target.value))} size={"small"}/>
                            </div>
                            <Button type={"primary"} block={true} size={"small"} onClick={addSheet} disabled={name === "" || width <= 0 || height <= 0}>
                                <Fas icon={"plus-circle"}/>&nbsp;Add
                            </Button>
                        </Space>
                    </Card>
                </Space>
            </Card>
        </div>
    )
}

export const SourceSheetsComponent: React.FC<{control: AsyncOpResult<IProductDefsWithTotalAmount[]>, selectedSheets: Rw<Record<number,number>>}> =
    ({control, selectedSheets}) => {

    const {res, executing: downloading, execute: download} = control;
    const [searchQuery, setSearchQuery] = React.useState<string>("");

    React.useEffect(() => {
        download();
    },[]);

    const changeItemCount = (itemId: number, delta: number) => {
        const currentAmount = selectedSheets.v[itemId] || 0;
        selectedSheets.sv({...selectedSheets.v, [itemId]: currentAmount + delta});
    }

    const sourceFiltered = res != null ? res.filter(r =>
        r.defTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        selectedSheets.v[r.id]
    ) : [];
    return (
        <Card title={<><Fas icon={"layer-group"}/>&nbsp; Tafle {res ? `[${sourceFiltered.length}/${res.length}]` : ""}</>} size={"small"} style={{marginBottom: "1em"}}>
            {(downloading || res == null) ? <SpinCentered/> :
                <>
                    <Input defaultValue={searchQuery}
                           onChange={evt => setSearchQuery(evt.target.value)}
                           placeholder={"Wyszukaj"}
                           addonAfter={<Fas icon={"search"}/>}
                           allowClear={true}
                           style={{marginBottom: "0.5em"}}
                    />
                    <Table size={"small"} bordered={true} dataSource={sourceFiltered} rowKey={"id"} pagination={false}
                           style={{maxHeight: "500px", overflow: "scroll"}}
                           columns={[
                               {title: "Id", dataIndex: "id"},
                               {title: t("Title"), dataIndex: "defTitle"},
                               {title: t("Total Amount"), dataIndex: "totalAmount"},
                               {title: t("Available Amount"), dataIndex: "availableAmount"},
                               {title: t("Width") + " [mm]", dataIndex: ["layerShape", "rectangleShape", "width"]},
                               {title: t("Height") + " [mm]", dataIndex: ["layerShape", "rectangleShape", "height"]},
                               {title: t("Thickness") + " [mm]", dataIndex: ["layerShape", "thickness"]},
                               {title: t("Selected Amount"), render: function renderSelectedAmount(row) {
                                       const amount = selectedSheets.v[row.id] || 0;
                                       return (
                                           <div style={{display: "flex", justifyContent: "space-between"}}>
                                               <div>{amount}</div>
                                               <Space>
                                                   <Button size={"small"} type={"primary"} title={"Dodaj sztukę"} disabled={amount == row.availableAmount} onClick={() => changeItemCount(row.id, 1)}>
                                                       <Fas icon={"plus"}/>
                                                   </Button>
                                                   <Button size={"small"} type={"primary"} title={"Odejmij sztukę"} disabled={amount == 0} danger onClick={() => changeItemCount(row.id, -1)}>
                                                       <Fas icon={"minus"}/>
                                                   </Button>
                                               </Space>
                                           </div>
                                       );
                                   }}
                           ]}
                    />
                </>
            }
        </Card>
    );
}

export const OperationCutAndAssignComponent : React.FC<{operations: AtomicOperationBasicDto[], deselectOp: (operationId: number) => void}> = ({operations, deselectOp}) => {
    const products = flatMap(operations, op => op.outputProducts);
    const [calculatingPaths, setCalculatingPaths] = React.useState<boolean>(false);
    const [resultPaths, setResultPaths] = React.useState<ResultPath[] | null>(null);
    const [acceptedThicknessValue, setAcceptedThicknessValue] = React.useState<boolean>(false);

    const selectedSheets = useRw<Record<number, number>>({});
    const stockControl = useAsyncOp<IProductDefsWithTotalAmount[]>(
        () => warehouseApi.getWarehouseProducts(),
        res => {
            const targetIdx = 1;
            const targetAmount = 2;
            if(MlConstants.isDev && res.length > targetIdx && res[targetIdx].availableAmount >= targetAmount) {
                selectedSheets.sv({[res[targetIdx].id] : targetAmount});
            }
        }
    );

    const generateGlassSheets = (selectedSheets: Record<number, number>, data: IProductDefsWithTotalAmount[]):GlassSheet[] => {
        let idx = 0;

        return flatMap(toPairs(selectedSheets), ([defId, amount]) => {
            const defIdInt = parseInt(defId);
            const typeDef = find(data, dt => dt.id === defIdInt);
            if(!typeDef) {
                return [];
            }
            return range(0, amount).map(idxLocal => ({
                id: idx++,
                srcId: defIdInt,
                name: typeDef.defTitle,
                width: typeDef.layerShape.rectangleShape.width,
                height: typeDef.layerShape.rectangleShape.height,
                thickness: typeDef.layerShape.thickness
            } as GlassSheet))
        });
    }

    const sheets  = stockControl.res ? generateGlassSheets(selectedSheets.v, stockControl.res) : [];

    const planCuts = async () => {
        const request: CalculatePathsRequest = {
            surfaces: sheets,
            entities: products.map(prd => ({
                id: prd.id,
                label: prd.atomicProductDefinition.title,
                dimensions: {
                    width: prd.layerShape.rectangleShape.width,
                    height: prd.layerShape.rectangleShape.height,
                }
            }) as InputEntity)
        };
        await processFrWithLoader<ResultPath[]>(setCalculatingPaths,
            () => cuttingApi.calculatePaths(request) as any,
            async (paths) => {
                setResultPaths(paths);
                if(paths.length === 0) {
                    notification.error({ message: "Nie znaleziono rozwiązania zawierającego wszystkie elementy"});
                }
            });
       // await
    }

    const onSelectSolution = async (rp: ResultPath):Promise<void> => {
        const srcGlassSheets = generateGlassSheets(selectedSheets.v, stockControl.res!);
        // @ts-ignore
        const surfaceToSheetDefIdMap = mapValues(groupBy(srcGlassSheets, et => et.srcId), v => v.map(vt => vt.id));

        const {data} = await cuttingApi.selectSolution({
            spes: rp.surfaceWithPlacedEntities,
            surfaceToSheetDefIdMap
        })

        if(data.success) {
            window.location.reload();
        } else {
            notification.error({
                message: "Failed to select solution",
                description: data.error
            })
        }
    }

    const isThicknessAccepted = () => {
        if (products.length > 0 && sheets.length > 0){
            const thickness = products[0].layerShape.thickness
            const result = products.map(prod => prod.layerShape.thickness === thickness)
            sheets.map(sheet => result.push(sheet.thickness === thickness))
            if (!result.includes(false)){
                setAcceptedThicknessValue(true)
            } else {
                setAcceptedThicknessValue(false)
            }
        }
    }

    React.useEffect(() => {
        isThicknessAccepted()
    }, [products,sheets])

    React.useEffect(() => {
        // planCuts();
    },[]);

    return (
        <Card title={<><Fas icon={"cut"}/> Planowanie [{products.length}]</>} size={"small"} style={{marginTop: "1em"}}>
            <Row gutter={5}>
                <Col sm={12}>
                    <Table size={"small"} bordered={true} dataSource={products}
                           rowKey={"id"}
                           columns={[
                               {title: "Id", dataIndex: "id"},
                               {title: t("Definition"), dataIndex: ["atomicProductDefinition", "title"]},
                               {title: t("Width") + " [mm]", dataIndex: ["layerShape", "rectangleShape", "width"]},
                               {title: t("Height") + " [mm]", dataIndex: ["layerShape", "rectangleShape", "height"]},
                               {title: t("Thickness") + " [mm]", dataIndex: ["layerShape", "thickness"]},
                               {title: t("Order"),
                                   render: function renderOrderNumber(prd) {
                                        const targetOp = find(operations, op => op.outputProducts.includes(prd));
                                        return (
                                            <>
                                                {/*@ts-ignore*/}
                                                {targetOp ? targetOp.productionOrder.orderNumber : ""}
                                            </>
                                        )
                                   }
                               },
                               {title: t("Operation"),
                                   render: function deselectOpComponent(prd) {
                                       const targetOp = find(operations, op => op.outputProducts.includes(prd));

                                       const deselectOpInt = () => {
                                            if(targetOp) {
                                                // @ts-ignore
                                                deselectOp(targetOp.id);
                                            }
                                       }
                                       return (
                                           <div style={{textAlign: "center"}}>
                                               <Button type={"primary"} title={t("Deselect Operation")} size={"small"} danger
                                                       disabled={targetOp === null}
                                                       onClick={deselectOpInt}>
                                                   <Fas icon={"trash"}/>
                                               </Button>
                                           </div>
                                       )
                                   }
                               }
                           ]} pagination={false}
                    />
                </Col>
                <Col sm={12}>
                    <SourceSheetsComponent control={stockControl} selectedSheets={selectedSheets}/>
                </Col>
            </Row>
            <Tooltip placement={"top"} title={!acceptedThicknessValue ? t("Wrong thickness") : ""} >
                <Button type={"primary"} block className={"mt-2 mb-2"} onClick={planCuts} loading={calculatingPaths}
                        disabled={products.length === 0 || sheets.length === 0 || !acceptedThicknessValue}>
                    <Fas icon={"pencil-ruler"}/>&nbsp; {t("Plan Cuts")}
                </Button>
            </Tooltip>
            {products.length === 0 &&
                <Alert message={"Nie wybrano produktów"} showIcon={true} type={"warning"} className={"mt-2"}/>
            }
            {sheets.length === 0 &&
                <Alert message={"Nie wybrano źródłowych tafli"} showIcon={true} type={"warning"} className={"mt-2"}/>
            }

            {resultPaths && <ResultPathSection resultPaths={resultPaths} sheets={sheets} onSelectSolution={onSelectSolution}/> }
        </Card>
    )
}

export const ResultPathSection : React.FC<{resultPaths: ResultPath[], sheets: GlassSheet[], onSelectSolution: (rp: ResultPath) => Promise<void>}> =
    ({resultPaths, sheets, onSelectSolution}) => {
    const [pathIdx, setPathIdx] = React.useState<number | null>(null);

    React.useEffect(() => {
        if(resultPaths.length > 0) {
            setPathIdx(0);
        }
    }, [resultPaths]);

    return (
        <div>
            <Card title={<><Fas icon={"cut"}/>&nbsp; Wynik Ciecia [{resultPaths.length}]</>} size={"small"}>
                <Row gutter={5}>
                    <Col sm={3}>
                        <ResultPathTable results={resultPaths} pathIdx={pathIdx} setPathIdx={setPathIdx}/>
                    </Col>
                    <Col sm={21}>
                        {/*Hack Workaround*/}
                        {(pathIdx != null && resultPaths[pathIdx]) ?
                            <div>
                                <ResultPathRenderer resultPath={resultPaths[pathIdx]} sheets={sheets}
                                                    onSelectSolution={async () => onSelectSolution(resultPaths[pathIdx])}/>
                            </div> :
                            <Empty description={"Nie wybrano ścieżki"}/>
                        }
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export const ResultPathTable : React.FC<{results: ResultPath[], pathIdx: number | null, setPathIdx: (val: number | null) => void}> =
    ({results, pathIdx, setPathIdx}) => {

    return (
        <Table size={"small"} bordered={true} pagination={false} dataSource={results}
            onRow={(record, rowIdx) => {
                return {
                    onClick: evt => setPathIdx(rowIdx!)
                }
            }}
            rowKey={row => results.indexOf(row)}
            rowClassName={(record, idx) => idx === pathIdx ? "ant-row-cursor ant-row-highlighted" : "ant-row-cursor"}
            columns={[
                {title: t("Number of Sheets"), render: row => row.surfaceWithPlacedEntities.length},
                {title: t("Fill Ratio"), render: row => displayFillRatio(row.fillRatio, true)},
                {title: t("Waste") + " [m2]", render: row => {
                    return (getWasteFromSurfaces(row.surfaceWithPlacedEntities) / (1000 * 1000)).toFixed(2);
                }},
            ]}
        />
    )
}

export const ResultPathRenderer : React.FC<{resultPath: ResultPath, sheets: GlassSheet[], onSelectSolution: () => Promise<void>}> = ({resultPath, sheets, onSelectSolution}) => {
    const [selectingSolution, setSelectingSolution] = React.useState<boolean>(false);
    const surfacesWithPlacedEntities: SurfaceWithPlacedEntities[] = resultPath.surfaceWithPlacedEntities;

    const renderSwpe = (swpe: SurfaceWithPlacedEntities) => {
        const targetSheet = find(sheets, sh => sh.id === swpe.surface.id);
        const title = targetSheet ? targetSheet.name : "---";
        return (
            <Card title={<SpacedBetween>
                <div> <Fas icon={"th"}/>&nbsp; {title} ({swpe.surface.width} x {swpe.surface.height}) {displayFillRatio(swpe.fillRatio)} {getWasteWithFormat(swpe)} </div>
                <DownloadDxfButton spe={swpe}/>
            </SpacedBetween>}
                  key={swpe.surface.id} size={"small"}
                  style={{display: "inline-block"}}
            >
                <SurfaceWithEntitiesRenderer obj={swpe} key={swpe.surface.id} maxWidth={window.screen.width / 4}/>
            </Card>
        )
    }

    const onSelectSolutionProxy = async () => {
        await withinGuard(setSelectingSolution, onSelectSolution);
    }

    return (
        <Card title={<><Fas icon={"list"}/>&nbsp;Wynik {displayFillRatio(resultPath.fillRatio)}</>} size={"small"}>
            <Space style={{flexWrap: "wrap"}}>
                {surfacesWithPlacedEntities.map(swpe => renderSwpe(swpe))}
            </Space>
            <Button type={"primary"} size={"middle"} block={true} style={{marginTop: "1em"}} onClick={onSelectSolutionProxy} loading={selectingSolution}>
                <Fas icon={"check"}/>&nbsp;Wybierz rozwiązanie i przypisz do tafli
            </Button>
        </Card>
    )
}


