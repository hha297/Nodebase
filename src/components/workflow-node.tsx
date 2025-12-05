'use client';

import { NodeToolbar, Position } from '@xyflow/react';
import { SettingsIcon, TrashIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from './ui/button';
interface WorkflowNodeProps {
        children: ReactNode;
        showToolbar?: boolean;
        onDelete?: () => void;
        onSettings?: () => void;
        name?: string;
        description?: string;
}

export function WorkflowNode({
        children,
        showToolbar = true,
        onDelete,
        onSettings,
        name,
        description,
}: WorkflowNodeProps) {
        return (
                <>
                        {showToolbar && (
                                <NodeToolbar position={Position.Top}>
                                        <Button variant="ghost" size="sm" onClick={onSettings}>
                                                <SettingsIcon className="size-4" />
                                        </Button>
                                        <Button onClick={onDelete}>
                                                <TrashIcon className="size-4" />
                                        </Button>
                                </NodeToolbar>
                        )}
                        {children}
                        {name && (
                                <NodeToolbar position={Position.Bottom} isVisible className="max-w-48 text-center">
                                        <p className="font-medium">{name}</p>
                                        {description && (
                                                <p className="text-sm truncate text-muted-foreground">{description}</p>
                                        )}
                                </NodeToolbar>
                        )}
                </>
        );
}
