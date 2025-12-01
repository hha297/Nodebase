import { requireAuth } from '@/lib/auth/auth-utils';

const Home = async () => {
        await requireAuth();
        return <div>Protected Page</div>;
};

export default Home;
