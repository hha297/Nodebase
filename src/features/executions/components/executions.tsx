'use client';
import React from 'react';

import {
        EmptyView,
        EntityContainer,
        EntityHeader,
        EntityItem,
        EntityList,
        EntityPagination,
        ErrorView,
        LoadingView,
} from '@/components/entity-components';
import { formatDistanceToNow } from 'date-fns';
import { useExecutionsParams } from '../hooks/use-executions-params';
import type { Execution } from '@/generated/prisma/client';
import { ExecutionStatus } from '@/generated/prisma/enums';
import { CredentialType } from '@/generated/prisma/enums';
import { useSuspenseExecutions } from '../hooks/use-executions';
import { CircleCheckIcon, CircleDashedIcon, CircleXIcon, Loader2Icon } from 'lucide-react';

export const ExecutionsList = () => {
        const executions = useSuspenseExecutions();
        return (
                <EntityList
                        items={executions.data.items}
                        getKey={(execution) => execution.id}
                        renderItem={(execution) => <ExecutionItem execution={execution} />}
                        emptyView={<ExecutionsEmpty />}
                />
        );
};

export const ExecutionsHeader = () => {
        return <EntityHeader title="Executions" description="Viuew your workflow executions history" />;
};

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
        return (
                <EntityContainer header={<ExecutionsHeader />} pagination={<ExecutionsPagination />}>
                        {children}
                </EntityContainer>
        );
};

export const ExecutionsPagination = () => {
        const [params, setParams] = useExecutionsParams();
        const executions = useSuspenseExecutions();
        return (
                <EntityPagination
                        page={params.page}
                        totalPages={executions.data.totalPages}
                        onPageChange={(page) => setParams({ ...params, page })}
                        disabled={executions.isFetching}
                />
        );
};

export const ExecutionsLoading = () => {
        return <LoadingView message="Loading executions..." entity="executions" />;
};

export const ExecutionsError = () => {
        return <ErrorView message="Error loading executions..." />;
};

export const ExecutionsEmpty = () => {
        return <EmptyView message="You haven't executed any workflows yet. Get started by creating a new workflow." />;
};

const credentialLogos: Record<CredentialType, string> = {
        [CredentialType.OPENAI]: '/images/openai.svg',
        [CredentialType.GEMINI]: '/images/gemini.svg',
        [CredentialType.ANTHROPIC]: '/images/anthropic.svg',
};

const getStatusIcon = (status: ExecutionStatus) => {
        switch (status) {
                case ExecutionStatus.SUCCESS:
                        return <CircleCheckIcon className="size-6 text-green-700" />;
                case ExecutionStatus.FAILED:
                        return <CircleXIcon className="size-6 text-destructive" />;
                case ExecutionStatus.RUNNING:
                        return <Loader2Icon className="size-6 animate-spin text-primary" />;
                default:
                        return <CircleDashedIcon className="size-6 text-muted-foreground" />;
        }
};

const formatStatus = (status: ExecutionStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const ExecutionItem = ({ execution }: { execution: Execution & { workflow: { id: string; name: string } } }) => {
        const duration = execution.completedAt
                ? Math.round((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000)
                : null;

        const subtitle = (
                <>
                        {execution.workflow.name} &bull; Started{' '}
                        {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                        {duration !== null && <>&bull; Took {duration} seconds</>}
                </>
        );
        return (
                <EntityItem
                        href={`/executions/${execution.id}`}
                        title={formatStatus(execution.status)}
                        subtitle={subtitle}
                        image={
                                <div className="size-10 flex items-center justify-center">
                                        {getStatusIcon(execution.status)}
                                </div>
                        }
                />
        );
};
