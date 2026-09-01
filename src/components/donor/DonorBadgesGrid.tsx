import React, { useState } from 'react';
import { 
  Award, 
  Droplet, 
  Flame, 
  Zap, 
  Crown, 
  Shield, 
  Sparkles, 
  Layers, 
  Star, 
  UserPlus, 
  Users, 
  Megaphone, 
  Radio, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  Lock, 
  CheckCircle2,
  Filter
} from 'lucide-react';
import { DonorBadge, BadgeCategory } from '../../types';

interface DonorBadgesGridProps {
  badges: DonorBadge[];
}

export const DonorBadgesGrid: React.FC<DonorBadgesGridProps> = ({ badges }) => {
  const [selectedCategory, setSelectedCategory] = useState<BadgeCategory | 'all'>('all');
  const [selectedBadge, setSelectedBadge] = useState<DonorBadge | null>(null);

  const categories: { id: BadgeCategory | 'all'; label: string; icon: any }[] = [
    { id: 'all', label: 'All Badges', icon: Award },
    { id: 'consistency', label: 'Streaks & Rhythm', icon: Flame },
    { id: 'rare_blood', label: 'Rare Blood & Types', icon: Droplet },
    { id: 'referrals', label: 'Ambassadors', icon: Users },
    { id: 'emergency', label: 'STAT Heroes', icon: Radio },
    { id: 'milestones', label: 'Lifetime Gallons', icon: Crown }
  ];

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);

  const unlockedCount = badges.filter(b => b.unlocked).length;

  const renderBadgeIcon = (iconName: string, className = 'w-5 h-5') => {
    switch (iconName) {
      case 'Droplet': return <Droplet className={className} />;
      case 'Flame': return <Flame className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Star': return <Star className={className} />;
      case 'UserPlus': return <UserPlus className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Megaphone': return <Megaphone className={className} />;
      case 'Radio': return <Radio className={className} />;
      case 'MapPin': return <MapPin className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      default: return <Award className={className} />;
    }
  };

  const getTierColors = (tier: string, unlocked: boolean) => {
    if (!unlocked) {
      return {
        cardBg: 'bg-slate-50 border-slate-200 opacity-75',
        iconBg: 'bg-slate-200 text-slate-400',
        badgePill: 'bg-slate-200 text-slate-600',
        textColor: 'text-slate-500'
      };
    }
    switch (tier) {
      case 'diamond':
        return {
          cardBg: 'bg-gradient-to-br from-fuchsia-50/70 via-rose-50/50 to-indigo-50/70 border-fuchsia-200 shadow-sm hover:shadow-md',
          iconBg: 'bg-gradient-to-tr from-fuchsia-600 to-rose-600 text-white shadow-md shadow-fuchsia-200',
          badgePill: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200',
          textColor: 'text-fuchsia-950'
        };
      case 'platinum':
        return {
          cardBg: 'bg-gradient-to-br from-cyan-50/70 to-blue-50/50 border-cyan-200 shadow-sm hover:shadow-md',
          iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-200',
          badgePill: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          textColor: 'text-cyan-950'
        };
      case 'gold':
        return {
          cardBg: 'bg-gradient-to-br from-amber-50/80 to-yellow-50/40 border-amber-200 shadow-sm hover:shadow-md',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-200',
          badgePill: 'bg-amber-100 text-amber-900 border-amber-200',
          textColor: 'text-amber-950'
        };
      case 'silver':
        return {
          cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100/80 border-slate-300 shadow-sm hover:shadow-md',
          iconBg: 'bg-gradient-to-tr from-slate-500 to-slate-700 text-white shadow-md shadow-slate-200',
          badgePill: 'bg-slate-200 text-slate-800 border-slate-300',
          textColor: 'text-slate-900'
        };
      default: // bronze
        return {
          cardBg: 'bg-gradient-to-br from-amber-50/50 to-orange-50/30 border-orange-200 shadow-sm hover:shadow-md',
          iconBg: 'bg-gradient-to-tr from-amber-700 to-orange-800 text-white shadow-md shadow-orange-200',
          badgePill: 'bg-orange-100 text-orange-900 border-orange-200',
          textColor: 'text-orange-950'
        };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Category Tabs & Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map(cat => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Unlocked Summary Badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 shrink-0">
          <span className="text-slate-400 font-medium">Earned:</span>
          <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 font-mono">
            {unlockedCount} / {badges.length} Badges
          </span>
        </div>

      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map(badge => {
          const styling = getTierColors(badge.tier, badge.unlocked);
          const progressPercent = badge.progress 
            ? Math.min(100, Math.round((badge.progress.current / badge.progress.target) * 100))
            : (badge.unlocked ? 100 : 0);

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${styling.cardBg}`}
            >
              <div>
                
                {/* Top Row: Icon, Tier Pill, and Points */}
                <div className="flex items-start justify-between gap-2 pb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${styling.iconBg}`}>
                    {renderBadgeIcon(badge.iconName)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${styling.badgePill}`}>
                      {badge.tier}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black font-mono bg-slate-900 text-white shadow-xs">
                      +{badge.pointsAwarded} pts
                    </span>
                  </div>
                </div>

                {/* Badge Title & Description */}
                <div className="mt-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-sm font-bold ${styling.textColor}`}>{badge.title}</h3>
                    {badge.unlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>
                </div>

              </div>

              {/* Bottom Progress & Unlock Status */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2 text-xs">
                {badge.unlocked ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" /> Unlocked
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {badge.unlockedAt ? new Date(badge.unlockedAt).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                      <span>Requirement: {badge.requirement}</span>
                      <span className="font-mono font-bold">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-rose-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
