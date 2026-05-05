'use client';
import { motion, AnimatePresence } from 'framer-motion';
import LogoMark from './LogoMark';
import LogoWordmark from './LogoWordmark';

const premiumEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function SplashScreen({ 
  onPhaseComplete 
}: { 
  onPhaseComplete: (phase: number) => void 
}) {
  // We use variants to orchestrate the staggered sequence
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const lockVariants = {
    initial: { opacity: 0, scale: 1.1 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: premiumEasing }
    }
  };

  const wordmarkVariants = {
    initial: { opacity: 0, x: -10 },
    animate: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 1.0, ease: premiumEasing }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onAnimationComplete={() => {
        // After logo assembly, wait a beat then trigger Phase 3 in parent
        setTimeout(() => onPhaseComplete(3), 700);
      }}
      className="flex items-center justify-center"
    >
      <motion.div variants={lockVariants} className="w-[80px]">
        <LogoMark className="w-full h-auto" />
      </motion.div>
      
      <div className="overflow-hidden -ml-6">
        <motion.div variants={wordmarkVariants} className="w-[180px]">
          <LogoWordmark className="w-full h-auto" />
        </motion.div>
      </div>
    </motion.div>
  );
}
