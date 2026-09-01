import React from 'react';
import { 
  Droplet, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Award, 
  Heart, 
  QrCode, 
  UserPlus, 
  TrendingUp, 
  Calendar, 
  Plus, 
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { DonorProfile } from '../../types';
import { DONOR_TIER_CONFIGS } from '../../data/donorGamificationData';

interface DonorProfileCardProps {
  donor: DonorProfile;
  onOpenLogDonation: () => void;
  onOpenReferral: () => void;
  onOpenDigitalPass: () => void;
}

export const DonorProfileCard: React.FC<DonorProfileCardProps> = ({
  donor,
  onOpenLogDonation,
  onOpenReferral,
  onOpenDigitalPass
}) => {
  const currentTierConfig = DONOR_TIER_CONFIGS.find(t => t.tier === donor.tier) || DONOR_TIER_CONFIGS[0];
  const nextTierConfig = DONOR_TIER_CONFIGS[currentTierConfig.level] || currentTierConfig;

  // Calculate percentage within current tier
  const tierRange = nextTierConfig.minPoints - currentTierConfig.minPoints;
  const currentTierProgress = Math.min(
    100,
    Math.max(0, Math.round(((donor.totalPoints - currentTierConfig.minPoints) / (tierRange || 1)) * 100))
  );

  const pointsToNext = Math.max(0, donor.nextTierPoints - donor.totalPoints);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
      
      {/* Top Row: Avatar, Identity, Tier, and Pass Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        
        <div className="flex items-center gap-4">
          
          {/* Avatar with Tier Ring */}
          <div className="relative shrink-0">
            <div className={`w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr ${currentTierConfig.color} shadow-md`}>
              <img
                src={donor.avatarUrl}
                alt={donor.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-md border border-slate-200 flex items-center justify-center text-xs">
              👑
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">{donor.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${currentTierConfig.badgeColor} border ${currentTierConfig.borderColor} flex items-center gap-1`}>
                <Award className="w-3 h-3" /> Level {donor.level} • {donor.tier}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
              <span className="font-mono font-medium text-slate-600">@{donor.handle}</span>
              <span>•</span>
              <span>{donor.city}</span>
              <span>•</span>
              <span className="text-slate-600">{donor.homeFacilityName}</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            id="open-digital-pass-btn"
            onClick={onOpenDigitalPass}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-slate-500" />
            <span>Digital Pass</span>
          </button>

          <button
            id="open-referral-btn"
            onClick={onOpenReferral}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
            <span>Refer (+200 pts)</span>
          </button>

          <button
            id="record-donation-btn"
            onClick={onOpenLogDonation}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-200 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Donation</span>
          </button>
        </div>

      </div>

      {/* Tier XP Progress Bar & Multiplier */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Tier XP Progress
            </span>
            <span className="text-[10px] text-slate-400 font-medium">({currentTierProgress}% completed)</span>
          </div>

          <div className="font-mono text-xs font-bold text-slate-700">
            <span className="text-rose-600 text-sm font-black">{donor.totalPoints.toLocaleString()}</span> / {donor.nextTierPoints.toLocaleString()} pts
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5">
          <div 
            className={`h-full rounded-full bg-gradient-to-r ${currentTierConfig.color} transition-all duration-500`}
            style={{ width: `${currentTierProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{currentTierConfig.tier}</span>
          <span className="text-rose-600 font-semibold font-mono">
            {pointsToNext > 0 ? `${pointsToNext} pts to ${nextTierConfig.tier}` : 'Max Tier Reached'}
          </span>
          <span>{nextTierConfig.tier}</span>
        </div>
      </div>

      {/* Hero Stats Quad Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Blood Group & Rare Status */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-700">Blood Phenotype</span>
            <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black font-mono text-slate-900">{donor.bloodGroup}</div>
            <div className="text-[10px] font-bold text-rose-700 mt-0.5 truncate">
              {donor.isRareType ? 'Universal Red Cells' : 'Verified Group'}
            </div>
          </div>
          <span className="text-[9px] text-slate-400">RhD Negative (cde/cde)</span>
        </div>

        {/* Estimated Lives Impacted */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-700">Lives Saved</span>
            <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black font-mono text-emerald-700">{donor.livesSavedEstimated}</div>
            <div className="text-[10px] font-bold text-emerald-800 mt-0.5">Direct Clinical Impact</div>
          </div>
          <span className="text-[9px] text-slate-400">3 lives per whole unit</span>
        </div>

        {/* Consistency Streak */}
        <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-amber-700">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-600 fill-amber-600 animate-pulse" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black font-mono text-amber-900">{donor.currentStreakMonths} <span className="text-xs font-normal text-slate-500">intervals</span></div>
            <div className="text-[10px] font-bold text-amber-800 mt-0.5">+50% Point Multiplier</div>
          </div>
          <span className="text-[9px] text-slate-400">Best: {donor.longestStreakMonths} intervals</span>
        </div>

        {/* Ambassador Referrals */}
        <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-indigo-700">Referral Squad</span>
            <UserPlus className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="my-1.5">
            <div className="text-2xl font-black font-mono text-indigo-900">{donor.referralsCount} <span className="text-xs font-normal text-slate-500">donors</span></div>
            <div className="text-[10px] font-bold text-indigo-800 mt-0.5">+{donor.referralsCount * 200} pts earned</div>
          </div>
          <span className="text-[9px] text-slate-400">Code: {donor.referralCode}</span>
        </div>

      </div>

    </div>
  );
};
