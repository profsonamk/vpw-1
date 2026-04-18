import React, { useState, useEffect } from 'react';
import { Bot, TrendingUp, TrendingDown, Clock, AlertTriangle, ShieldAlert, Activity, Siren, BarChart2 } from 'lucide-react';
import StadiumMap from './StadiumMap';

const MetricBlock = ({ label, value, trendIcon, trendColor, desc }) => (
  <div className="p-3 bg-[rgba(0,0,0,0.3)] border border-[var(--border-glass)] rounded-xl flex-col gap-1 flex-1 min-w-[120px]">
    <div className="text-xs text-secondary uppercase font-bold tracking-wider">{label}</div>
    <div className="text-2xl font-bold flex items-center gap-2">
      {value}
      <span className={trendColor}>{trendIcon}</span>
    </div>
    <div className="text-xs text-muted mt-1">{desc}</div>
  </div>
);

export default function ManagementView({ gameTime, phase, score, smartFlowEnabled, surgeActive, predictionMode, triggerSurge, togglePredict }) {
  const [alerts, setAlerts] = useState([]);

  // Base Logic influenced heavily by SmartFlow Enabled state
  const baseAttendees = gameTime <= 30 ? Math.floor((gameTime / 30) * 45000) : gameTime >= 160 ? Math.floor(((180 - gameTime) / 20) * 45000) : 45210;
  
  // Calculate specific WOW metrics
  const effScore = smartFlowEnabled ? (surgeActive ? 75 : 94) : (surgeActive ? 42 : 68);
  const waitTime = smartFlowEnabled ? (surgeActive ? 7.5 : 3.2) : (surgeActive ? 28.4 : 14.5);
  const flowBalance = smartFlowEnabled ? "+34%" : "-15%";
  const riskLevel = surgeActive ? (smartFlowEnabled ? "Moderate" : "CRITICAL") : (smartFlowEnabled ? "Low" : "High");
  const riskColor = riskLevel === "Low" ? "text-success" : riskLevel === "CRITICAL" ? "text-danger animate-pulse" : "text-warning";

  useEffect(() => {
    let newAlert = null;
    if (surgeActive) {
      newAlert = smartFlowEnabled 
        ? { id: Date.now(), text: "Surge detected! SmartFlow initiated dynamic load balancing at Gate 3.", type: "success" }
        : { id: Date.now(), text: "Surge detected! Critical bottleneck forming at North Concourse.", type: "danger" };
    } else if (gameTime === 15 || gameTime === 80 || gameTime === 145) {
      newAlert = smartFlowEnabled 
        ? { id: Date.now()+1, text: `Gemini AI: Distributing ${phase} load dynamically across all exits.`, type: "info" }
        : { id: Date.now()+1, text: `Static routing causing massive backlogs for ${phase}.`, type: "warning" };
    }

    if (newAlert) {
      setAlerts(current => [newAlert, ...current].slice(0, 5)); // Keep last 5
    }
  }, [gameTime, surgeActive, smartFlowEnabled, phase]);

  return (
    <div className="flex-col gap-4 h-full flex-1">
      {/* Top action row */}
      <div className="flex items-center gap-3 shrink-0">
        <button 
          onClick={triggerSurge}
          className={`flex-1 btn ${surgeActive ? 'btn-danger animate-pulse-danger' : 'btn-danger'}`}
          disabled={surgeActive}
        >
          <Siren size={18} /> {surgeActive ? 'Simulating Surge...' : 'Simulate Surge Event'}
        </button>
        <button 
          onClick={togglePredict}
          className={`flex-1 btn ${predictionMode ? 'btn-info shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'btn-secondary'}`}
        >
          <BarChart2 size={18} /> {predictionMode ? 'Viewing Predictions' : 'Predict Next 15 Min'}
        </button>
      </div>

      {/* Live Metrics Dashboard */}
      <div className="glass-panel p-3 shrink-0">
         <div className="flex flex-wrap gap-2">
            <MetricBlock 
               label="Crowd Efficiency" 
               value={`${effScore}%`} 
               trendIcon={smartFlowEnabled ? <TrendingUp size={16}/> : <TrendingDown size={16}/>} 
               trendColor={smartFlowEnabled ? "text-success" : "text-danger"}
               desc="Optimal movement capacity"
            />
            <MetricBlock 
               label="Avg Wait Time" 
               value={`${waitTime}m`} 
               trendIcon={smartFlowEnabled ? <TrendingDown size={16}/> : <TrendingUp size={16}/>} 
               trendColor={smartFlowEnabled ? "text-success" : "text-danger"}
               desc="Global service aggregate"
            />
            <MetricBlock 
               label="CongRisk" 
               value={riskLevel} 
               trendIcon={<AlertTriangle size={16}/>} 
               trendColor={riskColor}
               desc="Incident formation probability"
            />
            <MetricBlock 
               label="Flow Bal" 
               value={flowBalance} 
               trendIcon={smartFlowEnabled ? <TrendingUp size={16}/> : <TrendingDown size={16}/>} 
               trendColor={smartFlowEnabled ? "text-success" : "text-danger"}
               desc="Distribution variance"
            />
         </div>
      </div>

      {/* Embedded Map Section */}
      <div className="flex-1 glass-panel border-[var(--border-glass)] overflow-hidden relative min-h-[300px] flex flex-col">
          <div className="absolute top-2 left-2 z-10 bg-black/70 px-3 py-1 rounded backdrop-blur border border-[var(--border-glass)] text-sm font-bold flex items-center gap-2">
            Stadium Heatmap 
            {predictionMode && <span className="text-neon-blue px-2 py-0.5 bg-[var(--neon-blue)]/20 rounded">T+15m Forecast</span>}
          </div>
          <div className="absolute top-2 right-2 z-10 font-bold bg-black/80 px-3 py-1 rounded border border-[var(--border-glass)] text-xl">
             {score}
          </div>
          <StadiumMap 
            viewType="management" 
            gameTime={gameTime} 
            smartFlowEnabled={smartFlowEnabled} 
            surgeActive={surgeActive}
            predictionMode={predictionMode}
          />
      </div>

      {/* Intelligence Engine Log */}
      <div className="glass-panel p-3 shrink-0 h-[140px] flex-col overflow-hidden">
        <div className="flex items-center gap-2 text-gradient font-bold mb-2 text-sm uppercase tracking-wide">
          <Bot size={16} /> Operational Log
        </div>
        <div className="flex-1 overflow-y-auto flex-col gap-2 pr-1">
          {alerts.map((alert, i) => (
             <div key={alert.id} className="text-sm p-2 rounded bg-black/40 border-l-[3px] border-l-[currentColor] text-secondary flex gap-2 animate-in fade-in" style={{ color: `var(--${alert.type})` }}>
                {alert.type === 'danger' ? <ShieldAlert size={14} className="mt-0.5 shrink-0"/> : <Activity size={14} className="mt-0.5 shrink-0"/>}
                <span className="text-[0.8rem] text-white/90 font-medium">{alert.text}</span>
             </div>
          ))}
          {alerts.length === 0 && <div className="text-muted text-sm text-center mt-4">Awaiting signals...</div>}
        </div>
      </div>
    </div>
  );
}
