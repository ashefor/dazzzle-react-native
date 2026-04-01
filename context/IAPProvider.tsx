import React, { createContext, useContext, useCallback, useState, ReactNode } from 'react';
import { Platform, Alert } from 'react-native';
import {
  useIAP,
  finishTransaction,
  ErrorCode,
  type Product,
  type Purchase,
  type PurchaseIOS,
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
  /** Whether products are still being fetched after connection */
  productsLoading: boolean;
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
  const [productsLoading, setProductsLoading] = useState(false);

  const onPurchaseSuccess = useCallback(
    async (purchase: Purchase) => {
      dispatch(setIAPLoading());

      // Always finish the transaction FIRST, before hitting the backend.
      // If we don't, Apple re-delivers the unfinished transaction on every
      // app restart and onPurchaseSuccess fires again showing an error alert.
      try {
        await finishTransaction({ purchase });
      } catch (finishErr) {
        console.warn('[IAP] finishTransaction error (non-fatal):', finishErr);
      }

      try {
        const productId = purchase.productId as IAPProductId;
        const planUid = IAP_PRODUCT_TO_PLAN_UID[productId];
        const environment = (purchase as PurchaseIOS).environmentIOS ?? null;

        await validateWithBackend(purchase, planUid, environment);

        if (userInfo) {
          dispatch(updateUserInfo({ ...userInfo, is_premium: true }));
        }
        dispatch(setIAPSuccess(productId));
        Toast.success('Subscription activated!');
        await handlePermissionNavigation('/(tabs)', '/app-permissions');
      } catch (err: any) {
        console.error('[IAP] backend validation error:', err);
        dispatch(setIAPError(err?.message ?? 'Activation failed'));
        Alert.alert(
          'Activation Failed',
          'Your payment was received but we could not activate your subscription. Please contact support with your receipt.',
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
    restorePurchases: restoreIAPPurchases,
    getAvailablePurchases,
  } = useIAP({ onPurchaseSuccess, onPurchaseError });

  // ── Load products once connected ──────────────────────────────────────────
  React.useEffect(() => {
    if (Platform.OS !== 'ios' || !connected) return;
    setProductsLoading(true);
    fetchIAPProducts({ skus: [...IAP_PRODUCT_IDS], type: 'in-app' })
      .catch((err) => console.error('[IAP] fetchProducts failed:', err))
      .finally(() => setProductsLoading(false));
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
        productsLoading,
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
async function validateWithBackend(purchase: Purchase, planUid: string, environment: string | null): Promise<void> {
  const response: any = await axiosRequest.post('/premium-plan/verify-iap-receipt', {
    productId: purchase.productId,
    transactionId: purchase.transactionId ?? null,
    purchaseToken: purchase.purchaseToken ?? null,
    environment,
    planUid,
    platform: 'ios',
  });

  if (response.reaction !== ReactionCodes.SUCCESS) {
    throw new Error(response.message ?? 'Backend validation failed');
  }
}
