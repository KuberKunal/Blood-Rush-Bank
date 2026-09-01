import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  Droplet, 
  Flame, 
  UserPlus, 
  History, 
  Sparkles, 
  ShieldCheck, 
  QrCode, 
  Gift, 
  Zap, 
  Layers,
  ChevronRight,
  Radio,
  Plus
} from 'lucide-react';
import { 
  DonorProfile, 
  DonorBadge, 
  LeaderboardDonor, 
  Facility, 
  BloodComponent,
  BloodGroup
} from '../types';
import { DonorProfileCard } from './donor/DonorProfileCard';
import { DonorBadgesGrid } from './donor/DonorBadgesGrid';
import { LeaderboardView } from './donor/LeaderboardView';
import { DonationHistoryLedger } from './donor/DonationHistoryLedger';
import { LogDonationModal } from './donor/LogDonationModal';
import { ReferralModal } from './donor/ReferralModal';
import { DigitalDonorCardModal } from './donor/DigitalDonorCardModal';
import { DONOR_TIER_CONFIGS } from '../data/donorGamificationData';

interface DonorRewardsViewProps {
  donor: DonorProfile;
  leaderboard: LeaderboardDonor[];
  facilities: Facility[];
  onLogDonation: (
    component: BloodComponent,
    facilityName: string,
    isEmergency: boolean,
    isSurge: boolean,
    volumeMl: number
  ) => void;
  onSimulateReferral: (friendName: string, friendBloodGroup: string) => void;
  onToggleAnonymity: () => void;
  onEmergencyRespondClick?: () => void;
}

export const DonorRewardsView: React.FC<DonorRewardsViewProps> = ({
  donor,
  leaderboard,
  facilities,
  onLogDonation,
  onSimulateReferral,
  onToggleAnonymity,
  onEmergencyRespondClick
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'badges' | 'leaderboard' | 'history'>('profile');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isDigitalPassModalOpen, setIsDigitalPassModalOpen] = useState(false);

  const currentTierConfig = DONOR_TIER_CONFIGS.find(t => t.tier === donor.tier) || DONOR_TIER_CONFIGS[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Gamification Banner & Sub-Nav */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-600" /> BloodRUSH Hero Recognition
              </span>
              <span className="text-xs text-slate-400 font-medium">Gamified Civic Impact Program</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              Donor Rewards, Milestones & Civic Honor Roll
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
              Earn XP points, unlock rare phenotype badges, build donation streaks, refer fellow lifesavers, and rise on regional emergency leaderboards.
            </p>
          </div>

          {/* Quick Stats Pill Trio */}
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <div className="px-3.5 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
              <span className="text-[10px] text-rose-700 uppercase font-bold block">Total Points</span>
              <span className="font-black text-base">{donor.totalPoints.toLocaleString()} XP</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">Streak</span>
              <span className="font-black text-base">{donor.currentStreakMonths} mo</span>
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <span className="text-[10px] text-emerald-700 uppercase font-bold block">Lives Saved</span>
              <span className="font-black text-base">{donor.livesSavedEstimated}</span>
            </div>
          </div>
        </div>

        {/* View Switcher Sub-Tabs */}
        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-4 overflow-x-auto">
          {[
            { id: 'profile', label: 'Donor Profile & Perks', icon: Award, count: null },
            { id: 'badges', label: 'Badges & Achievements', icon: Sparkles, count: `${donor.earnedBadges.filter(b => b.unlocked).length}/${donor.earnedBadges.length}` },
            { id: 'leaderboard', label: 'Community Leaderboard', icon: Trophy, count: `#${leaderboard.find(d => d.id === donor.id || d.isCurrentDonor)?.rank || 4}` },
            { id: 'history', label: 'Points Ledger & Vitals', icon: History, count: donor.donationHistory.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-sub-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Sub-Tab 1: Profile & Tier Perks */}
      {activeSubTab === 'profile' && (
        <div className="space-y-6">
          <DonorProfileCard
            donor={donor}
            onOpenLogDonation={() => setIsLogModalOpen(true)}
            onOpenReferral={() => setIsReferralModalOpen(true)}
            onOpenDigitalPass={() => setIsDigitalPassModalOpen(true)}
          />

          {/* Tier Progression Roadmap */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">Lifesaver Tier Hierarchy & Unlocked Privileges</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Automatic Level Progression</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {DONOR_TIER_CONFIGS.map((tConfig) => {
                const isCurrent = donor.tier === tConfig.tier;
                const isPast = donor.totalPoints >= tConfig.maxPoints;

                return (
                  <div
                    key={tConfig.tier}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isCurrent
                        ? `${tConfig.bgColor} ${tConfig.borderColor} ring-2 ring-rose-500/20 shadow-sm`
                        : isPast
                        ? 'bg-slate-50 border-slate-200'
                        : 'bg-white border-slate-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between pb-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${tConfig.badgeColor}`}>
                          Lvl {tConfig.level}
                        </span>
                        {isCurrent && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-600 text-white">
                            Current
                          </span>
                        )}
                      </div>

                      <h4 className={`text-xs font-bold mt-1 ${tConfig.textColor}`}>{tConfig.tier}</h4>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {tConfig.minPoints.toLocaleString()} – {tConfig.maxPoints > 99999 ? '∞' : tConfig.maxPoints.toLocaleString()} pts
                      </p>

                      {/* Perks */}
                      <ul className="mt-3 space-y-1 text-[11px] text-slate-600">
                        {tConfig.perks.map((perk, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-rose-500 font-bold text-[10px]">•</span>
                            <span className="leading-tight">{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200/60 text-[10px] font-bold text-slate-400">
                      {isCurrent ? 'Active Rank' : isPast ? 'Unlocked' : 'Locked'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Badges Preview Section */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900">Recent Earned Badges</h3>
              </div>
              <button
                onClick={() => setActiveSubTab('badges')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <span>View All ({donor.earnedBadges.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {donor.earnedBadges.filter(b => b.unlocked).slice(0, 4).map(badge => (
                <div
                  key={badge.id}
                  onClick={() => setActiveSubTab('badges')}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-center space-y-1.5"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center mx-auto shadow-sm">
                    <Award className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{badge.title}</h4>
                  <span className="text-[10px] font-mono font-bold text-rose-600 block">+{badge.pointsAwarded} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Achievements & Badges */}
      {activeSubTab === 'badges' && (
        <DonorBadgesGrid badges={donor.earnedBadges} />
      )}

      {/* Sub-Tab 3: Community Leaderboard */}
      {activeSubTab === 'leaderboard' && (
        <LeaderboardView
          currentDonor={donor}
          leaderboard={leaderboard}
          onToggleAnonymity={onToggleAnonymity}
        />
      )}

      {/* Sub-Tab 4: Points Ledger & Vitals */}
      {activeSubTab === 'history' && (
        <DonationHistoryLedger history={donor.donationHistory} />
      )}

      {/* Modals */}
      <LogDonationModal
        donor={donor}
        facilities={facilities}
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onConfirmDonation={onLogDonation}
      />

      <ReferralModal
        donor={donor}
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
        onSimulateReferral={onSimulateReferral}
      />

      <DigitalDonorCardModal
        donor={donor}
        isOpen={isDigitalPassModalOpen}
        onClose={() => setIsDigitalPassModalOpen(false)}
      />

    </div>
  );
};
