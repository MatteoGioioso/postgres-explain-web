import React, {useMemo, useEffect} from 'react'
import ReactFlow, {
    Controls,
    useEdgesState,
    useNodesState,
    useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'
import {NodeWidget} from './diagram/NodeWidget'
import {EdgeWidget} from './diagram/EdgeWidget'
import {useTheme} from "@mui/material/styles";
import {calculateNodes, getLayoutedElements} from "../utils";
import {Grid, Typography} from "@mui/material";
import {PlanRow, Stats} from "../Plan/types";

interface ComparisonDiagramsProps {
    planOptimized: PlanRow[]
    planPrev: PlanRow[]
}

// @ts-ignore
const elk = new ELK();

export const ComparisonDiagrams = ({planPrev, planOptimized}: ComparisonDiagramsProps) => {
    const theme = useTheme();
    const {fitView, getNode} = useReactFlow()
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])

    const [nodesOptimized, setNodesOptimized, onNodesChangeOptimized] = useNodesState([])
    const [edgesOptimized, setEdgesOptimized, onEdgesChangeOptimized] = useEdgesState([])
    const nodeTypes = useMemo(() => ({special: NodeWidget}), [])
    const edgeTypes = useMemo(() => ({special: EdgeWidget}), [])


    useEffect(() => {
        // @ts-ignore
        theme.diagram.node.width = 100
        // @ts-ignore
        theme.diagram.node.height = 2
        const {initialNodes: initialNodesPrev, initialEdges: initialEdgesPrev} = calculateNodes(planPrev, null, theme, {draggable: false})
        const {initialNodes: initialNodesOptimized, initialEdges: initialEdgesOptimized} = calculateNodes(planOptimized, null, theme, {draggable: false})

        const elkOptions = {
            'elk.algorithm': 'layered',
            'elk.spacing.nodeNode': 80,
            'elk.layered.spacing.nodeNodeBetweenLayers': 80,
            'elk.direction': 'DOWN',
        };

        getLayoutedElements(elk, initialNodesPrev, initialEdgesPrev, elkOptions, theme).then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            window.requestAnimationFrame(() => fitView());
        });

        getLayoutedElements(elk, initialNodesOptimized, initialEdgesOptimized, elkOptions, theme).then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
            setNodesOptimized(layoutedNodes);
            setEdgesOptimized(layoutedEdges);
            window.requestAnimationFrame(() => fitView());
        });

    }, [])


    return (
        <Grid container>
            <Grid item xs={6} sx={{pt: 2, pr: 1}}>
                <Typography variant='h5'>
                    Previous Plan: 10902903903
                </Typography>
                <div style={{height: '75vh', width: 'auto', border: `solid 1px ${theme.palette.secondary.light}`, borderRadius: '10px'}}>
                    <ReactFlow
                        fitView
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        minZoom={0.1}
                    >
                    </ReactFlow>
                </div>
            </Grid>
            <Grid item xs={6} sx={{pt: 2, pl: 1}}>
                <Typography variant='h5'>
                    Optimized Plan: 10902903903
                </Typography>
                <div style={{height: '75vh', width: 'auto', border: `solid 1px ${theme.palette.secondary.light}`, borderRadius: '10px'}}>
                    <ReactFlow
                        fitView
                        nodes={nodesOptimized}
                        edges={edgesOptimized}
                        onNodesChange={onNodesChangeOptimized}
                        onEdgesChange={onEdgesChangeOptimized}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        minZoom={0.1}
                    >
                        <Controls/>
                    </ReactFlow>
                </div>
            </Grid>
        </Grid>
    )
}

export const SummaryComparisonDiagrams = ({planPrev, planOptimized}: ComparisonDiagramsProps) => {
    return (
        <ComparisonDiagrams planPrev={planPrev} planOptimized={planOptimized}/>
    )
}