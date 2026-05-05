'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Logo from './Logo';
import { useCTAStateMachine } from '../hooks/useCTAStateMachine';

export default function RootClient({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<'splash' | 'auth' | 'syncing' | 'authenticated'>('splash');
  const [hasAttempted, setHasAttempted] = useState(false);

  // Sequence: splash (1.5s) -> auth
  useEffect(() => {
    const t = setTimeout(() => setAuthState('auth'), 1500);
    return () => clearTimeout(t);
  }, []);

  const authCTA = useCTAStateMachine({
    action: async () => {
      // Simulate network request
      await new Promise(r => setTimeout(r, 1200));
      
      // Simulate error ONLY on the very first click to show off the animation
      if (!hasAttempted) {
        setHasAttempted(true);
        throw new Error('Invalid credentials');
      }
      return true;
    },
    onSuccess: () => {
      setAuthState('syncing');
      setTimeout(() => {
        setAuthState('authenticated');
      }, 2000);
    },
    resetAfterMs: 3000 // Error message clears after 3s
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (authCTA.isLoading) return;
    authCTA.execute().catch(() => {});
  };

  const cubicBezier: [number, number, number, number] = [0.4, 0, 0.2, 1];

  if (authState !== 'authenticated' && authState !== 'syncing') {
    return (
      <div className="h-full w-full flex items-center justify-center bg-surface relative overflow-hidden">
        <AnimatePresence mode="wait">
          {authState === 'splash' && (
            <motion.div
              key="splash"
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: cubicBezier }}
              className="text-center"
            >
              <Logo variant="dark" className="w-[200px] mx-auto" />
            </motion.div>
          )}
          {authState === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: cubicBezier }}
              className={`w-full max-w-md p-8 bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-2xl relative z-10 transition-opacity flex flex-col items-center ${authCTA.isLoading ? 'opacity-80' : 'opacity-100'}`}
            >
              <Logo variant="dark" className="w-[140px] mb-8" />
              <h2 className="text-2xl font-bold text-on-surface mb-6 w-full text-left">Welcome Back</h2>
              <motion.form 
                onSubmit={handleLogin} 
                className="flex flex-col gap-4 w-full"
                animate={authCTA.isError ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input 
                  type="email" 
                  placeholder="Email" 
                  defaultValue="demo@safekeep.app"
                  className={`w-full p-3 rounded-lg bg-surface-container-low border text-on-surface focus:outline-none transition-colors ${authCTA.isError ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant/30 focus:border-primary'}`}
                  required 
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  defaultValue="password"
                  className={`w-full p-3 rounded-lg bg-surface-container-low border text-on-surface focus:outline-none transition-colors ${authCTA.isError ? 'border-red-500/50 focus:border-red-500' : 'border-outline-variant/30 focus:border-primary'}`}
                  required 
                />
                
                <AnimatePresence>
                  {authCTA.isError && (
                    <motion.p 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-400 text-sm m-0"
                    >
                      Invalid credentials. Please try again.
                    </motion.p>
                  )}
                </AnimatePresence>

                <button 
                  type="submit" 
                  disabled={authCTA.isLoading}
                  className={`w-full p-3 rounded-lg bg-primary text-black font-semibold flex items-center justify-center transition-all mt-2 ${authCTA.isLoading ? 'opacity-80 cursor-not-allowed' : 'hover:bg-primary-dark'}`}
                >
                  {authCTA.isLoading ? (
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                    />
                  ) : 'Sign In'}
                </button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
        <AnimatePresence mode="wait">
          {authState === 'syncing' ? (
            <motion.div
              key="syncing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="flex-1 p-[80px] max-w-6xl mx-auto w-full relative"
            >
              {/* Shimmer Overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              />

              <header className="flex justify-between items-center mb-12">
                <div className="w-64 h-10 bg-surface-container-low rounded-md overflow-hidden relative" />
                <div className="w-40 h-10 bg-surface-container-low rounded-md overflow-hidden relative" />
              </header>
              <div className="flex gap-2 mb-8">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-24 h-10 bg-surface-container-low rounded-[10px] overflow-hidden relative" />
                 ))}
              </div>
              <div className="flex flex-col gap-[16px]">
                {[1, 2, 3, 4].map((item, index) => (
                  <motion.div 
                    key={item} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="w-full h-24 bg-surface-container-lowest rounded-xl flex items-center p-6 gap-4 border border-outline-variant/10 shadow-[0px_4px_24px_rgba(28,27,27,0.02)]"
                  >
                     <div className="w-12 h-12 rounded-lg bg-surface-container-low shrink-0" />
                     <div className="flex flex-col gap-3 flex-1">
                        <div className="w-1/3 h-4 bg-surface-container-low rounded" />
                        <div className="w-1/2 h-3 bg-surface-container-low rounded" />
                     </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Premium Loader Modal Overlay */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
                animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                transition={{ delay: 0.2 }}
                className="absolute top-1/2 left-1/2 flex flex-col items-center gap-6 bg-surface/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-outline-variant/20 z-30 min-w-[280px]"
              >
                <div className="relative flex items-center justify-center w-24 h-24 perspective-1000" style={{ perspective: 1000 }}>
                  {/* Back Left Cover */}
                  <div className="absolute right-1/2 w-10 h-14 bg-surface-container-low border border-outline-variant/30 rounded-l-sm flex flex-col gap-[3px] py-2 px-1.5 items-end justify-center shadow-inner">
                    <div className="w-full h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-3/4 h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-full h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-5/6 h-[2px] bg-outline-variant/20 rounded" />
                  </div>
                  
                  {/* Back Right Cover */}
                  <div className="absolute left-1/2 w-10 h-14 bg-surface-container-low border border-outline-variant/30 rounded-r-sm flex flex-col gap-[3px] py-2 px-1.5 justify-center shadow-inner">
                    <div className="w-full h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-5/6 h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-full h-[2px] bg-outline-variant/20 rounded" />
                    <div className="w-2/3 h-[2px] bg-outline-variant/20 rounded" />
                  </div>

                  {/* Flipping Pages */}
                  {[0, 1, 2].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ rotateY: 0, zIndex: 10 - i }}
                      animate={{ rotateY: -180, zIndex: [10 - i, 10 - i, i] }} 
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5, 
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                      style={{ transformOrigin: "left center", transformStyle: 'preserve-3d' }}
                      className="absolute left-1/2 w-10 h-14 bg-surface-container-highest border border-outline-variant/40 shadow-sm rounded-r-sm flex flex-col gap-[3px] py-2 px-1.5 justify-center"
                    >
                      <div className="w-full h-[2px] bg-outline-variant/40 rounded" />
                      <div className="w-4/5 h-[2px] bg-outline-variant/40 rounded" />
                      <div className="w-full h-[2px] bg-outline-variant/40 rounded" />
                      <div className="w-1/2 h-[2px] bg-outline-variant/40 rounded" />
                    </motion.div>
                  ))}
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <h3 className="text-on-surface font-bold text-lg">Analyzing Inbox</h3>
                  <motion.p 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-on-surface-variant text-sm font-medium tracking-wide"
                  >
                    Curating digital clutter...
                  </motion.p>
                </div>
              </motion.div>

            </motion.div>
          ) : (
            <motion.div
               key="content"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5, ease: cubicBezier }}
               className="w-full h-full flex flex-col"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
