import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import Handlebars from 'handlebars';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { geminiChannel } from '@/inngest/channels/gemini';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type GeminiData = {
        variableName?: string;

        systemPrompt?: string;
        userPrompt?: string;
};
export const geminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, context, step, publish }) => {
        await publish(geminiChannel().status({ nodeId, status: 'loading' }));

        if (!data.variableName) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: Variable name is missing');
        }

        if (!data.userPrompt) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: User prompt is missing');
        }

        // TODO: Throw if credentials are not found

        const systemPrompt = data.systemPrompt
                ? Handlebars.compile(data.systemPrompt)(context)
                : 'You are a helpful assistant.';
        const userPrompt = Handlebars.compile(data.userPrompt)(context);

        // TODO: Fetch credentials that user selected in the node settings

        const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
        const google = createGoogleGenerativeAI({
                apiKey: credentialValue,
        });

        try {
                const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
                        model: google('gemini-2.5-flash'),
                        system: systemPrompt,
                        prompt: userPrompt,
                        experimental_telemetry: {
                                isEnabled: true,
                                recordInputs: true,
                                recordOutputs: true,
                        },
                });

                const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

                await publish(geminiChannel().status({ nodeId, status: 'success' }));

                return {
                        ...context,
                        [data.variableName]: {
                                aiResponse: text,
                        },
                };
        } catch (error) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw error;
        }
};
