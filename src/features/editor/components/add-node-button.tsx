'use client';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { memo } from 'react';

export const AddNodeButton = memo(() => {
        return (
                <Button size="icon" onClick={() => {}}>
                        <PlusIcon className="size-4" />
                </Button>
        );
});

AddNodeButton.displayName = 'AddNodeButton';
