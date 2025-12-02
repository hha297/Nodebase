import Image from 'next/image';

import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
        return (
                // TODO: Add a background image (GIF, SVG, etc.)
                <div className="bg-primary flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-12">
                        <div className="flex w-full max-w-md flex-col gap-6">
                                <div className="flex items-center gap-2 self-center font-medium">
                                        <Image src="/images/logo.svg" alt="NodeBase" width={40} height={40} />
                                        <h1 className="text-xl font-bold uppercase text-white">Nodebase</h1>
                                </div>
                                {children}
                        </div>
                </div>
        );
};
