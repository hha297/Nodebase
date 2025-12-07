'use client';

import { memo, useState } from 'react';
import { BaseExecutionNode } from '../base-execution-node';
import { useReactFlow, type Node, type NodeProps } from '@xyflow/react';
import { GlobeIcon } from 'lucide-react';
import { HttpRequestFormValues, HttpRequestDialog } from './dialog';

type HttpRequestNodeData = {
        endpoint?: string;
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
        body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
        const [dialogOpen, setDialogOpen] = useState(false);
        const { setNodes } = useReactFlow();
        // Handle nested data structure (data.data) - flatten it
        const nodeData = (props.data as any)?.data || props.data;
        const description = nodeData?.endpoint
                ? `${nodeData.method || 'GET'} : ${nodeData.endpoint}`
                : 'Not configured';

        const nodeStatus = 'initial';

        const handleOpenSettings = () => {
                setDialogOpen(true);
        };

        const handleSubmit = (values: HttpRequestFormValues) => {
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
                        <HttpRequestDialog
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                                onSubmit={handleSubmit}
                                defaultValues={nodeData}
                        />
                        <BaseExecutionNode
                                {...props}
                                id={props.id}
                                icon={GlobeIcon}
                                name="HTTP Request"
                                description={description}
                                onSettings={handleOpenSettings}
                                onDoubleClick={handleOpenSettings}
                                status={nodeStatus}
                        />
                </>
        );
});

HttpRequestNode.displayName = 'HttpRequestNode';
