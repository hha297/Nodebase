// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
        dsn: 'https://80c2025bc73fcc56b5c5f7ecd1266bc9@o4509846580625408.ingest.de.sentry.io/4510469964824656',
        integrations: [
                // send console.log, console.warn, and console.error calls as logs to Sentry
                Sentry.consoleLoggingIntegration({ levels: ['log', 'warn', 'error'] }),
        ],

        // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
        tracesSampleRate: 1,

        // Enable logs to be sent to Sentry
        enableLogs: true,

        // Setting this option to true will print useful information to the console while you're setting up Sentry.
        debug: false,
});
