import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Truck, 
  ThermometerSnowflake, 
  Boxes, 
  ArrowUpRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { Facility, BloodGroup } from '../types';
import { BLOOD_GROUPS } from '../data/mockData';

interface NetworkFacilitiesViewProps {
  currentFacility: Facility;
  facilities: Facility[];
  onSelectFacility: (fac: Facility) => void;
}

export const NetworkFacilitiesView: React.FC<NetworkFacilitiesViewProps> = ({
  currentFacility,
  facilities,
  onSelectFacility
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filtered = facilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || f.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-indigo-600" />
              Connected Verified Facilities Network
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
              100% Verified Nodes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Directory of licensed hospitals, regional blood centers, and cold-chain hubs participating in peer-to-peer blood transfers.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="facility-search-input"
            type="text"
            placeholder="Search facility name, district, license..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Facilities ({facilities.length})
          </button>
          <button
            onClick={() => setFilterType('hospital')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'hospital' ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Hospitals
          </button>
          <button
            onClick={() => setFilterType('blood_bank')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'blood_bank' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Blood Banks
          </button>
        </div>
      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((fac) => {
          const isCurrent = fac.id === currentFacility.id;
          const totalStock = Object.values(fac.availableStockSummary).reduce((a: number, b: number) => a + b, 0);

          return (
            <div
              key={fac.id}
              id={`facility-card-${fac.id}`}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                isCurrent 
                  ? 'bg-white border-2 border-rose-500 shadow-md ring-4 ring-rose-500/10' 
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        fac.type === 'hospital' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        {fac.type === 'hospital' ? 'Hospital' : 'Blood Bank'}
                      </span>
                      {fac.verified && (
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1.5">{fac.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {fac.address}, {fac.city}
                    </p>
                  </div>

                  {isCurrent && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                      Active
                    </span>
                  )}
                </div>

                {/* Distance & Contact */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500 font-medium">Proximity to Active Node:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {isCurrent ? '0.0 km (Current)' : `${fac.distanceFromActiveFacility || 6.2} km (~${fac.etaMinutes || 15} mins)`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="text-slate-500 font-medium">Emergency Desk Direct:</span>
                    <span className="font-mono text-indigo-600 font-bold">{fac.phone}</span>
                  </div>
                </div>

                {/* Blood Group Stock Summary Pills */}
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                    <span>Live Stock Balance:</span>
                    <span className="font-mono font-bold text-slate-900">{totalStock} total units</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {BLOOD_GROUPS.map(bg => (
                      <div key={bg} className="p-1.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                        <div className="text-[9px] text-slate-400 font-bold">{bg}</div>
                        <div className={`text-xs font-mono font-bold ${
                          (fac.availableStockSummary[bg] || 0) <= 2 ? 'text-rose-600 font-black' : 'text-slate-800'
                        }`}>
                          {fac.availableStockSummary[bg] || 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                {!isCurrent ? (
                  <button
                    onClick={() => onSelectFacility(fac)}
                    className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Switch Command View to {fac.name.split(' ')[0]}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="text-center text-[11px] text-slate-400 font-bold py-1">
                    Currently Operating Facility Node
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
