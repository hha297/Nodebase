'use client';

import { Button } from '@/components/ui/button';
import { useTRPC } from '@/trpc/client';
import { useMutation } from '@tanstack/react-query';

const SubscriptionPage = () => {
        const trpc = useTRPC();
        const testAI = useMutation(trpc.testAI.mutationOptions());
        return (
                <div>
                        <h1>Subscription</h1>
                        <Button onClick={() => testAI.mutate()}>Test AI</Button>
                </div>
        );
};

export default SubscriptionPage;
