import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import ky, { type Options as KyOptions } from 'ky';

type HttpRequestData = {
        endpoint?: string;
        method?: string;
        body?: string;
};
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {
        // TODO: Publist 'loading' for http request
        if (!data.endpoint) {
                // TODO: Publish 'error' for http request
                throw new NonRetriableError('HTTP Request Node: No endpoint configured');
        }
        const result = await step.run('http-request', async () => {
                const method = data.method || 'GET';
                const endpoint = data.endpoint!;

                const options: KyOptions = { method };

                if (['POST', 'PUT', 'PATCH'].includes(method)) {
                        options.body = data.body;
                }

                const response = await ky(endpoint, options);
                const contentType = response.headers.get('content-type');
                const responseData = contentType?.includes('application/json')
                        ? await response.json()
                        : await response.text();

                return {
                        ...context,
                        httpRequest: {
                                status: response.status,
                                statusText: response.statusText,
                                data: responseData,
                        },
                };
        });

        // TODO: Publish 'completed/success' for http request
        return result;
};
