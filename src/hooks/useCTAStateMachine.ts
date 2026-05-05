import { useState, useCallback } from 'react';

export type CTAStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseCTAStateMachineProps<TArgs extends any[], TResult> {
  action: (...args: TArgs) => Promise<TResult>;
  onOptimisticUpdate?: (...args: TArgs) => void;
  onSuccess?: (result: TResult, ...args: TArgs) => void;
  onError?: (error: Error, ...args: TArgs) => void;
  onRollback?: (...args: TArgs) => void;
  resetAfterMs?: number;
}

export function useCTAStateMachine<TArgs extends any[], TResult>({
  action,
  onOptimisticUpdate,
  onSuccess,
  onError,
  onRollback,
  resetAfterMs = 3000
}: UseCTAStateMachineProps<TArgs, TResult>) {
  const [status, setStatus] = useState<CTAStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    // If optimistic update is provided, don't set loading state to block UI, just stay idle visually or let the dev handle it
    if (!onOptimisticUpdate) {
      setStatus('loading');
    }
    setError(null);
    
    // Apply optimistic UI update immediately
    if (onOptimisticUpdate) {
      onOptimisticUpdate(...args);
    }

    try {
      const result = await action(...args);
      setStatus('success');
      if (onSuccess) onSuccess(result, ...args);
      
      if (resetAfterMs > 0) {
        setTimeout(() => setStatus('idle'), resetAfterMs);
      }
      return result;
    } catch (err: any) {
      setStatus('error');
      setError(err);
      
      // Rollback optimistic UI if it failed
      if (onRollback) {
        onRollback(...args);
      }
      
      if (onError) onError(err, ...args);
      
      if (resetAfterMs > 0) {
        setTimeout(() => setStatus('idle'), resetAfterMs);
      }
      throw err;
    }
  }, [action, onOptimisticUpdate, onSuccess, onError, onRollback, resetAfterMs]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { 
    status, 
    execute, 
    reset, 
    error, 
    isIdle: status === 'idle', 
    isLoading: status === 'loading', 
    isSuccess: status === 'success', 
    isError: status === 'error' 
  };
}
