'use client';

import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ManualTriggerDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
}

export const ManualTriggerDialog = ({ open, onOpenChange }: ManualTriggerDialogProps) => {
        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Execute Workflow</DialogTitle>
                                        <DialogDescription>
                                                Configure settings for the manual trigger node.
                                        </DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                        <p className="text-sm text-muted-foreground">Manual trigger</p>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};
