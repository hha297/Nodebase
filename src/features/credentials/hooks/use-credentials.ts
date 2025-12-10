import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { toast } from 'sonner';
import { useCredentialsParams } from './use-credentials-params';
import { CredentialType } from '@prisma/client';

/**
 *Hook to fetch all credentials using Suspense
 */
export const useSuspenseCredentials = () => {
        const trpc = useTRPC();
        const [params] = useCredentialsParams();
        return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};

export const useSuspenseCredential = (id: string) => {
        const trpc = useTRPC();
        return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};

export const useCreateCredential = () => {
        const trpc = useTRPC();

        const queryClient = useQueryClient();
        return useMutation(
                trpc.credentials.create.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Credential '${data.name}' created.`);

                                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                        },
                        onError: (error) => {
                                toast.error(`Failed to create credential: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};

export const useDeleteCredential = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        return useMutation(
                trpc.credentials.delete.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Credential '${data.name}' deleted.`);
                                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                                queryClient.invalidateQueries(trpc.credentials.getOne.queryFilter({ id: data.id }));
                        },
                        onError: (error) => {
                                toast.error(`Failed to delete credential: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};

export const useUpdateCredential = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        return useMutation(
                trpc.credentials.update.mutationOptions({
                        onSuccess: (data) => {
                                toast.success(`Credential '${data.name}' saved.`);
                                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                                queryClient.invalidateQueries(trpc.credentials.getOne.queryOptions({ id: data.id }));
                        },
                        onError: (error) => {
                                toast.error(`Failed to save credential: ${error.message}`);
                                console.error(error);
                        },
                }),
        );
};

export const useGetCredentialsByType = (type: CredentialType) => {
        const trpc = useTRPC();
        return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};
