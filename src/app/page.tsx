'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UnsubscribeAllButton from './UnsubscribeAllButton';
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

const cubicBezier = [0.4, 0, 0.2, 1];

export default function NewsletterManager() {
  const [senders, setSenders] = useState(initialSenders);
  const [activeFilter, setActiveFilter] = useState<'Useful' | 'Important' | 'Spam'>('Useful');
  const [toast, setToast] = useState<{ message: string, show: boolean, type?: 'success' | 'error' | 'warning' }>({ message: '', show: false });

  const showToast = (message: string, type?: 'success' | 'error' | 'warning') => {
    setToast({ message, show: true, type });
    // Reset toast after 4s
    setTimeout(() => {
      setToast(prev => prev.message === message ? { ...prev, show: false } : prev);
    }, 4000);
  };

  // --- SINGLE TOGGLE (Optimistic UI via State Machine) ---
  const singleToggleCTA = useCTAStateMachine({
    action: async (id: string, newSubState: boolean, name: string) => {
      // Mock network latency
      await new Promise(res => setTimeout(res, 800));
      // Simulate an occasional network error (e.g., 20% chance)
      if (Math.random() < 0.2) {
        throw new Error("Network timeout");
      }
      return { id, newSubState, name };
    },
    onOptimisticUpdate: (id, newSubState, name) => {
      setSenders(prev => prev.map(s => s.id === id ? { ...s, isSubscribed: newSubState } : s));
      // Show optimistic toast
      if (!newSubState) {
        showToast(`Unsubscribed from ${name}. [Undo]`);
      } else {
        showToast(`Resubscribed to ${name}.`);
      }
    },
    onRollback: (id, newSubState) => {
      // Revert the local state if the server failed
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
    const currentItems = senders.filter(s => s.category === activeFilter && s.isSubscribed);
    
    // Mock network latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isError = Math.random() < 0.1; // 10% complete failure chance
    const isPartial = Math.random() < 0.2; // 20% partial failure chance

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
    setSenders(prev => prev.map(s => 
      (s.category === activeFilter && s.isSubscribed) ? { ...s, isSubscribed: false } : s
    ));

    return { success: successCount, failed: 0 };
  };

  const filteredSenders = senders.filter(s => s.category === activeFilter);
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

  return (
    <div className="flex-1 p-[80px] max-w-6xl mx-auto w-full">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ letterSpacing: '-0.02em' }}>Newsletter Manager</h1>
        <UnsubscribeAllButton 
          itemCount={activeSubscribedCount}
          onBulkUnsubscribe={handleBulkUnsubscribe}
          onToast={showToast}
        />
      </header>

      {/* Segmented Control / Tabs */}
      <div className="flex gap-2 p-1 bg-surface-container-low rounded-[14px] w-full mb-8 max-w-md relative">
        {(['Useful', 'Important', 'Spam'] as const).map(filter => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-2 text-[16px] transition-colors rounded-[10px] relative z-10 ${
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

      {/* List */}
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        key={activeFilter}
        className="flex flex-col gap-[16px]"
      >
        <AnimatePresence initial={false}>
          {filteredSenders.map(sender => (
            <motion.div 
              key={sender.id} 
              variants={itemVariants}
              layout="position"
              whileHover={{ backgroundColor: '#EAE7E7' }}
              className={`flex items-center justify-between p-6 rounded-xl border border-outline-variant/10 overflow-hidden relative shadow-[0px_4px_24px_rgba(28,27,27,0.02)]`}
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
                  <h3 className={`text-[17.275px] font-medium text-on-surface relative inline-block w-fit`}>
                    {sender.name}
                    <motion.div 
                      initial={false}
                      animate={{ width: sender.isSubscribed ? '0%' : '100%' }}
                      transition={{ duration: 0.3, ease: cubicBezier }}
                      className="absolute left-0 top-1/2 h-[1.5px] bg-on-surface"
                    />
                  </h3>
                  <p className="text-on-surface-variant text-[13px] mt-0.5">{sender.description}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="px-3 py-1 bg-surface-container-low border border-outline-variant/20 text-on-surface text-[11px] rounded-[6px] tracking-wide">
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

      {/* Empty State */}
      <AnimatePresence>
        {filteredSenders.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: cubicBezier }}
            className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-outline-variant/20 rounded-2xl mt-4"
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="w-20 h-20 mb-6 rounded-full bg-surface-container-low flex items-center justify-center"
            >
              <svg className="w-8 h-8 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </motion.div>
            <h2 className="text-xl font-bold text-on-surface mb-2">Inbox Zero</h2>
            <p className="text-on-surface-variant text-sm">You have triaged all senders in this category.</p>
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
              ${toast.type === 'error' ? 'bg-red-500 text-white' : toast.type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-on-surface text-surface-container-lowest'}
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
