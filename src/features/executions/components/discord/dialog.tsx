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
        username: z.string().optional(),
        content: z
                .string()
                .min(1, { message: 'Content is required' })
                .max(2000, { message: 'Content must be less than 2000 characters' }),
        webhookUrl: z.string().min(1, { message: 'Webhook URL is required' }),
});

export type DiscordFormValues = z.infer<typeof formSchema>;
interface DiscordDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onSubmit: (values: z.infer<typeof formSchema>) => void;
        defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: DiscordDialogProps) => {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        variableName: defaultValues.variableName || '',
                        username: defaultValues.username || '',
                        content: defaultValues.content || '',
                        webhookUrl: defaultValues.webhookUrl || '',
                },
        });

        // Reset form when dialog is closed
        useEffect(() => {
                if (open) {
                        form.reset({
                                variableName: defaultValues.variableName || '',
                                username: defaultValues.username || '',
                                content: defaultValues.content || '',
                                webhookUrl: defaultValues.webhookUrl || '',
                        });
                }
        }, [open, defaultValues, form]);

        const watchVariableName = form.watch('variableName') || 'myDiscord';

        const handleSubmit = (values: z.infer<typeof formSchema>) => {
                onSubmit(values);
                onOpenChange(false);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>Discord Configuration</DialogTitle>
                                        <DialogDescription>
                                                Configure the Discord webhook URL and content to use for the Discord
                                                node.
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
                                                                                        placeholder="myDiscord"
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
                                                                                        placeholder="https://discord.com/api/webhooks/1234567890/abcdefghijklmnopqrstuvwxyz"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                The webhook URL to use for the Discord
                                                                                node. You can find the webhook URL in
                                                                                the Discord channel settings by clicking
                                                                                on "Integrations" and then clicking on
                                                                                "Webhooks".
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
                                                                                        placeholder="Summary: {{myGemini.text}}"
                                                                                        className="min-h-20 font-mono text-sm"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                The message to use for the Discord node.
                                                                                Use {'{{variables}}'} for simple values
                                                                                or {'{{json variables}}'} to stringify
                                                                                complex values.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="username"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Bot Username (Optional)</FormLabel>
                                                                        <FormControl>
                                                                                <Textarea
                                                                                        {...field}
                                                                                        placeholder="My Bot"
                                                                                        className="min-h-32 font-mono text-sm"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                Overrides the default username of the
                                                                                bot.
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
