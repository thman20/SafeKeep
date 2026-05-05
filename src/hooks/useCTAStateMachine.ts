import { useState, useCallback } from 'react';

export type CTAStatus = 'idle' | 'awaiting-confirm' | 'loading' | 'success' | 'error' | 'partial-error';

interface UseCTAStateMachineProps<TArgs extends any[], TResult> {
  action: (...args: TArgs) => Promise<TResult>;
  onOptimisticUpdate?: (...args: TArgs) => void;
  onSuccess?: (result: TResult, ...args: TArgs) => void;
  onError?: (error: Error, ...args: TArgs) => void;
  onPartialError?: (result: TResult, ...args: TArgs) => void;
  onRollback?: (...args: TArgs) => void;
  resetAfterMs?: number;
  isPartialError?: (result: TResult) => boolean;
}

export function useCTAStateMachine<TArgs extends any[], TResult>({
  action,
  onOptimisticUpdate,
  onSuccess,
  onError,
  onPartialError,
  onRollback,
  resetAfterMs = 3000,
  isPartialError
}: UseCTAStateMachineProps<TArgs, TResult>) {
  const [status, setStatus] = useState<CTAStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const requestConfirm = useCallback(() => setStatus('awaiting-confirm'), []);
  const cancelConfirm = useCallback(() => setStatus('idle'), []);

  const execute = useCallback(async (...args: TArgs) => {
    if (!onOptimisticUpdate) {
      setStatus('loading');
    }
    setError(null);
    
    if (onOptimisticUpdate) {
      onOptimisticUpdate(...args);
    }

    try {
      const result = await action(...args);
      
      if (isPartialError && isPartialError(result)) {
        setStatus('partial-error');
        if (onPartialError) onPartialError(result, ...args);
      } else {
        setStatus('success');
        if (onSuccess) onSuccess(result, ...args);
      }
      
      if (resetAfterMs > 0) {
        setTimeout(() => setStatus('idle'), resetAfterMs);
      }
      return result;
    } catch (err: any) {
      setStatus('error');
      setError(err);
      
      if (onRollback) {
        onRollback(...args);
      }
      
      if (onError) onError(err, ...args);
      
      if (resetAfterMs > 0) {
        setTimeout(() => setStatus('idle'), resetAfterMs);
      }
      throw err;
    }
  }, [action, onOptimisticUpdate, onSuccess, onError, onPartialError, onRollback, resetAfterMs, isPartialError]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
  }, []);

  return { 
    status, 
    execute, 
    reset, 
    requestConfirm,
    cancelConfirm,
    error, 
    isIdle: status === 'idle', 
    isAwaitingConfirm: status === 'awaiting-confirm',
    isLoading: status === 'loading', 
    isSuccess: status === 'success', 
    isError: status === 'error',
    isPartialError: status === 'partial-error'
  };
}
