'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authClient } from '@/lib/auth/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { GithubIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const signUpSchema = z
        .object({
                email: z.email('Invalid email address'),
                password: z.string().min(1, 'Password is required'),
                confirmPassword: z.string().min(1, 'Confirm password is required'),
        })
        .refine((data) => data.password === data.confirmPassword, {
                path: ['confirmPassword'],
                message: "Passwords don't match.",
        });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export const SignUpForm = () => {
        const router = useRouter();
        const form = useForm<SignUpFormValues>({
                resolver: zodResolver(signUpSchema),
                defaultValues: {
                        email: '',
                        password: '',
                        confirmPassword: '',
                },
        });
        const signInWithGithub = async () => {
                await authClient.signIn.social(
                        {
                                provider: 'github',
                                callbackURL: '/',
                        },
                        {
                                onSuccess: () => {
                                        router.push('/');
                                },
                                onError: (ctx) => {
                                        toast.error('Failed to sign in with Github');
                                        console.error(ctx.error);
                                },
                        },
                );
        };
        const signInWithGoogle = async () => {
                await authClient.signIn.social(
                        {
                                provider: 'google',
                                callbackURL: '/',
                        },
                        {
                                onSuccess: () => {
                                        router.push('/');
                                },
                                onError: (ctx) => {
                                        toast.error('Failed to sign in with Google');
                                        console.error(ctx.error);
                                },
                        },
                );
        };
        const onSubmit = async (values: SignUpFormValues) => {
                await authClient.signUp.email(
                        {
                                name: values.email,
                                email: values.email,
                                password: values.password,
                                callbackURL: '/',
                        },
                        {
                                onSuccess: () => {
                                        toast.success('Signed up successfully');
                                        router.push('/');
                                },
                                onError: (ctx) => {
                                        toast.error(ctx.error.message);
                                        console.error(ctx.error);
                                },
                        },
                );
        };

        const isPending = form.formState.isSubmitting;

        return (
                <div className="flex flex-col gap-6">
                        <Card>
                                <CardHeader className="text-center">
                                        <CardTitle>Get started</CardTitle>
                                        <CardDescription>Create an account to get started.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                        <Form {...form}>
                                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                                        <div className="grid gap-6">
                                                                <div className="flex flex-col gap-4">
                                                                        <Button
                                                                                variant="outline"
                                                                                className="w-full"
                                                                                type="button"
                                                                                disabled={isPending}
                                                                                onClick={signInWithGithub}
                                                                        >
                                                                                <Image
                                                                                        src="/images/github.svg"
                                                                                        alt="Github"
                                                                                        width={20}
                                                                                        height={20}
                                                                                />
                                                                                Continue with Github
                                                                        </Button>
                                                                        <Button
                                                                                variant="outline"
                                                                                className="w-full"
                                                                                type="button"
                                                                                disabled={isPending}
                                                                                onClick={signInWithGoogle}
                                                                        >
                                                                                <Image
                                                                                        src="/images/google.svg"
                                                                                        alt="Google"
                                                                                        width={20}
                                                                                        height={20}
                                                                                />
                                                                                Continue with Google
                                                                        </Button>
                                                                </div>
                                                                <div className="grid gap-6">
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="email"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormLabel>
                                                                                                        Email
                                                                                                </FormLabel>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="email@example.com"
                                                                                                                type="email"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="password"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormLabel>
                                                                                                        Password
                                                                                                </FormLabel>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="********"
                                                                                                                type="password"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                        <FormField
                                                                                control={form.control}
                                                                                name="confirmPassword"
                                                                                render={({ field }) => (
                                                                                        <FormItem>
                                                                                                <FormLabel>
                                                                                                        Confirm Password
                                                                                                </FormLabel>
                                                                                                <FormControl>
                                                                                                        <Input
                                                                                                                placeholder="********"
                                                                                                                type="password"
                                                                                                                {...field}
                                                                                                        />
                                                                                                </FormControl>
                                                                                                <FormMessage />
                                                                                        </FormItem>
                                                                                )}
                                                                        />
                                                                        <Button
                                                                                type="submit"
                                                                                className="w-full"
                                                                                disabled={isPending}
                                                                        >
                                                                                {isPending ? (
                                                                                        <Loader2 className="size-4 animate-spin" />
                                                                                ) : (
                                                                                        'Sign Up'
                                                                                )}
                                                                        </Button>
                                                                </div>
                                                                <div className="flex items-center justify-center">
                                                                        <p className="text-sm">
                                                                                Already have an account?{' '}
                                                                                <Link
                                                                                        href="/sign-in"
                                                                                        className="text-primary underline underline-offset-4"
                                                                                >
                                                                                        Sign in
                                                                                </Link>
                                                                        </p>
                                                                </div>
                                                        </div>
                                                </form>
                                        </Form>
                                </CardContent>
                        </Card>
                </div>
        );
};
