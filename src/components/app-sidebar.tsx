'use client';

import { CreditCardIcon, FolderIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon } from 'lucide-react';
import {
        Sidebar,
        SidebarMenu,
        SidebarMenuItem,
        SidebarMenuButton,
        SidebarMenuSub,
        SidebarMenuSubItem,
        SidebarMenuSubButton,
        SidebarContent,
        SidebarGroupLabel,
        SidebarGroup,
        SidebarGroupContent,
        SidebarHeader,
        SidebarFooter,
} from './ui/sidebar';
import Link from 'next/link';
import Image from 'next/image';
import Logo from './logo';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth/auth-client';
import { useHasActiveSubscription } from '@/features/subscriptions/hooks/use-subscription';

const menuItems = [
        {
                title: 'Home',
                items: [
                        {
                                title: 'Workflows',
                                icon: FolderOpenIcon,
                                url: '/workflows',
                        },
                        {
                                title: 'Credentials',
                                icon: KeyIcon,
                                url: '/credentials',
                        },
                        {
                                title: 'Executions',
                                icon: HistoryIcon,
                                url: '/executions',
                        },
                ],
        },
];

export const AppSidebar = () => {
        const pathname = usePathname();
        const route = useRouter();
        const { hasActiveSubscription, isLoading } = useHasActiveSubscription();
        return (
                <Sidebar collapsible="icon">
                        <SidebarHeader>
                                <SidebarMenuButton asChild className="gap-x-4 h-10">
                                        <Link href="/workflows">
                                                <Logo />
                                        </Link>
                                </SidebarMenuButton>
                        </SidebarHeader>
                        <SidebarContent>
                                {menuItems.map((group) => (
                                        <SidebarGroup key={group.title}>
                                                <SidebarGroupContent>
                                                        <SidebarMenu>
                                                                {group.items.map((item) => (
                                                                        <SidebarMenuItem key={item.title}>
                                                                                <SidebarMenuButton
                                                                                        tooltip={item.title}
                                                                                        isActive={
                                                                                                item.url === '/'
                                                                                                        ? pathname ===
                                                                                                          '/'
                                                                                                        : pathname.startsWith(
                                                                                                                  item.url,
                                                                                                          )
                                                                                        }
                                                                                        asChild
                                                                                        className="gap-x-4 h-10 px-4"
                                                                                >
                                                                                        <Link href={item.url} prefetch>
                                                                                                <item.icon className="size-4" />
                                                                                                <span>
                                                                                                        {item.title}
                                                                                                </span>
                                                                                        </Link>
                                                                                </SidebarMenuButton>
                                                                        </SidebarMenuItem>
                                                                ))}
                                                        </SidebarMenu>
                                                </SidebarGroupContent>
                                        </SidebarGroup>
                                ))}
                        </SidebarContent>
                        <SidebarFooter>
                                <SidebarMenu>
                                        {!hasActiveSubscription && !isLoading && (
                                                <SidebarMenuItem>
                                                        <SidebarMenuButton
                                                                tooltip="Upgrade to Pro"
                                                                onClick={() =>
                                                                        authClient.checkout({ slug: 'nodebase-pro' })
                                                                }
                                                                className="gap-x-4 h-10"
                                                        >
                                                                <StarIcon className="size-4" />
                                                                <span>Upgrade to Pro</span>
                                                        </SidebarMenuButton>
                                                </SidebarMenuItem>
                                        )}

                                        <SidebarMenuItem>
                                                <SidebarMenuButton
                                                        tooltip="Sign Out"
                                                        onClick={() =>
                                                                authClient.signOut({
                                                                        fetchOptions: {
                                                                                onSuccess: () => {
                                                                                        route.push('/sign-in');
                                                                                },
                                                                        },
                                                                })
                                                        }
                                                        className="gap-x-4 h-10"
                                                >
                                                        <LogOutIcon className="size-4" />
                                                        <span>Sign Out</span>
                                                </SidebarMenuButton>
                                        </SidebarMenuItem>
                                </SidebarMenu>
                        </SidebarFooter>
                </Sidebar>
        );
};
