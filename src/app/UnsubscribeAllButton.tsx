'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useCTAStateMachine } from '../hooks/useCTAStateMachine';

export default function UnsubscribeAllButton({
  itemCount,
  onBulkUnsubscribe,
  onToast,
  onSuccessClearList
}: {
  itemCount: number;
  onBulkUnsubscribe: () => Promise<{ success: number, failed: number }>;
  onToast: (msg: string, type?: 'success' | 'error' | 'warning') => void;
  onSuccessClearList?: () => void;
}) {
  const { 
    execute, 
    isError, 
    isLoading, 
    isAwaitingConfirm, 
    requestConfirm, 
    cancelConfirm 
  } = useCTAStateMachine({
    action: async () => {
      const res = await onBulkUnsubscribe();
      if (res.failed === itemCount && itemCount > 0) {
        throw new Error("Complete failure");
      }
      return res;
    },
    isPartialError: (res) => res.failed > 0,
    onSuccess: (res) => {
      onToast(`Successfully unsubscribed from all ${res.success}.`, 'success');
      if (onSuccessClearList) onSuccessClearList();
    },
    onPartialError: (res) => {
      onToast(`Unsubscribed from ${res.success}. ${res.failed} failed.`, 'warning');
    },
    onError: () => {
      onToast(`Network error. Could not process unsubscriptions.`, 'error');
    }
  });

  const isDisabled = itemCount === 0;

  return (
    <div className="relative inline-block">
      <motion.button 
        whileHover={!isDisabled && !isLoading ? { backgroundColor: '#EAE7E7', scale: 1.02 } : {}}
        whileTap={!isDisabled && !isLoading ? { scale: 0.98 } : {}}
        animate={isError ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
        onClick={() => {
          if (isDisabled || isLoading) return;
          requestConfirm();
        }}
        disabled={isDisabled || isLoading}
        className={`flex items-center gap-2 border px-5 py-2.5 rounded-md transition-colors text-on-surface group 
          ${isDisabled ? 'opacity-50 cursor-not-allowed border-outline-variant/10' : 'border-outline-variant/30 hover:bg-surface-container-low'}
          ${isLoading ? 'opacity-80 cursor-wait bg-surface-container-low' : ''}
        `}
      >
        {isLoading ? (
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="w-5 h-5 border-2 border-on-surface-variant border-t-transparent rounded-full"
          />
        ) : (
          <svg className={`w-5 h-5 transition-colors ${isDisabled ? 'text-on-surface-variant' : 'text-on-surface-variant group-hover:text-on-surface'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )}
        <span className="font-semibold text-sm">
          {isLoading ? 'Processing...' : 'Unsubscribe All'}
        </span>
      </motion.button>

      {/* Confirmation Popover */}
      <AnimatePresence>
        {isAwaitingConfirm && (
          <>
            {/* Invisible backdrop to dismiss popover */}
            <div className="fixed inset-0 z-40" onClick={() => cancelConfirm()} />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="absolute right-0 top-full mt-2 w-72 bg-surface-container-lowest border border-outline-variant/20 rounded-xl shadow-2xl p-5 z-50 origin-top-right"
            >
              <h4 className="font-bold text-on-surface text-sm mb-2">Are you sure?</h4>
              <p className="text-on-surface-variant text-xs mb-4">
                You are about to unsubscribe from all {itemCount} senders in this list. This action cannot be easily undone.
              </p>
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => cancelConfirm()}
                  className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    execute().catch(() => {});
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-primary text-black hover:bg-primary-dark rounded-md transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
