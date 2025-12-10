import { Inngest } from 'inngest';
import { realtimeMiddleware } from '@inngest/realtime/middleware';
export const inngest = new Inngest({
        id: 'nodebase',
        middleware: [realtimeMiddleware()],
        eventKey: process.env.INNGEST_EVENT_KEY,
});
