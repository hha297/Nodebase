'use client';

import {
        Dialog,
        DialogContent,
        DialogHeader,
        DialogTitle,
        DialogDescription,
        DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';

// Available models:

const formSchema = z.object({
        variableName: z
                .string()
                .min(1, { message: 'Variable name is required' })
                .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
                        message: 'Variable name must start with a letter and contain only letters, numbers, and underscores',
                }),
        content: z.string().min(1, { message: 'Content is required' }),
        webhookUrl: z.string().min(1, { message: 'Webhook URL is required' }),
});

export type SlackFormValues = z.infer<typeof formSchema>;
interface SlackDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onSubmit: (values: z.infer<typeof formSchema>) => void;
        defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: SlackDialogProps) => {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        variableName: defaultValues.variableName || '',
                        content: defaultValues.content || '',
                        webhookUrl: defaultValues.webhookUrl || '',
                },
        });

        // Reset form when dialog is closed
        useEffect(() => {
                if (open) {
                        form.reset({
                                variableName: defaultValues.variableName || '',
                                content: defaultValues.content || '',
                                webhookUrl: defaultValues.webhookUrl || '',
                        });
                }
        }, [open, defaultValues, form]);

        const watchVariableName = form.watch('variableName') || 'mySlack';

        const handleSubmit = (values: z.infer<typeof formSchema>) => {
                onSubmit(values);
                onOpenChange(false);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Slack Configuration</DialogTitle>
                                        <DialogDescription>
                                                Configure the Slack webhook URL and content to use for the Slack node.
                                        </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                                                <FormField
                                                        control={form.control}
                                                        name="variableName"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Variable Name</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        {...field}
                                                                                        placeholder="mySlack"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                Use this name to reference the result in
                                                                                other nodes:{' '}
                                                                                {`{{${watchVariableName}.text}}`}
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="webhookUrl"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Webhook URL</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        {...field}
                                                                                        placeholder="https://hooks.slack.com/workflows/1234567890/abcdefghijklmnopqrstuvwxyz"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                The webhook URL to use for the Slack
                                                                                node. You can find the webhook URL:
                                                                                Workspace Settings {'>'} Workflow {'>'}{' '}
                                                                                Webhooks
                                                                        </FormDescription>
                                                                        <FormDescription>
                                                                                Make sure the variable "key" is set to
                                                                                "content"
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />

                                                <FormField
                                                        control={form.control}
                                                        name="content"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Message Content</FormLabel>
                                                                        <FormControl>
                                                                                <Textarea
                                                                                        {...field}
                                                                                        placeholder="Summary: {{mySlack.text}}"
                                                                                        className="min-h-20 font-mono text-sm"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                The message to use for the Slack node.
                                                                                Use {'{{variables}}'} for simple values
                                                                                or {'{{json variables}}'} to stringify
                                                                                complex values.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <DialogFooter className="mt-4">
                                                        <Button type="submit">Save</Button>
                                                </DialogFooter>
                                        </form>
                                </Form>
                        </DialogContent>
                </Dialog>
        );
};
