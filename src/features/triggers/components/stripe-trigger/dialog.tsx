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
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

interface StripeTriggerDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({ open, onOpenChange }: StripeTriggerDialogProps) => {
        const params = useParams();
        const workflowId = params.workflowId as string;
        const [isWebhookUrlCopied, setIsWebhookUrlCopied] = useState(false);

        // Construct the webhook URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;

        const copyToClipboard = async () => {
                try {
                        await navigator.clipboard.writeText(webhookUrl);
                        toast.success('Webhook URL copied to clipboard');
                        setIsWebhookUrlCopied(true);
                } catch (error) {
                        toast.error('Failed to copy webhook URL');
                }
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Stripe Trigger Configuration</DialogTitle>
                                        <DialogDescription>
                                                Use this workflow URL in your Stripe webhook to trigger the workflow
                                                when a stripe event is captured.
                                        </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                        <div className="space-y-2">
                                                <Label htmlFor="webhook-url">Webhook URL</Label>
                                                <div className="flex gap-2">
                                                        <Input
                                                                id="webhook-url"
                                                                value={webhookUrl}
                                                                readOnly
                                                                className="font-mono text-sm"
                                                        />
                                                        <Button
                                                                type="button"
                                                                onClick={copyToClipboard}
                                                                variant="outline"
                                                                size="icon"
                                                        >
                                                                {isWebhookUrlCopied ? (
                                                                        <CheckIcon className="w-4 h-4" />
                                                                ) : (
                                                                        <CopyIcon className="w-4 h-4" />
                                                                )}
                                                        </Button>
                                                </div>
                                        </div>

                                        <div className="rounded-lg bg-muted p-4 space-y-2">
                                                <h4 className="font-medium text-sm">Setup Instructions:</h4>
                                                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                                                        <li>Open your Stripe Dashboard</li>
                                                        <li>Go to Developers → Webhooks</li>
                                                        <li>Click "Add endpoint"</li>
                                                        <li>
                                                                Replace WEBHOOK_URL with the webhook URL you copied
                                                                above
                                                        </li>
                                                        <li>
                                                                Select events to listen to (e.g.,
                                                                payment_intent.succeeded)
                                                        </li>
                                                        <li>Click "Save" and copy the webhook signing secret</li>
                                                </ol>
                                        </div>

                                        <div className="rounded-lg bg-muted p-4 space-y-3">
                                                <h4 className="font-medium text-sm">Available Variables:</h4>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{stripe.amount}}'}
                                                                </code>
                                                                - Payment amount
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{stripe.currency}}'}
                                                                </code>
                                                                - Payment currency
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{stripe.status}}'}
                                                                </code>
                                                                - Payment status
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{stripe.customerId}}'}
                                                                </code>
                                                                - Customer ID
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{json stripe}}'}
                                                                </code>
                                                                - Full event data as JSON
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{stripe.eventType}}'}
                                                                </code>
                                                                - Event type (e.g., payment_intent.succeeded)
                                                        </li>
                                                </ul>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};
