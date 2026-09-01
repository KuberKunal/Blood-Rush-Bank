import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MapPin, 
  Clock, 
  Truck, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Flame, 
  Building2, 
  ThermometerSnowflake, 
  Lock, 
  KeyRound, 
  XCircle, 
  Check, 
  Sparkles,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmergencyRequest, Facility, BloodGroup, BloodComponent, FacilityMatchResponse } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPONENTS, COMPATIBILITY_RULES } from '../data/mockData';

interface EmergencyCoordinatorProps {
  currentFacility: Facility;
  allFacilities: Facility[];
  requests: EmergencyRequest[];
  onCreateEmergencyRequest: (req: EmergencyRequest) => void;
  onUpdateEmergencyStatus: (requestId: string, status: any, updateData?: any) => void;
  onSimulateResponder: (requestId: string, facilityId: string, action: 'accept_full' | 'accept_partial' | 'reject', units?: number, reason?: string) => void;
}

export const EmergencyCoordinator: React.FC<EmergencyCoordinatorProps> = ({
  currentFacility,
  allFacilities,
  requests,
  onCreateEmergencyRequest,
  onUpdateEmergencyStatus,
  onSimulateResponder
}) => {
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(requests[0] || null);
  const [handoverPinInput, setHandoverPinInput] = useState('');
  const [isHandoverSuccess, setIsHandoverSuccess] = useState(false);

  // Form for initiating new STAT request
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(4);
  const [patientDiagnosis, setPatientDiagnosis] = useState<string>('Massive trauma resuscitation in ER Resuscitation Bay');
  const [patientRoom, setPatientRoom] = useState<string>('Trauma Bay 1 (STAT)');

  const activeRequests = requests.filter(r => r.status !== 'delivered' && r.status !== 'cancelled');

  useEffect(() => {
    if (requests.length > 0 && !selectedRequest) {
      setSelectedRequest(requests[0]);
    }
  }, [requests, selectedRequest]);

  const handleBroadcastSTAT = () => {
    // Search nearby verified facilities
    const matched: FacilityMatchResponse[] = allFacilities
      .filter(f => f.id !== currentFacility.id && f.verified)
      .map(f => {
        const avail = f.availableStockSummary[bloodGroup] || 0;
        const dist = f.distanceFromActiveFacility || 8.5;
        const eta = f.etaMinutes || 18;
        return {
          facilityId: f.id,
          facilityName: f.name,
          distanceKm: dist,
          etaMins: eta,
          availableUnits: avail,
          status: 'pending' as const
        };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);

    const randomPin = `BR-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReq: EmergencyRequest = {
      id: `emg-${Date.now()}`,
      requesterFacilityId: currentFacility?.id || 'fac-active',
      requesterFacilityName: currentFacility?.name || 'Hospital Emergency Center',
      targetBloodGroup: bloodGroup,
      targetComponent: component,
      unitsRequested: unitsNeeded,
      unitsAllocated: 0,
      urgency: 'CRITICAL_STAT',
      patientDiagnosis: patientDiagnosis.trim() || 'STAT Critical Transfusion',
      patientRoom: patientRoom.trim() || 'Trauma Resuscitation Center',
      status: 'broadcasting',
      temperatureTarget: { min: 2.0, max: 6.0 },
      currentTransitTemp: 4.0,
      createdAt: new Date().toISOString(),
      estimatedArrivalMins: 15,
      courierVehicle: 'Rapid Response Bio-Courier (Priority Green Corridor)',
      handoverCode: randomPin,
      matchedFacilities: matched,
      dispatchLog: [
        {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'STAT Broadcast Transmitted',
          description: `Emergency neural request broadcasted to ${matched.length} nearby verified facilities.`,
          temperatureC: 4.0,
          courierLocation: currentFacility?.name || 'Hospital Emergency Center',
          completed: true
        }
      ]
    };

    onCreateEmergencyRequest(newReq);
    setSelectedRequest(newReq);
  };

  const handleVerifyHandover = () => {
    if (selectedRequest && handoverPinInput.trim().toUpperCase() === selectedRequest.handoverCode.toUpperCase()) {
      setIsHandoverSuccess(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onUpdateEmergencyStatus(selectedRequest.id, 'delivered');
    } else {
      alert("Invalid Handover Code. Please verify the physical PIN on the courier's digital seal.");
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Radio className="w-6 h-6 text-rose-600 animate-pulse" />
              Emergency Blood Coordination & Proximity Radar
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time proximity search, multi-facility emergency broadcasting, and cold-chain GPS dispatch tracking.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
            Zero Emergency Request Fees Guaranteed
          </span>
        </div>
      </div>

      {/* Main 2-Column Layout: Broadcast Creator & Live Dispatch Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): Broadcast STAT Request Form */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-600" />
                Initiate STAT Emergency Broadcast
              </h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-bold uppercase shadow-sm animate-pulse">
                STAT Priority
              </span>
            </div>

            {/* Blood Group & Component Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Required Blood Group:</label>
                <select
                  id="stat-blood-group-select"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-rose-600 focus:outline-none focus:border-rose-500 focus:bg-white"
                >
                  {BLOOD_GROUPS.map(bg => (
                    <option key={bg} value={bg}>{bg} {bg === 'O-' ? '(Universal Donor)' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Component Needed:</label>
                <select
                  id="stat-component-select"
                  value={component}
                  onChange={(e) => setComponent(e.target.value as BloodComponent)}
                  className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white"
                >
                  {BLOOD_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Units Needed */}
            <div>
              <label className="text-[11px] font-bold text-slate-700">Units Requested:</label>
              <div className="flex items-center gap-2 mt-1.5">
                {[1, 2, 4, 6, 8].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setUnitsNeeded(qty)}
                    className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      unitsNeeded === qty 
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-200' 
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {qty} Units
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Clinical Context */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Clinical Diagnosis / Indication:</label>
              <input
                id="stat-patient-diagnosis-input"
                type="text"
                placeholder="e.g. Acute hemorrhagic shock, aortic rupture"
                value={patientDiagnosis}
                onChange={(e) => setPatientDiagnosis(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Receiving Bay / Operating Theatre:</label>
              <input
                id="stat-patient-room-input"
                type="text"
                placeholder="e.g. Trauma Resuscitation Bay 1"
                value={patientRoom}
                onChange={(e) => setPatientRoom(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <button
              id="broadcast-stat-request-btn"
              onClick={handleBroadcastSTAT}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Broadcast Request to Nearby Facilities</span>
            </button>

          </div>

          {/* Quick List of Active Emergency Broadcasts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Active Network Broadcasts ({requests.length})
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {requests.map((req) => (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    selectedRequest?.id === req.id 
                      ? 'bg-rose-50/50 border-rose-500 ring-2 ring-rose-500/20 shadow-sm' 
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-600 text-xs">
                      {req.unitsRequested}x {req.targetBloodGroup} {req.targetComponent}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      req.status === 'in_transit' ? 'bg-amber-50 text-amber-700 border border-amber-100 animate-pulse' :
                      req.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 font-medium truncate">
                    {req.requesterFacilityName} • {req.patientDiagnosis}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (7 Cols): Live Tracking & Facility Radar Console */}
        <div className="lg:col-span-7 space-y-4">
          
          {selectedRequest ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
              
              {/* Radar Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[10px] uppercase">
                      STAT Incident #{selectedRequest.id.slice(-6)}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      Handover PIN: <strong className="text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 font-bold">{selectedRequest.handoverCode}</strong>
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {selectedRequest.unitsRequested} Units {selectedRequest.targetBloodGroup} {selectedRequest.targetComponent} for {selectedRequest.requesterFacilityName}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedRequest.patientDiagnosis} ({selectedRequest.patientRoom})</p>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Courier ETA</div>
                  <div className="text-2xl font-black text-rose-600 font-mono">
                    {selectedRequest.status === 'delivered' ? 'DELIVERED' : `~${selectedRequest.estimatedArrivalMins} mins`}
                  </div>
                </div>
              </div>

              {/* Real-Time Proximity Matcher & Responder Simulation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Navigation className="w-3.5 h-3.5 text-rose-600" />
                    Nearby Verified Facilities Radar ({selectedRequest.matchedFacilities.length} In Range)
                  </h3>
                  <span className="text-[10px] text-slate-400 font-semibold">Strict Proximity Radius</span>
                </div>

                <div className="space-y-2">
                  {selectedRequest.matchedFacilities.map((fac) => (
                    <div 
                      key={fac.facilityId}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-xs">{fac.facilityName}</span>
                          <span className="text-[10px] text-slate-500 font-medium">({fac.distanceKm} km • {fac.etaMins} mins)</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-0.5">
                          Usable Verified Stock: <strong className="text-emerald-700 font-mono font-bold">{fac.availableUnits} units</strong> {selectedRequest.targetBloodGroup}
                        </div>
                        {fac.rejectReason && (
                          <div className="text-[10px] text-rose-600 font-medium mt-0.5">Reason: {fac.rejectReason}</div>
                        )}
                      </div>

                      {/* Response Status / Simulator Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {fac.status === 'pending' ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onSimulateResponder(selectedRequest.id, fac.facilityId, 'accept_full', selectedRequest.unitsRequested)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all shadow-sm"
                            >
                              Accept Full ({selectedRequest.unitsRequested})
                            </button>
                            <button
                              onClick={() => onSimulateResponder(selectedRequest.id, fac.facilityId, 'accept_partial', 2)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100 font-bold text-[10px] transition-colors"
                            >
                              Partial (2)
                            </button>
                            <button
                              onClick={() => onSimulateResponder(selectedRequest.id, fac.facilityId, 'reject', 0, 'Locked for active ICU patient')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[10px] transition-colors"
                            >
                              Decline
                            </button>
                          </div>
                        ) : fac.status === 'accepted_full' ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Full Order Accepted ({fac.unitsOffered}u)
                          </span>
                        ) : fac.status === 'accepted_partial' ? (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold text-[10px] flex items-center gap-1">
                            <Check className="w-3 h-3 text-indigo-600" /> Partial ({fac.unitsOffered}u)
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[10px] flex items-center gap-1">
                            <XCircle className="w-3 h-3 text-rose-600" /> Declined
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold-Chain Dispatch Logs & Live Telemetry */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider">
                    <Truck className="w-3.5 h-3.5 text-cyan-600" />
                    Cold-Chain Waypoints & Telemetry
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-cyan-700 font-mono font-bold">
                    <ThermometerSnowflake className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{selectedRequest.currentTransitTemp}°C (Logged)</span>
                  </div>
                </div>

                <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {selectedRequest.dispatchLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-[10px] shrink-0 mt-0.5">
                        {log.completed ? <Check className="w-3 h-3" /> : idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{log.stage}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-medium">{log.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{log.description}</p>
                        <div className="text-[10px] text-slate-400 mt-0.5">Location: {log.courierLocation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Handover Verification Section */}
              {selectedRequest.status !== 'delivered' && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                      Hospital Dock Receipt & Handover Verification
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Enter the 6-digit seal code shown on the courier container to confirm transfer into hospital blood bank.
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      id="handover-pin-input"
                      type="text"
                      placeholder="e.g. BR-88392"
                      value={handoverPinInput}
                      onChange={(e) => setHandoverPinInput(e.target.value)}
                      className="w-28 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-900 text-center uppercase font-bold focus:outline-none focus:border-rose-500"
                    />
                    <button
                      id="confirm-handover-pin-btn"
                      onClick={handleVerifyHandover}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md shadow-emerald-100"
                    >
                      Verify PIN
                    </button>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'delivered' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Handover Completed & Verified. All units successfully transferred into hospital emergency stock.</span>
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center text-slate-400 font-medium shadow-sm">
              Select or initiate an emergency request to view live proximity tracking and courier dispatch.
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
