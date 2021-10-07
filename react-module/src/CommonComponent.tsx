import React from "react";
import {Form, Table} from "react-bootstrap";
import {deriveLayerShapeLabel, Fas, processFr, withinGuard} from "./misc/misc";
import {Alert, Button, Button as AntButton, Card, Input, InputNumber, Modal, notification, Space, Spin} from "antd";
import {
    AtomicProductDefinitionBasicDto,
    AtomicProductDefinitionExtendedDto,
    AtomicProductExtendedDto,
    InputEntityWithPlacement,
    LayerShapeBasicDto,
    RectangleShapeExtendedDto,
    Surface,
    SurfaceWithPlacedEntities
} from "./openapi/models";
import {useTranslation} from "react-i18next";
import {atomicProductApi, atomicProductDefinitionApi, layerShapeApi, rectangleShapeApi} from "./api/exports";
import {UniversalSingleSelect} from "./page/UniversalEdit";
import {Layer, Rect, Stage, Star, Text} from "react-konva";
import sum from "lodash/sum";

export const ID_NEW = "new"

export type RwProps<T> = { v: T, setV: (v: T) => void };

export const FormControlComponent: React.FC<{name: string, object: any, setObject: (object: any) => void}> = ({name, object, setObject}) => {
    return <Form.Control type="text" value={object[name]} name= {name} placeholder="Enter value"
                         onChange={(e) => {
                             setObject({...object, [e.target.name]: e.target.value})
                         }}
    />
}

type PropertyWithDataFunction<T> = {
    title: string;
    extractFunction: (object: T) => string
}

export type AggregatedUniversalTableParameters<T> = {
    list: T[],
    propertiesWithDataFunction : PropertyWithDataFunction<T>[]
}

/* AZA: Old component, should be replaced by UniversalList everywhere*/
export const UniversalTable: React.FC<{
    data:AggregatedUniversalTableParameters<any> , onClickEvent: (id: number) => void
}> = ({
                                       data,
          onClickEvent
      }) => {
    return <Table striped bordered hover>
        <thead>
        <tr>
            {data.propertiesWithDataFunction?.map(property => <th key={property.title}>{property.title}</th>)}
        </tr>
        </thead>
        <tbody>
        {data.list?.map(listElement =>
            <tr onClick={() => onClickEvent(listElement.id)} key={listElement.id}>
                {data.propertiesWithDataFunction?.map(property => {
                        return <td style={{whiteSpace: "pre-line"}} key={`${property.title}-${listElement.id}`}>{property.extractFunction(listElement)}</td>
                    }
                )}
            </tr>
        )}
        </tbody>
    </Table>
}

export const OverlaySpinner : React.FC<{}> = () => (
    <div className={"overlay-spinner-container"}>
        <Fas icon={"sync"} spin size={"2x"}/>
    </div>
)

export const SpinCentered : React.FC<{}> = () => {
    return (
        <div style={{textAlign: "center"}}>
            <Spin/>
        </div>
    )
}
export const RectangleLayerShapeCreatorDialog: React.FC<{ onDone: () => void }> = ({onDone}) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const [saving, setSaving] = React.useState<boolean>(false);

    const [thickness, setThickness] = React.useState<number>(5);
    const [object, setObject] = React.useState<RectangleShapeExtendedDto>({
        width: 0,
        height: 0
    })

    React.useEffect(() => {
        setObject({...object, width: 0, height: 0});
    }, []);

    const addObject = async () => {
        await withinGuard(setSaving, async () => {
            await processFr(
                () => rectangleShapeApi.reShSaveAndCreateShape(object, thickness) as any,
                async (saved) => {
                    setOpened(false);
                    onDone();
                }
            )
        })
    }

    return (
        <>
            <AntButton size={"middle"} type={"primary"} onClick={() => setOpened(true)}>
                <Fas icon={"plus-circle"}/>
            </AntButton>
            <Modal visible={opened} title={<><Fas icon={"plus"}/> Add Rectangle Shape Def</>}
                   onCancel={() => setOpened(false)}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <div className={"mb-1"}>Szerokość [mm]</div>
                <InputNumber<number> value={object.width} onChange={width => setObject({...object, width})}/>
                <div className={"mb-1"}>Wysokość [mm]</div>
                <InputNumber<number>  value={object.height} onChange={height => setObject({...object, height})}/>
                <div className={"mb-1"}>Grubość [mm]</div>
                <InputNumber<number> value={thickness} onChange={newThickness => setThickness(newThickness)}/>
                <AntButton type={"primary"} size={"middle"} block loading={saving} className={"mt-1"} onClick={addObject}
                           disabled={object.width === 0 || object.height === 0}
                >
                    <Fas icon={"plus-circle"}/>&nbsp; Dodaj
                </AntButton>
            </Modal>
        </>
    )
};
export const ProductTypeCreatorDialog: React.FC<{ onDone: () => void }> = ({onDone}) => {
    const [opened, setOpened] = React.useState<boolean>(false);
    const [saving, setSaving] = React.useState<boolean>(false);

    const [productDef, setProductDef] = React.useState<AtomicProductDefinitionExtendedDto>({
        title: "",

    })
    React.useEffect(() => {
        setProductDef({...productDef, title: ""});
    }, []);

    const addProductDef = async () => {
        await withinGuard(setSaving, async () => {
            await processFr(
                () => atomicProductDefinitionApi.atPrTySaveObject(productDef) as any,
                async (saved) => {
                    setOpened(false);
                    onDone();
                }
            )
        })
    }

    return (
        <>
            <AntButton size={"middle"} type={"primary"} onClick={() => setOpened(true)}>
                <Fas icon={"plus-circle"}/>
            </AntButton>
            <Modal visible={opened} title={<><Fas icon={"plus"}/> Add Product Definition </>}
                   onCancel={() => setOpened(false)}
                   okButtonProps={{hidden: true}} cancelButtonProps={{hidden: true}}
            >
                <div className={"mb-1"}>Nazwa</div>
                <Input value={productDef.title} onChange={evt => setProductDef({...productDef, title: evt.target.value})}/>
                <AntButton type={"primary"} size={"middle"} block loading={saving} className={"mt-1"} onClick={addProductDef}>
                    <Fas icon={"plus-circle"}/>&nbsp; Dodaj
                </AntButton>
            </Modal>
        </>
    )
};
export const InlineProductAdder: React.FC<{ onAddedProduct: (prd: AtomicProductExtendedDto) => void, layerShape: LayerShapeBasicDto | null }> =
    ({onAddedProduct, layerShape}) => {

        const [object, setObject] = React.useState<AtomicProductExtendedDto>({
            layerShape
        });

        const [saving, setSaving] = React.useState<boolean>(false);
        const [thicknessConfirmed, setThicknessConfirmed] = React.useState<boolean>(false);

        const {t} = useTranslation();

        const addProduct = async () => {
            await withinGuard(setSaving, async () => {
                const response = await atomicProductApi.atPrSaveObject(object);
                if (response.status == 200) {
                    if (!response.data.success) {
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

        const setLayerShape = (layerShape: LayerShapeBasicDto) => {
            setObject({...object, layerShape})
            setThicknessConfirmed(false);
        }
        return (
            <Card size={"small"} title={<><Fas icon={"plus-circle"}/>&nbsp;{t("Add Product")}</>}>
                {saving && <SpinCentered/>}
                <UniversalSingleSelect getObjectsViaApi={layerShapeApi.laShGetObjectList}
                                       updateObject={setLayerShape}
                                       defaultValue={object?.layerShape}
                                       getItemLabel={(object: LayerShapeBasicDto) => deriveLayerShapeLabel(t, object)}
                                       fieldText={t("Layer Shape")}
                                       auxColumn={onDone => <RectangleLayerShapeCreatorDialog onDone={onDone}/>}
                />
                {/*<ProductTypeCreatorDialog onDone={console.log}/>*/}

                <UniversalSingleSelect fieldText={"Definition"} getObjectsViaApi={atomicProductDefinitionApi.atPrTyGetObjectList}
                                       getItemLabel={(objectMachine: AtomicProductDefinitionBasicDto) => objectMachine?.title}
                                       defaultValue={object?.atomicProductDefinition}
                                       updateObject={(selectedObject: AtomicProductDefinitionBasicDto) => setObject({
                                           ...object,
                                           atomicProductDefinition: selectedObject
                                       })}
                                       auxColumn={onDone => <ProductTypeCreatorDialog onDone={onDone}/>}
                />

                <AntButton block size={"small"} onClick={() => setThicknessConfirmed(true)} type={"primary"} style={{marginBottom: "1em"}}
                           disabled={thicknessConfirmed}>
                    <Fas icon={"check"}/>&nbsp;{t("Confirm Thickness")} ({object.layerShape.thickness ? object.layerShape.thickness : "-" } mm)
                    {thicknessConfirmed && <>&nbsp;{t("Confirmed")}</>}
                </AntButton>

                <AntButton block size={"middle"} disabled={object.atomicProductDefinition == null || !thicknessConfirmed} onClick={addProduct} loading={saving} type={"primary"}>
                    <Fas icon={"plus-circle"}/>&nbsp;{t("Add")}
                </AntButton>

                {!thicknessConfirmed &&
                    <Alert message={"Nie potwierdzono grubości"} showIcon={true} type={"warning"} className={"mt-2"}/>
                }
                {object.atomicProductDefinition == null  &&
                    <Alert message={"Nie wybrano defnicji produktu"} showIcon={true} type={"warning"} className={"mt-2"}/>
                }
            </Card>
        )
    }

export const VerticalSpacings : React.FC<{}> = ({children}) => {
    return (
        <Space direction={"vertical"} style={{width: "100%"}}>
            {children}
        </Space>
    )
}

export const SpacedBetween : React.FC<{}> = ({children}) => {
    return (
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            {children}
        </div>
    )
}


export const DownloadDxfButton: React.FC<{ spe: SurfaceWithPlacedEntities }> = ({spe}) => {
    const {t} = useTranslation();
    const [downloading, setDownloading] = React.useState<boolean>(false);

    // Example POST method implementation:
    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response; // parses JSON response into native JavaScript objects
    }

    const downloadFile = async () => {
        await withinGuard(setDownloading, async () => {
            const response = await postData("/cutting/dxfFromSpe/generate", spe);
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "pane.dxf";

            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //afterwards we remove the element again
        });
    }

    return (
        <Button size={"small"} title={t("Download Dxf")} onClick={downloadFile} loading={downloading}>
            <Fas icon={"download"}/>
        </Button>
    )
}
export const SurfaceWithEntitiesRenderer: React.FC<{ obj: SurfaceWithPlacedEntities, maxWidth: number }> = ({obj, maxWidth}) => {
    const surface: Surface = obj.surface;
    const entities: InputEntityWithPlacement[] = obj.inputEntityWithPlacements;

    // const maxWidth = window.screen.width / 4;

    const resMultiplier = maxWidth / surface.width;

    const renderEntity = (entity: InputEntityWithPlacement) => {
        const width = entity.placedBox.rotation ? entity.placedBox.size.y : entity.placedBox.size.x
        const height = entity.placedBox.rotation ? entity.placedBox.size.x : entity.placedBox.size.y
        const x = entity.placedBox.position.x;
        const y = entity.placedBox.position.y;
        return (
            <>
                <Rect
                    key={entity.inputEntity.id + "_1"}
                    id={entity.inputEntity.id + ""}
                    x={x * resMultiplier}
                    y={y * resMultiplier}
                    width={width * resMultiplier}
                    height={height * resMultiplier}
                    fill={"lightgrey"} strokeWidth={1} stroke={"black"}

                    fillLinearGradientStartPoint={{x: 0, y: 0}}
                    fillLinearGradientEndPoint={{x: 0, y: height * resMultiplier}}
                    // fillLinearGradientColorStops={[1, 'rgba(127,22,179,0.7)', 0, 'rgba(179,122,24,0.91)']}
                    fillLinearGradientColorStops={[1, 'rgba(102,101,101,0.55)', 0, 'rgba(255,255,255,0.5)']}
                    // fillLinearGradientColorStops={[1, 'rgba(0,0,0,0.7)', 0, 'rgba(255,255,255,0.5)']}
                    fillEnabled={true}
                    fillPriority='linear-gradient'
                    // shadowBlur={1}
                />
                <Text
                    key={entity.inputEntity.id + "_2"}
                    x={x * resMultiplier + 5}
                    y={y * resMultiplier + 5}
                    text={`${entity.inputEntity.id} (${width} x ${height})`}
                />
            </>
        )
    }

    const width = surface.width * resMultiplier;
    const height = surface.height * resMultiplier;

    return (
        <Stage width={width} height={height}>
            <Layer>
                {entities.map(renderEntity)}
                <Rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    shadowBlur={10}
                    // fill={"lightgrey"}
                    strokeWidth={1}
                    stroke={"black"}
                />
            </Layer>
        </Stage>
    )
}

export function konvaGenerateShapes() {
    return [...Array(10)].map((_, i) => ({
        id: i.toString(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 180,
        isDragging: false,
    }));
}

export const INITIAL_STATE = konvaGenerateShapes();
export const KonvaApp = () => {
    const [stars, setStars] = React.useState(INITIAL_STATE);

    const handleDragStart = (e: any) => {
        const id = e.target.id();
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: star.id === id,
                };
            })
        );
    };
    const handleDragEnd = (e: any) => {
        setStars(
            stars.map((star) => {
                return {
                    ...star,
                    isDragging: false,
                };
            })
        );
    };

    return (
        <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
                <Text text="Try to drag a star"/>
                {stars.map((star) => (
                    <Star
                        key={star.id}
                        id={star.id}
                        x={star.x}
                        y={star.y}
                        numPoints={5}
                        innerRadius={20}
                        outerRadius={40}
                        fill="#89b717"
                        opacity={0.8}
                        draggable
                        rotation={star.rotation}
                        shadowColor="black"
                        shadowBlur={10}
                        shadowOpacity={0.6}
                        shadowOffsetX={star.isDragging ? 10 : 5}
                        shadowOffsetY={star.isDragging ? 10 : 5}
                        scaleX={star.isDragging ? 1.2 : 1}
                        scaleY={star.isDragging ? 1.2 : 1}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))}
                <Rect
                    x={20}
                    y={50}
                    width={100}
                    height={100}
                    fill="red"
                    shadowBlur={10}
                />
            </Layer>
        </Stage>
    );
};
export const displayFillRatio = (fillRatio: number, withoutBraces: boolean = false) => {
    const mainPart = `${(fillRatio * 100).toFixed(2)} %`;
    return withoutBraces ? mainPart : `(${mainPart})`;
}
export const getWaste = (rf: SurfaceWithPlacedEntities): number => rf.surface.width * rf.surface.height * (1.0 - rf.fillRatio);
export const getWasteFromSurfaces = (rf: SurfaceWithPlacedEntities[]): number => sum(rf.map(getWaste));
export const getWasteWithFormat = (rf: SurfaceWithPlacedEntities): string => (getWaste(rf) / (1000 * 1000)).toFixed(2) + " m2 Waste";
