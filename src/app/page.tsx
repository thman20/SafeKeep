'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnsubscribeAllButton from './UnsubscribeAllButton';
import EmptyState from './EmptyState';
import { useCTAStateMachine } from '../hooks/useCTAStateMachine';

// Mock Data
const initialSenders = [
  { id: '1', name: 'Tech Digest Weekly', description: 'tech@digest.com', category: 'Useful', tag: 'Technology', isSubscribed: true, isHighValue: false },
  { id: '2', name: 'Design Inspiration', description: 'hello@designweekly.com', category: 'Useful', tag: 'Design', isSubscribed: true, isHighValue: false },
  { id: '3', name: 'Product Updates', description: 'updates@company.com', category: 'Useful', tag: 'Business', isSubscribed: true, isHighValue: false },
  { id: '4', name: 'Bank Statements', description: 'statements@bank.com', category: 'Important', tag: 'Finance', isSubscribed: true, isHighValue: true },
  { id: '5', name: 'Healthcare Newsletter', description: 'info@healthcare.com', category: 'Important', tag: 'Health', isSubscribed: true, isHighValue: true },
  { id: '6', name: 'Daily Promotions', description: 'promo@marketing.com', category: 'Spam', tag: 'Technology', isSubscribed: true, isHighValue: false },
  { id: '7', name: 'Random Newsletter', description: 'spam@random.com', category: 'Spam', tag: 'Design', isSubscribed: true, isHighValue: false },
];

const cubicBezier: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function NewsletterManager() {
  const [senders, setSenders] = useState(initialSenders);
  const [activeFilter, setActiveFilter] = useState<'Inbox' | 'Unsubscribed' | 'High-Value'>('Inbox');
  const [toast, setToast] = useState<{ message: string, show: boolean, type?: 'success' | 'error' | 'warning' }>({ message: '', show: false });

  const showToast = (message: string, type?: 'success' | 'error' | 'warning') => {
    setToast({ message, show: true, type });
    setTimeout(() => {
      setToast(prev => prev.message === message ? { ...prev, show: false } : prev);
    }, 4000);
  };

  const singleToggleCTA = useCTAStateMachine({
    action: async (id: string, newSubState: boolean, name: string) => {
      await new Promise(res => setTimeout(res, 800));
      if (Math.random() < 0.2) {
        throw new Error("Network timeout");
      }
      return { id, newSubState, name };
    },
    onOptimisticUpdate: (id, newSubState, name) => {
      setSenders(prev => prev.map(s => s.id === id ? { ...s, isSubscribed: newSubState } : s));
      if (!newSubState) {
        showToast(`Unsubscribed from ${name}. [Undo]`);
      } else {
        showToast(`Resubscribed to ${name}.`);
      }
    },
    onRollback: (id, newSubState) => {
      setSenders(prev => prev.map(s => s.id === id ? { ...s, isSubscribed: !newSubState } : s));
    },
    onError: () => {
      showToast('Network error. Reverted changes.', 'error');
    }
  });

  const toggleSubscribe = (id: string, currentSubState: boolean, name: string) => {
    singleToggleCTA.execute(id, !currentSubState, name).catch(() => {});
  };

  // --- BULK ACTION ---
  const handleBulkUnsubscribe = async () => {
    // Current items are whatever is currently visible AND subscribed
    const currentItems = getFilteredSenders().filter(s => s.isSubscribed);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isError = Math.random() < 0.1;
    const isPartial = Math.random() < 0.2;

    if (isError && currentItems.length > 0) {
      return { success: 0, failed: currentItems.length };
    }

    if (isPartial && currentItems.length > 1) {
      const successCount = currentItems.length - 1;
      const failedCount = 1;
      const successfulIds = currentItems.slice(0, successCount).map(s => s.id);
      
      setSenders(prev => prev.map(s => 
        successfulIds.includes(s.id) ? { ...s, isSubscribed: false } : s
      ));

      return { success: successCount, failed: failedCount };
    }

    // Happy Path
    const successCount = currentItems.length;
    const itemIds = currentItems.map(i => i.id);
    setSenders(prev => prev.map(s => 
      itemIds.includes(s.id) ? { ...s, isSubscribed: false } : s
    ));

    return { success: successCount, failed: 0 };
  };

  const getFilteredSenders = () => {
    switch (activeFilter) {
      case 'Inbox':
        return senders.filter(s => s.isSubscribed && !s.isHighValue);
      case 'Unsubscribed':
        return senders.filter(s => !s.isSubscribed);
      case 'High-Value':
        return senders.filter(s => s.isSubscribed && s.isHighValue);
      default:
        return [];
    }
  };

  const filteredSenders = getFilteredSenders();
  const activeSubscribedCount = filteredSenders.filter(s => s.isSubscribed).length;

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: cubicBezier } },
    exit: { opacity: 0, height: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden', transition: { duration: 0.3, ease: cubicBezier } }
  };

  // SVG Icons for Empty States
  const ShieldCheckIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
  );
  const ArchiveIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
  );
  const StarIcon = (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
  );

  return (
    <div className="flex-1 p-[80px] max-w-6xl mx-auto w-full">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-[32px] font-bold tracking-[-0.02em] text-on-surface leading-[1.2]">Newsletter Manager</h1>
        <UnsubscribeAllButton 
          itemCount={activeSubscribedCount}
          onBulkUnsubscribe={handleBulkUnsubscribe}
          onToast={showToast}
        />
      </header>

      {/* Segmented Control / Tabs */}
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-[14px] w-full mb-8 max-w-[500px] relative">
        {(['Inbox', 'Unsubscribed', 'High-Value'] as const).map(filter => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-2.5 text-[14px] transition-colors rounded-[10px] relative z-10 ${
                isActive ? 'text-black font-semibold' : 'text-on-surface-variant hover:text-on-surface font-medium'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="tabIndicator"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute inset-0 bg-primary rounded-[10px] shadow-sm -z-10"
                />
              )}
              {filter}
            </button>
          );
        })}
      </div>

      {/* List / Empty State */}
      <AnimatePresence mode="wait">
        {filteredSenders.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {activeFilter === 'Inbox' && (
              <EmptyState 
                icon={ShieldCheckIcon}
                title="You're all caught up."
                message="Your inbox is safe and clear of pending newsletters."
              />
            )}
            {activeFilter === 'Unsubscribed' && (
              <EmptyState 
                icon={ArchiveIcon}
                title="No severed ties yet."
                message="Senders you unsubscribe from will be archived here."
              />
            )}
            {activeFilter === 'High-Value' && (
              <EmptyState 
                icon={StarIcon}
                title="No gems saved yet."
                message="Mark important newsletters to keep them securely stored here."
              />
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={listVariants}
            initial="hidden"
            animate="visible"
            key="list"
            className="flex flex-col gap-[16px]"
          >
            <AnimatePresence initial={false}>
              {filteredSenders.map(sender => (
                <motion.div 
                  key={sender.id} 
                  variants={itemVariants}
                  layout="position"
                  whileHover={{ backgroundColor: '#EAE7E7' }}
                  className={`flex items-center justify-between p-6 rounded-xl border border-outline-variant/10 overflow-hidden relative shadow-[0px_4px_24px_rgba(28,27,27,0.02)] bg-surface-container-lowest`}
                >
                  <motion.div 
                    animate={{ opacity: sender.isSubscribed ? 1 : 0.4 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-4 flex-1"
                  >
                    <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 border border-outline-variant/10">
                      <span className="font-bold text-on-surface-variant">{sender.name.charAt(0)}</span>
                    </div>
                    <div className="flex flex-col relative w-full">
                      <h3 className={`text-[18px] font-medium text-on-surface relative inline-block w-fit`}>
                        {sender.name}
                        <motion.div 
                          initial={false}
                          animate={{ width: sender.isSubscribed ? '0%' : '100%' }}
                          transition={{ duration: 0.3, ease: cubicBezier }}
                          className="absolute left-0 top-1/2 h-[1.5px] bg-on-surface"
                        />
                      </h3>
                      <p className="text-on-surface-variant text-[14px] mt-0.5">{sender.description}</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/20 text-on-surface text-[12px] font-semibold uppercase tracking-[0.1em] rounded-[6px]">
                          {sender.tag}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  
                  <div className="flex items-center gap-6 shrink-0 relative z-10">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSubscribe(sender.id, sender.isSubscribed, sender.name)}
                      className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${sender.isSubscribed ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
                    >
                      <motion.div 
                        layout
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className={`w-4 h-4 rounded-full shadow-sm ${sender.isSubscribed ? 'bg-white' : 'bg-on-surface-variant'}`}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3.5 rounded-lg shadow-[0px_24px_48px_rgba(28,27,27,0.06)] flex items-center gap-4 z-50 origin-bottom 
              ${toast.type === 'error' ? 'bg-error-base text-white' : toast.type === 'warning' ? 'bg-warning-base text-black' : 'bg-on-surface text-surface-container-lowest'}
            `}
          >
            <span className="text-sm font-medium">{toast.message}</span>
            {toast.message.includes('[Undo]') && (
              <button 
                className="font-bold text-xs uppercase tracking-[0.1em] transition-colors opacity-80 hover:opacity-100"
                onClick={() => {
                  setToast({ message: '', show: false });
                  setSenders(initialSenders); 
                }}
              >
                Undo
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
