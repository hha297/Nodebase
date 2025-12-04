import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import React, { Suspense } from 'react';
import { WorkflowsContainer, WorkflowsList } from '@/features/workflows/components/workflows';

const WorkflowsPage = async () => {
        await requireAuth();
        prefetchWorkflows();
        return (
                <WorkflowsContainer>
                        <HydrateClient>
                                <ErrorBoundary fallback={<div>Error</div>}>
                                        <Suspense fallback={<div>Loading...</div>}>
                                                <WorkflowsList />
                                        </Suspense>
                                </ErrorBoundary>
                        </HydrateClient>
                </WorkflowsContainer>
        );
};

export default WorkflowsPage;
