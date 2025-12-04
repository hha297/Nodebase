import { PlusIcon, SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Input } from './ui/input';

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
