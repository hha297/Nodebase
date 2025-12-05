'use client';

import { type NodeProps, Position } from '@xyflow/react';
import type { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback } from 'react';
import { BaseNode, BaseNodeContent } from '../../../components/react-flow/base-node';
import { BaseHandle } from '../../../components/react-flow/base-handle';
import { WorkflowNode } from '../../../components/workflow-node';

interface BaseExecutionNodeProps extends NodeProps {
        icon: LucideIcon | string;
        name: string;
        description?: string;
        children?: React.ReactNode;
        // status?: NodeStatus;
        onSettings?: () => void;
        onDoubleClick?: () => void;
}

export const BaseExecutionNode = memo(
        ({ id, icon: Icon, name, description, children, onSettings, onDoubleClick }: BaseExecutionNodeProps) => {
                // TODO: Implement delete functionality
                const handleDelete = () => {};
                return (
                        <WorkflowNode
                                name={name}
                                description={description}
                                showToolbar={false}
                                onDelete={handleDelete}
                                onSettings={onSettings}
                        >
                                {/* TODO: Wrap within NodeStatus */}
                                <BaseNode onDoubleClick={onDoubleClick}>
                                        <BaseNodeContent>
                                                {typeof Icon === 'string' ? (
                                                        <Image src={Icon} alt={name} width={16} height={16} />
                                                ) : (
                                                        <Icon className="size-4" />
                                                )}
                                                {children}
                                                <BaseHandle id="target-1" type="target" position={Position.Left} />
                                                <BaseHandle id="source-1" type="source" position={Position.Right} />
                                        </BaseNodeContent>
                                </BaseNode>
                        </WorkflowNode>
                );
        },
);

BaseExecutionNode.displayName = 'BaseExecutionNode';
