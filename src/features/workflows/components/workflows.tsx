'use client';
import React from 'react';
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows';
import { EntityContainer, EntityHeader } from '@/components/entity-views';
import { toast } from 'sonner';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';

export const WorkflowsList = () => {
        const workflows = useSuspenseWorkflows();
        return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
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
                <EntityContainer header={<WorkflowsHeader disabled={false} />} search={<></>} pagination={<></>}>
                        {children}
                </EntityContainer>
        );
};
