'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { requireAuth } from '@/lib/auth/auth-utils';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const Home = () => {
        const trpc = useTRPC();
        const queryClient = useQueryClient();
        const { data } = useQuery(trpc.getWorkflows.queryOptions());
        const createWorkflow = useMutation(
                trpc.createWorkflow.mutationOptions({
                        onSuccess: () => {
                                queryClient.invalidateQueries(trpc.getWorkflows.queryOptions());
                                toast.success('Workflow created successfully');
                        },
                        onError: (error) => {
                                toast.error(error.message);
                        },
                }),
        );
        return (
                <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
                        {JSON.stringify(data)}
                        <Button disabled={createWorkflow.isPending} onClick={() => createWorkflow.mutate()}>
                                Create Workflow
                        </Button>
                </div>
        );
};

export default Home;
