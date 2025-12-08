import { NodeType } from '@/generated/prisma/enums';
import { NodeExecutor } from '../type';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../components/http-request/executor';
import { googleFormTriggerExecutor } from '@/features/triggers/components/google-form-trigger/executor';

export const executorRegistry: Record<NodeType, NodeExecutor> = {
        [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
        // TODO: Add initial and http request executors
        [NodeType.INITIAL]: manualTriggerExecutor,
        [NodeType.HTTP_REQUEST]: httpRequestExecutor, //TODO: Fix typing
        [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
        const executor = executorRegistry[nodeType];
        if (!executor) {
                throw new Error(`Executor not found for node type: ${nodeType}`);
        }
        return executor;
};
