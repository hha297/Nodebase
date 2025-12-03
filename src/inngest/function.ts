import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { inngest } from './client';
import { generateText } from 'ai';
import * as Sentry from '@sentry/nextjs';

const google = createGoogleGenerativeAI();

export const executeAI = inngest.createFunction(
        { id: 'execute-ai' },
        { event: 'execute/ai' },
        async ({ event, step }) => {
                const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
                        model: google('gemini-2.5-flash'),
                        system: 'You are a helpful assistant that can answer questions and help with tasks.',
                        prompt: 'What is the capital of France?',
                        experimental_telemetry: {
                                isEnabled: true,
                                recordInputs: true,
                                recordOutputs: true,
                        },
                });
                return steps;
        },
);
