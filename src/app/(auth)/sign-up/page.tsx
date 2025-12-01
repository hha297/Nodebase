import { SignUpForm } from '@/features/auth/components/signup-form';
import { requireUnAuth } from '@/lib/auth/auth-utils';
import React from 'react';

const SignUpPage = async () => {
        await requireUnAuth();
        return (
                <div>
                        <SignUpForm />
                </div>
        );
};

export default SignUpPage;
