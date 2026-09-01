import React, { useState } from 'react';
import { 
  X, 
  Droplet, 
  Sparkles, 
  Flame, 
  Radio, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Activity,
  Heart,
  TrendingUp,
  Building2
} from 'lucide-react';
import { BloodGroup, BloodComponent, DonorProfile, Facility } from '../../types';
import { calculateDonationPoints } from '../../data/donorGamificationData';

interface LogDonationModalProps {
  donor: DonorProfile;
  facilities: Facility[];
  isOpen: boolean;
  onClose: () => void;
  onConfirmDonation: (
    component: BloodComponent,
    facilityName: string,
    isEmergency: boolean,
    isSurge: boolean,
    volumeMl: number
  ) => void;
}

export const LogDonationModal: React.FC<LogDonationModalProps> = ({
  donor,
  facilities,
  isOpen,
  onClose,
  onConfirmDonation
}) => {
  const [selectedComponent, setSelectedComponent] = useState<BloodComponent>('PRBC');
  const [selectedFacilityName, setSelectedFacilityName] = useState<string>(
    facilities[0]?.name || 'Metro General Hospital - Level 1 Trauma'
  );
  const [isEmergencyStat, setIsEmergencyStat] = useState<boolean>(false);
  const [isSurgeCorridor, setIsSurgeCorridor] = useState<boolean>(false);
  const [volumeMl, setVolumeMl] = useState<number>(450);
  const [isSuccessAnim, setIsSuccessAnim] = useState<boolean>(false);

  if (!isOpen) return null;

  // Real-time calculated points
  const pointsBreakdown = calculateDonationPoints(
    donor.bloodGroup,
    selectedComponent,
    isEmergencyStat,
    donor.currentStreakMonths,
    isSurgeCorridor
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccessAnim(true);

    // Play soft celebratory Web Audio beep
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio context ignore if blocked
    }

    setTimeout(() => {
      onConfirmDonation(
        selectedComponent,
        selectedFacilityName,
        isEmergencyStat,
        isSurgeCorridor,
        volumeMl
      );
      setIsSuccessAnim(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-200">
              <Droplet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Record Verified Donation</h2>
              <p className="text-[11px] text-slate-500">Calculate Gamified Points, Streaks & Badge Progress</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Donor Summary Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center font-black font-mono text-rose-600 text-sm">
                {donor.bloodGroup}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{donor.name}</div>
                <div className="text-[10px] text-slate-500">{donor.tier} • {donor.currentStreakMonths}-month streak</div>
              </div>
            </div>
            {donor.isRareType && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Rare Bonus Active
              </span>
            )}
          </div>

          {/* Blood Component Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Blood Product Donated
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'PRBC', label: 'Packed RBC', desc: '300 base pts', vol: 450 },
                { id: 'Platelets', label: 'Platelet Apheresis', desc: '400 base pts', vol: 300 },
                { id: 'WholeBlood', label: 'Whole Blood', desc: '250 base pts', vol: 500 },
                { id: 'FFP', label: 'Fresh Plasma', desc: '200 base pts', vol: 250 },
                { id: 'Cryoprecipitate', label: 'Cryoprecipitate', desc: '200 base pts', vol: 150 }
              ].map(comp => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => {
                    setSelectedComponent(comp.id as BloodComponent);
                    setVolumeMl(comp.vol);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedComponent === comp.id
                      ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold">{comp.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{comp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Facility Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Donation Facility / Center
            </label>
            <div className="relative">
              <select
                value={selectedFacilityName}
                onChange={(e) => setSelectedFacilityName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              >
                {facilities.map(f => (
                  <option key={f.id} value={f.name}>
                    {f.name} ({f.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Special Mission / Multipliers Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Urgency & Multiplier Contexts
            </label>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsEmergencyStat(!isEmergencyStat)}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  isEmergencyStat
                    ? 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Radio className={`w-4 h-4 mt-0.5 shrink-0 ${isEmergencyStat ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">STAT Emergency</div>
                  <div className="text-[10px] text-slate-500">+250 Hero Points</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setIsSurgeCorridor(!isSurgeCorridor)}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  isSurgeCorridor
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Flame className={`w-4 h-4 mt-0.5 shrink-0 ${isSurgeCorridor ? 'text-amber-600' : 'text-slate-400'}`} />
                <div>
                  <div className="text-xs font-bold">Corridor Surge</div>
                  <div className="text-[10px] text-slate-500">+100 Buffer Points</div>
                </div>
              </button>
            </div>
          </div>

          {/* Live Gamified Points Breakdown Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-slate-400 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" /> Reward Points Preview
              </span>
              <span className="text-emerald-400 font-bold font-mono text-xs">+3 Lives Impacted</span>
            </div>

            <div className="grid grid-cols-2 gap-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between pr-2">
                <span>Base Component:</span>
                <span className="font-mono font-bold text-white">+{pointsBreakdown.basePoints}</span>
              </div>
              <div className="flex justify-between pl-2 border-l border-slate-800">
                <span>Rare Blood Bonus:</span>
                <span className="font-mono font-bold text-amber-400">+{pointsBreakdown.rareTypeBonus}</span>
              </div>
              <div className="flex justify-between pr-2">
                <span>Streak ({donor.currentStreakMonths} mo):</span>
                <span className="font-mono font-bold text-indigo-400">+{pointsBreakdown.streakBonus}</span>
              </div>
              <div className="flex justify-between pl-2 border-l border-slate-800">
                <span>Surge/STAT Bonus:</span>
                <span className="font-mono font-bold text-rose-400">+{pointsBreakdown.emergencySurgeBonus}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">Total Awarded to Profile</span>
              <div className="text-xl font-black font-mono text-rose-400">
                +{pointsBreakdown.totalPoints} <span className="text-xs text-slate-400 font-sans font-medium">pts</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSuccessAnim}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
              isSuccessAnim 
                ? 'bg-emerald-600 text-white shadow-emerald-200' 
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-200 active:scale-95'
            }`}
          >
            {isSuccessAnim ? (
              <>
                <CheckCircle2 className="w-4 h-4 animate-bounce" />
                <span>Points Claimed! Updating Leaderboard...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Confirm & Claim +{pointsBreakdown.totalPoints} Points</span>
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
