import React, {useMemo, useEffect, useCallback, useContext, useState} from 'react'
import ReactFlow, {
    Controls,
    Edge,
    MiniMap,
    Node,
    Position,
    useEdgesState,
    useNodesState,
    useReactFlow,
    applyNodeChanges
} from 'reactflow'
import {SummaryTableProps} from './interfaces'
import {PlanRow} from './types'
import 'reactflow/dist/style.css'
import {NodeWidget} from './diagram/NodeWidget'
import {EdgeWidget} from './diagram/EdgeWidget'
import {useTheme} from "@mui/material/styles";
import {getPercentage} from "../utils";
import {Collapse, Grid} from "@mui/material";
import {DetailsTable} from "./diagram/DetailsTable";

// @ts-ignore
const elk = new ELK();

const getLayoutedElements = (nodes, edges, options = {}, theme) => {
    const graph = {
        id: 'root',
        layoutOptions: options,
        children: nodes.map((node) => ({
            ...node,
            targetPosition: 'bottom',
            sourcePosition: 'top',
            width: theme.diagram.node.width,
            height: theme.diagram.node.height,
        })),
        edges: edges,
    };

    return elk
        .layout(graph)
        .then((layoutedGraph) => ({
            nodes: layoutedGraph.children.map((node) => ({
                ...node,
                position: {x: -node.x, y: -node.y},
            })),

            edges: layoutedGraph.edges,
        }))
        .catch(console.error);
};

export const Diagram = ({summary, stats}: SummaryTableProps) => {
    const theme = useTheme();
    const {fitView, getNode} = useReactFlow()
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const nodeTypes = useMemo(() => ({special: NodeWidget}), [])
    const edgeTypes = useMemo(() => ({special: EdgeWidget}), [])

    const elkOptions = {
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': 80,
        'elk.layered.spacing.nodeNodeBetweenLayers': 80,
    };

    const calculateNodes = () => {
        const initialNodes = []
        const initialEdges = []

        for (let i = 0; i < summary.length; i++) {
            const row: PlanRow = summary[i]

            const node: Node = {
                id: row.node_id,
                data: {
                    row,
                    stats,
                },
                targetPosition: Position.Bottom,
                sourcePosition: Position.Top,
                type: 'special',
                draggable: true,
                position: {x: 0, y: 0},
            }

            initialNodes.push(node)

            if (row.node_parent_id === "") continue

            const edge: Edge = {
                id: `${row.node_id}-${row.node_parent_id}`,
                source: row.node_id,
                target: row.node_parent_id,
                style: {
                    strokeWidth: Math.max((getPercentage(row.rows.total * (row.workers.launched + 1), stats.max_rows) / 2), 1),
                    stroke: theme.palette.primary[200]
                },
                data: {
                    rows: row.rows.total,
                },
                type: 'special',
            }

            initialEdges.push(edge)
        }

        return {
            initialNodes, initialEdges
        }
    }

    useEffect(() => {
        const {initialNodes, initialEdges} = calculateNodes()

        const opts = {'elk.direction': 'DOWN', ...elkOptions};

        getLayoutedElements(initialNodes, initialEdges, opts, theme).then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            window.requestAnimationFrame(() => fitView());
        });
    }, [summary])


    return (
        <Grid container>
            <Grid xs={4} sx={{pt: 2, pr: 2}} position='absolute' zIndex='999'>
                <DetailsTable/>
            </Grid>

            <Grid xs={12} sx={{pt: 2}}>
                <div style={{height: '82vh', width: 'auto', border: `solid 1px ${theme.palette.secondary.light}`, borderRadius: '10px'}}>
                    <ReactFlow
                        fitView
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        // This will cause "ResizeObserver loop completed with undelivered notifications".
                        // According to SO this can be ignored: https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
                        // onlyRenderVisibleElements
                        minZoom={0.1}
                    >
                        <Controls/>
                    </ReactFlow>
                </div>
            </Grid>
        </Grid>
    )
}

export const SummaryDiagram = ({summary, stats}: SummaryTableProps) => {
    return (
        <Diagram summary={summary} stats={stats}/>
    )
}