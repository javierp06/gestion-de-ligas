// Helper composable for API calls with built-in retry and error handling
export const useApiCall = () => {
  const { $api, $apiRetry } = useNuxtApp();
  const toastStore = useToastStore();

  /**
   * Make an API call with automatic retry on failure
   * @param fn - The API call function
   * @param options - Retry options
   * @returns Promise with the API response
   */
  const callWithRetry = async <T>(
    fn: () => Promise<T>,
    options?: {
      maxRetries?: number;
      showToast?: boolean;
      successMessage?: string;
    }
  ): Promise<T> => {
    const { maxRetries = 3, showToast = true, successMessage } = options || {};

    try {
      const result = await $apiRetry(fn, { maxRetries });

      if (showToast && successMessage) {
        toastStore.success(successMessage);
      }

      return result;
    } catch (error: any) {
      // Error already handled by interceptor with toast
      throw error;
    }
  };

  /**
   * Make a simple API call without retry (for create/update operations)
   */
  const callSimple = async <T>(
    fn: () => Promise<T>,
    options?: {
      showToast?: boolean;
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T> => {
    const { showToast = true, successMessage, errorMessage } = options || {};

    try {
      const result = await fn();

      if (showToast && successMessage) {
        toastStore.success(successMessage);
      }

      return result;
    } catch (error: any) {
      if (showToast && errorMessage) {
        toastStore.error(errorMessage);
      }
      throw error;
    }
  };

  /**
   * Fetch data with loading state management
   */
  const fetchWithLoading = async <T>(
    fn: () => Promise<T>,
    loadingRef: Ref<boolean>,
    options?: {
      showToast?: boolean;
      successMessage?: string;
    }
  ): Promise<T | null> => {
    loadingRef.value = true;

    try {
      const result = await callWithRetry(fn, options);
      return result;
    } catch (error) {
      return null;
    } finally {
      loadingRef.value = false;
    }
  };

  return {
    api: $api,
    callWithRetry,
    callSimple,
    fetchWithLoading,
  };
};
