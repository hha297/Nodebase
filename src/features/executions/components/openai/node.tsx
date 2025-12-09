'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchOpenAIRealtimeToken } from './action';
import { OpenAIDialog, OpenAIFormValues } from './dialog';
import { OPENAI_CHANNEL_NAME } from '@/inngest/channels/openai';

type OpenAINodeData = {
        variableName?: string;
        credentialId?: string;
        systemPrompt?: string;
        userPrompt?: string;
};

type OpenAINodeType = Node<OpenAINodeData>;

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const { setNodes } = useReactFlow();
        // Handle nested data structure (data.data) - flatten it
        const nodeData = props.data;
        const description = nodeData?.userPrompt ? `gpt-4o: ${nodeData.userPrompt.slice(0, 50)}...` : 'Not configured';

        const nodeStatus = useNodeStatus({
                nodeId: props.id,
                channel: OPENAI_CHANNEL_NAME,
                topic: 'status',
                refreshToken: fetchOpenAIRealtimeToken,
        });

        const handleOpenSettings = () => {
                setDialogOpen(true);
        };

        const handleSubmit = (values: OpenAIFormValues) => {
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
                        <OpenAIDialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                                onSubmit={handleSubmit}
                                defaultValues={nodeData}
                        />
                        <BaseExecutionNode
                                {...props}
                                id={props.id}
                                icon="/images/openai.svg"
                                name="OpenAI"
                                description={description}
                                onSettings={handleOpenSettings}
                                onDoubleClick={handleOpenSettings}
                                status={nodeStatus}
                        />
                </>
        );
});

OpenAINode.displayName = 'OpenAINode';
