'use client';

import React from 'react';
import { authClient } from '@/lib/auth/auth-client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const LogoutButton = () => {
        return (
                <Button
                        onClick={() =>
                                authClient.signOut({
                                        fetchOptions: {
                                                onSuccess: () => {
                                                        toast.success('Logged out successfully');
                                                },
                                                onError: (ctx) => {
                                                        toast.error(ctx.error.message);
                                                },
                                        },
                                })
                        }
                >
                        Logout
                </Button>
        );
};
