import { useState, useCallback } from 'react';
import { useAppSelector } from './reduxHooks';
import dayjs from 'dayjs';

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
 * Hook to check if user is premium and show payment modal if not
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
 *     message: "Upgrade to premium to like users!"
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
        title: 'Premium Feature',
        message: 'This feature requires a premium subscription. Subscribe now to unlock it!',
    });

    // Check if user is premium and subscription is not expired
    const isPremium = useCallback(() => {
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
     * Check if user is premium. If yes, execute action. If no, show payment modal.
     */
    const requirePremium = useCallback((
        action: () => void,
        options?: {
            title?: string;
            message?: string;
        }
    ) => {
        if (isPremium()) {
            // User is premium, execute action immediately
            action();
        } else {
            // User is not premium, show payment modal
            setModalOptions({
                title: options?.title || 'Premium Feature',
                message: options?.message || 'This feature requires a premium subscription. Subscribe now to unlock it!',
                onSuccess: action, // Execute action after successful payment
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
