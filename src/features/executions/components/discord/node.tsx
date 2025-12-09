'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchDiscordRealtimeToken } from './action';
import { DiscordDialog, DiscordFormValues } from './dialog';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini';
import { DISCORD_CHANNEL_NAME } from '@/inngest/channels/discord';

type DiscordNodeData = {
        webhookUrl?: string;
        content?: string;
        username?: string;
};

type DiscordNodeType = Node<DiscordNodeData>;

export const DiscordNode = memo((props: NodeProps<DiscordNodeType>) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const { setNodes } = useReactFlow();
        // Handle nested data structure (data.data) - flatten it
        const nodeData = props.data;
        const description = nodeData?.content ? `Sent: ${nodeData.content.slice(0, 50)}...` : 'Not configured';

        const nodeStatus = useNodeStatus({
                nodeId: props.id,
                channel: DISCORD_CHANNEL_NAME,
                topic: 'status',
                refreshToken: fetchDiscordRealtimeToken,
        });

        const handleOpenSettings = () => {
                setDialogOpen(true);
        };

        const handleSubmit = (values: DiscordFormValues) => {
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
                        <DiscordDialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                                onSubmit={handleSubmit}
                                defaultValues={nodeData}
                        />
                        <BaseExecutionNode
                                {...props}
                                id={props.id}
                                icon="/images/discord.svg"
                                name="Discord"
                                description={description}
                                onSettings={handleOpenSettings}
                                onDoubleClick={handleOpenSettings}
                                status={nodeStatus}
                        />
                </>
        );
});

DiscordNode.displayName = 'DiscordNode';
