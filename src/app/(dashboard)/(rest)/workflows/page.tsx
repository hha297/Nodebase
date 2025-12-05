import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import React, { Suspense } from 'react';
import {
        WorkflowsContainer,
        WorkflowsError,
        WorkflowsList,
        WorkflowsLoading,
} from '@/features/workflows/components/workflows';
import { type SearchParams } from 'nuqs/server';
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader';

type WorkflowsPageProps = {
        searchParams: Promise<SearchParams>;
};
const WorkflowsPage = async ({ searchParams }: WorkflowsPageProps) => {
        await requireAuth();
        const params = await workflowsParamsLoader(searchParams);
        prefetchWorkflows(params);
        return (
                <WorkflowsContainer>
                        <HydrateClient>
                                <ErrorBoundary fallback={<WorkflowsError />}>
                                        <Suspense fallback={<WorkflowsLoading />}>
                                                <WorkflowsList />
                                        </Suspense>
                                </ErrorBoundary>
                        </HydrateClient>
                </WorkflowsContainer>
        );
};

export default WorkflowsPage;
