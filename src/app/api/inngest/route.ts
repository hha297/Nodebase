import { serve } from 'inngest/next';
import { inngest } from '../../../inngest/client';
import { executeWorkflow } from '@/inngest/function';

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
        client: inngest,
        functions: [executeWorkflow],
        signingKey: process.env.INNGEST_SIGNING_KEY,
});
