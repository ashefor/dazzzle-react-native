import React, { createContext, useContext, useCallback, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import {
  useIAP,
  ErrorCode,
  type Product,
  type Purchase,
} from 'expo-iap';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import {
  setIAPLoading,
  setIAPSuccess,
  setIAPError,
  resetIAP,
} from '@/redux/slices/iapSlice';
import { updateUserInfo } from '@/redux/slices/authSlice';
import { IAP_PRODUCT_IDS, IAP_PRODUCT_TO_PLAN_UID, type IAPProductId } from '@/constants/constants';
import axiosRequest from '@/utils/axios';
import { ReactionCodes } from '@/models/general';
import { handlePermissionNavigation } from '@/utils/notificationHandler';
import Toast from '@/components/toast/toast';

// ── Context shape ─────────────────────────────────────────────────────────────

interface IAPContextValue {
  /** App Store products loaded from StoreKit */
  products: Product[];
  /** Whether the IAP connection to the App Store is live */
  connected: boolean;
  /** Trigger a purchase for a given App Store product ID */
  purchaseProduct: (productId: string) => Promise<void>;
  /** Re-fetch purchases the user already owns (restore purchases) */
  restorePurchases: () => Promise<void>;
}

const IAPContext = createContext<IAPContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function IAPProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { userInfo } = useAppSelector((s) => s.auth);

  const onPurchaseSuccess = useCallback(
    async (purchase: Purchase) => {
      try {
        dispatch(setIAPLoading());

        const productId = purchase.productId as IAPProductId;
        const planUid = IAP_PRODUCT_TO_PLAN_UID[productId];

        await validateWithBackend(purchase, planUid);

        if (userInfo) {
          dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
        }

        dispatch(setIAPSuccess(productId));
        Toast.success('Subscription successful');
        await handlePermissionNavigation('/(tabs)', '/app-permissions');
      } catch (err) {
        console.error('[IAP] purchase processing error:', err);
        dispatch(setIAPError('Failed to complete purchase. Please try again.'));
        Alert.alert(
          'Purchase Error',
          'Failed to complete your purchase. Please contact support if you were charged.',
        );
      }
    },
    [dispatch, userInfo],
  );

  const onPurchaseError = useCallback(
    (err: unknown) => {
      if ((err as { code?: string })?.code === ErrorCode.UserCancelled) {
        dispatch(resetIAP());
        return;
      }
      const message = (err as { message?: string })?.message ?? 'An error occurred during purchase.';
      console.error('[IAP] StoreKit error:', err);
      dispatch(setIAPError(message));
      Alert.alert('Purchase Failed', message);
    },
    [dispatch],
  );

  const {
    connected,
    products,
    fetchProducts: fetchIAPProducts,
    requestPurchase,
    finishTransaction,
    restorePurchases: restoreIAPPurchases,
    getAvailablePurchases,
  } = useIAP({ onPurchaseSuccess, onPurchaseError });

  // ── Load products once connected ──────────────────────────────────────────
  React.useEffect(() => {
    if (Platform.OS !== 'ios' || !connected) return;
    console.log('[IAP] Connected to StoreKit, fetching products...');
    fetchIAPProducts({ skus: [...IAP_PRODUCT_IDS], type: 'in-app' }).catch((err) =>
      console.error('[IAP] fetchProducts failed:', err),
    );
  }, [connected]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Purchase action ───────────────────────────────────────────────────────
  const purchaseProduct = useCallback(
    async (productId: string) => {
      if (Platform.OS !== 'ios') return;
      try {
        dispatch(setIAPLoading());
        await requestPurchase({
          request: { apple: { sku: productId } },
          type: 'in-app',
        });
      } catch (err) {
        if ((err as { code?: string })?.code === ErrorCode.UserCancelled) {
          dispatch(resetIAP());
        } else {
          const message = (err as { message?: string })?.message ?? 'Purchase request failed.';
          dispatch(setIAPError(message));
        }
      }
    },
    [dispatch, requestPurchase],
  );

  // ── Restore purchases ─────────────────────────────────────────────────────
  const restorePurchases = useCallback(async () => {
    if (Platform.OS !== 'ios') return;
    try {
      dispatch(setIAPLoading());
      await restoreIAPPurchases();
      await getAvailablePurchases();
      // onPurchaseSuccess fires for each restored item via the hook's callbacks
    } catch (err) {
      console.error('[IAP] restorePurchases error:', err);
      dispatch(setIAPError('Failed to restore purchases.'));
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
    }
  }, [dispatch, restoreIAPPurchases, getAvailablePurchases]);

  return (
    <IAPContext.Provider
      value={{
        products: products ?? [],
        connected,
        purchaseProduct,
        restorePurchases,
      }}
    >
      {children}
    </IAPContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useIAPContext(): IAPContextValue {
  const ctx = useContext(IAPContext);
  if (!ctx) throw new Error('useIAPContext must be used inside <IAPProvider>');
  return ctx;
}

// ── Backend validation ────────────────────────────────────────────────────────
async function validateWithBackend(purchase: Purchase, planUid: string): Promise<void> {
  const response: any = await axiosRequest.post('/premium-plan/verify-iap-receipt', {
    productId: purchase.productId,
    transactionId: purchase.transactionId ?? null,
    purchaseToken: purchase.purchaseToken ?? null,
    planUid,
    platform: 'ios',
  });

  if (response.reaction !== ReactionCodes.SUCCESS) {
    throw new Error(response.message ?? 'Backend validation failed');
  }
}