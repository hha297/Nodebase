'use client';

import type { NodeProps } from '@xyflow/react';
import { PlusIcon } from 'lucide-react';
import { PlaceholderNode } from './react-flow/placeholder-node';
import { memo } from 'react';
import { WorkflowNode } from './workflow-node';

export const InitialNode = memo((props: NodeProps) => {
        return (
                <WorkflowNode name="Initial Node" description="Click to add a new node">
                        <PlaceholderNode {...props}>
                                <div className="flex items-center justify-center cursor-pointer">
                                        <PlusIcon className="size-4" />
                                </div>
                        </PlaceholderNode>
                </WorkflowNode>
        );
});

InitialNode.displayName = 'InitialNode';
