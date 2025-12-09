'use client';
import React from 'react';
import { useDeleteCredential, useSuspenseCredentials } from '../hooks/use-credentials';
import {
        EmptyView,
        EntityContainer,
        EntityHeader,
        EntityItem,
        EntityList,
        EntityPagination,
        EntitySearch,
        ErrorView,
        LoadingView,
} from '@/components/entity-components';
import { formatDistanceToNow } from 'date-fns';

import { useRouter } from 'next/navigation';
import { useCredentialsParams } from '../hooks/use-credentials-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
import type { Credential } from '@/generated/prisma/client';
import { CredentialType } from '@/generated/prisma/enums';

import Image from 'next/image';

export const CredentialsList = () => {
        const credentials = useSuspenseCredentials();
        return (
                <EntityList
                        items={credentials.data.items as Credential[]}
                        getKey={(credential) => credential.id}
                        renderItem={(credential: Credential) => <CredentialItem credential={credential} />}
                        emptyView={<CredentialsEmpty />}
                />
        );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
        const router = useRouter();
        return (
                <EntityHeader
                        title="Credentials"
                        description="Create and manage your credentials"
                        onNew={() => router.push('/credentials/new')}
                        newButtonLabel="New Credential"
                        disabled={disabled}
                />
        );
};

export const CredentialsContainer = ({ children }: { children: React.ReactNode }) => {
        return (
                <EntityContainer
                        header={<CredentialsHeader disabled={false} />}
                        search={<CredentialsSearch />}
                        pagination={<CredentialsPagination />}
                >
                        {children}
                </EntityContainer>
        );
};

export const CredentialsSearch = () => {
        const [params, setParams] = useCredentialsParams();
        const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
        return <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search credentials" />;
};

export const CredentialsPagination = () => {
        const [params, setParams] = useCredentialsParams();
        const credentials = useSuspenseCredentials();
        return (
                <EntityPagination
                        page={params.page}
                        totalPages={credentials.data.totalPages}
                        onPageChange={(page) => setParams({ ...params, page })}
                        disabled={credentials.isFetching}
                />
        );
};

export const CredentialsLoading = () => {
        return <LoadingView message="Loading credentials..." entity="credentials" />;
};

export const CredentialsError = () => {
        return <ErrorView message="Error loading credentials..." />;
};

export const CredentialsEmpty = () => {
        const router = useRouter();

        const handleCreateCredential = () => {
                router.push('/credentials/new');
        };
        return (
                <EmptyView
                        message="No credentials found. You can create a new one to get started."
                        onNew={handleCreateCredential}
                />
        );
};

const credentialLogos: Record<CredentialType, string> = {
        [CredentialType.OPENAI]: '/images/openai.svg',
        [CredentialType.GEMINI]: '/images/gemini.svg',
        [CredentialType.ANTHROPIC]: '/images/anthropic.svg',
};

export const CredentialItem = ({ credential }: { credential: Credential }) => {
        const deleteCredential = useDeleteCredential();
        const handleDeleteCredential = () => {
                deleteCredential.mutate({ id: credential.id });
        };

        const logo = credentialLogos[credential.type] || '/images/openai.svg';
        return (
                <EntityItem
                        href={`/credentials/${credential.id}`}
                        title={credential.name}
                        subtitle={
                                <>
                                        Created {formatDistanceToNow(credential.createdAt, { addSuffix: true })}
                                        &bull; Updated {formatDistanceToNow(credential.updatedAt, { addSuffix: true })}
                                </>
                        }
                        image={
                                <div className="size-10 flex items-center justify-center">
                                        <Image src={logo} alt={credential.type} width={24} height={24} />
                                </div>
                        }
                        onRemove={handleDeleteCredential}
                        isRemoving={deleteCredential.isPending}
                />
        );
};
