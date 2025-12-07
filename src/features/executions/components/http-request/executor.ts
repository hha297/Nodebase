import type { NodeExecutor } from '@/features/executions/type';
import { NonRetriableError } from 'inngest';
import ky, { type Options as KyOptions } from 'ky';

type HttpRequestData = {
        variableName?: string;
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
        if (!data.variableName) {
                // TODO: Publish 'error' for http request
                throw new NonRetriableError('variable name not configured');
        }

        const result = await step.run('http-request', async () => {
                const method = data.method || 'GET';
                const endpoint = data.endpoint!;

                const options: KyOptions = { method };

                if (['POST', 'PUT', 'PATCH'].includes(method)) {
                        options.body = data.body;
                        options.headers = {
                                'Content-Type': 'application/json',
                        };
                }

                const response = await ky(endpoint, options);
                const contentType = response.headers.get('content-type');
                const responseData = contentType?.includes('application/json')
                        ? await response.json()
                        : await response.text();

                const responsePayload = {
                        httpResponse: {
                                status: response.status,
                                statusText: response.statusText,
                                data: responseData,
                        },
                };

                if (data.variableName) {
                        return {
                                ...context,
                                [data.variableName]: responsePayload,
                        };
                }

                // Fallback to direct httpResponse for backwards compatibility
                return {
                        ...context,
                        ...responsePayload,
                };
        });

        // TODO: Publish 'completed/success' for http request
        return result;
};
