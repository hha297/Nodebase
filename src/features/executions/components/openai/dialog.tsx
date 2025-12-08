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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
        systemPrompt: z.string().optional(),
        userPrompt: z.string().min(1, { message: 'User prompt is required' }),
});

export type OpenAIFormValues = z.infer<typeof formSchema>;
interface OpenAIDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onSubmit: (values: z.infer<typeof formSchema>) => void;
        defaultValues?: Partial<OpenAIFormValues>;
}

export const OpenAIDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: OpenAIDialogProps) => {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        variableName: defaultValues.variableName || '',

                        systemPrompt: defaultValues.systemPrompt || '',
                        userPrompt: defaultValues.userPrompt || '',
                },
        });

        // Reset form when dialog is closed
        useEffect(() => {
                if (open) {
                        form.reset({
                                variableName: defaultValues.variableName || '',

                                systemPrompt: defaultValues.systemPrompt || '',
                                userPrompt: defaultValues.userPrompt || '',
                        });
                }
        }, [open, defaultValues, form]);

        const watchVariableName = form.watch('variableName') || 'myOpenAI';

        const handleSubmit = (values: z.infer<typeof formSchema>) => {
                onSubmit(values);
                onOpenChange(false);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>OpenAI Configuration</DialogTitle>
                                        <DialogDescription>
                                                Configure the AI models and prompt to use for the OpenAI node.
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
                                                                                        placeholder="myOpenAI"
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
                                                        name="systemPrompt"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>System Prompt (Optional)</FormLabel>
                                                                        <FormControl>
                                                                                <Textarea
                                                                                        {...field}
                                                                                        placeholder="You are a helpful assistant."
                                                                                        className="min-h-20 font-mono text-sm"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                Sets the behavior of the AI model. Use{' '}
                                                                                {'{{variables}}'} for simple values or{' '}
                                                                                {'{{json variables}}'} to stringify
                                                                                complex values.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="userPrompt"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>User Prompt</FormLabel>
                                                                        <FormControl>
                                                                                <Textarea
                                                                                        {...field}
                                                                                        placeholder="Summarize the following text: {{json httpResponse.data}}"
                                                                                        className="min-h-32 font-mono text-sm"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                The prompt to use for the OpenAI node.
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
