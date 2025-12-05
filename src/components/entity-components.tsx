import { AlertTriangleIcon, Loader2Icon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Input } from './ui/input';
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '@/components/ui/empty';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {
        DropdownMenu,
        DropdownMenuTrigger,
        DropdownMenuContent,
        DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import { EllipsisVerticalIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
type EntityHeaderProps = {
        title: string;
        description?: string;
        newButtonLabel?: string;
        disabled?: boolean;
        isCreating?: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never }
        | { newButtonHref: string; onNew: never }
        | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
        title,
        description,
        newButtonLabel,
        disabled,
        isCreating,
        onNew,
        newButtonHref,
}: EntityHeaderProps) => {
        return (
                <div className="flex flex-row items-center justify-between gap-x-4">
                        <div className="flex flex-col">
                                <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
                                {description && (
                                        <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
                                )}
                        </div>
                        {onNew && !newButtonHref && (
                                <Button size="sm" onClick={onNew} disabled={disabled || isCreating}>
                                        <PlusIcon className="size-4" />
                                        {newButtonLabel}
                                </Button>
                        )}
                        {newButtonHref && !onNew && (
                                <Button size="sm" asChild disabled={disabled || isCreating} className="h-8">
                                        <Link href={newButtonHref} prefetch>
                                                <PlusIcon className="size-4" />
                                                {newButtonLabel}
                                        </Link>
                                </Button>
                        )}
                </div>
        );
};

type EntityContainerProps = {
        children: React.ReactNode;
        header?: React.ReactNode;
        search?: React.ReactNode;
        pagination?: React.ReactNode;
};

export const EntityContainer = ({ header, search, pagination, children }: EntityContainerProps) => {
        return (
                <div className="p-4 md:px-10 md:py-6 h-full">
                        <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
                                {header}
                                <div className="flex flex-col gap-y-4 h-full">
                                        {search}
                                        {children}
                                </div>
                                {pagination}
                        </div>
                </div>
        );
};

interface EntitySearchProps {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
}

export const EntitySearch = ({ value, onChange, placeholder = 'Search' }: EntitySearchProps) => {
        return (
                <div className="relative ml-auto">
                        <SearchIcon className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                                value={value}
                                onChange={(e) => onChange(e.target.value)}
                                placeholder={placeholder}
                                className="pl-10 max-w-xs bg-background shadow-none border-border "
                        />
                </div>
        );
};

interface EntityPaginationProps {
        page: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        disabled?: boolean;
}

export const EntityPagination = ({ page, totalPages, onPageChange, disabled }: EntityPaginationProps) => {
        return (
                <div className="flex items-center justify-between gap-x-2 w-full">
                        <div className="flex-1 text-sm text-muted-foreground">
                                Showing page {page} of {totalPages || 1}
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                        disabled={disabled || page === 1}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(Math.max(1, page - 1))}
                                >
                                        Previous
                                </Button>
                                <Button
                                        disabled={disabled || page === totalPages || totalPages === 0}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                                >
                                        Next
                                </Button>
                        </div>
                </div>
        );
};

interface StateViewProps {
        message?: string;
}

interface LoadingViewProps extends StateViewProps {
        entity?: string;
}

export const LoadingView = ({ message, entity = 'items' }: LoadingViewProps) => {
        return (
                <div className="flex flex-col flex-1 gap-y-4 items-center justify-center h-full">
                        <Loader2Icon className="size-4 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">{message || `Loading ${entity || 'entity'}...`}</p>
                </div>
        );
};

export const ErrorView = ({ message }: StateViewProps) => {
        return (
                <div className="flex flex-col flex-1 gap-y-4 items-center justify-center h-full">
                        <AlertTriangleIcon className="size-4 text-destructive" />
                        <p className="text-sm text-muted-foreground">{message || 'Error loading entity...'}</p>
                </div>
        );
};

interface EmptyViewProps extends StateViewProps {
        onNew?: () => void;
}

export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
        return (
                <Empty className="border border-dashed bg-white">
                        <EmptyHeader>
                                <EmptyMedia variant="icon">
                                        <PackageOpenIcon className="size-6 text-primary" />
                                </EmptyMedia>
                        </EmptyHeader>
                        <EmptyTitle>No items found</EmptyTitle>
                        {!!message && <EmptyDescription>{message}</EmptyDescription>}
                        {!!onNew && (
                                <EmptyContent>
                                        <Button onClick={onNew}>
                                                <PlusIcon className="size-4" /> Add item
                                        </Button>
                                </EmptyContent>
                        )}
                </Empty>
        );
};

interface EntityListProps<T> {
        items: T[];
        renderItem: (item: T, index: number) => React.ReactNode;
        getKey?: (item: T, index: number) => string | number;
        emptyView?: React.ReactNode;
        className?: string;
}

export function EntityList<T>({ items, renderItem, getKey, emptyView, className }: EntityListProps<T>) {
        if (items.length === 0 && emptyView) {
                return (
                        <div className="flex flex-1 items-center justify-center">
                                <div className="max-w-sm mx-auto">{emptyView}</div>
                        </div>
                );
        }
        return (
                <div className={cn('flex flex-col gap-y-4', className)}>
                        {items.map((item, index) => (
                                <div key={getKey ? getKey(item, index) : index}>{renderItem(item, index)}</div>
                        ))}
                </div>
        );
}

interface EntityItemProps {
        href: string;
        title: string;
        subtitle?: React.ReactNode;
        image?: React.ReactNode;
        actions?: React.ReactNode;
        onRemove?: () => void | Promise<void>;
        isRemoving?: boolean;
        className?: string;
}

export const EntityItem = ({
        href,
        title,
        subtitle,
        image,
        actions,
        onRemove,
        isRemoving,
        className,
}: EntityItemProps) => {
        const handleRemove = async (e: React.MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();

                if (isRemoving) return;
                if (onRemove) {
                        await onRemove();
                        toast.success('Item removed.');
                }
        };
        return (
                <Link href={href} prefetch>
                        <Card
                                className={cn(
                                        'p-4 shadow-none hover:shadow cursor-pointer',
                                        className,
                                        isRemoving && 'opacity-50 cursor-not-allowed',
                                )}
                        >
                                <CardContent className="flex flex-row items-center justify-between p-0">
                                        <div className="flex items-center gap-3">
                                                {image}
                                                <div>
                                                        <CardTitle className="text-base font-medium">{title}</CardTitle>
                                                        {!!subtitle && (
                                                                <CardDescription className="text-xs text-muted-foreground">
                                                                        {subtitle}
                                                                </CardDescription>
                                                        )}
                                                </div>
                                        </div>
                                        {(actions || onRemove) && (
                                                <div className="flex gap-x-4 items-center">
                                                        {actions}
                                                        {onRemove && (
                                                                <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                                <Button
                                                                                        variant="ghost"
                                                                                        size="icon"
                                                                                        onClick={(e) =>
                                                                                                e.stopPropagation()
                                                                                        }
                                                                                >
                                                                                        <EllipsisVerticalIcon className="size-4" />
                                                                                </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent
                                                                                align="end"
                                                                                onCloseAutoFocus={(e) =>
                                                                                        e.stopPropagation()
                                                                                }
                                                                        >
                                                                                <DropdownMenuItem
                                                                                        onClick={handleRemove}
                                                                                        disabled={isRemoving}
                                                                                        className="hover:cursor-pointer!"
                                                                                >
                                                                                        <TrashIcon className="size-4" />{' '}
                                                                                        Remove
                                                                                </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                </DropdownMenu>
                                                        )}
                                                </div>
                                        )}
                                </CardContent>
                        </Card>
                </Link>
        );
};
