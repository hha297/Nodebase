import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { createOpenAI } from '@ai-sdk/openai';
import { openaiChannel } from '@/inngest/channels/openai';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type OpenAIData = {
        variableName?: string;

        systemPrompt?: string;
        userPrompt?: string;
};
export const openaiExecutor: NodeExecutor<OpenAIData> = async ({ data, nodeId, context, step, publish }) => {
        await publish(openaiChannel().status({ nodeId, status: 'loading' }));

        if (!data.variableName) {
                await publish(openaiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('OpenAI Node: Variable name is missing');
        }

        if (!data.userPrompt) {
                await publish(openaiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('OpenAI Node: User prompt is missing');
        }

        // TODO: Throw if credentials are not found

        const systemPrompt = data.systemPrompt
                ? Handlebars.compile(data.systemPrompt)(context)
                : 'You are a helpful assistant.';
        const userPrompt = Handlebars.compile(data.userPrompt)(context);

        // TODO: Fetch credentials that user selected in the node settings

        const credentialValue = process.env.OPENAI_API_KEY!;
        const openai = createOpenAI({
                apiKey: credentialValue,
        });

        try {
                const { steps } = await step.ai.wrap('openai-generate-text', generateText, {
                        model: openai('gpt-4o'),
                        system: systemPrompt,
                        prompt: userPrompt,
                        experimental_telemetry: {
                                isEnabled: true,
                                recordInputs: true,
                                recordOutputs: true,
                        },
                });

                const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

                await publish(openaiChannel().status({ nodeId, status: 'success' }));

                return {
                        ...context,
                        [data.variableName]: {
                                aiResponse: text,
                        },
                };
        } catch (error) {
                await publish(openaiChannel().status({ nodeId, status: 'error' }));
                throw error;
        }
};
