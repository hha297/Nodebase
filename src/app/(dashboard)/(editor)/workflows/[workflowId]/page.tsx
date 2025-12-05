import { Editor, EditorError, EditorLoading } from '@/features/editor/components/editor';
import { EditorHeader } from '@/features/editor/components/editor-header';
import { prefetchWorkflow } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth/auth-utils';
import { HydrateClient } from '@/trpc/server';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface WorkflowIdPageProps {
        params: Promise<{
                workflowId: string;
        }>;
}

const WorkflowIdPage = async ({ params }: WorkflowIdPageProps) => {
        await requireAuth();
        const { workflowId } = await params;
        prefetchWorkflow(workflowId);
        return (
                <HydrateClient>
                        <ErrorBoundary fallback={<EditorError />}>
                                <Suspense fallback={<EditorLoading />}>
                                        <EditorHeader workflowId={workflowId} />
                                        <main className="flex-1">
                                                <Editor workflowId={workflowId} />
                                        </main>
                                </Suspense>
                        </ErrorBoundary>
                </HydrateClient>
        );
};

export default WorkflowIdPage;
