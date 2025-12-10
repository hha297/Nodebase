import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import { decode } from 'html-entities';
import Handlebars from 'handlebars';
import ky from 'ky';
import { slackChannel } from '@/inngest/channels/slack';

Handlebars.registerHelper('json', (context) => {
        const stringified = JSON.stringify(context, null, 2);
        return new Handlebars.SafeString(stringified);
});
type SlackData = {
        variableName?: string;
        webhookUrl?: string;
        content?: string;
};
export const slackExecutor: NodeExecutor<SlackData> = async ({ data, nodeId, context, step, publish }) => {
        await publish(slackChannel().status({ nodeId, status: 'loading' }));

        const rawContent = Handlebars.compile(data.content)(context);
        const content = decode(rawContent);
        try {
                const result = await step.run('slack-webhook', async () => {
                        if (!data.variableName) {
                                await publish(slackChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Slack Node: Variable name is missing');
                        }

                        if (!data.content) {
                                await publish(slackChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Slack Node: Content is missing');
                        }

                        if (!data.webhookUrl) {
                                await publish(slackChannel().status({ nodeId, status: 'error' }));
                                throw new NonRetriableError('Slack Node: Webhook URL is missing');
                        }
                        await ky.post(data.webhookUrl!, {
                                json: {
                                        content: content, // The key depends on the Slack app configuration
                                },
                        });

                        return {
                                ...context,
                                [data.variableName]: {
                                        messageContent: content.slice(0, 2000),
                                },
                        };
                });

                await publish(slackChannel().status({ nodeId, status: 'success' }));
                return result;
        } catch (error) {
                await publish(slackChannel().status({ nodeId, status: 'error' }));
                throw error;
        }
};
