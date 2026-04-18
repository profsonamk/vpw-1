import React, { useState } from 'react';
import { Navigation, Coffee, MapPin, Clock, Trophy, Map, ShieldAlert, Cpu } from 'lucide-react';
import StadiumMap from './StadiumMap';

export default function AttendeeView({ gameTime, phase, score, smartFlowEnabled, surgeActive }) {
  const [activeTab, setActiveTab] = useState('navigate');

  const isMatchTime = (gameTime > 30 && gameTime <= 75) || (gameTime > 95 && gameTime <= 140);
  const isWalking = ((gameTime <= 30) || (gameTime >= 80 && gameTime <= 95) || (gameTime >= 145)) && !isMatchTime;

  return (
    <div className="w-full flex justify-center items-center h-full pb-4">
      <div className="glass-panel w-full max-w-sm h-full max-h-[85vh] flex flex-col relative overflow-hidden flex-1 shadow-[0_0_50px_rgba(0,0,0,0.5)]" style={{ borderRadius: '40px', border: '8px solid #000' }}>
        
        {/* App Header */}
        <div className="p-3 bg-[rgba(15,10,28,0.95)] flex-col border-b border-[var(--border-glass)] relative z-10 gap-2 shrink-0">
          <div className="flex items-center justify-between">
             <div className="font-bold text-gradient flex items-center gap-2"><Map size={18}/> SmartFlow</div>
             <div className="bg-black/50 border border-[var(--border-glass)] px-3 py-1 rounded-full font-bold text-sm">
                Score: <span className="text-[var(--neon-blue)]">{score}</span>
             </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 flex-col gap-3 relative z-10 custom-scrollbar pb-8">
          
          {/* Main Map Box */}
          <div className="rounded-xl relative border-[1px] border-[var(--border-glass)] overflow-hidden min-h-[220px] shrink-0 bg-[#000]">
             <StadiumMap viewType="attendee" gameTime={gameTime} smartFlowEnabled={smartFlowEnabled} surgeActive={surgeActive} />
             
             {/* Gamified Feedback Overlay */}
             {smartFlowEnabled && isWalking && (
               <div className="absolute top-2 left-2 right-2 bg-black/80 backdrop-blur border border-[var(--success)] rounded-lg p-2 flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg">
                  <div className="bg-[var(--success)]/20 p-2 rounded-full text-[var(--success)]">
                    <Trophy size={16} />
                  </div>
                  <div className="flex-col">
                    <div className="text-xs text-[var(--success)] font-bold">Smart Navigator</div>
                    <div className="text-[10px] text-white">Time Saved: {surgeActive ? '15m' : '8m'} | Rank: Top 18%</div>
                  </div>
               </div>
             )}

             {!smartFlowEnabled && isWalking && (
               <div className="absolute top-2 left-2 right-2 bg-black/80 backdrop-blur border border-[var(--danger)] rounded-lg p-2 flex items-center gap-3 animate-in slide-in-from-top-2 shadow-lg">
                 <div className="bg-[var(--danger)]/20 p-2 rounded-full text-[var(--danger)]">
                    <ShieldAlert size={16} />
                  </div>
                  <div className="flex-col">
                    <div className="text-xs text-[var(--danger)] font-bold">Path Congested</div>
                    <div className="text-[10px] text-white">Traffic Severe. +25m Wait.</div>
                  </div>
               </div>
             )}
          </div>

          {/* Explainable Routing Box */}
          {isWalking && (
            <div className={`p-3 rounded-xl border ${smartFlowEnabled ? 'bg-[rgba(0,229,255,0.05)] border-[var(--neon-blue)]' : 'bg-[rgba(255,51,102,0.05)] border-[var(--danger)]'} shrink-0 mb-1`}>
               <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                  <Cpu size={14} className={smartFlowEnabled ? 'text-neon-blue' : 'text-danger'} /> 
                  Routing Engine AI
               </div>
               
               {smartFlowEnabled ? (
                 <>
                   <div className="text-xs font-bold mb-1">Suggested Route: Optimal Bypass</div>
                   <div className="text-xs text-secondary mb-1">
                     {gameTime <= 30 ? "Avoiding Gate NW (Severe Congestion)" : gameTime >= 145 ? "Routing to Exit SE (Low Volume)" : "Routing to Food W (Fastest Queue)"}
                   </div>
                   <ul className="text-[10px] text-muted list-disc ml-4">
                     <li>{surgeActive ? "72%" : "32%"} lower crowd density</li>
                     <li>{surgeActive ? "15" : "8"} min faster than default path</li>
                   </ul>
                 </>
               ) : (
                 <>
                   <div className="text-xs font-bold text-[var(--danger)] mb-1">Suggested Route: Default (Static)</div>
                   <div className="text-xs text-secondary mb-1">Direct path to destination.</div>
                   <ul className="text-[10px] text-muted list-disc ml-4">
                     <li className="text-[var(--warning)]">Routing through major heat zones.</li>
                     <li>Queue times not factored.</li>
                   </ul>
                 </>
               )}
            </div>
          )}

          {/* Action Cards */}
          <div className="flex flex-wrap gap-2 shrink-0">
             <div className="bg-[rgba(0,0,0,0.4)] border border-[var(--border-glass)] rounded-xl p-3 flex-1 min-w-[120px] flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--electric-purple)] transition">
                <Coffee size={20} className="mb-1 text-[var(--neon-purple)]" />
                <div className="text-xs font-bold">Food Pre-Order</div>
                <div className="text-[10px] text-muted">Skip the line</div>
             </div>
             <div className="bg-[rgba(0,0,0,0.4)] border border-[var(--border-glass)] rounded-xl p-3 flex-1 min-w-[120px] flex-col items-center justify-center text-center cursor-pointer hover:border-[var(--electric-purple)] transition">
                <MapPin size={20} className="mb-1 text-[var(--success)]" />
                <div className="text-xs font-bold">Facilities</div>
                <div className="text-[10px] text-muted">Washrooms & Elevators</div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
