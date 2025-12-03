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
        const testAI = useMutation(
                trpc.testAI.mutationOptions({
                        onSuccess: (data) => {
                                toast.success('AI test successful');
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
                        <Button disabled={testAI.isPending} onClick={() => testAI.mutate()}>
                                Test AI
                        </Button>
                        {testAI.data && <div className="text-sm text-gray-500">{testAI.data.message}</div>}
                </div>
        );
};

export default Home;
