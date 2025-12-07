import type { Realtime } from '@inngest/realtime';
import { useInngestSubscription } from '@inngest/realtime/hooks';
import type { NodeStatus } from '@/components/react-flow/node-status-indicator';
import { useEffect, useState } from 'react';

interface UseNodeStatusOptions {
        nodeId: string;
        channel: string;
        topic: string;
        refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({ nodeId, channel, topic, refreshToken }: UseNodeStatusOptions) {
        const [status, setStatus] = useState<NodeStatus>('initial');

        const { data: subscription } = useInngestSubscription({
                refreshToken,
                enabled: true,
        });

        useEffect(() => {
                if (!subscription?.length) return;

                // Find the latest message for the node
                const latestMessage = subscription
                        .filter(
                                (message) =>
                                        message.kind === 'data' &&
                                        message.channel === channel &&
                                        message.topic === topic &&
                                        message.data.nodeId === nodeId,
                        )
                        .sort((a, b) => {
                                if (a.kind === 'data' && b.kind === 'data') {
                                        return b.createdAt.getTime() - a.createdAt.getTime();
                                }
                                return 0;
                        })[0];

                if (latestMessage) {
                        setStatus(latestMessage.data.status as NodeStatus);
                }
        }, [subscription, nodeId, channel, topic]);

        return status;
}
