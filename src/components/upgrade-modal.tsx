import { authClient } from '@/lib/auth/auth-client';
import {
        AlertDialog,
        AlertDialogContent,
        AlertDialogHeader,
        AlertDialogTitle,
        AlertDialogDescription,
        AlertDialogFooter,
        AlertDialogTrigger,
        AlertDialogAction,
        AlertDialogCancel,
} from './ui/alert-dialog';

interface UpgradeModalProps {
        open: boolean;
        onOpenChange: (open: boolean) => void;
}

export const UpgradeModal = ({ open, onOpenChange }: UpgradeModalProps) => {
        return (
                <AlertDialog open={open} onOpenChange={onOpenChange}>
                        <AlertDialogContent>
                                <AlertDialogHeader>
                                        <AlertDialogTitle>Upgrade</AlertDialogTitle>
                                        <AlertDialogDescription>
                                                You need an active subscription to perform this action. Please upgrade
                                                to Pro to unlock all features.
                                        </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => onOpenChange(false)}>
                                                Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                                onClick={() => authClient.checkout({ slug: 'nodebase-pro' })}
                                        >
                                                Upgrade Now
                                        </AlertDialogAction>
                                </AlertDialogFooter>
                        </AlertDialogContent>
                </AlertDialog>
        );
};
