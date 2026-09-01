import React from 'react';
import { 
  Activity, 
  Flame, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ShieldAlert, 
  Boxes, 
  ArrowUpRight, 
  Sparkles, 
  Radio, 
  ThermometerSnowflake, 
  CheckCircle2, 
  Calendar, 
  Truck,
  HelpCircle,
  Zap,
  MapPin,
  Trophy,
  Award,
  HeartHandshake,
  UserPlus
} from 'lucide-react';
import { BloodUnit, Facility, ScheduledSurgery, EmergencyRequest, BloodGroup, BloodComponent } from '../types';
import { BLOOD_GROUPS, COMPONENT_DETAILS } from '../data/mockData';

interface DashboardOverviewProps {
  facility: Facility;
  units: BloodUnit[];
  surgeries: ScheduledSurgery[];
  activeEmergency?: EmergencyRequest;
  onNavigateTab: (tab: string) => void;
  onOpenStatModal: () => void;
  onOpenIntakeModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  facility,
  units,
  surgeries,
  activeEmergency,
  onNavigateTab,
  onOpenStatModal,
  onOpenIntakeModal
}) => {
  // Compute counts for active facility
  const facilityUnits = units.filter(u => u.facilityId === facility.id);
  const usableUnits = facilityUnits.filter(u => u.status === 'usable');
  const reservedUnits = facilityUnits.filter(u => u.status === 'reserved');
  const quarantinedUnits = facilityUnits.filter(u => u.status === 'quarantined');
  const expiringSoonUnits = facilityUnits.filter(u => u.status === 'usable' && u.daysToExpiry <= 3);

  // Group counts by blood group
  const bloodGroupCounts: Record<BloodGroup, { usable: number; reserved: number; status: 'critical' | 'low' | 'good' | 'surplus' }> = {
    'O-': { usable: 0, reserved: 0, status: 'critical' },
    'O+': { usable: 0, reserved: 0, status: 'good' },
    'A-': { usable: 0, reserved: 0, status: 'low' },
    'A+': { usable: 0, reserved: 0, status: 'good' },
    'B-': { usable: 0, reserved: 0, status: 'low' },
    'B+': { usable: 0, reserved: 0, status: 'good' },
    'AB-': { usable: 0, reserved: 0, status: 'critical' },
    'AB+': { usable: 0, reserved: 0, status: 'good' }
  };

  BLOOD_GROUPS.forEach(bg => {
    const bgUsable = facilityUnits.filter(u => u.bloodGroup === bg && u.status === 'usable').length;
    const bgReserved = facilityUnits.filter(u => u.bloodGroup === bg && u.status === 'reserved').length;
    let status: 'critical' | 'low' | 'good' | 'surplus' = 'good';
    if (bgUsable <= 3) status = 'critical';
    else if (bgUsable <= 6) status = 'low';
    else if (bgUsable > 20) status = 'surplus';

    bloodGroupCounts[bg] = { usable: bgUsable, reserved: bgReserved, status };
  });

  // Component breakdown
  const componentStats: Record<BloodComponent, number> = {
    PRBC: facilityUnits.filter(u => u.component === 'PRBC' && u.status === 'usable').length,
    Platelets: facilityUnits.filter(u => u.component === 'Platelets' && u.status === 'usable').length,
    FFP: facilityUnits.filter(u => u.component === 'FFP' && u.status === 'usable').length,
    Cryoprecipitate: facilityUnits.filter(u => u.component === 'Cryoprecipitate' && u.status === 'usable').length,
    WholeBlood: facilityUnits.filter(u => u.component === 'WholeBlood' && u.status === 'usable').length
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / AI Alert Broadcast */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-full border border-rose-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                AI Proactive Inventory Alert
              </span>
              <span className="text-xs text-slate-400">• Real-Time Neural Demand Engine</span>
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {facility.name} <span className="text-slate-500 font-medium">Blood Command Center</span>
            </h1>
            
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              <strong className="text-rose-600 font-bold">Critical Shortage Alert:</strong> Hospital A may face an O-positive shortage within five days. Predicted demand is <span className="font-bold text-slate-900">20 units</span>. Recommended order is <span className="text-rose-600 font-bold">17 units</span> including safety stock.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              id="dash-emergency-btn"
              onClick={onOpenStatModal}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-200 active:scale-95 transition-all"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>SOS Emergency Broadcast</span>
            </button>

            <button
              id="dash-forecast-btn"
              onClick={() => onNavigateTab('forecast')}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>AI Demand Forecast</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: O-Negative Critical Stock */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">O-Negative Stock</span>
          <div className="flex items-end gap-2 my-2">
            <span className="text-3xl font-black text-rose-600">04</span>
            <span className="text-slate-400 text-xs mb-1 uppercase font-bold">Units (STAT Alert)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full">
            <div className="h-1.5 w-1/4 bg-rose-600 rounded-full" />
          </div>
        </div>

        {/* Metric 2: Total Usable Units */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Usable Stock</span>
          <div className="flex items-end gap-2 my-2">
            <span className="text-3xl font-black text-slate-900">{usableUnits.length}</span>
            <span className="text-slate-400 text-xs mb-1 uppercase font-bold">Available Units</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full">
            <div className="h-1.5 w-4/5 bg-blue-500 rounded-full" />
          </div>
        </div>

        {/* Metric 3: Surgical Reservations & Active Requests */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Reservations</span>
          <div className="flex items-end gap-2 my-2">
            <span className="text-3xl font-black text-amber-500">{reservedUnits.length}</span>
            <span className="text-slate-400 text-xs mb-1 uppercase font-bold">{surgeries.length} Surgeries</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full">
            <div className="h-1.5 w-2/5 bg-amber-500 rounded-full" />
          </div>
        </div>

        {/* Metric 4: Expiry Alerts / Cold Chain */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cold-Chain & Expiry</span>
          <div className="flex items-end gap-2 my-2">
            <span className="text-3xl font-black text-slate-900">{expiringSoonUnits.length}</span>
            <span className="text-slate-400 text-xs mb-1 uppercase font-bold">&lt; 72h • 3.9°C Safe</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full">
            <div className="h-1.5 w-1/2 bg-slate-800 rounded-full" />
          </div>
        </div>

      </div>

      {/* Active Live Emergency Dispatch Radar (If active) */}
      {activeEmergency && (
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-rose-900/50">
                <Truck className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider">
                    Live Cold-Chain Dispatch
                  </span>
                  <span className="text-xs text-slate-300">Security PIN: <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">{activeEmergency.handoverCode}</strong></span>
                </div>
                <h3 className="text-base font-bold text-white mt-1.5">
                  {activeEmergency.unitsRequested} Units of {activeEmergency.targetBloodGroup} {activeEmergency.targetComponent} en route from {activeEmergency.matchedFacilities[0]?.facilityName}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Courier: {activeEmergency.courierVehicle} • Current Temp: <strong className="text-cyan-400 font-mono">{activeEmergency.currentTransitTemp}°C</strong> (Tolerance 2.0–6.0°C)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 px-5 py-3.5 rounded-2xl border border-white/10">
              <div className="text-center">
                <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Arrival</div>
                <div className="text-2xl font-black text-rose-400 font-mono">~{activeEmergency.estimatedArrivalMins} mins</div>
              </div>
              <button
                id="open-emergency-tracker-btn"
                onClick={() => onNavigateTab('emergency')}
                className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-900/40"
              >
                Track Live Map →
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Blood Group Matrix Grid (8 Blood Groups) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              Blood Group Inventory Matrix
            </h2>
            <p className="text-xs text-slate-500">Real-time telemetry across all 8 ABO/Rh blood groups at {facility.name}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-rose-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical (&le;3)
            </span>
            <span className="flex items-center gap-1.5 text-amber-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Low (4-6)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Optimal (&gt;6)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {BLOOD_GROUPS.map((bg) => {
            const data = bloodGroupCounts[bg];
            const isUniversalDonor = bg === 'O-';
            const isUniversalRecipient = bg === 'AB+';

            return (
              <div
                key={bg}
                id={`bg-card-${bg}`}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  data.status === 'critical'
                    ? 'bg-rose-50 border-rose-200'
                    : data.status === 'low'
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/60'
                }`}
              >
                {isUniversalDonor && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                    Univ Donor
                  </span>
                )}
                {isUniversalRecipient && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white">
                    Univ Recip
                  </span>
                )}

                <div className="text-xl font-black text-slate-900">{bg}</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">Blood Group</div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className={`text-2xl font-black font-mono ${
                      data.status === 'critical' ? 'text-rose-600' :
                      data.status === 'low' ? 'text-amber-600' : 'text-slate-800'
                    }`}>
                      {data.usable}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1 font-semibold">avail</span>
                  </div>
                  {data.reserved > 0 && (
                    <span className="text-[10px] text-indigo-600 font-bold font-mono bg-indigo-50 px-1 rounded">
                      +{data.reserved} res
                    </span>
                  )}
                </div>

                {/* Mini progress bar */}
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      data.status === 'critical' ? 'bg-rose-600' :
                      data.status === 'low' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, (data.usable / 15) * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donor Recognition & Community Hero Spotlight */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 text-rose-300 text-xs font-bold rounded-full border border-white/20 flex items-center gap-1.5 backdrop-blur-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Gamified Donor Recognition Program
              </span>
              <span className="text-xs text-slate-400">• Civic Lifesaver Network</span>
            </div>
            
            <h2 className="text-xl font-bold tracking-tight text-white">
              Civic Heroes & Rare Phenotype Community Recognition
            </h2>
            
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Honoring consistent donors, rare antigen specialists, and community ambassadors. Donors earn XP, unlock milestone badges, and climb regional hospital leaderboards.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-right pr-2">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Active Lifesaver</div>
              <div className="text-sm font-bold text-amber-400">Alex Mercer • Gold Sentinel</div>
              <div className="text-[11px] font-mono text-slate-300">2,850 XP • Rank #4 SF</div>
            </div>

            <button
              id="dash-view-rewards-btn"
              onClick={() => onNavigateTab('rewards')}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-900/50 active:scale-95 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Explore Donor Rewards & Leaderboard →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Component Breakdown & Scheduled Surgeries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Component Distribution (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Boxes className="w-5 h-5 text-rose-600" />
                Component Separation & Biological Expiry
              </h3>
              <p className="text-xs text-slate-500">Each cellular & plasma product strictly managed under FDA biological stability rules</p>
            </div>
            <button
              id="dash-add-unit-btn"
              onClick={onOpenIntakeModal}
              className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
            >
              + Intake Batch
            </button>
          </div>

          <div className="space-y-3">
            {/* PRBC */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 font-black text-xs">
                  RBC
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{COMPONENT_DETAILS.PRBC.fullName}</div>
                  <div className="text-[11px] text-slate-500">
                    Shelf Life: <strong className="text-slate-800">42 Days</strong> • Temp: <strong className="text-slate-800">{COMPONENT_DETAILS.PRBC.tempRange}</strong>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900 font-mono">{componentStats.PRBC} <span className="text-xs text-slate-400 font-normal">units</span></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">Optimal</span>
              </div>
            </div>

            {/* Platelets */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-black text-xs">
                  PLT
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{COMPONENT_DETAILS.Platelets.fullName}</div>
                  <div className="text-[11px] text-amber-800">
                    Shelf Life: <strong className="font-bold text-amber-900">5 Days (Strict)</strong> • Temp: 20-24°C Agitated
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-amber-700 font-mono">{componentStats.Platelets} <span className="text-xs text-slate-400 font-normal">units</span></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-200">5-Day Expiry</span>
              </div>
            </div>

            {/* FFP */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs">
                  FFP
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{COMPONENT_DETAILS.FFP.fullName}</div>
                  <div className="text-[11px] text-slate-500">
                    Shelf Life: <strong className="text-slate-800">1 Year (365 Days)</strong> • Temp: &le; -18°C Frozen
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900 font-mono">{componentStats.FFP} <span className="text-xs text-slate-400 font-normal">units</span></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">Stable Buffer</span>
              </div>
            </div>

            {/* Cryoprecipitate */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs">
                  CRYO
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{COMPONENT_DETAILS.Cryoprecipitate.fullName}</div>
                  <div className="text-[11px] text-slate-500">
                    Shelf Life: <strong className="text-slate-800">1 Year</strong> • Concentrated Coagulation Factors
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900 font-mono">{componentStats.Cryoprecipitate} <span className="text-xs text-slate-400 font-normal">units</span></div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">Optimal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduled Surgeries & Reservations (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-rose-600" />
                Surgical Demand Queue
              </h3>
              <p className="text-xs text-slate-500">Cross-matched units reserved for procedures</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
              {surgeries.length} Slated
            </span>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {surgeries.map((surg) => (
              <div 
                key={surg.id} 
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900">{surg.procedure}</div>
                    <div className="text-[10px] text-slate-500">{surg.department} • {surg.surgeon}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    surg.riskLevel === 'High Blood Loss' 
                      ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {surg.riskLevel}
                  </span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">{surg.scheduledDate}</span>
                  <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-100">
                    {surg.unitsReserved} units {surg.requiredBloodGroup} {surg.requiredComponent}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs flex items-center gap-3">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-slate-300 text-[11px] leading-relaxed">
              Neural demand model automatically reserves slated surgery units when calculating replenishment drafts.
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
