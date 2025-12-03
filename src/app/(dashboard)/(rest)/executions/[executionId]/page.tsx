import { requireAuth } from '@/lib/auth/auth-utils';
import React from 'react';

interface ExecutionIdPageProps {
        params: Promise<{
                executionId: string;
        }>;
}

const ExecutionIdPage = async ({ params }: ExecutionIdPageProps) => {
        await requireAuth();
        const { executionId } = await params;
        return <div>ExecutionIdPage {executionId}</div>;
};

export default ExecutionIdPage;
