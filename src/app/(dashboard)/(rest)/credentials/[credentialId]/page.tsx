import { requireAuth } from '@/lib/auth/auth-utils';
import React from 'react';

interface CredentialIdPageProps {
        params: Promise<{
                credentialId: string;
        }>;
}

const CredentialIdPage = async ({ params }: CredentialIdPageProps) => {
        await requireAuth();
        const { credentialId } = await params;
        return <div>CredentialIdPage {credentialId}</div>;
};

export default CredentialIdPage;
