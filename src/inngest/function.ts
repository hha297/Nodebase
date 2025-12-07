import { NonRetriableError } from 'inngest';
import { inngest } from './client';
import prisma from '@/lib/db';

export const executeWorkflow = inngest.createFunction(
        { id: 'execute-workflow' },
        { event: 'workflows/execute.workflow' },
        async ({ event, step }) => {
                const workflowId = event.data.workflowId;
                if (!workflowId) {
                        throw new NonRetriableError('Workflow ID is required');
                }

                const nodes = await step.run('prepare-workflow', async () => {
                        const workflow = await prisma.workflow.findUnique({
                                where: {
                                        id: workflowId,
                                },
                                include: {
                                        nodes: true,
                                        connections: true,
                                },
                        });

                        if (!workflow) {
                                throw new NonRetriableError('Workflow not found');
                        }
                        return workflow.nodes;
                });

                return { nodes };
        },
);
