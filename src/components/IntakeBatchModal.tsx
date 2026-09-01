import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Boxes, 
  ThermometerSnowflake, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodUnit, Facility, BloodGroup, BloodComponent } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPONENTS, COMPONENT_DETAILS } from '../data/mockData';

interface IntakeBatchModalProps {
  facility: Facility;
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: BloodUnit) => void;
}

export const IntakeBatchModal: React.FC<IntakeBatchModalProps> = ({
  facility,
  isOpen,
  onClose,
  onAddUnit
}) => {
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O-');
  const [component, setComponent] = useState<BloodComponent>('PRBC');
  const [volumeMl, setVolumeMl] = useState<number>(350);
  const [quantity, setQuantity] = useState<number>(1);
  const [testedViralMarkers, setTestedViralMarkers] = useState<boolean>(true);
  const [leukoreduced, setLeukoreduced] = useState<boolean>(true);
  const [storageUnit, setStorageUnit] = useState<string>('Vault 1 - Shelf A');
  const [temperatureC, setTemperatureC] = useState<number>(3.8);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const shelfLifeDays = COMPONENT_DETAILS[component].shelfLifeDays;
    const now = new Date();
    const expiryDateObj = new Date();
    expiryDateObj.setDate(now.getDate() + shelfLifeDays);

    const collectionDateStr = now.toISOString().slice(0, 10);
    const expiryDateStr = expiryDateObj.toISOString().slice(0, 10);

    for (let i = 0; i < quantity; i++) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newUnit: BloodUnit = {
        id: `unit-${Date.now()}-${i}`,
        facilityId: facility.id,
        bloodGroup,
        component,
        batchNumber: `BAT-${now.getFullYear()}-${bloodGroup.replace(/[\+\-]/g, '')}-${randomSuffix}`,
        donorCode: `DNR-VOL-${Math.floor(10000 + Math.random() * 90000)}`,
        collectionDate: collectionDateStr,
        expiryDate: expiryDateStr,
        daysToExpiry: shelfLifeDays,
        volumeMl,
        status: testedViralMarkers ? 'usable' : 'quarantined',
        storageUnit,
        temperatureC,
        testedViralMarkers,
        leukoreduced,
        irradiated: false
      };

      onAddUnit(newUnit);
    }

    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Boxes className="w-5 h-5 text-rose-600" />
            Intake & Register Blood Batch
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Blood Group (ABO/Rh):</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-black text-rose-600 focus:outline-none focus:border-rose-500 focus:bg-white"
              >
                {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Component Type:</label>
              <select
                value={component}
                onChange={(e) => {
                  const comp = e.target.value as BloodComponent;
                  setComponent(comp);
                  if (comp === 'Platelets') {
                    setStorageUnit('Agitator Incubator #2');
                    setTemperatureC(22.0);
                  } else if (comp === 'FFP' || comp === 'Cryoprecipitate') {
                    setStorageUnit('Sub-Zero Vault -20°C');
                    setTemperatureC(-19.5);
                  } else {
                    setStorageUnit('Cold Vault 1 - Shelf A');
                    setTemperatureC(3.8);
                  }
                }}
                className="w-full mt-1 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-rose-500 focus:bg-white"
              >
                {BLOOD_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Volume Per Unit (ml):</label>
              <input
                type="number"
                value={volumeMl}
                onChange={(e) => setVolumeMl(parseInt(e.target.value) || 350)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Number of Units:</label>
              <input
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700">Assigned Storage Vault:</label>
              <input
                type="text"
                value={storageUnit}
                onChange={(e) => setStorageUnit(e.target.value)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700">Target Temp (°C):</label>
              <input
                type="number"
                step="0.1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(parseFloat(e.target.value) || 4.0)}
                className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-cyan-700 focus:outline-none focus:border-rose-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Biological Verification Checkboxes */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-800">
              <input
                type="checkbox"
                checked={testedViralMarkers}
                onChange={(e) => setTestedViralMarkers(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-0 w-4 h-4"
              />
              <span className="font-bold">Viral & Transfusion Transmissible Infections (TTI) Cleared</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={leukoreduced}
                onChange={(e) => setLeukoreduced(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-0 w-4 h-4"
              />
              <span className="font-medium">Leukoreduction filtration completed</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-intake-batch-btn"
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-200 transition-all"
            >
              Complete Batch Intake ({quantity} {quantity === 1 ? 'Unit' : 'Units'})
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
