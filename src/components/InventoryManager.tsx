import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  Search, 
  Filter, 
  Plus, 
  Clock, 
  ThermometerSnowflake, 
  ShieldCheck, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  Trash2, 
  Lock, 
  Unlock, 
  RefreshCw,
  Layers,
  Sparkles,
  ArrowUpDown,
  Tag,
  Check,
  X
} from 'lucide-react';
import { BloodUnit, Facility, BloodGroup, BloodComponent, StockStatus } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPONENTS, COMPONENT_DETAILS } from '../data/mockData';

interface InventoryManagerProps {
  facility: Facility;
  units: BloodUnit[];
  onAddUnit: (unit: BloodUnit) => void;
  onUpdateUnitStatus: (unitId: string, status: StockStatus, patientId?: string) => void;
  onOpenIntakeModal: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  facility,
  units,
  onAddUnit,
  onUpdateUnitStatus,
  onOpenIntakeModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string>('all');
  const [selectedComponent, setSelectedComponent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'expiry' | 'batch' | 'temp'>('expiry');
  const [reserveModalUnit, setReserveModalUnit] = useState<BloodUnit | null>(null);
  const [patientIdInput, setPatientIdInput] = useState('');

  // Filter units for active facility
  const facilityUnits = useMemo(() => {
    return units.filter(u => u.facilityId === facility.id);
  }, [units, facility.id]);

  const filteredUnits = useMemo(() => {
    return facilityUnits.filter(u => {
      const matchesSearch = 
        u.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.donorCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.storageUnit.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesBg = selectedBloodGroup === 'all' || u.bloodGroup === selectedBloodGroup;
      const matchesComp = selectedComponent === 'all' || u.component === selectedComponent;
      const matchesStatus = selectedStatus === 'all' || u.status === selectedStatus;

      return matchesSearch && matchesBg && matchesComp && matchesStatus;
    }).sort((a, b) => {
      if (sortBy === 'expiry') return a.daysToExpiry - b.daysToExpiry;
      if (sortBy === 'batch') return a.batchNumber.localeCompare(b.batchNumber);
      if (sortBy === 'temp') return a.temperatureC - b.temperatureC;
      return 0;
    });
  }, [facilityUnits, searchQuery, selectedBloodGroup, selectedComponent, selectedStatus, sortBy]);

  // Handle patient reservation
  const handleConfirmReservation = () => {
    if (reserveModalUnit && patientIdInput.trim()) {
      onUpdateUnitStatus(reserveModalUnit.id, 'reserved', patientIdInput.trim());
      setReserveModalUnit(null);
      setPatientIdInput('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Boxes className="w-6 h-6 text-rose-600" />
              Blood Inventory Matrix & FEFO Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking usable, reserved, quarantined, and expiring batches with temperature cold-chain integrity.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="intake-batch-header-btn"
            onClick={onOpenIntakeModal}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-200 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Intake / Register Batch</span>
          </button>
        </div>
      </div>

      {/* Grid: 2D Matrix Overview (Blood Group x Component) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm overflow-x-auto">
        <div className="flex items-center justify-between mb-4 min-w-[650px]">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-600" />
              2D Component Availability Matrix (Usable Units)
            </h3>
            <p className="text-[11px] text-slate-500">Strict separation of cellular & plasma products</p>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Total Batches: <strong className="text-slate-900">{facilityUnits.length}</strong>
          </div>
        </div>

        <table className="w-full text-xs text-left min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
              <th className="py-3 px-3.5 rounded-l-xl">Blood Group</th>
              <th className="py-3 px-3.5">PRBC (Red Cells)</th>
              <th className="py-3 px-3.5">Platelets (5-Day Max)</th>
              <th className="py-3 px-3.5">FFP (Frozen Plasma)</th>
              <th className="py-3 px-3.5">Cryoprecipitate</th>
              <th className="py-3 px-3.5 text-right rounded-r-xl">Total Active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {BLOOD_GROUPS.map((bg) => {
              const prbcCount = facilityUnits.filter(u => u.bloodGroup === bg && u.component === 'PRBC' && u.status === 'usable').length;
              const pltCount = facilityUnits.filter(u => u.bloodGroup === bg && u.component === 'Platelets' && u.status === 'usable').length;
              const ffpCount = facilityUnits.filter(u => u.bloodGroup === bg && u.component === 'FFP' && u.status === 'usable').length;
              const cryoCount = facilityUnits.filter(u => u.bloodGroup === bg && u.component === 'Cryoprecipitate' && u.status === 'usable').length;
              const totalRow = prbcCount + pltCount + ffpCount + cryoCount;

              return (
                <tr key={bg} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    {bg}
                    {bg === 'O-' && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-100">Univ</span>}
                  </td>
                  
                  {/* PRBC */}
                  <td className="py-3 px-3.5">
                    <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                      prbcCount <= 2 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      prbcCount <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {prbcCount} units
                    </span>
                  </td>

                  {/* Platelets */}
                  <td className="py-3 px-3.5">
                    <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                      pltCount === 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                      pltCount <= 2 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {pltCount} units
                    </span>
                  </td>

                  {/* FFP */}
                  <td className="py-3 px-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-semibold text-xs">
                      {ffpCount} units
                    </span>
                  </td>

                  {/* Cryo */}
                  <td className="py-3 px-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-mono font-semibold text-xs">
                      {cryoCount} units
                    </span>
                  </td>

                  {/* Row Total */}
                  <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                    {totalRow}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="inventory-search-input"
              type="text"
              placeholder="Search batch #, donor code, cold vault..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
            />
          </div>

          {/* Blood Group Filter */}
          <div>
            <select
              id="filter-blood-group-select"
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="all">All Blood Groups</option>
              {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
          </div>

          {/* Component Filter */}
          <div>
            <select
              id="filter-component-select"
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="all">All Components</option>
              {BLOOD_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="usable">Usable / Available</option>
              <option value="reserved">Reserved (Pre-Op)</option>
              <option value="quarantined">Quarantined (Testing)</option>
              <option value="expired">Expired</option>
            </select>
          </div>

        </div>
      </div>

      {/* Batches Table (FEFO: First Expiry First Out) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Individual Unit Inventory ({filteredUnits.length} Units Matching)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono font-medium">
            Sorted by FEFO (First-Expiry-First-Out)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="py-3.5 px-4">Batch & Donor</th>
                <th className="py-3.5 px-4">Group & Component</th>
                <th className="py-3.5 px-4">Expiry Countdown</th>
                <th className="py-3.5 px-4">Cold Vault & Temp</th>
                <th className="py-3.5 px-4">Testing Markers</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No blood units matched your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUnits.map((unit) => {
                  const isExpiringCritical = unit.daysToExpiry <= 2 && unit.status === 'usable';
                  const isExpiringWarning = unit.daysToExpiry <= 5 && unit.status === 'usable';

                  return (
                    <tr key={unit.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Batch & Donor */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{unit.batchNumber}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{unit.donorCode} • {unit.volumeMl}ml</div>
                      </td>

                      {/* Group & Component */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-rose-600">{unit.bloodGroup}</span>
                          <span className="font-bold text-slate-800">{unit.component}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Collected: {unit.collectionDate}
                        </div>
                      </td>

                      {/* Expiry Countdown */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {isExpiringCritical ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[10px] flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {unit.daysToExpiry === 1 ? 'Expires in 24h' : `${unit.daysToExpiry} days left`}
                            </span>
                          ) : isExpiringWarning ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-bold text-[10px]">
                              {unit.daysToExpiry} days left
                            </span>
                          ) : (
                            <span className="text-slate-700 font-mono text-xs font-semibold">
                              {unit.daysToExpiry} days
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">Exp: {unit.expiryDate}</div>
                      </td>

                      {/* Storage & Temp */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 font-medium">{unit.storageUnit}</div>
                        <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                          <ThermometerSnowflake className="w-3 h-3 text-cyan-600" />
                          {unit.temperatureC}°C (Logged)
                        </div>
                      </td>

                      {/* Safety Markers */}
                      <td className="py-3.5 px-4">
                        {unit.testedViralMarkers ? (
                          <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>NAT/ELISA Cleared</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-amber-700 font-semibold text-[11px]">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Screening</span>
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400">
                          {unit.leukoreduced ? 'Leukoreduced' : 'Standard'} {unit.irradiated && '• Irradiated'}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {unit.status === 'usable' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                            Usable Stock
                          </span>
                        )}
                        {unit.status === 'reserved' && (
                          <div>
                            <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold">
                              Reserved
                            </span>
                            {unit.reservedForPatientId && (
                              <div className="text-[9px] font-mono text-indigo-600 font-bold mt-0.5">
                                {unit.reservedForPatientId}
                              </div>
                            )}
                          </div>
                        )}
                        {unit.status === 'quarantined' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
                            Quarantine
                          </span>
                        )}
                        {unit.status === 'expired' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold">
                            Expired
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {unit.status === 'usable' && (
                            <>
                              <button
                                id={`reserve-unit-${unit.id}`}
                                onClick={() => setReserveModalUnit(unit)}
                                className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 text-[10px] font-bold transition-colors"
                                title="Reserve for surgical cross-match"
                              >
                                Reserve
                              </button>
                              <button
                                id={`use-unit-${unit.id}`}
                                onClick={() => onUpdateUnitStatus(unit.id, 'discarded')}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold transition-colors"
                                title="Mark as transfused to patient"
                              >
                                Transfuse
                              </button>
                            </>
                          )}

                          {unit.status === 'reserved' && (
                            <button
                              id={`unlock-unit-${unit.id}`}
                              onClick={() => onUpdateUnitStatus(unit.id, 'usable')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-[10px] font-bold transition-colors flex items-center gap-1"
                              title="Release reservation back to usable inventory"
                            >
                              <Unlock className="w-3 h-3" />
                              Release
                            </button>
                          )}

                          {unit.status === 'quarantined' && (
                            <button
                              id={`approve-quarantine-unit-${unit.id}`}
                              onClick={() => onUpdateUnitStatus(unit.id, 'usable')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-[10px] font-bold transition-colors"
                              title="Approve viral test results & mark as usable"
                            >
                              Clear Tests
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Reservation Modal */}
      {reserveModalUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600" />
                Reserve Blood Unit for Patient
              </h3>
              <button 
                onClick={() => setReserveModalUnit(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Batch Number:</span>
                <span className="font-mono font-bold text-slate-900">{reserveModalUnit.batchNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group & Component:</span>
                <span className="font-bold text-rose-600">{reserveModalUnit.bloodGroup} {reserveModalUnit.component}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Expiry:</span>
                <span className="font-mono text-slate-700 font-semibold">{reserveModalUnit.expiryDate} ({reserveModalUnit.daysToExpiry}d remaining)</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Patient Medical Record Number (MRN) / Surgery ID:
              </label>
              <input
                id="patient-mrn-input"
                type="text"
                placeholder="e.g. PT-CARD-8841 or SURG-BAY-3"
                value={patientIdInput}
                onChange={(e) => setPatientIdInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <p className="text-[10px] text-slate-500">
                This unit will be locked from emergency general broadcast availability until released or transfused.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setReserveModalUnit(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="confirm-reservation-btn"
                onClick={handleConfirmReservation}
                disabled={!patientIdInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-all shadow-md shadow-indigo-100"
              >
                Lock Reservation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
