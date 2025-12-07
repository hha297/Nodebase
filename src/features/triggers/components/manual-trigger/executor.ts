import type { NodeExecutor } from '@/features/executions/type';

type ManualTriggerData = Record<string, unknown>;
export const manualTriggerExecutor: NodeExecutor<ManualTriggerData> = async ({ nodeId, context, step }) => {
        // TODO: Publist 'loading' for manual trigger

        const result = await step.run('manual-trigger', async () => context);

        // TODO: Publish 'completed/success' for manual trigger
        return result;
};
