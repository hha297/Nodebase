import { SignInForm } from '@/features/auth/components/signin-form';
import { requireUnAuth } from '@/lib/auth/auth-utils';

const SignInPage = async () => {
        await requireUnAuth();
        return <SignInForm />;
};

export default SignInPage;
