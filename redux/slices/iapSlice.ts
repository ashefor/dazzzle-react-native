import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type IAPStatus = 'idle' | 'loading' | 'success' | 'error';

interface IAPState {
  status: IAPStatus;
  error: string | null;
  /** The productId of the most recently completed purchase */
  lastPurchasedProductId: string | null;
}

const initialState: IAPState = {
  status: 'idle',
  error: null,
  lastPurchasedProductId: null,
};

const iapSlice = createSlice({
  name: 'iap',
  initialState,
  reducers: {
    setIAPLoading(state) {
      state.status = 'loading';
      state.error = null;
    },
    setIAPSuccess(state, action: PayloadAction<string>) {
      state.status = 'success';
      state.error = null;
      state.lastPurchasedProductId = action.payload;
    },
    setIAPError(state, action: PayloadAction<string>) {
      state.status = 'error';
      state.error = action.payload;
    },
    resetIAP(state) {
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const { setIAPLoading, setIAPSuccess, setIAPError, resetIAP } = iapSlice.actions;
export default iapSlice.reducer;