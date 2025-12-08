import { NonRetriableError } from 'inngest';
import { inngest } from './client';
import prisma from '@/lib/db';
import { topologicalSort } from './utils';
import { NodeType } from '@/generated/prisma/enums';
import { getExecutor } from '@/features/executions/lib/executor-registry';
import { httpRequestChannel } from './channels/http-request';
import { manualTriggerChannel } from './channels/manual-trigger';
import { googleFormTriggerChannel } from './channels/google-form-trigger';
import { stripeTriggerChannel } from './channels/stripe-trigger';
import { geminiChannel } from './channels/gemini';
import { openaiChannel } from './channels/openai';
import { anthropicChannel } from './channels/anthropic';

export const executeWorkflow = inngest.createFunction(
        {
                id: 'execute-workflow',
                retries: 0, //TODO: Remove for production
        },
        {
                event: 'workflows/execute.workflow',
                channels: [
                        httpRequestChannel(),
                        manualTriggerChannel(),
                        googleFormTriggerChannel(),
                        stripeTriggerChannel(),
                        geminiChannel(),
                        openaiChannel(),
                        anthropicChannel(),
                ],
        },
        async ({ event, step, publish }) => {
                const workflowId = event.data.workflowId;
                if (!workflowId) {
                        throw new NonRetriableError('Workflow ID is required');
                }

                const sortedNodes = await step.run('prepare-workflow', async () => {
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
                        return topologicalSort(workflow.nodes, workflow.connections);
                });

                // Initialize the context with any initial variables needed for the workflow
                let context = event.data.initialData || {};

                // Execute the nodes in the sorted order
                for (const node of sortedNodes) {
                        const executor = getExecutor(node.type as NodeType);
                        context = await executor({
                                data: node.data as Record<string, unknown>,
                                nodeId: node.id,
                                context,
                                step,
                                publish,
                        });
                }

                return { workflowId, result: context };
        },
);
