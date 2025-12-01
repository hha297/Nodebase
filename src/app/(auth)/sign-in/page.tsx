import { SignInForm } from '@/features/auth/components/signin-form';
import { requireUnAuth } from '@/lib/auth/auth-utils';
import React from 'react';

const SignInPage = async () => {
        await requireUnAuth();
        return (
                <div className="">
                        <SignInForm />
                </div>
        );
};

export default SignInPage;
