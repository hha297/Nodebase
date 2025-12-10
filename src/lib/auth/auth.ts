import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { polar, checkout, portal } from '@polar-sh/better-auth';
import prisma from '../db';
import { polarClient } from '../polar';

export const auth = betterAuth({
        database: prismaAdapter(prisma, { provider: 'postgresql' }),
        emailAndPassword: {
                enabled: true,
                autoSignIn: true,
        },
        socialProviders: {
                github: {
                        clientId: process.env.GITHUB_CLIENT_ID as string,
                        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
                },
                google: {
                        clientId: process.env.GOOGLE_CLIENT_ID as string,
                        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                },
        },
        plugins: [
                polar({
                        client: polarClient,
                        createCustomerOnSignUp: true,
                        use: [
                                checkout({
                                        products: [
                                                {
                                                        productId: '58cb56ce-e23e-46b5-bbb4-aa8e9f302432',
                                                        slug: 'nodebase-pro', // Custom slug for easy reference in Checkout URL, e.g. /checkout/nodebase-pro
                                                },
                                        ],
                                        successUrl: process.env.POLAR_SUCCESS_URL,
                                        authenticatedUsersOnly: true,
                                }),
                                portal(),
                        ],
                }),
        ],
});
