let showToast: ((arg0: { message: string; duration: number; type: keyof typeof ToastType }) => void) | null = null;

export enum ToastType {
  success = "success",
  error = "error",
  default = "default",
}

const Toast = {
  setShowToast: (showToastFn: ((arg0: { message: string; duration: number; type: keyof typeof ToastType }) => void) | null) => {
    showToast = showToastFn;
  },

  success: (message: string, duration = 3000) => {
    if (showToast) {
      showToast({
        message,
        duration,
        type: ToastType.success,
      });
    }
  },

  error: (message: string, duration = 3000) => {
    if (showToast) {
      showToast({
        message,
        duration,
        type: ToastType.error,
      });
    }
  },

  show: (message: string, duration = 3000, type = ToastType.default) => {
    if (showToast) {
      showToast({ message, duration, type });
    }
  },
};

export default Toast;