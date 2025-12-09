import {
        CredentialsContainer,
        CredentialsError,
        CredentialsList,
        CredentialsLoading,
} from '@/features/credentials/components/credentials';
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader';
import { prefetchCredentials } from '@/features/credentials/server/prefetch';
import { requireAuth } from '@/lib/auth/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type CredentialsPageProps = {
        searchParams: Promise<SearchParams>;
};
const CredentialsPage = async ({ searchParams }: CredentialsPageProps) => {
        await requireAuth();

        const params = await credentialsParamsLoader(searchParams);
        prefetchCredentials(params);

        return (
                <CredentialsContainer>
                        <HydrateClient>
                                <ErrorBoundary fallback={<CredentialsError />}>
                                        <Suspense fallback={<CredentialsLoading />}>
                                                <CredentialsList />
                                        </Suspense>
                                </ErrorBoundary>
                        </HydrateClient>
                </CredentialsContainer>
        );
};

export default CredentialsPage;
