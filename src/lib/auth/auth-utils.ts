import { redirect } from 'next/navigation';
import { auth } from './auth';
import { headers } from 'next/headers';

export const requireAuth = async () => {
        const session = await auth.api.getSession({
                headers: await headers(),
        });
        if (!session) {
                redirect('/sign-in');
        }
        return session;
};

export const requireUnAuth = async () => {
        const session = await auth.api.getSession({
                headers: await headers(),
        });
        if (session) {
                redirect('/');
        }
        return session;
};
