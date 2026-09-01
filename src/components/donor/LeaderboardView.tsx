import React, { useState } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Sparkles, 
  Flame, 
  Droplet, 
  ShieldCheck, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Filter, 
  UserPlus, 
  Award,
  Eye,
  EyeOff,
  Search,
  MapPin
} from 'lucide-react';
import { LeaderboardDonor, DonorProfile } from '../../types';

interface LeaderboardViewProps {
  currentDonor: DonorProfile;
  leaderboard: LeaderboardDonor[];
  onToggleAnonymity: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentDonor,
  leaderboard,
  onToggleAnonymity
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'monthly' | 'rare' | 'streaks'>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract cities
  const uniqueCities = Array.from(new Set(leaderboard.map(d => d.city)));

  // Filter leaderboard
  const filtered = leaderboard.filter(d => {
    if (cityFilter !== 'all' && d.city !== cityFilter) return false;
    if (timeFilter === 'rare' && !d.isRareType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.handle.toLowerCase().includes(q) || d.city.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (timeFilter === 'streaks') return b.streakMonths - a.streakMonths;
    return b.totalPoints - a.totalPoints;
  });

  // Re-rank for display
  const ranked = filtered.map((d, index) => ({
    ...d,
    currentRank: index + 1
  }));

  const topThree = ranked.slice(0, 3);
  const remaining = ranked.slice(3);

  // Find user rank in filtered list
  const userRankEntry = ranked.find(d => d.id === currentDonor.id || d.isCurrentDonor);

  return (
    <div className="space-y-6">
      
      {/* Header & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Time / Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All-Time Legends', icon: Trophy },
            { id: 'monthly', label: 'Surge Blitz', icon: Sparkles },
            { id: 'rare', label: 'Rare Blood Champions', icon: Droplet },
            { id: 'streaks', label: 'Longest Streaks', icon: Flame }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = timeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTimeFilter(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* City Filter, Search & Anonymity Toggle */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          
          {/* City Dropdown */}
          <div className="relative shrink-0">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-rose-500"
            >
              <option value="all">All Regional Hubs</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Privacy Toggle */}
          <button
            onClick={onToggleAnonymity}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors shrink-0 ${
              currentDonor.isAnonymousOnLeaderboard
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle between real name and anonymous pseudonym"
          >
            {currentDonor.isAnonymousOnLeaderboard ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Incognito Mode</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Public Hero</span>
              </>
            )}
          </button>

        </div>

      </div>

      {/* Podium Showcase (1st, 2nd, 3rd) */}
      {topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* 2nd Place */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col items-center text-center relative order-2 md:order-1 mt-0 md:mt-6">
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 font-black text-xs absolute -top-3.5 shadow-sm">
              #2
            </div>
            <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-slate-400 to-slate-600 shadow-md mt-2">
              <img
                src={topThree[1].avatarUrl}
                alt={topThree[1].name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2.5">{topThree[1].name}</h3>
            <span className="text-[11px] text-slate-500 font-mono">@{topThree[1].handle}</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 font-mono">
                {topThree[1].bloodGroup}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {topThree[1].tier}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{topThree[1].donationsCount} donations</span>
              <span className="text-rose-600 font-mono font-black">{topThree[1].totalPoints.toLocaleString()} pts</span>
            </div>
          </div>

          {/* 1st Place Champion */}
          <div className="bg-gradient-to-b from-amber-50/80 to-white border-2 border-amber-300 rounded-3xl p-6 shadow-md flex flex-col items-center text-center relative order-1 md:order-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white font-black text-sm absolute -top-4.5 shadow-md">
              👑
            </div>
            <div className="w-20 h-20 rounded-2xl p-1 bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 shadow-lg mt-2">
              <img
                src={topThree[0].avatarUrl}
                alt={topThree[0].name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[12px]"
              />
            </div>
            <h3 className="text-base font-black text-slate-950 mt-3">{topThree[0].name}</h3>
            <span className="text-[11px] text-slate-500 font-mono">@{topThree[0].handle}</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-700" /> Champion
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 font-mono">
                {topThree[0].bloodGroup}
              </span>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-200/80 w-full flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold">{topThree[0].donationsCount} donations • {topThree[0].streakMonths} mo streak</span>
              <span className="text-amber-700 font-mono font-black text-sm">{topThree[0].totalPoints.toLocaleString()} pts</span>
            </div>
          </div>

          {/* 3rd Place */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col items-center text-center relative order-3 md:order-3 mt-0 md:mt-8">
            <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-800 font-black text-xs absolute -top-3.5 shadow-sm">
              #3
            </div>
            <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-700 to-orange-800 shadow-md mt-2">
              <img
                src={topThree[2].avatarUrl}
                alt={topThree[2].name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-2.5">{topThree[2].name}</h3>
            <span className="text-[11px] text-slate-500 font-mono">@{topThree[2].handle}</span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 font-mono">
                {topThree[2].bloodGroup}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                {topThree[2].tier}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">{topThree[2].donationsCount} donations</span>
              <span className="text-rose-600 font-mono font-black">{topThree[2].totalPoints.toLocaleString()} pts</span>
            </div>
          </div>

        </div>
      )}

      {/* Sticky User Position Banner */}
      {userRankEntry && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center font-black text-sm font-mono shadow-md">
              #{userRankEntry.currentRank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight">Your Current Ranking</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">
                  {currentDonor.city}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {userRankEntry.currentRank > 1 
                  ? `Only ${(ranked[userRankEntry.currentRank - 2]?.totalPoints - currentDonor.totalPoints) || 140} pts behind Rank #${userRankEntry.currentRank - 1}!` 
                  : 'You are currently leading the community podium!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Lifetime XP</span>
              <span className="text-base font-black text-rose-400">{currentDonor.totalPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Full Leaderboard Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Regional Honor Roll</h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {ranked.length} verified lifesavers listed
          </span>
        </div>

        <div className="divide-y divide-slate-100 overflow-x-auto">
          {ranked.map((donor) => {
            const isUser = donor.id === currentDonor.id || donor.isCurrentDonor;
            const displayName = isUser && currentDonor.isAnonymousOnLeaderboard 
              ? 'Anonymous Hero (You)' 
              : donor.name;

            return (
              <div
                key={donor.id}
                className={`px-6 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                  isUser ? 'bg-rose-50/60 font-semibold' : 'hover:bg-slate-50/70'
                }`}
              >
                
                {/* Rank & Identity */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <span className={`w-7 text-center font-mono font-black text-sm ${
                    donor.currentRank <= 3 ? 'text-amber-600' : 'text-slate-400'
                  }`}>
                    #{donor.currentRank}
                  </span>

                  <img
                    src={donor.avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{displayName}</span>
                      {isUser && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-600 text-white">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <span className="font-mono">@{donor.handle}</span>
                      <span>•</span>
                      <span>{donor.city}</span>
                    </div>
                  </div>
                </div>

                {/* Blood Group & Badges */}
                <div className="hidden sm:flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-100">
                    {donor.bloodGroup}
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                    {donor.tier}
                  </span>
                  {donor.isRareType && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Rare
                    </span>
                  )}
                </div>

                {/* Streak & Donations */}
                <div className="hidden md:flex items-center gap-6 text-xs text-slate-600">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>{donor.streakMonths} mo streak</span>
                  </div>
                  <div>
                    <span>{donor.donationsCount} donations</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-600">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{donor.referralsCount} refs</span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-sm text-slate-900">
                    {donor.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">pts</span>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
