import React from 'react';

const StadiumMap = ({ viewType, gameTime, smartFlowEnabled, surgeActive, predictionMode }) => {
  // Base Locations
  const gates = [
    { id: 'Gate NW', x: 80, y: 50 },
    { id: 'Gate NE', x: 720, y: 50 },
    { id: 'Gate SW', x: 80, y: 450 },
    { id: 'Gate SE', x: 720, y: 450 }
  ];

  const services = [
    { id: 'Washroom N', type: 'washroom', x: 300, y: 40 },
    { id: 'Washroom S', type: 'washroom', x: 500, y: 460 },
    { id: 'Food Stall W', type: 'food', x: 70, y: 250 },
    { id: 'Food Stall E', type: 'food', x: 730, y: 250 }
  ];

  const seatPos = { x: 250, y: 70 }; 

  // --- ATTENDEE LOGIC ---
  const getAttendeePos = () => {
    let startPos = gates[0]; // Entering NW Gate
    let targetGate = smartFlowEnabled ? gates[3] : gates[0]; // SmartFlow routes to SE on exit, Dumb routes back to congested NW
    let targetFood = smartFlowEnabled ? services[2] : services[3]; // SmartFlow routes to nearer Food W, Dumb routes to far Food E

    if (gameTime <= 30) {
      const progress = gameTime / 30;
      return { x: startPos.x + (seatPos.x - startPos.x) * progress, y: startPos.y + (seatPos.y - startPos.y) * progress };
    } else if (gameTime > 30 && gameTime < 80) {
      return seatPos; 
    } else if (gameTime >= 80 && gameTime <= 95) {
      if (gameTime <= 87) {
        const progress = (gameTime - 80) / 7;
        return { x: seatPos.x + (targetFood.x - seatPos.x) * progress, y: seatPos.y + (targetFood.y - seatPos.y) * progress };
      } else {
        const progress = (gameTime - 88) / 7;
        return { x: targetFood.x + (seatPos.x - targetFood.x) * progress, y: targetFood.y + (seatPos.y - targetFood.y) * progress };
      }
    } else if (gameTime > 95 && gameTime < 145) {
      return seatPos; 
    } else if (gameTime >= 145 && gameTime <= 175) {
      const progress = (gameTime - 145) / 30;
      return { x: seatPos.x + (targetGate.x - seatPos.x) * progress, y: seatPos.y + (targetGate.y - seatPos.y) * progress };
    } else {
      return targetGate; 
    }
  };

  const attendeePos = getAttendeePos();

  let attendeePath = '';
  if (viewType === 'attendee') {
    let targetGateE = smartFlowEnabled ? gates[3] : gates[0];
    let targetFoodE = smartFlowEnabled ? services[2] : services[3];

    // Path drawing logic. SmartFlow uses efficient curves, Dumb uses straight lines.
    if (smartFlowEnabled) {
      if (gameTime <= 30) attendeePath = `M ${attendeePos.x} ${attendeePos.y} Q 150 150 ${seatPos.x} ${seatPos.y}`;
      else if (gameTime >= 80 && gameTime <= 87) attendeePath = `M ${attendeePos.x} ${attendeePos.y} Q 150 100 ${targetFoodE.x} ${targetFoodE.y}`;
      else if (gameTime >= 88 && gameTime <= 95) attendeePath = `M ${attendeePos.x} ${attendeePos.y} Q 150 100 ${seatPos.x} ${seatPos.y}`;
      else if (gameTime >= 145 && gameTime <= 175) attendeePath = `M ${attendeePos.x} ${attendeePos.y} Q 500 250 ${targetGateE.x} ${targetGateE.y}`;
    } else {
      // Dumb pathing (straight lines cutting through congestion)
      if (gameTime <= 30) attendeePath = `M ${attendeePos.x} ${attendeePos.y} L ${seatPos.x} ${seatPos.y}`;
      else if (gameTime >= 80 && gameTime <= 87) attendeePath = `M ${attendeePos.x} ${attendeePos.y} L ${targetFoodE.x} ${targetFoodE.y}`;
      else if (gameTime >= 88 && gameTime <= 95) attendeePath = `M ${attendeePos.x} ${attendeePos.y} L ${seatPos.x} ${seatPos.y}`;
      else if (gameTime >= 145 && gameTime <= 175) attendeePath = `M ${attendeePos.x} ${attendeePos.y} L ${targetGateE.x} ${targetGateE.y}`;
    }
  }

  // --- MANAGEMENT HEATMAP LOGIC ---
  const getHeatmaps = () => {
    let maps = [];
    let scale = surgeActive ? 2 : 1; 
    let predictOffset = predictionMode ? 30 : 0; // If prediction mode, shift logic into the future
    let effectiveTime = Math.min(180, gameTime + predictOffset);

    if (effectiveTime <= 30 || effectiveTime >= 145) {
      if (smartFlowEnabled) {
         // Balanced distribution across 4 gates
         gates.forEach(g => maps.push({ x: g.x, y: g.y, color: 'var(--warning)', radius: 70 * scale }));
      } else {
         // Horrible congestion at a single gate
         maps.push({ x: gates[0].x, y: gates[0].y, color: 'var(--danger)', radius: 150 * scale });
      }
    } else if (effectiveTime >= 35 && effectiveTime <= 75) {
      maps.push({ x: 400, y: 250, color: 'var(--electric-purple)', radius: 150 * (scale===2?1.2:1) });
    } else if (effectiveTime >= 80 && effectiveTime <= 95) {
      if (smartFlowEnabled) {
         maps.push({ x: services[0].x, y: services[0].y, color: 'var(--warning)', radius: 60 * scale });
         maps.push({ x: services[2].x, y: services[2].y, color: 'var(--warning)', radius: 60 * scale });
         maps.push({ x: services[1].x, y: services[1].y, color: 'var(--warning)', radius: 60 * scale });
      } else {
         maps.push({ x: services[0].x, y: services[0].y, color: 'var(--danger)', radius: 120 * scale });
      }
    }
    return maps;
  };

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full drop-shadow-lg" preserveAspectRatio="xMidYMid meet">
      {/* Pitch */}
      <rect x="200" y="100" width="400" height="300" rx="10" fill="rgba(0,255,136,0.1)" stroke="var(--success)" strokeWidth="2" />
      <line x1="400" y1="100" x2="400" y2="400" stroke="var(--success)" strokeWidth="2" />
      <circle cx="400" cy="250" r="40" fill="transparent" stroke="var(--success)" strokeWidth="2" />

      {/* Stands */}
      <path d="M 200 20 L 600 20 L 580 90 L 220 90 Z" fill="rgba(140,82,255,0.15)" stroke="var(--electric-purple)" strokeWidth="1" />
      <path d="M 200 480 L 600 480 L 580 410 L 220 410 Z" fill="rgba(140,82,255,0.15)" stroke="var(--electric-purple)" strokeWidth="1" />
      <path d="M 40 100 L 190 120 L 190 380 L 40 400 Z" fill="rgba(140,82,255,0.15)" stroke="var(--electric-purple)" strokeWidth="1" />
      <path d="M 760 100 L 610 120 L 610 380 L 760 400 Z" fill="rgba(140,82,255,0.15)" stroke="var(--electric-purple)" strokeWidth="1" />

      <text x="400" y="60" fill="var(--text-muted)" fontSize="16" textAnchor="middle">NORTH</text>
      <text x="400" y="450" fill="var(--text-muted)" fontSize="16" textAnchor="middle">SOUTH</text>

      {/* Heatmaps (Management View) */}
      {viewType === 'management' && getHeatmaps().map((h, i) => (
        <circle 
          key={i} 
          cx={h.x} cy={h.y} 
          r={h.radius} 
          fill={h.color} 
          style={{ filter: `blur(${h.radius/2}px)`, opacity: predictionMode ? 0.4 : 0.7, mixBlendMode: 'screen', transition: 'all 0.5s ease-out' }} 
          className={surgeActive ? "animate-pulse" : "animate-pulse-glow"} 
        />
      ))}

      {/* Infrastructure */}
      {services.map((s, i) => (
        <g key={`service-${i}`}>
          <rect x={s.x - 15} y={s.y - 15} width="30" height="30" rx="5" fill="var(--bg-surface)" stroke={s.type === 'food' ? 'var(--neon-pink)' : 'var(--neon-blue)'} />
          <text x={s.x} y={s.y + 4} fill="white" fontSize="12" textAnchor="middle" fontWeight="bold">{s.type === 'food' ? '🍔' : '🚻'}</text>
          <text x={s.x} y={s.y - 20} fill="var(--text-secondary)" fontSize="10" textAnchor="middle">{s.id}</text>
        </g>
      ))}

      {gates.map((g, i) => (
        <g key={`gate-${i}`}>
          <circle cx={g.x} cy={g.y} r="12" fill="var(--bg-surface)" stroke="var(--warning)" strokeWidth="2" />
          <text x={g.x} y={g.y + 4} fill="var(--warning)" fontSize="10" textAnchor="middle">G</text>
          <text x={g.x} y={g.y + 25} fill="var(--text-secondary)" fontSize="10" textAnchor="middle">{g.id}</text>
        </g>
      ))}

      {/* Attendee Map Layer */}
      {viewType === 'attendee' && (
        <>
          <circle cx={seatPos.x} cy={seatPos.y} r="8" fill="var(--electric-purple)" stroke="white" strokeWidth="2" />
          <text x={seatPos.x} y={seatPos.y + 20} fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle">Sec 104</text>
          
          {attendeePath && (
             <path 
               d={attendeePath} 
               fill="transparent" 
               stroke={smartFlowEnabled ? "var(--neon-blue)" : "var(--danger)"} 
               strokeWidth="4" 
               strokeDasharray="6,6" 
               className="animate-pulse-glow" 
               style={{ transition: 'stroke 0.3s ease' }} 
             />
          )}

          <circle cx={attendeePos.x} cy={attendeePos.y} r="8" fill="var(--neon-blue)" style={{ transition: 'all 0.3s linear' }} />
          <circle cx={attendeePos.x} cy={attendeePos.y} r="16" fill="transparent" stroke="var(--neon-blue)" strokeWidth="2" className="animate-pulse-glow" style={{ transition: 'all 0.3s linear' }} />
          <rect x={attendeePos.x + 15} y={attendeePos.y - 10} width="40" height="20" rx="10" fill="var(--neon-blue)" style={{ transition: 'all 0.3s linear' }} />
          <text x={attendeePos.x + 35} y={attendeePos.y + 4} fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle" style={{ transition: 'all 0.3s linear' }}>YOU</text>
        </>
      )}
    </svg>
  );
};

export default StadiumMap;
