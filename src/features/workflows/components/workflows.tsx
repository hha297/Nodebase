'use client';
import React from 'react';
import { useCreateWorkflow, useDeleteWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows';
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
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';
import { useWorkflowsParams } from '../hooks/use-workflows-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
import type { Workflow } from '@/generated/prisma/client';
import { WorkflowIcon } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export const WorkflowsList = () => {
        const workflows = useSuspenseWorkflows();
        return (
                <EntityList
                        items={workflows.data.items}
                        renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
                        getKey={(workflow) => workflow.id}
                        emptyView={<WorkflowsEmpty />}
                />
        );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
        const createWorkflow = useCreateWorkflow();
        const { modal, handleError } = useUpgradeModal();
        const router = useRouter();
        const handleCreateWorkflow = () => {
                createWorkflow.mutate(undefined, {
                        onSuccess: (data) => {
                                router.push(`/workflows/${data.id}`);
                        },
                        onError: (error) => {
                                handleError(error);
                        },
                });
        };
        return (
                <>
                        {modal}
                        <EntityHeader
                                title="Workflows"
                                description="Create and manage your workflows"
                                newButtonLabel="New Workflow"
                                onNew={handleCreateWorkflow}
                                disabled={disabled}
                                isCreating={createWorkflow.isPending}
                        />
                </>
        );
};

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
        return (
                <EntityContainer
                        header={<WorkflowsHeader disabled={false} />}
                        search={<WorkflowsSearch />}
                        pagination={<WorkflowsPagination />}
                >
                        {children}
                </EntityContainer>
        );
};

export const WorkflowsSearch = () => {
        const [params, setParams] = useWorkflowsParams();
        const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
        return <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows" />;
};

export const WorkflowsPagination = () => {
        const [params, setParams] = useWorkflowsParams();
        const workflows = useSuspenseWorkflows();
        return (
                <EntityPagination
                        page={params.page}
                        totalPages={workflows.data.totalPages}
                        onPageChange={(page) => setParams({ ...params, page })}
                        disabled={workflows.isFetching}
                />
        );
};

export const WorkflowsLoading = () => {
        return <LoadingView message="Loading workflows..." entity="workflows" />;
};

export const WorkflowsError = () => {
        return <ErrorView message="Error loading workflows..." />;
};

export const WorkflowsEmpty = () => {
        const createWorkflow = useCreateWorkflow();
        const router = useRouter();
        const { modal, handleError } = useUpgradeModal();

        const handleCreateWorkflow = () => {
                createWorkflow.mutate(undefined, {
                        onSuccess: (data) => {
                                router.push(`/workflows/${data.id}`);
                        },
                        onError: (error) => {
                                handleError(error);
                        },
                });
        };
        return (
                <>
                        {modal}
                        <EmptyView
                                message="No workflows found. You can create a new one to get started."
                                onNew={handleCreateWorkflow}
                        />
                </>
        );
};

export const WorkflowItem = ({ workflow }: { workflow: Workflow }) => {
        const deleteWorkflow = useDeleteWorkflow();
        const handleDeleteWorkflow = () => {
                deleteWorkflow.mutate({ id: workflow.id });
        };
        return (
                <EntityItem
                        href={`/workflows/${workflow.id}`}
                        title={workflow.name}
                        subtitle={
                                <>
                                        Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })} &bull;
                                        Created {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
                                </>
                        }
                        image={
                                <div className="size-10 flex items-center justify-center">
                                        <WorkflowIcon className="size-5 text-primary" />
                                </div>
                        }
                        onRemove={handleDeleteWorkflow}
                        isRemoving={deleteWorkflow.isPending}
                />
        );
};
