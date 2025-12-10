import { Connection, Node } from '@prisma/client';
import toposort from 'toposort';
import { inngest } from './client';
import { createId } from '@paralleldrive/cuid2';

export const topologicalSort = (nodes: Node[], connections: Connection[]): Node[] => {
        // If there are no connections, return the nodes in the order they were provided
        if (connections.length === 0) {
                return nodes;
        }

        // Create edges array for toposort
        const edges: [string, string][] = connections.map((connection) => [connection.fromNodeId, connection.toNodeId]);

        // Add nodes with no connections as self-edges to ensure they are included in the sort
        const connectedNodeIds = new Set<string>();
        for (const connection of connections) {
                connectedNodeIds.add(connection.fromNodeId);
                connectedNodeIds.add(connection.toNodeId);
        }

        for (const node of nodes) {
                if (!connectedNodeIds.has(node.id)) {
                        edges.push([node.id, node.id]);
                }
        }

        // Perform topological sort
        let sortedNodeIds: string[] = [];
        try {
                sortedNodeIds = toposort(edges);
                // Remove duplicates
                sortedNodeIds = [...new Set(sortedNodeIds)];
        } catch (error) {
                if (error instanceof Error && error.message.includes('Cyclic')) {
                        throw new Error('Workflow contains a cycle');
                }

                throw error;
        }

        // Map sorted node IDs back to nodes object
        const nodeMap = new Map(nodes.map((node) => [node.id, node]));

        return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};

export const sendWorkflowExecution = async (data: { workflowId: string; [key: string]: any }) => {
        return inngest.send({
                id: createId(),
                name: 'workflows/execute.workflow',
                data,
        });
};
