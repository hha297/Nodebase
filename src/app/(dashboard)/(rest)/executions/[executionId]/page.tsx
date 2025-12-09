import { ExecutionView } from '@/features/executions/components/execution';
import { ExecutionsError, ExecutionsLoading } from '@/features/executions/components/executions';
import { prefetchExecution } from '@/features/executions/server/prefetch';
import { requireAuth } from '@/lib/auth/auth-utils';
import { HydrateClient } from '@/trpc/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ExecutionIdPageProps {
        params: Promise<{
                executionId: string;
        }>;
}

const ExecutionIdPage = async ({ params }: ExecutionIdPageProps) => {
        await requireAuth();
        const { executionId } = await params;
        prefetchExecution(executionId);
        return (
                <div className="p-4 md:px-10 md:py-6 h-full">
                        <div className="mx-auto max-w-3xl w-full flex flex-col gap-y-8 h-full">
                                <HydrateClient>
                                        <ErrorBoundary fallback={<ExecutionsError />}>
                                                <Suspense fallback={<ExecutionsLoading />}>
                                                        <ExecutionView executionId={executionId} />
                                                </Suspense>
                                        </ErrorBoundary>
                                </HydrateClient>
                        </div>
                </div>
        );
};

export default ExecutionIdPage;
