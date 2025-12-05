import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useWorkflowsParams } from './use-workflows-params';

/**
 *Hook to fetch all workflows using Suspense
 */
export const useSuspenseWorkflows = () => {
        const trpc = useTRPC();
        const [params] = useWorkflowsParams();
        return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useSuspenseWorkflow = (id: string) => {
        const trpc = useTRPC();
        return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

export const useCreateWorkflow = () => {
        const trpc = useTRPC();

        const queryClient = useQueryClient();
        return useMutation(
                trpc.workflows.create.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Workflow '${data.name}' created.`);

                                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                        },
                        onError: (error) => {
                                toast.error(`Failed to create workflow: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};

export const useDeleteWorkflow = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        return useMutation(
                trpc.workflows.delete.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Workflow '${data.name}' deleted.`);
                                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                                queryClient.invalidateQueries(trpc.workflows.getOne.queryFilter({ id: data.id }));
                        },
                        onError: (error) => {
                                toast.error(`Failed to delete workflow: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};

export const useUpdateWorkflowName = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        return useMutation(
                trpc.workflows.updateName.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Workflow '${data.name}' updated.`);
                                queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
                                queryClient.invalidateQueries(trpc.workflows.getOne.queryOptions({ id: data.id }));
                        },
                        onError: (error) => {
                                toast.error(`Failed to update workflow name: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};
