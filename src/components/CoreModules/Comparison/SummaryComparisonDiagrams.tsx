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
import {Grid, Stack, Typography} from "@mui/material";
import {PlanRow, Stats} from "../Plan/types";
import {QueryPlan} from "../types";

interface ComparisonDiagramsProps {
    plan: QueryPlan
    planToCompare: QueryPlan
}

// @ts-ignore
const elk = new ELK();

export const ComparisonDiagrams = ({planToCompare, plan}: ComparisonDiagramsProps) => {
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
        theme.diagram.node.height = 50
        const {initialNodes: initialNodesPrev, initialEdges: initialEdgesPrev} = calculateNodes(planToCompare.summary,
            plan.stats,
            theme,
            {draggable: false}
        )
        const {initialNodes: initialNodesOptimized, initialEdges: initialEdgesOptimized} = calculateNodes(plan.summary,
            planToCompare.stats,
            theme,
            {draggable: false}
        )

        const elkOptions = {
            'elk.algorithm': 'layered',
            'elk.spacing.nodeNode': 80,
            'elk.layered.spacing.nodeNodeBetweenLayers': 80,
            'elk.direction': 'DOWN',
        };

        getLayoutedElements(elk, initialNodesPrev, initialEdgesPrev, elkOptions, theme)
            .then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
                window.requestAnimationFrame(() => fitView());
            });

        getLayoutedElements(elk, initialNodesOptimized, initialEdgesOptimized, elkOptions, theme)
            .then(({nodes: layoutedNodes, edges: layoutedEdges}) => {
                setNodesOptimized(layoutedNodes);
                setEdgesOptimized(layoutedEdges);
                window.requestAnimationFrame(() => fitView());
            });

    }, [])


    return (
        <Grid container>
            <Grid item xs={6} sx={{pt: 2, pr: 1}}>
                <Title plan={plan} label="Plan ID"/>
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
                <Title plan={planToCompare} label="Plan to compare ID"/>

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

const Title = ({plan, label}: { plan: QueryPlan, label: string }) => {
    return (
        <Stack direction='row'>
            <Typography variant='h5'>
                {label}:
            </Typography>
            &nbsp;
            <Typography
                // onClick={() => onClickOptimization(opt)}
                variant='h5'
                sx={{
                    cursor: 'pointer',
                    color: (theme) => theme.palette.primary.main,
                    '&:hover': {
                        color: (theme) => theme.palette.primary.dark,
                        textDecoration: 'underline'
                    }
                }}
            >
                {plan.id}
            </Typography>
        </Stack>
    )
}

export const SummaryComparisonDiagrams = ({planToCompare, plan}: ComparisonDiagramsProps) => {
    return (
        <ComparisonDiagrams planToCompare={planToCompare} plan={plan}/>
    )
}