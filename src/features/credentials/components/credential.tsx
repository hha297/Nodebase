'use client';

import { CredentialType } from '@prisma/client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCredential, useUpdateCredential, useSuspenseCredential } from '../hooks/use-credentials';
import { useRouter, useParams } from 'next/navigation';

import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import Link from 'next/link';

const formSchema = z.object({
        name: z.string().min(1, { message: 'Name is required' }),
        type: z.enum(CredentialType),
        value: z.string().min(1, { message: 'Value is required' }),
});
type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
        { label: 'OpenAI', value: CredentialType.OPENAI, logo: '/images/openai.svg' },
        { label: 'Gemini', value: CredentialType.GEMINI, logo: '/images/gemini.svg' },
        { label: 'Anthropic', value: CredentialType.ANTHROPIC, logo: '/images/anthropic.svg' },
];

interface CredentialFormProps {
        initialData?: {
                id: string;
                name: string;
                type: CredentialType;
                value: string;
        };
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
        const router = useRouter();
        const createCredential = useCreateCredential();
        const updateCredential = useUpdateCredential();
        const { modal, handleError } = useUpgradeModal();

        const isEditing = !!initialData;

        const form = useForm<z.infer<typeof formSchema>>({
                resolver: zodResolver(formSchema),
                defaultValues: initialData ?? {
                        name: '',
                        type: CredentialType.OPENAI,
                        value: '',
                },
        });

        const onSubmit = (values: FormValues) => {
                if (isEditing && initialData?.id) {
                        updateCredential.mutateAsync({ id: initialData?.id, ...values });
                } else {
                        createCredential.mutateAsync(values, {
                                onSuccess: (data) => {
                                        router.push(`/credentials/${data.id}`);
                                },
                                onError: (error) => {
                                        handleError(error);
                                },
                        });
                }
        };

        return (
                <>
                        {modal}
                        <Card className="shadow-none">
                                <CardHeader>
                                        <CardTitle>{isEditing ? 'Edit Credential' : 'Create Credential'}</CardTitle>
                                        <CardDescription>
                                                {isEditing
                                                        ? 'Update your API key or credential details'
                                                        : 'Add a new API key or credential to your account'}
                                        </CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                        <FormField
                                                                control={form.control}
                                                                name="name"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Name</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                {...field}
                                                                                                placeholder="My API Key"
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="type"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>Type</FormLabel>
                                                                                <Select
                                                                                        onValueChange={field.onChange}
                                                                                        defaultValue={field.value}
                                                                                >
                                                                                        <FormControl>
                                                                                                <SelectTrigger className="w-full">
                                                                                                        <SelectValue placeholder="Select a type" />
                                                                                                </SelectTrigger>
                                                                                        </FormControl>
                                                                                        <SelectContent>
                                                                                                {credentialTypeOptions.map(
                                                                                                        (option) => (
                                                                                                                <SelectItem
                                                                                                                        key={
                                                                                                                                option.value
                                                                                                                        }
                                                                                                                        value={
                                                                                                                                option.value
                                                                                                                        }
                                                                                                                >
                                                                                                                        <div className="flex items-center gap-2">
                                                                                                                                <Image
                                                                                                                                        src={
                                                                                                                                                option.logo
                                                                                                                                        }
                                                                                                                                        alt={
                                                                                                                                                option.label
                                                                                                                                        }
                                                                                                                                        width={
                                                                                                                                                16
                                                                                                                                        }
                                                                                                                                        height={
                                                                                                                                                16
                                                                                                                                        }
                                                                                                                                />
                                                                                                                                <span>
                                                                                                                                        {
                                                                                                                                                option.label
                                                                                                                                        }
                                                                                                                                </span>
                                                                                                                        </div>
                                                                                                                </SelectItem>
                                                                                                        ),
                                                                                                )}
                                                                                        </SelectContent>
                                                                                </Select>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />
                                                        <FormField
                                                                control={form.control}
                                                                name="value"
                                                                render={({ field }) => (
                                                                        <FormItem>
                                                                                <FormLabel>API Key</FormLabel>
                                                                                <FormControl>
                                                                                        <Input
                                                                                                {...field}
                                                                                                placeholder="sk-..."
                                                                                                type="password"
                                                                                        />
                                                                                </FormControl>
                                                                                <FormMessage />
                                                                        </FormItem>
                                                                )}
                                                        />

                                                        <div className="flex gap-4">
                                                                <Button
                                                                        type="submit"
                                                                        disabled={
                                                                                createCredential.isPending ||
                                                                                updateCredential.isPending
                                                                        }
                                                                >
                                                                        {isEditing ? 'Update' : 'Create'}
                                                                </Button>
                                                                <Button type="button" variant="outline" asChild>
                                                                        <Link href="/credentials" prefetch>
                                                                                Cancel
                                                                        </Link>
                                                                </Button>
                                                        </div>
                                                </form>
                                        </Form>
                                </CardContent>
                        </Card>
                </>
        );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
        const { data: credential } = useSuspenseCredential(credentialId);

        return <CredentialForm initialData={credential} />;
};
