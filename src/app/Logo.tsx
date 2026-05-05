'use client';
import LogoMark from './LogoMark';
import LogoWordmark from './LogoWordmark';

export default function Logo({ 
  variant = 'dark', 
  className = '' 
}: { 
  variant?: 'light' | 'dark', 
  className?: string 
}) {
  const fillColor = variant === 'light' ? '#FFFFFF' : '#1C1B1B';
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-[33%] shrink-0">
        <LogoMark color={fillColor} className="w-full h-auto" />
      </div>
      <div className="-ml-4 w-[67%] shrink-0 overflow-hidden">
        <LogoWordmark color={fillColor} className="w-full h-auto" />
      </div>
    </div>
  );
}
