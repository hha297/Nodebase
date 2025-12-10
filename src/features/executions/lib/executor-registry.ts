import { NodeType } from '@prisma/client';
import { NodeExecutor } from '../type';
import { manualTriggerExecutor } from '@/features/triggers/components/manual-trigger/executor';
import { httpRequestExecutor } from '../components/http-request/executor';
import { googleFormTriggerExecutor } from '@/features/triggers/components/google-form-trigger/executor';
import { stripeTriggerExecutor } from '@/features/triggers/components/stripe-trigger/executor';
import { geminiExecutor } from '../components/gemini/executor';
import { openaiExecutor } from '../components/openai/executor';
import { anthropicExecutor } from '../components/anthropic/executor';
import { discordExecutor } from '../components/discord/executor';
import { slackExecutor } from '../components/slack/executor';

export const executorRegistry: Record<NodeType, NodeExecutor> = {
        [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
        // TODO: Add initial and http request executors
        [NodeType.INITIAL]: manualTriggerExecutor,
        [NodeType.HTTP_REQUEST]: httpRequestExecutor,
        [NodeType.GOOGLE_FORM_TRIGGER]: googleFormTriggerExecutor,
        [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
        [NodeType.GEMINI]: geminiExecutor,
        [NodeType.OPENAI]: openaiExecutor,
        [NodeType.ANTHROPIC]: anthropicExecutor,
        [NodeType.DISCORD]: discordExecutor,
        [NodeType.SLACK]: slackExecutor,
};

export const getExecutor = (nodeType: NodeType): NodeExecutor => {
        const executor = executorRegistry[nodeType];
        if (!executor) {
                throw new Error(`Executor not found for node type: ${nodeType}`);
        }
        return executor;
};
