import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  Sliders, 
  Calendar, 
  Activity, 
  Boxes,
  HelpCircle,
  Zap,
  Info
} from 'lucide-react';
import { ForecastItem, Facility, BloodUnit, ScheduledSurgery } from '../types';

interface AIForecastingViewProps {
  facility: Facility;
  units: BloodUnit[];
  surgeries: ScheduledSurgery[];
  forecasts: ForecastItem[];
  aiSummary: string;
  isLoadingForecast: boolean;
  onRefreshForecast: () => void;
  onGenerateOrderFromForecast: (forecasts: ForecastItem[]) => void;
}

export const AIForecastingView: React.FC<AIForecastingViewProps> = ({
  facility,
  units,
  surgeries,
  forecasts,
  aiSummary,
  isLoadingForecast,
  onRefreshForecast,
  onGenerateOrderFromForecast
}) => {
  const [safetyBufferDays, setSafetyBufferDays] = useState<number>(3);
  const [activeComponentFilter, setActiveComponentFilter] = useState<string>('all');

  const filteredForecasts = forecasts.filter(f => {
    if (activeComponentFilter === 'all') return true;
    return f.component === activeComponentFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header with Live AI Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              AI Demand Forecasting & Shortage Predictor
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
              Gemini 3.7 Flash Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing 30-day historical usage, scheduled surgery reservations, accident corridor clusters, and 5-day platelet expiration curves.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="refresh-ai-forecast-btn"
            onClick={onRefreshForecast}
            disabled={isLoadingForecast}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 disabled:opacity-50 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingForecast ? 'animate-spin' : ''}`} />
            <span>{isLoadingForecast ? 'Computing Forecast...' : 'Re-Run Neural Model'}</span>
          </button>
        </div>
      </div>

      {/* Mandatory Medical Decision Disclaimer */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900">Medical Decision Boundary:</span> BloodRUSH AI supports inventory replenishment and supply logistics forecasting only. It does not decide patient transfusion therapy or verify individual cross-match compatibility. All clinical decisions remain strictly with authorized medical professionals.
        </div>
      </div>

      {/* AI Summary Card */}
      <div className="rounded-3xl bg-slate-900 text-white p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Executive AI Synthesis • Next 7 Days
            </div>
            <p className="text-sm text-slate-200 leading-relaxed max-w-3xl">
              {aiSummary || "Hospital A may face an O-positive shortage within five days. Current usable stock is 8 units, predicted demand is 20 units and the recommended order is 17 units, including safety stock. Immediate order drafting recommended."}
            </p>
          </div>

          <button
            id="forecast-create-order-draft-btn"
            onClick={() => onGenerateOrderFromForecast(forecasts)}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-5 py-3 rounded-2xl font-bold text-xs shadow-md shadow-rose-900/30 shrink-0 active:scale-95 transition-all"
          >
            <span>Draft Order from AI Forecast</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control Bar: Safety Buffer tuning & Component Filter */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        
        {/* Safety buffer slider */}
        <div className="flex items-center gap-3">
          <Sliders className="w-4 h-4 text-slate-400" />
          <span className="text-slate-700 font-bold">Safety Stock Buffer Target:</span>
          <div className="flex items-center gap-2">
            {[2, 3, 5, 7].map((days) => (
              <button
                key={days}
                onClick={() => setSafetyBufferDays(days)}
                className={`px-3 py-1.5 rounded-xl font-mono font-bold transition-all ${
                  safetyBufferDays === days 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                +{days} Days
              </button>
            ))}
          </div>
        </div>

        {/* Component Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Component:</span>
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {['all', 'PRBC', 'Platelets', 'FFP'].map((comp) => (
              <button
                key={comp}
                onClick={() => setActiveComponentFilter(comp)}
                className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all ${
                  activeComponentFilter === comp
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {comp === 'all' ? 'All Products' : comp}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Forecast Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredForecasts.map((item, idx) => {
          const isCritical = item.riskLevel === 'CRITICAL';
          const isHigh = item.riskLevel === 'HIGH';

          return (
            <div
              key={`${item.bloodGroup}-${item.component}-${idx}`}
              id={`forecast-card-${item.bloodGroup}-${item.component}`}
              className={`p-6 rounded-3xl border transition-all relative overflow-hidden ${
                isCritical 
                  ? 'bg-white border-2 border-rose-500 shadow-md ring-4 ring-rose-500/10' 
                  : isHigh 
                  ? 'bg-white border-2 border-amber-400 shadow-sm' 
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Header Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">{item.bloodGroup}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
                      {item.component}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Universal Coverage: {item.bloodGroup === 'O-' ? 'Universal RBC Donor' : 'Standard Compatibility'}
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  isCritical ? 'bg-rose-50 text-rose-700 border border-rose-200 font-black' :
                  isHigh ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {item.riskLevel} Shortage Risk
                </span>
              </div>

              {/* Numerical Metrics 3-Column */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Usable Stock</div>
                  <div className="text-lg font-black text-slate-900 font-mono">{item.currentUsableStock} <span className="text-xs font-medium text-slate-400">units</span></div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">7d Demand</div>
                  <div className="text-lg font-black text-amber-700 font-mono">{item.predictedDemand7Days} <span className="text-xs font-medium text-slate-400">units</span></div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Order Suggestion</div>
                  <div className="text-lg font-black text-rose-600 font-mono">+{item.recommendedOrderUnits} <span className="text-xs font-medium text-slate-400">units</span></div>
                </div>
              </div>

              {/* Shortage Countdown ETA */}
              {item.shortageEtaDays !== null && (
                <div className="mt-3 flex items-center justify-between p-3 rounded-2xl bg-rose-50 border border-rose-100 text-xs">
                  <span className="text-rose-800 flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    Estimated Depletion Window:
                  </span>
                  <span className="font-mono font-black text-rose-700">
                    Within {item.shortageEtaDays} Days (~{(item.shortageEtaDays * 24).toFixed(0)}h)
                  </span>
                </div>
              )}

              {/* AI Reasoning Text */}
              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 leading-relaxed font-medium">
                <strong className="text-indigo-900 font-bold">AI Rationale:</strong> {item.reasoning}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
