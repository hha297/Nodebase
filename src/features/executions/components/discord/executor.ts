import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { decode } from 'html-entities';
import Handlebars from 'handlebars';
import { discordChannel } from '@/inngest/channels/discord';
import ky from 'ky';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type DiscordData = {
        variableName?: string;
        webhookUrl?: string;
        username?: string;
        content?: string;
};
export const discordExecutor: NodeExecutor<DiscordData> = async ({ data, nodeId, context, step, publish }) => {
        await publish(discordChannel().status({ nodeId, status: 'loading' }));

        const rawContent = Handlebars.compile(data.content)(context);
        const content = decode(rawContent);
        const username = data.username ? decode(Handlebars.compile(data.username)(context)) : undefined;
        try {
                const result = await step.run('discord-webhook', async () => {
                        if (!data.variableName) {
                                await publish(discordChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Discord Node: Variable name is missing');
                        }

                        if (!data.content) {
                                await publish(discordChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Discord Node: Content is missing');
                        }

                        if (!data.webhookUrl) {
                                await publish(discordChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Discord Node: Webhook URL is missing');
                        }
                        await ky.post(data.webhookUrl!, {
                                json: {
                                        content: content.slice(0, 2000),
                                        username,
                                },
                        });

                        return {
                                ...context,
                                [data.variableName]: {
                                        messageContent: content.slice(0, 2000),
                                },
                        };
                });

                await publish(discordChannel().status({ nodeId, status: 'success' }));
                return result;
        } catch (error) {
                await publish(discordChannel().status({ nodeId, status: 'error' }));
                throw error;
        }
};
