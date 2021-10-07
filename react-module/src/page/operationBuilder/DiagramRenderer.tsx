import React from "react";
import {
    AtomicOperationExtendedDto,
    AtomicOperationExtendedDtoOperationResultEnum,
    AtomicProductExtendedDto, OperationDiagramData,
    TreeNodeAtomicOperationExtendedDto
} from "../../openapi/models";
import {CanvasWidget} from "@projectstorm/react-canvas-core";
import createEngine, {
    DagreEngine,
    DefaultLinkModel,
    DefaultNodeModel,
    DefaultPortModel,
    DiagramEngine,
    DiagramModel,
    LinkModel, PathFindingLinkFactory
} from "@projectstorm/react-diagrams";
import {flatMap} from "lodash";
import find from "lodash/find";
import {flatMapTreeNode} from "./OperationBuilderPage";
import {Button, Card, Divider, Tag} from "antd";
import {Fas, MiscUtils} from "../../misc/misc";
import {useTranslation} from "react-i18next";

export const getDepth = (tree: TreeNodeAtomicOperationExtendedDto, operation: AtomicOperationExtendedDto):number => {
    let currentNodes: TreeNodeAtomicOperationExtendedDto[] = [tree];
    let depth = 0;

    while(true) {
        const found = find(currentNodes, node => node.node.id === operation.id);
        if(found) {
            return depth;
        }
        depth++;
        currentNodes = flatMap(currentNodes, node => node.subNodes);
    }
}

export const colorMap: Record<AtomicOperationExtendedDtoOperationResultEnum, string> = {
    BROKEN: "rgb(227,27,8)",
    COMPLETED: "rgb(69,229,67)",
    IS_RUNNING: "rgb(0,192,255)",
    POSTPONED: "rgb(250, 140, 22)",
    NOT_ASSIGNED: "rgb(104,104,104)",
    SUCCESS: "rgb(81,147,81)",
    ASSIGNED : "rgb(18,85,118)",

}

export const createEngineFromTree = (tree: TreeNodeAtomicOperationExtendedDto): DiagramEngine => {
    const engine = createEngine({registerDefaultZoomCanvasAction: false});

    const operations = flatMapTreeNode(tree);
    const operationNodeMap:Record<number, DefaultNodeModel> = {};
    const outPortMap: Record<number, DefaultPortModel> = {};
    const inPortMap: Record<number, DefaultPortModel> = {};
    const links = [] as LinkModel[];

    const pathfinding = engine.getLinkFactories().getFactory<PathFindingLinkFactory>(PathFindingLinkFactory.NAME);

    operations.forEach((op: AtomicOperationExtendedDto, idx) => {

        const color = op.operationResult ? colorMap[op.operationResult] : 'rgb(0,192,255)';
        const node = new DefaultNodeModel({
            name: op.operationType?.title, color
        });

        const depth = getDepth(tree, op);

        node.setPosition(100 * (idx * 2), 100 * depth);
        op.outputProducts.forEach((prd:AtomicProductExtendedDto) => {
            outPortMap[prd.id] = node.addOutPort(prd.atomicProductDefinition.title);
        });
        op.inputProducts.forEach((prd:AtomicProductExtendedDto) => {
            inPortMap[prd.id] = node.addInPort(prd.atomicProductDefinition.title);
            const targetOutPort = outPortMap[prd.id];
            if(targetOutPort) {
                const link = targetOutPort.link(inPortMap[prd.id], pathfinding);
                links.push(link);
            }

        });
        operationNodeMap[op.id] = node;
    });

    const model = new DiagramModel();
    Object.values(operationNodeMap).forEach(v => {
        model.addNode(v);
    })

    links.forEach(l => {
        model.addLink(l);
    })

    model.setLocked(false);
    engine.setModel(model);

    console.log(engine.getModel().getModels());
    // model.getLinks().forEach(link => link.setLocked(true));

    return engine;
}

export const createEngineML = (): DiagramEngine => {

    // create an instance of the engine with all the defaults
    const engine = createEngine();
    // node 1
    const node1 = new DefaultNodeModel({
        name: 'Node 1',
        color: 'rgb(0,192,255)',
    });
    node1.setPosition(100, 100);
    let port1 = node1.addOutPort('Out');

    // node 2
    const node2 = new DefaultNodeModel({
        name: 'Node 1',
        color: 'rgb(0,192,255)',
    });
    node2.setPosition(100, 200);
    let port2 = node2.addOutPort('Out');

    // link them and add a label to the link
    const link = port1.link<DefaultLinkModel>(port2);
    // link.addLabel('Hello World!');

    const model = new DiagramModel();
    model.addAll(node1, node2, link);
    engine.setModel(model);
    return engine;
}


export const DiagramRenderer: React.FC<{ tree: TreeNodeAtomicOperationExtendedDto }> = ({tree}) => {
    const [engine, setEngine] = React.useState<DiagramEngine | null>(null);

    React.useEffect(() => {
        // const engine = createEngineML();
        // console.log({tree});
        // if(tree === "") {
        //     return;
        // }
        const engine = createEngineFromTree(tree);
        /*  operations with engine */
        setEngine(engine)
        // setTimeout(() => {
        //     redistribute(engine);
        // }, 1000);

    }, [tree])

    const zoom = (multiplier: number) => {
        if(!engine) {
            return;
        }
        const model = engine.getModel();

        model.setZoomLevel(model.getZoomLevel() * multiplier)
        engine.repaintCanvas();
    }

    const redistribute = (engine: DiagramEngine | null) => {
        if(!engine) {
            return;
        }

        const model = engine.getModel();
        const margin = 75;
        const dagreEngine = new DagreEngine({
            graph: {
                rankdir: 'LR',
                ranker: 'longest-path',
                marginx: margin,
                marginy: margin
            },
            includeLinks: true
        });
        dagreEngine.redistribute(model);
        engine.repaintCanvas();
    }

    const {t} = useTranslation();

    return (
        <Card title={
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div>
                    <Fas icon={"project-diagram"}/>&nbsp;Diagram
                </div>
                <div>
                    <Button size={"small"} onClick={() => redistribute(engine)}><Fas icon={"broom"}/></Button>
                    &nbsp;
                    <Button size={"small"} onClick={() => zoom(1.1)}><Fas icon={"search-plus"}/></Button>
                    &nbsp;
                    <Button size={"small"} onClick={() => zoom(0.9)}><Fas icon={"search-minus"}/></Button>
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
