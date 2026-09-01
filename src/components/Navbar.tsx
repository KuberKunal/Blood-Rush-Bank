import React, { useState } from 'react';
import { 
  Activity, 
  Flame, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  Sparkles, 
  AlertTriangle, 
  BookOpen, 
  CreditCard, 
  FileText, 
  Radio, 
  Boxes,
  Compass,
  MapPin,
  Clock,
  ArrowRightLeft,
  Trophy,
  Award
} from 'lucide-react';
import { Facility, UserRole, UserProfile } from '../types';
import { INITIAL_FACILITIES } from '../data/mockData';

export interface NavbarProps {
  currentFacility?: Facility;
  activeFacility?: Facility;
  allFacilities?: Facility[];
  facilities?: Facility[];
  onSelectFacility?: (fac: Facility) => void;
  onFacilityChange?: (fac: Facility) => void;
  currentRole?: UserRole | string;
  activeRole?: UserRole | string;
  onChangeRole?: (role: UserRole) => void;
  onRoleChange?: (role: string) => void;
  activeTab: string;
  onSelectTab?: (tab: string) => void;
  onTabChange?: (tab: string) => void;
  hasActiveEmergency?: boolean;
  activeEmergencyCount?: number;
  onOpenStatModal?: () => void;
  onOpenCompatibilityModal?: () => void;
  onOpenPlansModal?: () => void;
  onOpenAuditLogs?: () => void;
  onToggleAIAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentFacility,
  activeFacility,
  allFacilities,
  facilities,
  onSelectFacility,
  onFacilityChange,
  currentRole,
  activeRole,
  onChangeRole,
  onRoleChange,
  activeTab,
  onSelectTab,
  onTabChange,
  hasActiveEmergency,
  activeEmergencyCount,
  onOpenStatModal,
  onOpenCompatibilityModal,
  onOpenPlansModal,
  onOpenAuditLogs,
  onToggleAIAssistant
}) => {
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const effectiveFacility: Facility = currentFacility || activeFacility || allFacilities?.[0] || facilities?.[0] || INITIAL_FACILITIES[0];
  const effectiveFacilities: Facility[] = allFacilities || facilities || INITIAL_FACILITIES;
  const effectiveRole: UserRole = ((currentRole || activeRole || 'admin') as UserRole);

  const selectFacility = (fac: Facility) => {
    if (onSelectFacility) onSelectFacility(fac);
    if (onFacilityChange) onFacilityChange(fac);
  };

  const selectRole = (role: UserRole) => {
    if (onChangeRole) onChangeRole(role);
    if (onRoleChange) onRoleChange(role);
  };

  const selectTab = (tab: string) => {
    if (onSelectTab) onSelectTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const hasEmergency = hasActiveEmergency || (activeEmergencyCount !== undefined && activeEmergencyCount > 0);

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string }> = {
    admin: { label: 'Hospital Administrator', badge: 'Admin', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    inventory_manager: { label: 'Inventory Manager', badge: 'Inventory Lead', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    emergency_staff: { label: 'Emergency Trauma Staff', badge: 'STAT Trauma', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    blood_bank_staff: { label: 'Blood Bank Dispatcher', badge: 'Blood Hub', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    health_authority: { label: 'State Health Authority', badge: 'Gov Command', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }
  };

  const currentRoleConfig = roleLabels[effectiveRole] || roleLabels.admin;

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: Activity },
    { id: 'rewards', label: 'Donor Rewards', icon: Trophy },
    { id: 'inventory', label: 'Blood Inventory', icon: Boxes },
    { id: 'forecast', label: 'AI Demand Forecast', icon: Sparkles },
    { id: 'orders', label: 'Weekly Orders', icon: ArrowRightLeft },
    { id: 'emergency', label: 'Emergency Dispatch', icon: Radio, highlight: hasEmergency },
    { id: 'hotspots', label: 'Accident Hotspots', icon: MapPin },
    { id: 'facilities', label: 'Regional Network', icon: Building2 },
    { id: 'audit', label: 'Audit Trail', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shrink-0 shadow-sm">
      {/* Top emergency broadcast ticker if active */}
      {hasEmergency && (
        <div className="bg-rose-600 text-white px-4 py-2 flex items-center justify-between text-xs font-semibold shadow-md shadow-rose-200">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-white animate-ping" />
            <AlertTriangle className="w-4 h-4 text-white" />
            <span className="font-bold tracking-wide uppercase">Active STAT Emergency:</span>
            <span>4 units O- PRBC in cold-chain rapid transit to Trauma Bay 1</span>
          </div>
          <button 
            id="view-active-dispatch-btn"
            onClick={() => selectTab('emergency')}
            className="text-rose-700 bg-white hover:bg-rose-50 px-3 py-1 rounded-lg font-bold text-xs shadow-sm transition-colors"
          >
            Track Live Courier →
          </button>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => selectTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-200 text-white transition-transform group-hover:scale-105">
                <Flame className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold tracking-tight text-slate-900">
                  Blood<span className="text-rose-600">RUSH</span>
                </span>
                <span className="ml-3 px-3 py-0.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-100 hidden sm:inline-block">
                  NETWORK ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* Facility & Role Selectors (Context Switcher) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Facility Selector */}
            <div className="relative">
              <button
                id="facility-switcher-btn"
                onClick={() => {
                  setIsFacilityDropdownOpen(!isFacilityDropdownOpen);
                  setIsRoleDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 transition-all font-medium"
              >
                <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0" />
                <div className="text-left hidden md:block">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Connected Facility</div>
                  <div className="font-bold text-slate-800 truncate max-w-[150px]">{effectiveFacility.name}</div>
                </div>
                <div className="md:hidden font-bold truncate max-w-[100px] text-slate-800">
                  {(effectiveFacility.name || 'Facility').split(' ')[0]}
                </div>
                {effectiveFacility.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
                )}
              </button>

              {isFacilityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Connected Facility
                  </div>
                  <div className="space-y-1 mt-1.5 max-h-60 overflow-y-auto">
                    {effectiveFacilities.map((fac) => (
                      <button
                        key={fac.id}
                        onClick={() => {
                          selectFacility(fac);
                          setIsFacilityDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          fac.id === effectiveFacility.id 
                            ? 'bg-rose-50 text-rose-700 font-bold border border-rose-100' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold flex items-center gap-1.5 text-slate-900">
                            {fac.name}
                            {fac.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                          <div className="text-[10px] text-slate-500 capitalize">{fac.type?.replace('_', ' ')} • {fac.city}</div>
                        </div>
                        {fac.traumaLevel && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-100">
                            {fac.traumaLevel}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role Selector */}
            <div className="relative">
              <button
                id="role-switcher-btn"
                onClick={() => {
                  setIsRoleDropdownOpen(!isRoleDropdownOpen);
                  setIsFacilityDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${currentRoleConfig.color}`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">{currentRoleConfig.label}</span>
                <span className="lg:hidden">{currentRoleConfig.badge}</span>
              </button>

              {isRoleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch User Role (RBAC)
                  </div>
                  <div className="space-y-1 mt-1.5">
                    {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => {
                          selectRole(r);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          effectiveRole === r 
                            ? 'bg-slate-100 text-slate-900 font-bold' 
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{roleLabels[r].label}</div>
                          <div className="text-[10px] text-slate-500">{roleLabels[r].badge} permissions</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action: STAT Emergency Button */}
            <button
              id="stat-emergency-quick-btn"
              onClick={onOpenStatModal || (() => selectTab('emergency'))}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-lg shadow-rose-200 active:scale-95 transition-all"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span>SOS Dispatch</span>
            </button>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => selectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-100 text-rose-600 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                } ${item.highlight ? 'text-rose-600 font-bold' : ''}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'} ${item.highlight ? 'animate-bounce text-rose-600' : ''}`} />
                <span>{item.label}</span>
                {item.id === 'emergency' && hasEmergency && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
