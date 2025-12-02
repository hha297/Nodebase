import { SignUpForm } from '@/features/auth/components/signup-form';
import { requireUnAuth } from '@/lib/auth/auth-utils';

const SignUpPage = async () => {
        await requireUnAuth();
        return <SignUpForm />;
};

export default SignUpPage;
