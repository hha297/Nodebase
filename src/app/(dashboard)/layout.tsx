import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
        return (
                <SidebarProvider>
                        <AppSidebar />
                        <SidebarInset className="">{children}</SidebarInset>
                </SidebarProvider>
        );
};

export default DashboardLayout;
