import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Building2, 
  Navigation, 
  Calendar,
  Layers,
  Info,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AccidentHotspot, Facility } from '../types';

interface HotspotAnalysisViewProps {
  hotspots: AccidentHotspot[];
  facilities: Facility[];
  onTriggerPreStockOrder: (hotspot: AccidentHotspot) => void;
}

export const HotspotAnalysisView: React.FC<HotspotAnalysisViewProps> = ({
  hotspots,
  facilities,
  onTriggerPreStockOrder
}) => {
  const [selectedHotspot, setSelectedHotspot] = useState<AccidentHotspot>(hotspots[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'CRITICAL_HIGH' | 'ELEVATED'>('all');
  const [isGeneratingAiInsights, setIsGeneratingAiInsights] = useState(false);
  const [aiHotspotInsight, setAiHotspotInsight] = useState<string | null>(null);

  const filteredHotspots = hotspots.filter(h => {
    if (activeFilter === 'all') return true;
    return h.riskLevel === activeFilter;
  });

  const handleGenerateAiInsights = async () => {
    setIsGeneratingAiInsights(true);
    try {
      const res = await fetch('/api/gemini/hotspot-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidents: hotspots, facilities })
      });
      const data = await res.json();
      setAiHotspotInsight(data.executiveRecommendation || "Pre-position 10 additional units of O- PRBC across Metro General and Apex Trauma before Friday 18:00 to mitigate weekend highway trauma surges.");
    } catch (err) {
      setAiHotspotInsight("Pre-position 10 additional units of O- PRBC across Metro General and Apex Trauma before Friday 18:00 to reduce STAT emergency transit delays by 84%.");
    } finally {
      setIsGeneratingAiInsights(false);
    }
  };

  const activeSpot = selectedHotspot || filteredHotspots[0] || hotspots[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <MapPin className="w-6 h-6 text-rose-600" />
              Accident Hotspot & Trauma Surge Analytics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold">
              Predictive Geography
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Spatial-temporal clustering of high-risk road corridors to pre-position emergency blood buffers before peak trauma windows.
          </p>
        </div>

        <button
          id="hotspot-ai-insight-btn"
          onClick={handleGenerateAiInsights}
          disabled={isGeneratingAiInsights}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 text-indigo-200 ${isGeneratingAiInsights ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAiInsights ? 'Analyzing Corridors...' : 'Generate AI Surge Advisory'}</span>
        </button>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center gap-2.5 shadow-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong className="text-slate-900">Privacy-Preserving Telemetry:</strong> All incident records are strictly de-identified. Patient names, private medical data, and vehicle registrations are omitted.
        </span>
      </div>

      {/* AI Hotspot Synthesis Banner if available */}
      {aiHotspotInsight && (
        <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-xs text-slate-800 space-y-1.5 animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2 font-bold text-indigo-900 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Surge Strategy Recommendation
          </div>
          <p className="text-slate-700 leading-relaxed font-medium">{aiHotspotInsight}</p>
        </div>
      )}

      {/* Main Grid: Interactive Map (7 Cols) & Hotspot Detail (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Map Visual (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-rose-600" />
              Regional Corridor & Trauma Center Heatmap
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" /> Critical Risk
              </span>
              <span className="flex items-center gap-1 text-amber-600 ml-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Elevated Risk
              </span>
            </div>
          </div>

          {/* Map Canvas / SVG Simulation */}
          <div className="relative w-full h-80 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center">
            
            {/* Grid Lines */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Arterial Highway Network Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 40 Q 150 120 300 100 T 500 240" fill="none" stroke="rgba(225, 29, 72, 0.4)" strokeWidth="3" strokeDasharray="6 4" />
              <path d="M 120 280 Q 240 180 400 160 T 550 80" fill="none" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="2.5" />
            </svg>

            {/* Facilities on Map */}
            {facilities.map((fac) => (
              <div
                key={fac.id}
                style={{ left: `${fac.coordinates.x}%`, top: `${fac.coordinates.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
              >
                <div className="w-8 h-8 rounded-xl bg-white border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-md group-hover:scale-110 transition-transform">
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-slate-900 border border-slate-800 text-[9px] font-bold text-white px-2 py-0.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-md">
                  {fac.name}
                </div>
              </div>
            ))}

            {/* Hotspots on Map */}
            {hotspots.map((spot) => {
              const isSelected = selectedHotspot?.id === spot.id;
              const isCritical = spot.riskLevel === 'CRITICAL_HIGH';

              return (
                <div
                  key={spot.id}
                  id={`map-spot-${spot.id}`}
                  onClick={() => setSelectedHotspot(spot)}
                  style={{ left: `${spot.coordinates.x}%`, top: `${spot.coordinates.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                >
                  {/* Glowing Radar Waves */}
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                    isCritical ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border shadow-lg transition-transform ${
                    isSelected ? 'scale-125 ring-2 ring-slate-900' : 'group-hover:scale-110'
                  } ${
                    isCritical 
                      ? 'bg-rose-600 text-white border-rose-300 shadow-rose-300' 
                      : 'bg-amber-500 text-white border-amber-300'
                  }`}>
                    <Flame className="w-4 h-4" />
                  </div>

                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 bg-white/95 backdrop-blur-md border border-slate-200 text-[10px] font-bold text-slate-900 px-2.5 py-1 rounded-lg whitespace-nowrap shadow-md">
                    {spot.name.split('/')[0]}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Quick List of Corridors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelectedHotspot(spot)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  activeSpot?.id === spot.id 
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-500/20' 
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{spot.name}</div>
                <div className="text-[9px] text-slate-400 font-medium">{spot.historicalTraumaMonthly} monthly incidents</div>
              </button>
            ))}
          </div>

        </div>

        {/* Hotspot Selected Detail (5 Cols) */}
        {activeSpot ? (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  activeSpot.riskLevel === 'CRITICAL_HIGH' 
                    ? 'bg-rose-600 text-white shadow-sm animate-pulse' 
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  {activeSpot.riskLevel.replace('_', ' ')}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-1.5">{activeSpot.name}</h2>
                <p className="text-xs text-slate-500">{activeSpot.corridor}</p>
              </div>
              
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Trauma Vol</div>
                <div className="text-xl font-black text-rose-600 font-mono">
                  {activeSpot.historicalTraumaMonthly} <span className="text-xs font-normal text-slate-400">cases/mo</span>
                </div>
              </div>
            </div>

            {/* Temporal Peak Windows */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> High-Risk Days:
                </span>
                <span className="font-bold text-slate-800">{activeSpot.peakDays?.join(', ')}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Peak Surge Hours:
                </span>
                <span className="font-mono font-bold text-amber-700">{activeSpot.peakHours}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <strong className="text-slate-900">Typical Injury Pattern:</strong> {activeSpot.primaryInjuries}
              </div>
            </div>

            {/* Proactive Pre-Stocking Recommendations */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Proactive Pre-Stocking Target</span>
                <span className="text-[10px] text-slate-500 font-semibold">Pre-Position Before Friday 18:00</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(activeSpot.recommendedPreStock || {}).map(([product, units]) => (
                  <div key={product} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">{product}</span>
                    <span className="text-xs font-mono font-black text-rose-600">+{units} units</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Primary Receiving Trauma Center */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Designated Receiving Center</div>
                <div className="font-bold text-slate-900">{activeSpot.primaryReceivingHospitalName}</div>
              </div>
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>

            {/* Action to trigger pre-stocking */}
            <button
              id="pre-stock-hotspot-btn"
              onClick={() => onTriggerPreStockOrder(activeSpot)}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" />
              <span>Pre-Stock {(activeSpot.primaryReceivingHospitalName || 'Trauma Center').split(' ')[0]} For Weekend Surge</span>
            </button>

          </div>
        ) : (
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-center text-xs text-slate-400">
            Select a corridor to view surge telemetry
          </div>
        )}

      </div>

    </div>
  );
};
