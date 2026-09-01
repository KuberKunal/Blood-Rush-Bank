import React from 'react';
import { 
  History, 
  Droplet, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  Activity, 
  Calendar, 
  Flame, 
  Heart,
  TrendingUp
} from 'lucide-react';
import { DonationHistoryRecord } from '../../types';

interface DonationHistoryLedgerProps {
  history: DonationHistoryRecord[];
}

export const DonationHistoryLedger: React.FC<DonationHistoryLedgerProps> = ({ history }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Donation History & Points Ledger</h2>
            <p className="text-xs text-slate-500">Verified intake log and clinical impact distribution</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl">
          {history.length} Verified Records
        </span>
      </div>

      {/* List of Donation Events */}
      <div className="space-y-4">
        {history.map((record) => (
          <div
            key={record.id}
            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-3"
          >
            
            {/* Top Row: Date, Facility, Product, Points */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white font-mono font-bold text-xs shrink-0 shadow-sm shadow-rose-200">
                  {record.bloodGroup}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{record.component} ({record.volumeMl}ml)</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600 font-medium">{record.facilityName}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-rose-600">
                  +{record.pointsEarned}
                </span>
                <span className="text-xs text-slate-400 font-bold ml-1">pts</span>
              </div>
            </div>

            {/* Points Breakdown Tags */}
            <div className="flex items-center gap-2 flex-wrap text-xs pt-1">
              <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-mono">
                Base: +{record.breakdown.basePoints}
              </span>
              {record.breakdown.rareTypeBonus > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-mono font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Rare Type: +{record.breakdown.rareTypeBonus}
                </span>
              )}
              {record.breakdown.streakBonus > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 font-mono font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3 text-indigo-500" /> Streak: +{record.breakdown.streakBonus}
                </span>
              )}
              {record.breakdown.emergencySurgeBonus > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-mono font-medium">
                  STAT Surge: +{record.breakdown.emergencySurgeBonus}
                </span>
              )}
              {record.breakdown.referralBonus > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-medium">
                  Referral: +{record.breakdown.referralBonus}
                </span>
              )}
            </div>

            {/* Clinical Impact Summary & Vitals */}
            <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="text-slate-600 flex items-start gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-slate-900">Clinical Impact:</strong> {record.impactSummary}
                </span>
              </div>

              {record.vitalMetrics && (
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono shrink-0">
                  <span>Hb: {record.vitalMetrics.hemoglobinGdl} g/dL</span>
                  <span>BP: {record.vitalMetrics.bloodPressure}</span>
                  <span>Pulse: {record.vitalMetrics.pulseBpm} bpm</span>
                </div>
              )}
            </div>

            {/* Verification Footer */}
            <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              <span>Verified by: {record.verifiedByStaff}</span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
