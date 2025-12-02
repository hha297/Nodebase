import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';
import { requireAuth } from '@/lib/auth/auth-utils';

const Home = async () => {
        await requireAuth();
        return (
                <div
                        onClick={() => {
                                authClient.signOut();
                        }}
                >
                        Protected Page
                </div>
        );
};

export default Home;
