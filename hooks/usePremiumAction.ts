import { useState, useCallback } from 'react';
import { useAppSelector } from './reduxHooks';
import dayjs from 'dayjs';
import { isFreemiumAccessActive } from '@/utils/freemiumAccess';

interface UsePremiumActionReturn {
    requirePremium: (action: () => void, options?: {
        title?: string;
        message?: string;
    }) => void;
    showModal: boolean;
    setShowModal: (show: boolean) => void;
    modalOptions: {
        title: string;
        message: string;
        onSuccess?: () => void;
    };
    isPremium: boolean;
}

/**
 * Hook to check if user has upgraded account and show upgrade modal if not
 * 
 * @example
 * const { requirePremium, showModal, setShowModal, modalOptions } = usePremiumAction();
 * 
 * const handleLike = () => {
 *   requirePremium(() => {
 *     // Execute like action
 *     dispatch(likeUser(userId));
 *   }, {
 *     title: "Like Users",
 *     message: "Upgrade your account to like users!"
 *   });
 * };
 * 
 * return (
 *   <>
 *     <Button onPress={handleLike} />
 *     <PremiumActionModal
 *       visible={showModal}
 *       onClose={() => setShowModal(false)}
 *       {...modalOptions}
 *     />
 *   </>
 * );
 */
export const usePremiumAction = (): UsePremiumActionReturn => {
    const { userInfo } = useAppSelector(state => state.auth);
    const { currentSubscription } = useAppSelector(state => state.subscription);
    const [showModal, setShowModal] = useState(false);
    const [modalOptions, setModalOptions] = useState<{
        title: string;
        message: string;
        onSuccess?: () => void;
    }>({
        title: 'Upgrade Required',
        message: 'Upgrade your account to unlock this feature and enjoy exclusive benefits!',
    });

    // Check if user is premium and subscription is not expired
    const isPremium = useCallback(() => {
        if (isFreemiumAccessActive()) {
            return true;
        }

        if (!userInfo?.is_premium) {
            return false;
        }
        
        if (currentSubscription) {
            const isExpired = dayjs().isAfter(dayjs(currentSubscription.expiry_at));
            return !isExpired;
        }
        
        return false;
    }, [userInfo, currentSubscription]);

    /**
     * Check if user has upgraded. If yes, execute action. If no, show upgrade modal.
     */
    const requirePremium = useCallback((
        action: () => void,
        options?: {
            title?: string;
            message?: string;
        }
    ) => {
        if (isPremium()) {
            // User has upgraded, execute action immediately
            action();
        } else {
            // User needs to upgrade, show modal
            setModalOptions({
                title: options?.title || 'Upgrade Required',
                message: options?.message || 'Upgrade your account to unlock this feature and enjoy exclusive benefits!',
                onSuccess: action, // Execute action after successful upgrade
            });
            setShowModal(true);
        }
    }, [isPremium]);

    return {
        requirePremium,
        showModal,
        setShowModal,
        modalOptions,
        isPremium: isPremium(),
    };
};
