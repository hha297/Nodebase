import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { inngest } from './client';
import { generateText } from 'ai';

const google = createGoogleGenerativeAI();

export const executeAI = inngest.createFunction(
        { id: 'execute-ai' },
        { event: 'execute/ai' },
        async ({ event, step }) => {
                const { steps } = await step.ai.wrap('gemini-generate-text', generateText, {
                        system: 'You are a helpful assistant that can answer questions and help with tasks.',
                        prompt: 'What is the capital of France?',
                        model: google('gemini-2.5-flash'),
                });
                return steps;
        },
);
