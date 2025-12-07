import { Button } from '@/components/ui/button';
import { useExecuteWorkflow } from '@/features/workflows/hooks/use-workflows';
import { FlaskConicalIcon } from 'lucide-react';

export const ExecuteWorkflowButton = ({ workflowId }: { workflowId: string }) => {
        const executeWorkflow = useExecuteWorkflow();

        const handleExecuteWorkflow = () => {
                executeWorkflow.mutate({ id: workflowId });
        };
        return (
                <Button onClick={handleExecuteWorkflow} size="lg" disabled={executeWorkflow.isPending}>
                        <FlaskConicalIcon className="size-4" />
                        {executeWorkflow.isPending ? 'Executing...' : 'Execute Workflow'}
                </Button>
        );
};
