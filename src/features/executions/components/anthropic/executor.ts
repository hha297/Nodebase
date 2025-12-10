import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { generateText } from 'ai';
import Handlebars from 'handlebars';
import { createAnthropic } from '@ai-sdk/anthropic';
import { anthropicChannel } from '@/inngest/channels/anthropic';
import prisma from '@/lib/db';
import { decrypt } from '@/lib/encryption';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type AnthropicData = {
        variableName?: string;
        credentialId?: string;
        systemPrompt?: string;
        userPrompt?: string;
};
export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
        data,
        nodeId,
        context,
        step,
        publish,
        userId,
}) => {
        await publish(anthropicChannel().status({ nodeId, status: 'loading' }));

        if (!data.variableName) {
                await publish(anthropicChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Anthropic Node: Variable name is missing');
        }

        if (!data.userPrompt) {
                await publish(anthropicChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Anthropic Node: User prompt is missing');
        }

        if (!data.credentialId) {
                await publish(anthropicChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Anthropic Node: Credential ID is missing');
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
                await publish(anthropicChannel().status({ nodeId, status: 'error' }));
                throw new NonRetriableError('Anthropic Node: Credential not found');
        }

        const anthropic = createAnthropic({
                apiKey: decrypt(credential.value),
        });

        try {
                const { steps } = await step.ai.wrap('anthropic-generate-text', generateText, {
                        model: anthropic('claude-3-5-sonnet'),
                        system: systemPrompt,
                        prompt: userPrompt,
                        experimental_telemetry: {
                                isEnabled: true,
                                recordInputs: true,
                                recordOutputs: true,
                        },
                });

                const text = steps[0].content[0].type === 'text' ? steps[0].content[0].text : '';

                await publish(anthropicChannel().status({ nodeId, status: 'success' }));

                return {
                        ...context,
                        [data.variableName]: {
                                aiResponse: text,
                        },
                };
        } catch (error) {
                await publish(anthropicChannel().status({ nodeId, status: 'error' }));
                throw error;
        }
};
