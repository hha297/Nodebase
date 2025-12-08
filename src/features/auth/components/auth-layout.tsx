import Logo from '@/components/logo';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
        return (
                // TODO: Add a background image (GIF, SVG, etc.)
                <div className="bg-primary flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-12">
                        <div className="flex w-full max-w-md flex-col gap-6">
                                {/* <Logo /> */}
                                {children}
                        </div>
                </div>
        );
};
