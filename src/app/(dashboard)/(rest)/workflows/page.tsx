import { requireAuth } from '@/lib/auth/auth-utils';
import React from 'react';

const WorkflowsPage = async () => {
        await requireAuth();
        return <div>WorkflowsPage</div>;
};

export default WorkflowsPage;
