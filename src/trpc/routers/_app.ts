import { inngest } from '@/inngest/client';
import { createTRPCRouter, protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
        getWorkflows: protectedProcedure.query(() => {
                return prisma.workflow.findMany();
        }),
        createWorkflow: protectedProcedure.mutation(async () => {
                await inngest.send({
                        name: 'test/hello.world',
                        data: {
                                email: 'test@test.com',
                        },
                });
                return { success: true, message: 'Job queued' };
        }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
