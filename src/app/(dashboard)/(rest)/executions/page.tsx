import { requireAuth } from '@/lib/auth/auth-utils';
import React from 'react';
import { prefetchExecutions } from '@/features/executions/server/prefetch';
import { SearchParams } from 'nuqs';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { executionsParamsLoader } from '@/features/executions/server/params-loader';
import {
        ExecutionsContainer,
        ExecutionsError,
        ExecutionsList,
        ExecutionsLoading,
} from '@/features/executions/components/executions';

type ExecutionsPageProps = {
        searchParams: Promise<SearchParams>;
};
const ExecutionsPage = async ({ searchParams }: ExecutionsPageProps) => {
        await requireAuth();

        const params = await executionsParamsLoader(searchParams);
        prefetchExecutions(params);

        return (
                <ExecutionsContainer>
                        <HydrateClient>
                                <ErrorBoundary fallback={<ExecutionsError />}>
                                        <Suspense fallback={<ExecutionsLoading />}>
                                                <ExecutionsList />
                                        </Suspense>
                                </ErrorBoundary>
                        </HydrateClient>
                </ExecutionsContainer>
        );
};

export default ExecutionsPage;
