import React, { useState, useEffect } from 'react';
import { Activity, Clock, Play, Pause, Check, X } from 'lucide-react';
import ManagementView from './components/ManagementView';
import AttendeeView from './components/AttendeeView';

function App() {
  const [gameTime, setGameTime] = useState(0); 
  const [isPlaying, setIsPlaying] = useState(false);
  
  // WOW Features State
  const [smartFlowEnabled, setSmartFlowEnabled] = useState(true);
  const [surgeActive, setSurgeActive] = useState(false);
  const [predictionMode, setPredictionMode] = useState(false);

  // Determine Game Phase
  const getPhase = (time) => {
    if (time <= 30) return 'Pre-Match (Entry)';
    if (time <= 75) return 'First Half';
    if (time <= 95) return 'Half-Time';
    if (time <= 140) return 'Second Half';
    if (time <= 180) return 'Post-Match (Exit)';
    return 'Match Ended';
  };

  const getScore = (time) => {
    if (time < 12) return '0 - 0';
    if (time < 45) return '1 - 0';
    if (time < 110) return '1 - 1';
    return '2 - 1';
  };

  // Auto-play timer
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setGameTime((prevTime) => (prevTime >= 180 ? 180 : prevTime + 1));
      }, 500); 
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Surge Event Logic
  const triggerSurge = () => {
    setSurgeActive(true);
    // If SmartFlow is ON, it stabilizes quickly. If OFF, it stays until deactivated or time passes.
    if (smartFlowEnabled) {
      setTimeout(() => setSurgeActive(false), 5000); // stabilizes in 5 seconds
    } else {
      setTimeout(() => setSurgeActive(false), 15000); // 15 seconds to simulate stubborn congestion
    }
  };

  return (
    <>
      <header className="app-header glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
        <div className="logo text-gradient flex items-center font-bold" style={{ minWidth: '180px' }}>
          <Activity size={26} className="mr-2" />
          SmartFlow
        </div>
        
        {/* Global Timeline Controller */}
        <div className="flex flex-col items-center flex-1 max-w-xl mx-4">
           <div className="flex items-center gap-4 w-full">
             <button 
                className="btn-icon bg-[var(--electric-purple)] hover:bg-[var(--neon-purple)] transition rounded-full text-white p-2 shrink-0"
                onClick={() => setIsPlaying(!isPlaying)}
             >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
             </button>
             <input 
               type="range" 
               min="0" 
               max="180" 
               value={gameTime}
               onChange={(e) => setGameTime(parseInt(e.target.value))}
               className="flex-1 accent-[var(--electric-purple)] cursor-pointer"
             />
             <div className="flex-col items-end min-w-[140px]">
               <div className="font-bold flex items-center gap-1 text-[var(--neon-blue)]">
                 <Clock size={16} />
                 {gameTime} min
               </div>
               <div className="text-sm font-medium text-secondary whitespace-nowrap">{getPhase(gameTime)}</div>
             </div>
           </div>
        </div>

        {/* Global Toggle Array */}
        <div className="toggle-switch shrink-0">
          <button 
            className={`flex items-center gap-2 ${!smartFlowEnabled ? 'active-off' : ''}`}
            onClick={() => setSmartFlowEnabled(false)}
          >
            <X size={14} /> Without SmartFlow
          </button>
          <button 
            className={`flex items-center gap-2 ${smartFlowEnabled ? 'active-on' : ''}`}
            onClick={() => setSmartFlowEnabled(true)}
          >
            <Check size={14} /> With SmartFlow
          </button>
        </div>
      </header>

      <main className="content-wrapper overflow-hidden pb-4">
        {/* Unified Side-by-Side Grid */}
        <div className="split-screen-grid w-full h-[calc(100vh-130px)]">
          {/* Left Side: Management View */}
          <div className="h-full flex flex-col gap-4 border-r border-[var(--border-glass)] pr-4 overflow-y-auto custom-scrollbar">
             <h2 className="text-xl font-bold text-gradient mb-2 shrink-0 flex items-center justify-between">
                Management Dashboard
             </h2>
             <ManagementView 
               gameTime={gameTime} 
               phase={getPhase(gameTime)} 
               score={getScore(gameTime)} 
               smartFlowEnabled={smartFlowEnabled}
               surgeActive={surgeActive}
               predictionMode={predictionMode}
               triggerSurge={triggerSurge}
               togglePredict={() => setPredictionMode(!predictionMode)}
             />
          </div>
          
          {/* Right Side: Attendee View */}
          <div className="h-full flex flex-col pl-2 overflow-y-auto">
             <h2 className="text-xl font-bold text-secondary mb-4 shrink-0 px-4">Attendee App Simulator</h2>
             <AttendeeView 
               gameTime={gameTime} 
               phase={getPhase(gameTime)} 
               score={getScore(gameTime)}
               smartFlowEnabled={smartFlowEnabled}
               surgeActive={surgeActive}
             />
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
