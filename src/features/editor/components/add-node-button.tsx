'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { memo, useState } from 'react';
import { NodeSelector } from '@/components/node-selector';

export const AddNodeButton = memo(() => {
        const [selectorOpen, setSelectorOpen] = useState(false);
        return (
                <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
                        <Button size="icon" onClick={() => setSelectorOpen(true)}>
                                <PlusIcon className="size-4" />
                        </Button>
                </NodeSelector>
        );
});

AddNodeButton.displayName = 'AddNodeButton';
