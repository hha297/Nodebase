import Image from 'next/image';
import React from 'react';

export const Logo = () => {
        return (
                <div className="flex items-center gap-2 self-center font-medium">
                        <Image src="/images/logo.svg" alt="NodeBase" width={40} height={40} />
                        <h1 className="text-lg font-bold uppercase text-primary">Nodebase</h1>
                </div>
        );
};

export default Logo;
