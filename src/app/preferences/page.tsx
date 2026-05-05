'use client';
import { useState } from 'react';

export default function Preferences() {
  const [smartLearning, setSmartLearning] = useState(true);
  const [autoCategorize, setAutoCategorize] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [autoUnsubscribe, setAutoUnsubscribe] = useState(false);

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
              <h3 className="text-[17px] font-medium text-on-surface">AI Smart Learning</h3>
              <p className="text-on-surface-variant text-[13px] mt-0.5">AI-powered categorization improves based on your previous actions.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setSmartLearning(!smartLearning)}
            className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${smartLearning ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
          >
            <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${smartLearning ? 'bg-white' : 'bg-on-surface-variant'}`}></div>
          </button>
        </div>

        {/* Category Preferences Card */}
        <div className="flex flex-col p-8 rounded-xl bg-surface-container-lowest shadow-[0px_4px_24px_rgba(28,27,27,0.02)] border border-outline-variant/10">
          <div className="mb-8">
            <h3 className="text-[20px] font-medium text-on-surface">Category Preferences</h3>
            <p className="text-on-surface-variant text-[15px] mt-1">Customize how newsletters are automatically categorized</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* Setting 1 */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-outline-variant/20 bg-surface-container-low/30">
              <span className="text-[15px] text-on-surface font-medium">Auto-categorize new subscriptions</span>
              <button 
                onClick={() => setAutoCategorize(!autoCategorize)}
                className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${autoCategorize ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${autoCategorize ? 'bg-white' : 'bg-on-surface-variant'}`}></div>
              </button>
            </div>

            {/* Setting 2 */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-outline-variant/20 bg-surface-container-low/30">
              <span className="text-[15px] text-on-surface font-medium">Send weekly summary</span>
              <button 
                onClick={() => setWeeklySummary(!weeklySummary)}
                className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${weeklySummary ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${weeklySummary ? 'bg-white' : 'bg-on-surface-variant'}`}></div>
              </button>
            </div>

            {/* Setting 3 */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-outline-variant/20 bg-surface-container-low/30">
              <span className="text-[15px] text-on-surface font-medium">Auto-unsubscribe from junk after 30 days</span>
              <button 
                onClick={() => setAutoUnsubscribe(!autoUnsubscribe)}
                className={`w-12 h-6 rounded-full flex items-center transition-colors px-1 ${autoUnsubscribe ? 'bg-gradient-to-br from-primary-dark to-primary justify-end' : 'bg-outline-variant/30 justify-start'}`}
              >
                <div className={`w-4 h-4 rounded-full shadow-sm transition-transform ${autoUnsubscribe ? 'bg-white' : 'bg-on-surface-variant'}`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
