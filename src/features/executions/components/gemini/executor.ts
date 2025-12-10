import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import Handlebars from 'handlebars';

import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { geminiChannel } from '@/inngest/channels/gemini';
import prisma from '@/lib/db';
import { decrypt } from '@/lib/encryption';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type GeminiData = {
        variableName?: string;
        credentialId?: string;
        systemPrompt?: string;
        userPrompt?: string;
};
export const geminiExecutor: NodeExecutor<GeminiData> = async ({ data, nodeId, context, step, publish, userId }) => {
        await publish(geminiChannel().status({ nodeId, status: 'loading' }));

        if (!data.variableName) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: Variable name is missing');
        }

        if (!data.userPrompt) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: User prompt is missing');
        }

        if (!data.credentialId) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: Credential ID is missing');
        }

        const systemPrompt = data.systemPrompt
                ? Handlebars.compile(data.systemPrompt)(context)
                : 'You are a helpful assistant.';
        const userPrompt = Handlebars.compile(data.userPrompt)(context);

        const credential = await step.run('get-credential', () => {
                return prisma.credential.findUnique({
                        where: {
                                id: data.credentialId,
                                userId,
                        },
                });
        });

        if (!credential) {
                await publish(geminiChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Gemini Node: Credential not found');
        }

        const google = createGoogleGenerativeAI({
                apiKey: decrypt(credential.value),
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
