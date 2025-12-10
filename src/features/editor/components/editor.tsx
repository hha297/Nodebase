'use client';
import { useState, useCallback, useMemo } from 'react';
import {
        ReactFlow,
        applyNodeChanges,
        applyEdgeChanges,
        addEdge,
        type Node,
        type Edge,
        type NodeChange,
        type EdgeChange,
        type Connection,
        Background,
        Controls,
        MiniMap,
        Panel,
} from '@xyflow/react';
import { ErrorView, LoadingView } from '@/components/entity-components';
import { useSuspenseWorkflow } from '@/features/workflows/hooks/use-workflows';
import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { AddNodeButton } from './add-node-button';
import { editorAtom } from '../store/atom';
import { useSetAtom } from 'jotai';
import { NodeType } from '@prisma/client';
import { ExecuteWorkflowButton } from './execute-workflow-button';

export const EditorLoading = () => {
        return <LoadingView message="Loading editor..." />;
};
export const EditorError = () => {
        return <ErrorView message="Error loading editor..." />;
};
export const Editor = ({ workflowId }: { workflowId: string }) => {
        const { data: workflow } = useSuspenseWorkflow(workflowId);
        const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
        const [edges, setEdges] = useState<Edge[]>(workflow.edges);

        const setEditor = useSetAtom(editorAtom);

        const onNodesChange = useCallback(
                (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
                [],
        );
        const onEdgesChange = useCallback(
                (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
                [],
        );
        const onConnect = useCallback(
                (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
                [],
        );

        const hasManualTrigger = useMemo(() => {
                return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
        }, [nodes]);
        return (
                <div className="size-full">
                        <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onConnect={onConnect}
                                nodeTypes={nodeComponents}
                                onInit={setEditor}
                                fitView
                                proOptions={{
                                        hideAttribution: true,
                                }}
                                snapGrid={[10, 10]}
                                snapToGrid={true}
                                panOnScroll
                                panOnDrag={false}
                                selectionOnDrag
                        >
                                <Background />
                                <Controls />
                                <MiniMap />
                                <Panel position="top-right">
                                        <AddNodeButton />
                                </Panel>
                                {hasManualTrigger && (
                                        <Panel position="bottom-center">
                                                <ExecuteWorkflowButton workflowId={workflowId} />
                                        </Panel>
                                )}
                        </ReactFlow>
                </div>
        );
};
