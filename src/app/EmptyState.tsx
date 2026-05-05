'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  const cubicBezier: [number, number, number, number] = [0.4, 0, 0.2, 1];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.6, ease: cubicBezier }}
      className="flex flex-col items-center justify-center w-full py-24 text-center border border-dashed border-outline-variant/30 rounded-2xl bg-surface-base"
    >
      <motion.div 
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="w-20 h-20 mb-6 rounded-full bg-surface-container-low shadow-[0px_4px_24px_rgba(28,27,27,0.02)] border border-outline-variant/20 flex items-center justify-center text-on-surface-variant"
      >
        {icon}
      </motion.div>
      <h2 className="text-[32px] font-bold text-on-surface tracking-[-0.02em] leading-[1.2] mb-3">{title}</h2>
      <p className="text-[16px] text-on-surface-variant max-w-md mx-auto leading-[1.5] mb-6">{message}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
