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
import { generateGoogleFormScript } from './utils';

interface GoogleFormTriggerDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: GoogleFormTriggerDialogProps) => {
        const params = useParams();
        const workflowId = params.workflowId as string;
        const [isWebhookUrlCopied, setIsWebhookUrlCopied] = useState(false);
        const [isGoogleAppScriptCopied, setIsGoogleAppScriptCopied] = useState(false);
        // Construct the webhook URL
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

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
                                        <DialogTitle>Google Form Trigger Configuration</DialogTitle>
                                        <DialogDescription>
                                                Use this workflow URL in your Google Form's Apps Script to trigger the
                                                workflow when a form is submitted.
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
                                                        <li>Open your Google Form</li>
                                                        <li>
                                                                Click the three dots in the top right corner → App
                                                                Scripts
                                                        </li>
                                                        <li>Copy and paste the script below</li>
                                                        <li>
                                                                Replace WEBHOOK_URL with the webhook URL you copied
                                                                above
                                                        </li>
                                                        <li>Save and click "Triggers" → Add Trigger </li>
                                                        <li>
                                                                Choose: Event Source: "From form" → Event Type: "On form
                                                                submit" → Save
                                                        </li>
                                                </ol>
                                        </div>

                                        <div className="rounded-lg bg-muted p-4 space-y-3">
                                                <h4 className="font-medium text-sm">Google App Script:</h4>
                                                <Button
                                                        type="button"
                                                        onClick={async () => {
                                                                const script = generateGoogleFormScript(webhookUrl);
                                                                try {
                                                                        await navigator.clipboard.writeText(script);
                                                                        toast.success(
                                                                                'Google App Script copied to clipboard',
                                                                        );
                                                                        setIsGoogleAppScriptCopied(true);
                                                                } catch (error) {
                                                                        toast.error('Failed to copy Google App Script');
                                                                }
                                                        }}
                                                        variant="outline"
                                                >
                                                        Copy Google App Script
                                                        {isGoogleAppScriptCopied ? (
                                                                <CheckIcon className="w-4 h-4" />
                                                        ) : (
                                                                <CopyIcon className="w-4 h-4" />
                                                        )}
                                                </Button>
                                                <p>
                                                        This script includes the webhook URL and the function to trigger
                                                        the workflow.
                                                </p>
                                        </div>

                                        <div className="rounded-lg bg-muted p-4 space-y-3">
                                                <h4 className="font-medium text-sm">Available Variables:</h4>
                                                <ul className="text-sm text-muted-foreground space-y-1">
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{googleForm.respondentEmail}}'}
                                                                </code>
                                                                - Respondent's email
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {"{{googleForm.responses['Question Name']}}"}
                                                                </code>
                                                                - Specific answer
                                                        </li>
                                                        <li>
                                                                <code className="bg-background px-1 py-0.5 rounded">
                                                                        {'{{json googleForm.responses}}'}
                                                                </code>
                                                                - All answers as JSON
                                                        </li>
                                                </ul>
                                        </div>
                                </div>
                        </DialogContent>
                </Dialog>
        );
};
