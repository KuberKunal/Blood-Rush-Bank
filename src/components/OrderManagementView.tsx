import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Sliders, 
  ShieldAlert, 
  Plus, 
  X, 
  Building2, 
  DollarSign, 
  Boxes, 
  AlertTriangle,
  FileCheck,
  Check,
  Ban,
  ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodOrder, Facility, OrderingMode, OrderItem, BloodGroup, BloodComponent, AutoOrderRules } from '../types';
import { BLOOD_GROUPS, BLOOD_COMPONENTS } from '../data/mockData';

interface OrderManagementViewProps {
  facility: Facility;
  suppliers: Facility[];
  orders: BloodOrder[];
  autoRules: AutoOrderRules;
  onUpdateAutoRules: (rules: AutoOrderRules) => void;
  onCreateOrder: (order: BloodOrder) => void;
  onApproveOrder: (orderId: string, approverName: string) => void;
  onRejectOrder: (orderId: string, reason: string) => void;
}

export const OrderManagementView: React.FC<OrderManagementViewProps> = ({
  facility,
  suppliers,
  orders,
  autoRules,
  onUpdateAutoRules,
  onCreateOrder,
  onApproveOrder,
  onRejectOrder
}) => {
  const [activeModeTab, setActiveModeTab] = useState<OrderingMode | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  
  // New order form state
  const [newOrderMode, setNewOrderMode] = useState<OrderingMode>('manual');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || 'fac-central-bank');
  const [orderItems, setOrderItems] = useState<Array<{ bloodGroup: BloodGroup; component: BloodComponent; units: number; unitPrice: number; urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' }>>([
    { bloodGroup: 'O-', component: 'PRBC', units: 8, unitPrice: 210, urgency: 'CRITICAL' },
    { bloodGroup: 'O+', component: 'PRBC', units: 14, unitPrice: 190, urgency: 'HIGH' }
  ]);

  const facilityOrders = orders.filter(o => o.facilityId === facility.id);
  const filteredOrders = facilityOrders.filter(o => {
    if (activeModeTab === 'all') return true;
    return o.orderingMode === activeModeTab;
  });

  const handleAddItemRow = () => {
    setOrderItems(prev => [
      ...prev,
      { bloodGroup: 'A+', component: 'PRBC', units: 5, unitPrice: 190, urgency: 'NORMAL' }
    ]);
  };

  const handleRemoveItemRow = (idx: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateItemRow = (idx: number, field: string, val: any) => {
    setOrderItems(prev => prev.map((item, i) => {
      if (i === idx) return { ...item, [field]: val };
      return item;
    }));
  };

  const handleGenerateAIDraftOrder = () => {
    setNewOrderMode('ai_draft');
    setOrderItems([
      { bloodGroup: 'O-', component: 'PRBC', units: 8, unitPrice: 210, urgency: 'CRITICAL' },
      { bloodGroup: 'O+', component: 'PRBC', units: 15, unitPrice: 190, urgency: 'HIGH' },
      { bloodGroup: 'A+', component: 'Platelets', units: 6, unitPrice: 240, urgency: 'HIGH' },
      { bloodGroup: 'B+', component: 'FFP', units: 5, unitPrice: 150, urgency: 'NORMAL' },
      { bloodGroup: 'AB-', component: 'Platelets', units: 3, unitPrice: 240, urgency: 'HIGH' }
    ]);
  };

  const handleSaveNewOrder = () => {
    const totalUnits = orderItems.reduce((acc, item) => acc + item.units, 0);
    const totalCost = orderItems.reduce((acc, item) => acc + (item.units * item.unitPrice), 0);
    const targetSupplier = suppliers.find(s => s.id === selectedSupplierId) || suppliers[0] || { id: 'fac-central-bank', name: 'City Central Blood Center' };

    const isAutoApproved = newOrderMode === 'controlled_auto' && 
      totalCost <= autoRules.maxBudgetMonthly && 
      totalUnits <= autoRules.requiresApprovalIfUnitsExceed;

    const newOrder: BloodOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-W${Math.floor(Math.random() * 40) + 10}-${Math.floor(Math.random() * 90) + 10}`,
      facilityId: facility?.id || 'fac-active',
      facilityName: facility?.name || 'Local Hospital Facility',
      supplierFacilityId: targetSupplier.id,
      supplierFacilityName: targetSupplier.name,
      orderingMode: newOrderMode,
      items: orderItems.map((item, idx) => ({
        id: `item-${Date.now()}-${idx}`,
        ...item,
        totalCost: item.units * item.unitPrice
      })),
      totalUnits,
      totalCost,
      status: isAutoApproved ? 'approved' : 'pending_approval',
      autoApproved: isAutoApproved,
      aiRationale: newOrderMode === 'controlled_auto'
        ? `Autonomous replenishment triggered under hospital rule set (Budget cap: $${autoRules.maxBudgetMonthly}).`
        : newOrderMode === 'ai_draft'
        ? `AI weekly bundle configured from 7-day shortage predictions and scheduled surgeries.`
        : `Manual requisition configured by inventory director.`,
      complianceFlags: [
        `Supplier: ${targetSupplier.name} (Verified)`,
        `Budget check: $${totalCost} / $${autoRules.maxBudgetMonthly}`
      ],
      createdAt: new Date().toISOString()
    };

    onCreateOrder(newOrder);
    setShowCreateModal(false);
  };

  const handleApproveWithCelebration = (orderId: string) => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 }
    });
    onApproveOrder(orderId, 'Dr. Evelyn Hayes (Inventory Director)');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ArrowRightLeft className="w-6 h-6 text-rose-600" />
              Weekly Ordering & Autonomous Replenishment
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Supporting Manual, AI-Drafted, and Controlled Automatic Ordering within hospital compliance ceilings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="configure-auto-rules-btn"
            onClick={() => setShowRulesModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors"
          >
            <Sliders className="w-4 h-4 text-indigo-600" />
            <span>Autonomous Rules & Limits</span>
          </button>

          <button
            id="create-new-order-btn"
            onClick={() => {
              setShowCreateModal(true);
              setNewOrderMode('manual');
            }}
            className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-200 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Weekly Order</span>
          </button>
        </div>
      </div>

      {/* 3 Ordering Modes Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Mode 1: Manual */}
        <div 
          onClick={() => setActiveModeTab('manual')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeModeTab === 'manual' 
              ? 'bg-indigo-50/40 border-indigo-500 ring-2 ring-indigo-500/20 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase border border-indigo-100">
              Mode 1
            </span>
            <span className="text-xs text-slate-400 font-semibold">Human Managed</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Manual Ordering</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            AI provides shortage suggestions and surgical reservations, but hospital staff manually build, adjust, and submit the order.
          </p>
        </div>

        {/* Mode 2: AI Draft */}
        <div 
          onClick={() => setActiveModeTab('ai_draft')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeModeTab === 'ai_draft' 
              ? 'bg-rose-50/40 border-rose-500 ring-2 ring-rose-500/20 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold text-[10px] uppercase border border-rose-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Mode 2
            </span>
            <span className="text-xs text-slate-400 font-semibold">AI Assisted</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">AI Draft Ordering</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            AI synthesizes demand and prepares an optimized order draft bundle. Staff can edit quantities, approve, or reject.
          </p>
        </div>

        {/* Mode 3: Controlled Auto */}
        <div 
          onClick={() => setActiveModeTab('controlled_auto')}
          className={`p-5 rounded-3xl border cursor-pointer transition-all ${
            activeModeTab === 'controlled_auto' 
              ? 'bg-emerald-50/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-100">
              Mode 3
            </span>
            <span className="text-xs text-emerald-600 font-bold">Autonomous Guardrails</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900">Controlled Automatic Ordering</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            AI auto-orders within strict hospital rules (Max ${autoRules.maxBudgetMonthly} budget, verified suppliers, safety limits). High-volume orders require human sign-off.
          </p>
        </div>

      </div>

      {/* Mode Filter Tab Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveModeTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeModeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
          }`}
        >
          All Orders ({facilityOrders.length})
        </button>
        <button
          onClick={() => setActiveModeTab('manual')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeModeTab === 'manual' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
          }`}
        >
          Manual Mode
        </button>
        <button
          onClick={() => setActiveModeTab('ai_draft')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeModeTab === 'ai_draft' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
          }`}
        >
          AI Draft Mode
        </button>
        <button
          onClick={() => setActiveModeTab('controlled_auto')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            activeModeTab === 'controlled_auto' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 bg-slate-100'
          }`}
        >
          Controlled Auto Mode
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="py-3.5 px-4">Order # & Date</th>
                <th className="py-3.5 px-4">Supplier Blood Bank</th>
                <th className="py-3.5 px-4">Mode & Rationale</th>
                <th className="py-3.5 px-4">Requested Products</th>
                <th className="py-3.5 px-4">Units & Cost</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No orders matching this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Order # */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900">{order.orderNumber}</div>
                        <div className="text-[10px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </td>

                      {/* Supplier */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{order.supplierFacilityName}</div>
                        <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Tier-1 Supplier
                        </div>
                      </td>

                      {/* Mode & AI Rationale */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.orderingMode === 'controlled_auto' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          order.orderingMode === 'ai_draft' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          'bg-indigo-50 text-indigo-700 border border-indigo-100'
                        }`}>
                          {order.orderingMode.replace('_', ' ')}
                        </span>
                        <div className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                          {order.aiRationale}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {order.items.map((it, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono font-semibold text-slate-700">
                              <strong className="text-rose-600 font-bold">{it.units}x</strong> {it.bloodGroup} {it.component}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Units & Total */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-mono">{order.totalUnits} units</div>
                        <div className="text-xs font-mono font-bold text-emerald-700">${order.totalCost.toLocaleString()}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {order.status === 'pending_approval' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-[10px] font-bold">
                            Pending Human Sign-off
                          </span>
                        )}
                        {order.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
                            Approved & Queued
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-100 text-[10px] font-bold">
                            Delivered & Stocked
                          </span>
                        )}
                        {order.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-[10px] font-bold">
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {order.status === 'pending_approval' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              id={`approve-order-${order.id}`}
                              onClick={() => handleApproveWithCelebration(order.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-all shadow-md shadow-emerald-100 active:scale-95"
                              title="Approve Order"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              id={`reject-order-${order.id}`}
                              onClick={() => onRejectOrder(order.id, 'Quantity exceeds standard shift intake capacity.')}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                              title="Reject Order"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono font-medium">
                            {order.humanApprover || (order.autoApproved ? 'Auto-Signed' : 'Completed')}
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-rose-600" />
                Configure New Weekly Blood Requisition
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode selection buttons */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Select Ordering Method:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setNewOrderMode('manual')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    newOrderMode === 'manual' ? 'bg-indigo-50 text-indigo-700 border-indigo-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  1. Manual
                </button>
                <button
                  type="button"
                  onClick={handleGenerateAIDraftOrder}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    newOrderMode === 'ai_draft' ? 'bg-rose-50 text-rose-700 border-rose-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  2. AI Draft
                </button>
                <button
                  type="button"
                  onClick={() => setNewOrderMode('controlled_auto')}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    newOrderMode === 'controlled_auto' ? 'bg-emerald-50 text-emerald-700 border-emerald-500 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  3. Controlled Auto
                </button>
              </div>
            </div>

            {/* Supplier selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Approved Blood Supplier Facility:</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-rose-500 font-medium"
              >
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>

            {/* Items Editor */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Requisition Items:</label>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="text-xs text-rose-600 hover:text-rose-700 font-bold"
                >
                  + Add Product Row
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <select
                      value={item.bloodGroup}
                      onChange={(e) => handleUpdateItemRow(idx, 'bloodGroup', e.target.value as BloodGroup)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-bold"
                    >
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>

                    <select
                      value={item.component}
                      onChange={(e) => handleUpdateItemRow(idx, 'component', e.target.value as BloodComponent)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-medium"
                    >
                      {BLOOD_COMPONENTS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 font-medium">Units:</span>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={item.units}
                        onChange={(e) => handleUpdateItemRow(idx, 'units', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 font-mono font-bold"
                      />
                    </div>

                    <div className="text-xs font-mono text-emerald-700 font-bold ml-auto">
                      ${item.units * item.unitPrice}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItemRow(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Total & Rationale summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-600 font-medium">Total Units: <strong className="text-slate-900 font-mono font-bold">{orderItems.reduce((a, b) => a + b.units, 0)}</strong></div>
                <div className="text-[11px] text-slate-500">Within $10,000 Hospital Budget Ceiling</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Estimated Total</div>
                <div className="text-xl font-black text-emerald-700 font-mono">
                  ${orderItems.reduce((a, b) => a + (b.units * b.unitPrice), 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Modal actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                id="submit-order-btn"
                type="button"
                onClick={handleSaveNewOrder}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-200 transition-all"
              >
                Submit Requisition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Autonomous Guardrails Configuration Modal */}
      {showRulesModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                Controlled Autonomous Ordering Rules
              </h3>
              <button onClick={() => setShowRulesModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Set hospital parameters that limit the AI's autonomous purchasing power. Orders exceeding these caps require explicit human authorization.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Monthly Requisition Budget Ceiling ($):</label>
                <input
                  type="number"
                  value={autoRules.maxBudgetMonthly}
                  onChange={(e) => onUpdateAutoRules({ ...autoRules, maxBudgetMonthly: parseInt(e.target.value) || 5000 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Max Auto-Order Units Per Request:</label>
                <input
                  type="number"
                  value={autoRules.maxUnitsPerOrder}
                  onChange={(e) => onUpdateAutoRules({ ...autoRules, maxUnitsPerOrder: parseInt(e.target.value) || 20 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Mandatory Human Sign-off If Units Exceed:</label>
                <input
                  type="number"
                  value={autoRules.requiresApprovalIfUnitsExceed}
                  onChange={(e) => onUpdateAutoRules({ ...autoRules, requiresApprovalIfUnitsExceed: parseInt(e.target.value) || 30 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRulesModal(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-100"
              >
                Save Guardrail Policies
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
