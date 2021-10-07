import {PortModel, PortModelOptions} from "@projectstorm/react-diagrams-core";
import {AbstractReactFactory, BasePositionModelOptions, GenerateModelEvent, GenerateWidgetEvent} from "@projectstorm/react-canvas-core";
import createEngine, {
    DefaultDiagramState,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    LinkModel,
    PortWidget
} from "@projectstorm/react-diagrams";
import React from "react";
import styled from "@emotion/styled";
import {deriveLayerShapeLabel, Fas, prvtDeflt, t} from "../../misc/misc";
import {Resizable} from "react-resizable";
import {DiagramCtx} from "../../context/DiagramCtx";
import {Button, notification, Tooltip} from "antd";
import * as _ from "lodash";
import {AtomicOperationExtendedDto, AtomicProductExtendedDto, OperationDiagramData, TreeNodeAtomicOperationExtendedDto} from "../../openapi/models";
import fromPairs from "lodash/fromPairs";
import {flatMapTreeNode} from "./OperationBuilderPage";
import {colorMap, getDepth} from "./DiagramRenderer";
import flatMap from "lodash/flatMap";
import size from "lodash/size";
import "react-resizable/css/styles.css";

export interface DefaultPortModelOptions extends PortModelOptions {
    label?: string;
    in?: boolean;
}

export interface DefaultNodeModelOptions extends BasePositionModelOptions {
    name?: string;
    color?: string;
}

export const S = {
    Node: styled.div<{ background: string; selected: boolean }>`
		background-color: ${(p) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${(p) => (p.selected ? 'rgb(0,192,255)' : 'black')};
	`,
    Title: styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: nowrap;
		justify-items: center;
	`,
    TitleName: styled.div`
		flex-grow: 1;
		padding: 5px 5px;
	`,
    Ports: styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`,
    PortsContainer: styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;

		&:first-of-type {
			margin-right: 10px;
		}

		&:only-child {
			margin-right: 0px;
		}
	`,
    Port: styled.div`
        width: 16px;
        height: 16px;
        z-index: 10;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 8px;
        cursor: pointer;
        &:hover {
            background: rgba(0, 0, 0, 1);
        }
    `,
    PortLabel: styled.div`
		display: flex;
		margin-top: 1px;
		align-items: center;
	`,
    Label: styled.div`
		padding: 0 5px;
		flex-grow: 1;
	`,
    PortInLabel: styled.div`
		width: 15px;
		height: 15px;
        cursor: pointer;
		background: rgba(255, 255, 255, 0.1);

		&:hover {
			background: rgb(192, 255, 0);
		}
	`,
    PortInLabelAvailable: styled.div`
		width: 15px;
		height: 15px;
        cursor: pointer;
		background: rgb(81, 147, 81);

		&:hover {
			background: rgb(192, 255, 0);
		}
	`
}
export type NodeDims = {
    width: number;
    height: number;
}
export type OperationNodeModelProps = {
    operationId: number;
    operation: AtomicOperationExtendedDto;
    dims: NodeDims | null;
}

export class OperationNodeModel extends DefaultNodeModel {
    private operationId: number;
    private operation: AtomicOperationExtendedDto;
    private dims: NodeDims | null;

    constructor(options: DefaultNodeModelOptions & OperationNodeModelProps) {
        super({...options, type: "operation"});
        this.operationId = options.operationId;
        this.operation = options.operation;
        this.dims = options.dims;
    }

    public getOperationId(): number {
        return this.operationId;
    }

    public getOperation(): AtomicOperationExtendedDto {
        return this.operation;
    }

    public getDims(): NodeDims | null {
        return this.dims;
    }

    public setDims(dims: NodeDims | null) {
        this.dims = dims;
    }
}

export interface OperationNodeProps {
    node: OperationNodeModel;
    engine: DiagramEngine;
}

export class OperationPortModel extends DefaultPortModel {
    private productId: number;
    private product: AtomicProductExtendedDto;

    constructor(options: DefaultPortModelOptions & { productId: number, product: AtomicProductExtendedDto }) {
        super({...options, type: "operation"});
        this.productId = options.productId;
        this.product = options.product;
    }

    public getProductId(): number {
        return this.productId;
    }

    public getProduct(): AtomicProductExtendedDto {
        return this.product;
    }

    canLinkToPort(port: PortModel): boolean {
        return false;
    }
}

export interface DefaultPortLabelProps {
    port: OperationPortModel;
    engine: DiagramEngine;
}

export class DefaultPortLabel extends React.Component<DefaultPortLabelProps> {
    render() {
        const productId = this.props.port.getProductId();
        const product = this.props.port.getProduct();
        const inPort = this.props.port.getOptions().in;
        const label =
            <S.Label className={!inPort ? "right-aligned-product" : undefined}>
                {this.props.port.getOptions().label}&nbsp;
                <Tooltip title={<><Fas icon={"expand"}/>&nbsp;{deriveLayerShapeLabel(t, product.layerShape)}</>} style={{cursor: "pointer"}}
                         overlayInnerStyle={{width: "300px", textAlign: "center"}}>
                    <Fas icon={"info-circle"} style={{cursor: "pointer"}}/>
                </Tooltip>
            </S.Label>;
        const qualifiesForOperation = inPort && size(this.props.port.getLinks()) === 0;

        const title = inPort ? (qualifiesForOperation ? "Dodaj Operacje" : "Operacja Dodana") : "";
        const PortImpl = qualifiesForOperation ? S.PortInLabelAvailable : S.PortInLabel;

        const port = (
            <DiagramCtx.Consumer>
                {(v) =>
                    <PortWidget engine={this.props.engine} port={this.props.port}>
                        <PortImpl title={title} onClick={() => {
                            if (qualifiesForOperation) {
                                v!.productIdForOperationCreate.sv(productId)
                            } else {
                                if (inPort) {
                                    notification.warn({message: "Operacja już istnieje"});
                                }
                            }
                        }}/>
                    </PortWidget>
                }
            </DiagramCtx.Consumer>
        );

        return (
            <S.PortLabel>
                {inPort ? port : label}
                {inPort &&
                <DiagramCtx.Consumer>
                    {(v) =>
                        <>
                            <Button size={"small"} type={"primary"} className={"diagram-button"}
                                    onClick={() => v!.productToModify.sv(product)}
                                    title={"Edytuj Produkt"} style={{marginLeft: "4px"}}
                            >
                                <Fas icon={"edit"}/>
                            </Button>
                            <Button size={"small"} type={"primary"} className={"diagram-button"} danger
                                    onClick={() => v!.productIdForDeletion.sv(productId)}
                                    title={"Usuń Produkt Wejściowy z Pochodnymi Obiektami"} style={{marginLeft: "4px"}}
                            >
                                <Fas icon={"trash"}/>
                            </Button>
                        </>
                    }
                </DiagramCtx.Consumer>
                }
                {inPort ? label : port}
            </S.PortLabel>
        );
    }
}

/**
 * Default node that models the DefaultNodeModel. It creates two columns
 * for both all the input ports on the left, and the output ports on the right.
 */
export class OperationNodeWidget extends React.Component<OperationNodeProps> {
    state = {
        // @ts-ignore
        width: this.props.node.getDims() ? this.props.node.getDims().width : 560,
        // @ts-ignore
        height: this.props.node.getDims() ? this.props.node.getDims().height : 100,
    };
    generatePort = (port: any) => {
        return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()}/>;
    };
    // On top layout
    onResize = (event: any, {element, size, handle}: any) => {
        const dims = {width: size.width, height: size.height};
        this.setState(dims);
        this.props.node.setDims(dims);
        prvtDeflt(event);
    };

    render() {
        const operationId = this.props.node.getOperationId();
        const operation = this.props.node.getOperation();

        return (
            <S.Node
                data-default-node-name={this.props.node.getOptions().name}
                selected={this.props.node.isSelected()}
                background={this.props.node.getOptions().color || ""}
            >
                <Resizable height={this.state.height} width={this.state.width} onResize={this.onResize}
                           onResizeStart={prvtDeflt} onResizeStop={prvtDeflt}
                           minConstraints={[300, 70]}
                >
                    <div style={{width: this.state.width + "px", height: this.state.height + "px"}}>
                        <S.Title>
                            <div style={{display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center"}}>
                                <S.TitleName><Fas icon={"tools"}/>&nbsp;{this.props.node.getOptions().name}</S.TitleName>
                                <div>
                                    <DiagramCtx.Consumer>
                                        {(v) =>
                                            <div>
                                                <Button size={"small"} type={"primary"} className={"diagram-button"}
                                                        onClick={() => v!.operationToModify.sv(operation)}
                                                        title={"Modyfikuj Operacje"} style={{marginRight: "5px"}}
                                                >
                                                    <Fas icon={"edit"}/>
                                                </Button>
                                                <Button size={"small"} type={"primary"} className={"diagram-button"} danger
                                                        onClick={() => v!.operationIdForDeletion.sv(operationId)}
                                                        title={"Usuń Operacje z Pochodnymi Obiektami"} style={{marginRight: "5px"}}
                                                >
                                                    <Fas icon={"trash"}/>
                                                </Button>
                                            </div>
                                        }
                                    </DiagramCtx.Consumer>
                                </div>
                            </div>
                        </S.Title>
                        <S.Ports>
                            <S.PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</S.PortsContainer>
                            <S.PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</S.PortsContainer>
                        </S.Ports>
                        <div>
                            <DiagramCtx.Consumer>
                                {(v) =>
                                    <Button size={"small"} type={"primary"} className={"diagram-button"} style={{marginTop: 5}}
                                            onClick={() => v!.operationIdForInputProductCreate.sv(operationId)}
                                            title={"Dodaj Produkt Wejściowy"}
                                    >
                                        <Fas icon={"plus"}/>
                                    </Button>
                                }
                            </DiagramCtx.Consumer>
                        </div>
                    </div>
                </Resizable>
            </S.Node>
        )
    }
}

export class OperationNodeFactory extends AbstractReactFactory<OperationNodeModel, DiagramEngine> {
    constructor() {
        super('operation');
    }

    generateReactWidget(event: GenerateWidgetEvent<OperationNodeModel>): JSX.Element {
        return <OperationNodeWidget node={event.model} engine={this.engine}/>;
    }

    generateModel(event: GenerateModelEvent): OperationNodeModel {
        return new OperationNodeModel({operationId: 0, dims: null, operation: {}});
    }
}

export const extractOperationDiagramData = (engine: DiagramEngine): OperationDiagramData => {
    const model = engine.getModel();
    return {
        zoomLevel: model.getZoomLevel(),
        offset: {x: model.getOffsetX(), y: model.getOffsetY()},
        // @ts-ignore
        nodeDataMap: fromPairs(engine.getModel().getNodes().map(nd => [nd.operationId,
            {
                position: {
                    x: nd.getPosition().x,
                    y: nd.getPosition().y
                },
                // @ts-ignore
                dimensions: nd.getDims()
            }
        ]))
    }
}
export const createEngineFromTree = (tree: TreeNodeAtomicOperationExtendedDto, engineArg: DiagramEngine | null, rootChanged: boolean): DiagramEngine => {
    let engine = engineArg == null ? createEngine({registerDefaultZoomCanvasAction: true, registerDefaultDeleteItemsAction: false}) : engineArg;

    const operations = flatMapTreeNode(tree);

    // If engine exists and tree didn't change
    let diagramData: OperationDiagramData | null = (engine && engine.getModel() && !rootChanged) ?
        // Extract from state - used in case of adding operation and stuff
        extractOperationDiagramData(engine) :
        // Otherwise load from output product
        operations[operations.length - 1].outputProducts[0].operationDiagramData;

    engine.getNodeFactories().registerFactory(new OperationNodeFactory());

    const operationNodeMap: Record<number, DefaultNodeModel> = {};
    const outPortMap: Record<number, DefaultPortModel> = {};
    const inPortMap: Record<number, DefaultPortModel> = {};
    const links = [] as LinkModel[];

    operations.forEach((op: AtomicOperationExtendedDto, idx) => {
        const color = op.operationResult ? colorMap[op.operationResult] : 'rgb(0,192,255)';
        const depth = getDepth(tree, op);

        const node = new OperationNodeModel({
            name: op.operationType?.title + " (Poziom " + depth + ")",
            color,
            operationId: op.id,
            operation: op,
            dims: null
        });

        node.setPosition(100 * (idx * 2), 100 * depth);
        if (diagramData && diagramData.nodeDataMap && diagramData.nodeDataMap[op.id]) {
            const nodeData = diagramData.nodeDataMap[op.id];
            const targetPos = nodeData.position;
            if (targetPos) {
                node.setPosition(targetPos.x, targetPos.y);
            }
            const targetDims = nodeData.dimensions;
            if (targetDims) {
                node.width = targetDims.width;
                node.height = targetDims.height;

                node.setDims(targetDims);
            }
        }
        op.outputProducts.forEach((prd: AtomicProductExtendedDto) => {
            outPortMap[prd.id] = node.addPort(new OperationPortModel({
                in: false,
                label: prd.atomicProductDefinition.title,
                productId: prd.id,
                name: prd.atomicProductDefinition.title + "_" + prd.id,
                product: prd
            }))
        });
        op.inputProducts.forEach((prd: AtomicProductExtendedDto) => {
            inPortMap[prd.id] = node.addPort(new OperationPortModel({
                in: true,
                label: prd.atomicProductDefinition.title,
                productId: prd.id,
                name: prd.atomicProductDefinition.title + "_" + prd.id,
                product: prd
            }));
        });
        operationNodeMap[op.id] = node;
    });

    flatMap(operations, op => op.outputProducts)
        .forEach((prd: AtomicProductExtendedDto) => {
            const targetOutPort = outPortMap[prd.id];
            const targetInPort = inPortMap[prd.id];

            if (targetOutPort && targetInPort) {
                // @ts-ignore
                const link = targetOutPort.link(targetInPort);
                links.push(link);
            }
        })

    const model = new DiagramModel();
    if (diagramData) {
        model.setZoomLevel(diagramData.zoomLevel);
        model.setOffsetX(diagramData.offset.x);
        model.setOffsetY(diagramData.offset.y);
    }
    Object.values(operationNodeMap).forEach(v => {
        model.addNode(v);
    })

    links.forEach(l => {
        model.addLink(l);
    })

    model.setLocked(false);
    engine.setModel(model);

    // engine.getActionEventBus().registerAction(new DeleteItemsAction({ keyCodes: [46] }));
    // console.log("Action Keys", engine.getActionEventBus().getKeys());

    const state = engine.getStateMachine().getCurrentState();
    if (state instanceof DefaultDiagramState) {
        state.dragNewLink.config.allowLooseLinks = false;
    }

    return engine;
}
