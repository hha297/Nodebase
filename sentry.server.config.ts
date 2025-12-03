// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
        dsn: 'https://80c2025bc73fcc56b5c5f7ecd1266bc9@o4509846580625408.ingest.de.sentry.io/4510469964824656',

        integrations: [
                // Add the Vercel AI SDK integration to sentry.server.config.ts
                Sentry.vercelAIIntegration({
                        recordInputs: true,
                        recordOutputs: true,
                }),
                Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
        ],

        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: 1,
        sendDefaultPii: true,

        // Enable logs to be sent to Sentry
        enableLogs: true,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,
});
