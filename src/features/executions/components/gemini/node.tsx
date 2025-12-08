'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchGeminiRealtimeToken } from './action';
import { GeminiDialog, GeminiFormValues } from './dialog';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini';

type GeminiNodeData = {
        variableName?: string;
        model?: string;
        systemPrompt?: string;
        userPrompt?: string;
};

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const { setNodes } = useReactFlow();
        // Handle nested data structure (data.data) - flatten it
        const nodeData = props.data;
        const description = nodeData?.userPrompt
                ? `gemini-2.5-flash: ${nodeData.userPrompt.slice(0, 50)}...`
                : 'Not configured';

        const nodeStatus = useNodeStatus({
                nodeId: props.id,
                channel: GEMINI_CHANNEL_NAME,
                topic: 'status',
                refreshToken: fetchGeminiRealtimeToken,
        });

        const handleOpenSettings = () => {
                setDialogOpen(true);
        };

        const handleSubmit = (values: GeminiFormValues) => {
                setNodes((nodes) =>
                        nodes.map((node) => {
                                if (node.id === props.id) {
                                        return {
                                                ...node,
                                                data: {
                                                        ...node.data,
                                                        ...values,
                                                },
                                        };
                                }
                                return node;
                        }),
                );
        };

        return (
                <>
                        <GeminiDialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                                onSubmit={handleSubmit}
                                defaultValues={nodeData}
                        />
                        <BaseExecutionNode
                                {...props}
                                id={props.id}
                                icon="/images/gemini.svg"
                                name="Gemini"
                                description={description}
                                onSettings={handleOpenSettings}
                                onDoubleClick={handleOpenSettings}
                                status={nodeStatus}
                        />
                </>
        );
});

GeminiNode.displayName = 'GeminiNode';
