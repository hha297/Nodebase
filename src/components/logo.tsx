'use client';

import Image from 'next/image';
import React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

export const Logo = () => {
        const { state } = useSidebar();
        const isCollapsed = state === 'collapsed';

        return (
                <div className="flex items-center gap-2 self-center font-medium">
                        <Image
                                src="/images/logo.svg"
                                alt="NodeBase"
                                width={isCollapsed ? 24 : 40}
                                height={isCollapsed ? 24 : 40}
                                className="transition-all duration-200"
                        />
                        <h1
                                className={`text-lg font-bold uppercase text-primary transition-all duration-200 ${
                                        isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                }`}
                        >
                                Nodebase
                        </h1>
                </div>
        );
};

export default Logo;
