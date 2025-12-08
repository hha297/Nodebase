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

const formSchema = z.object({
        variableName: z
                .string()
                .min(1, { message: 'Variable name is required' })
                .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, {
                        message: 'Variable name must start with a letter and contain only letters, numbers, and underscores',
                }),
        endpoint: z.string().min(1, { message: 'Please enter a valid URL' }),
        method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
        body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;
interface HttpRequestDialogProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
        onSubmit: (values: z.infer<typeof formSchema>) => void;
        defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({ open, onOpenChange, onSubmit, defaultValues = {} }: HttpRequestDialogProps) => {
        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: {
                        variableName: defaultValues.variableName || '',
                        endpoint: defaultValues.endpoint || '',
                        method: defaultValues.method || 'GET',
                        body: defaultValues.body || '',
                },
        });

        // Reset form when dialog is closed
        useEffect(() => {
                if (open) {
                        form.reset({
                                variableName: defaultValues.variableName || '',
                                endpoint: defaultValues.endpoint || '',
                                method: defaultValues.method || 'GET',
                                body: defaultValues.body || '',
                        });
                }
        }, [open, defaultValues, form]);

        const watchVariableName = form.watch('variableName') || 'myApiCall';
        const watchMethod = form.watch('method');
        const showBodyField = ['POST', 'PUT', 'PATCH'].includes(watchMethod);

        const handleSubmit = (values: z.infer<typeof formSchema>) => {
                onSubmit(values);
                onOpenChange(false);
        };

        return (
                <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogContent>
                                <DialogHeader>
                                        <DialogTitle>HTTP Request</DialogTitle>
                                        <DialogDescription>
                                                Configure settings for the HTTP request node.
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
                                                                                        placeholder="myApiCall"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                Use this name to reference the result in
                                                                                other nodes:{' '}
                                                                                {`{{${watchVariableName}.httpResponse.data}}`}
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="method"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Method</FormLabel>

                                                                        <Select
                                                                                onValueChange={field.onChange}
                                                                                value={field.value}
                                                                        >
                                                                                <FormControl>
                                                                                        <SelectTrigger className="w-full">
                                                                                                <SelectValue placeholder="Select a method" />
                                                                                        </SelectTrigger>
                                                                                </FormControl>
                                                                                <SelectContent>
                                                                                        <SelectItem value="GET">
                                                                                                GET
                                                                                        </SelectItem>
                                                                                        <SelectItem value="POST">
                                                                                                POST
                                                                                        </SelectItem>
                                                                                        <SelectItem value="PUT">
                                                                                                PUT
                                                                                        </SelectItem>
                                                                                        <SelectItem value="DELETE">
                                                                                                DELETE
                                                                                        </SelectItem>
                                                                                        <SelectItem value="PATCH">
                                                                                                PATCH
                                                                                        </SelectItem>
                                                                                </SelectContent>
                                                                        </Select>

                                                                        <FormDescription>
                                                                                The HTTP method to use for the request.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                <FormField
                                                        control={form.control}
                                                        name="endpoint"
                                                        render={({ field }) => (
                                                                <FormItem>
                                                                        <FormLabel>Endpoint URL</FormLabel>
                                                                        <FormControl>
                                                                                <Input
                                                                                        {...field}
                                                                                        placeholder="https://api.example.com/endpoint/{{httpResponse.data.id}}"
                                                                                />
                                                                        </FormControl>
                                                                        <FormDescription>
                                                                                Static URL or use {'{{variables}}'} for
                                                                                simple values or {'{{json variables}}'}{' '}
                                                                                to stringify complex values.
                                                                        </FormDescription>
                                                                        <FormMessage />
                                                                </FormItem>
                                                        )}
                                                />
                                                {showBodyField && (
                                                        <FormField
                                                                control={form.control}
                                                                name="body"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Body</FormLabel>
                                                                                <FormControl>
                                                                                        <Textarea
                                                                                                placeholder={
                                                                                                        '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                                                                                                }
                                                                                                className="min-h-[120px] font-mono text-sm"
                                                                                                {...field}
                                                                                        />
                                                                                </FormControl>
                                                                                <FormDescription>
                                                                                        Template with template
                                                                                        variables. Use {'{{variables}}'}{' '}
                                                                                        for simple values or{' '}
                                                                                        {'{{json variables}}'} to
                                                                                        stringify complex values.
                                                                                </FormDescription>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                )}
                                                <DialogFooter className="mt-4">
                                                        <Button type="submit">Save</Button>
                                                </DialogFooter>
                                        </form>
                                </Form>
                        </DialogContent>
                </Dialog>
        );
};
