'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ExecutionStatus } from '@prisma/client';
import { CircleCheckIcon, CircleXIcon, Loader2Icon, CircleDashedIcon } from 'lucide-react';
import { useSuspenseExecution } from '../hooks/use-executions';
import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const getStatusIcon = (status: ExecutionStatus) => {
        switch (status) {
                case ExecutionStatus.SUCCESS:
                        return <CircleCheckIcon className="size-6 text-green-700" />;
                case ExecutionStatus.FAILED:
                        return <CircleXIcon className="size-6 text-destructive" />;
                case ExecutionStatus.RUNNING:
                        return <Loader2Icon className="size-6 animate-spin text-primary" />;
                default:
                        return <CircleDashedIcon className="size-6 text-muted-foreground" />;
        }
};

const formatStatus = (status: ExecutionStatus) => {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export const ExecutionView = ({ executionId }: { executionId: string }) => {
        const { data: execution } = useSuspenseExecution(executionId);

        const [showStackTrace, setShowStackTrace] = useState(false);
        const duration = execution.completedAt
                ? Math.round((execution.completedAt.getTime() - execution.startedAt.getTime()) / 1000)
                : null;
        return (
                <Card className="shadow-none">
                        <CardHeader>
                                <div className="flex items-center gap-2">
                                        {getStatusIcon(execution.status)}
                                        <div>
                                                <CardTitle>{formatStatus(execution.status)}</CardTitle>
                                                <CardDescription>
                                                        Execution for {execution.workflow.name}
                                                </CardDescription>
                                        </div>
                                </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                        <div>
                                                <p className="text-sm text-muted-foreground font-medium">Workflow</p>
                                                <Link
                                                        href={`/workflows/${execution.workflow.id}`}
                                                        prefetch
                                                        className="text-sm hover:underline text-primary"
                                                >
                                                        {execution.workflow.name}
                                                </Link>
                                        </div>
                                        <div>
                                                <p className="text-sm text-muted-foreground font-medium">Status</p>
                                                <Badge
                                                        variant="outline"
                                                        className={cn(
                                                                execution.status === ExecutionStatus.SUCCESS
                                                                        ? 'bg-green-700 text-white'
                                                                        : execution.status === ExecutionStatus.FAILED
                                                                        ? 'bg-destructive text-white'
                                                                        : 'bg-muted text-muted-foreground',
                                                        )}
                                                >
                                                        {formatStatus(execution.status)}
                                                </Badge>
                                        </div>
                                        <div>
                                                <p className="text-sm text-muted-foreground font-medium">Started</p>
                                                <p className="text-sm text-muted-foreground">
                                                        {formatDistanceToNow(execution.startedAt, { addSuffix: true })}
                                                </p>
                                        </div>
                                        {execution.completedAt ? (
                                                <div>
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                                Completed
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                                {formatDistanceToNow(execution.completedAt, {
                                                                        addSuffix: true,
                                                                })}
                                                        </p>
                                                </div>
                                        ) : null}
                                        {duration !== null ? (
                                                <div>
                                                        <p className="text-sm text-muted-foreground font-medium">
                                                                Duration
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                                {duration} seconds
                                                        </p>
                                                </div>
                                        ) : null}

                                        <div>
                                                <p className="text-sm text-muted-foreground font-medium">
                                                        Inngest Event ID
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                        {execution.inngestEventId}
                                                </p>
                                        </div>
                                </div>
                                {execution.error && (
                                        <div className="mt-6 p-4 bg-destructive/10 rounded-md space-y-3">
                                                <div>
                                                        <p className="text-sm font-medium text-destructive">Error</p>
                                                        <p className="text-sm text-destructive">{execution.error}</p>
                                                </div>
                                                {execution.errorStack && (
                                                        <Collapsible
                                                                open={showStackTrace}
                                                                onOpenChange={setShowStackTrace}
                                                        >
                                                                <CollapsibleTrigger>
                                                                        <Button
                                                                                variant="outline"
                                                                                size={'sm'}
                                                                                className="text-primary hover:bg-destructive/40"
                                                                        >
                                                                                {showStackTrace
                                                                                        ? 'Hide Stack Trace'
                                                                                        : 'Show Stack Trace'}
                                                                        </Button>
                                                                </CollapsibleTrigger>
                                                                <CollapsibleContent>
                                                                        <pre className="text-sm text-destructive overflow-auto mt-2 p-2 rounded-md bg-destructive/10">
                                                                                {execution.errorStack}
                                                                        </pre>
                                                                </CollapsibleContent>
                                                        </Collapsible>
                                                )}
                                        </div>
                                )}
                                {execution.output && (
                                        <div className="mt-6 p-4 bg-muted rounded-md">
                                                <p className="text-sm text-muted-foreground font-medium mb-2">Output</p>
                                                <pre className="text-sm text-muted-foreground overflow-auto mt-2 p-2 rounded-md bg-muted">
                                                        {JSON.stringify(execution.output, null, 2)}
                                                </pre>
                                        </div>
                                )}
                        </CardContent>
                </Card>
        );
};
