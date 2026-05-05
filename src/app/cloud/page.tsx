'use client';
import { useState } from 'react';

export default function MoveToCloud() {
  const [smartLearning, setSmartLearning] = useState(true);

  return (
    <div className="flex-1 p-[80px] max-w-4xl mx-auto w-full">
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-on-surface" style={{ letterSpacing: '-0.02em' }}>Newsletter Manager</h1>
      </header>

      <div className="flex flex-col gap-6">
        {/* Smart Learning Card */}
        <div className="flex items-center justify-between p-6 rounded-xl bg-surface-container-lowest shadow-[0px_4px_24px_rgba(28,27,27,0.02)] border border-outline-variant/10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center shrink-0 border border-outline-variant/10">
              <svg className="w-5 h-5 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h3 className="text-[17px] font-medium text-on-surface">Smart Learning</h3>
              <p className="text-on-surface-variant text-[13px] mt-0.5">AI-powered categorization improves based on your actions</p>
            </div>
          </div>
          
          <button 
            onClick={() => setSmartLearning(!smartLearning)}
            className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${smartLearning ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
          >
            <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${smartLearning ? 'bg-white' : 'bg-on-surface-variant'}`}></div>
          </button>
        </div>

        {/* Cloud Storage Card */}
        <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest shadow-[0px_4px_24px_rgba(28,27,27,0.02)] border border-outline-variant/10">
          <div className="mb-8">
            <h3 className="text-[20px] font-medium text-on-surface">Cloud Storage</h3>
            <p className="text-on-surface-variant text-[15px] mt-1">Archive important newsletters to cloud storage</p>
          </div>
          
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-outline-variant/20 rounded-xl bg-surface-container-low/50">
            <p className="text-on-surface-variant text-[16px] mb-6">Select newsletters from Inbox to move to cloud</p>
            <button className="px-6 py-2.5 rounded-md border border-outline-variant/30 bg-surface hover:bg-surface-container-low transition-colors text-on-surface font-medium text-[15px]">
              Select Newsletters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
