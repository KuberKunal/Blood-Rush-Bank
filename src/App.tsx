/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { InventoryManager } from './components/InventoryManager';
import { AIForecastingView } from './components/AIForecastingView';
import { OrderManagementView } from './components/OrderManagementView';
import { EmergencyCoordinator } from './components/EmergencyCoordinator';
import { HotspotAnalysisView } from './components/HotspotAnalysisView';
import { NetworkFacilitiesView } from './components/NetworkFacilitiesView';
import { AuditComplianceView } from './components/AuditComplianceView';
import { IntakeBatchModal } from './components/IntakeBatchModal';
import { DonorRewardsView } from './components/DonorRewardsView';

import { 
  BloodUnit, 
  Facility, 
  ScheduledSurgery, 
  EmergencyRequest, 
  BloodOrder, 
  ForecastItem, 
  AuditLogEntry, 
  AccidentHotspot,
  AutoOrderRules,
  StockStatus,
  OrderingMode,
  DonorProfile,
  LeaderboardDonor,
  BloodComponent,
  BloodGroup,
  DonationHistoryRecord
} from './types';

import { 
  INITIAL_FACILITIES, 
  INITIAL_INVENTORY, 
  SCHEDULED_SURGERIES, 
  INITIAL_EMERGENCY_REQUESTS, 
  INITIAL_ORDERS, 
  INITIAL_FORECASTS, 
  ACCIDENT_HOTSPOTS, 
  INITIAL_AUDIT_LOGS,
  DEFAULT_AUTO_RULES 
} from './data/mockData';

import {
  INITIAL_DONOR_PROFILE,
  INITIAL_LEADERBOARD,
  calculateDonationPoints,
  getTierInfo,
  DONOR_TIER_CONFIGS
} from './data/donorGamificationData';

export default function App() {
  // Navigation & Facility State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeRole, setActiveRole] = useState<string>('admin');
  const [activeFacility, setActiveFacility] = useState<Facility>(INITIAL_FACILITIES[0]);
  
  // Data State
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [inventory, setInventory] = useState<BloodUnit[]>(INITIAL_INVENTORY);
  const [surgeries, setSurgeries] = useState<ScheduledSurgery[]>(SCHEDULED_SURGERIES);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(INITIAL_EMERGENCY_REQUESTS);
  const [orders, setOrders] = useState<BloodOrder[]>(INITIAL_ORDERS);
  const [forecasts, setForecasts] = useState<ForecastItem[]>(INITIAL_FORECASTS);
  const [hotspots, setHotspots] = useState<AccidentHotspot[]>(ACCIDENT_HOTSPOTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [autoRules, setAutoRules] = useState<AutoOrderRules>(DEFAULT_AUTO_RULES);

  // Gamified Donor Profile & Leaderboard State
  const [donorProfile, setDonorProfile] = useState<DonorProfile>(INITIAL_DONOR_PROFILE);
  const [leaderboard, setLeaderboard] = useState<LeaderboardDonor[]>(INITIAL_LEADERBOARD);

  // Modal & AI Forecast Loading States
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState<boolean>(false);
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<string>(
    "Hospital A may face an O-positive shortage within five days. Current usable stock is 8 units, predicted demand is 20 units and the recommended order is 17 units, including safety stock."
  );

  // Helper to log audit events
  const addAuditLog = (action: string, details: string, role = 'Hospital Blood Director') => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Dr. Evelyn Hayes',
      actorRole: role,
      action,
      facilityId: activeFacility.id,
      details,
      complianceSeal: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Add new blood unit
  const handleAddUnit = (unit: BloodUnit) => {
    setInventory(prev => [unit, ...prev]);
    addAuditLog(
      'BATCH_INTAKE',
      `Registered new blood batch ${unit.batchNumber} (${unit.bloodGroup} ${unit.component}, ${unit.volumeMl}ml). Stored at ${unit.storageUnit}.`
    );
  };

  // Update blood unit status (usable, reserved, quarantined, discarded)
  const handleUpdateUnitStatus = (unitId: string, status: StockStatus, patientId?: string) => {
    setInventory(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          status,
          reservedForPatientId: patientId || u.reservedForPatientId
        };
      }
      return u;
    }));

    const unit = inventory.find(u => u.id === unitId);
    if (unit) {
      addAuditLog(
        status === 'reserved' ? 'UNIT_RESERVED' : status === 'usable' ? 'UNIT_RELEASED' : 'STATUS_CHANGE',
        `Unit ${unit.batchNumber} (${unit.bloodGroup} ${unit.component}) transitioned to status '${status}'${patientId ? ` for patient ${patientId}` : ''}.`
      );
    }
  };

  // Trigger AI Forecast recomputation via Gemini API endpoint
  const handleRefreshForecast = async () => {
    setIsLoadingForecast(true);
    try {
      const activeFacilityUnits = inventory.filter(u => u.facilityId === activeFacility.id);
      const res = await fetch('/api/gemini/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventory: activeFacilityUnits,
          surgeries,
          facilityName: activeFacility.name
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.forecasts && data.forecasts.length > 0) {
          setForecasts(data.forecasts);
        }
        if (data.summary) {
          setAiSummary(data.summary);
        }
        addAuditLog('AI_FORECAST_GENERATED', `Executed Gemini Neural Demand Forecast model for ${activeFacility.name}.`);
      }
    } catch (err) {
      console.warn("Forecast fallback simulation triggered", err);
    } finally {
      setIsLoadingForecast(false);
    }
  };

  // Generate order directly from AI forecast
  const handleGenerateOrderFromForecast = (forecastItems: ForecastItem[]) => {
    const suppliers = facilities.filter(f => f.id !== activeFacility?.id);
    const targetSupplier = suppliers[0] || facilities[1] || facilities[0] || { id: 'fac-central-bank', name: 'City Central Blood Center' };

    const criticalItems = forecastItems.filter(f => f.recommendedOrderUnits > 0);
    const newItems = criticalItems.map((item, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      bloodGroup: item.bloodGroup,
      component: item.component,
      units: item.recommendedOrderUnits,
      unitPrice: 195,
      urgency: item.riskLevel as 'CRITICAL' | 'HIGH' | 'NORMAL',
      totalCost: item.recommendedOrderUnits * 195
    }));

    const totalUnits = newItems.reduce((acc, i) => acc + i.units, 0);
    const totalCost = newItems.reduce((acc, i) => acc + i.totalCost, 0);

    const draftOrder: BloodOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-AI-${Math.floor(100 + Math.random() * 900)}`,
      facilityId: activeFacility?.id || 'fac-active',
      facilityName: activeFacility?.name || 'Local Hospital Facility',
      supplierFacilityId: targetSupplier.id,
      supplierFacilityName: targetSupplier.name,
      orderingMode: 'ai_draft',
      items: newItems,
      totalUnits,
      totalCost,
      status: 'pending_approval',
      autoApproved: false,
      aiRationale: `Automated AI weekly draft: replenishes predicted shortage of ${criticalItems.map(c => `${c.recommendedOrderUnits}x ${c.bloodGroup}`).join(', ')} including safety stock.`,
      complianceFlags: ['Verified Supplier Tier-1', 'Approved Component Quality Check'],
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [draftOrder, ...prev]);
    setActiveTab('orders');
    addAuditLog('AI_ORDER_DRAFTED', `AI Neural engine generated weekly replenishment requisition ${draftOrder.orderNumber} for ${totalUnits} units ($${totalCost}).`);
  };

  // Create order
  const handleCreateOrder = (order: BloodOrder) => {
    setOrders(prev => [order, ...prev]);
    addAuditLog(
      order.orderingMode === 'controlled_auto' ? 'AUTONOMOUS_ORDER_EXECUTED' : 'ORDER_CREATED',
      `Requisition ${order.orderNumber} created under mode '${order.orderingMode}' for ${order.totalUnits} units.`
    );
  };

  // Approve order
  const handleApproveOrder = (orderId: string, approverName: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'approved',
          humanApprover: approverName
        };
      }
      return o;
    }));

    const order = orders.find(o => o.id === orderId);
    if (order) {
      addAuditLog('ORDER_AUTHORIZED', `Order ${order.orderNumber} approved and signed by ${approverName}.`);
    }
  };

  // Reject order
  const handleRejectOrder = (orderId: string, reason: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: 'rejected', rejectionReason: reason };
      }
      return o;
    }));

    const order = orders.find(o => o.id === orderId);
    if (order) {
      addAuditLog('ORDER_REJECTED', `Order ${order.orderNumber} rejected. Reason: ${reason}`);
    }
  };

  // Create emergency request
  const handleCreateEmergencyRequest = (req: EmergencyRequest) => {
    setEmergencyRequests(prev => [req, ...prev]);
    addAuditLog(
      'STAT_EMERGENCY_BROADCAST',
      `STAT Emergency broadcast transmitted for ${req.unitsRequested} units of ${req.targetBloodGroup} ${req.targetComponent}. Proximity radius active.`
    );
  };

  // Update emergency status
  const handleUpdateEmergencyStatus = (requestId: string, status: any) => {
    setEmergencyRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status };
      }
      return r;
    }));

    const req = emergencyRequests.find(r => r.id === requestId);
    if (req) {
      addAuditLog(
        'EMERGENCY_STATUS_UPDATED',
        `STAT Request ${req.id} transitioned to '${status}'.`
      );
    }
  };

  // Simulate responder facility actions
  const handleSimulateResponder = (
    requestId: string,
    facilityId: string,
    action: 'accept_full' | 'accept_partial' | 'reject',
    units?: number,
    reason?: string
  ) => {
    setEmergencyRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        const updatedMatches = r.matchedFacilities.map(m => {
          if (m.facilityId === facilityId) {
            return {
              ...m,
              status: action === 'accept_full' ? 'accepted_full' : action === 'accept_partial' ? 'accepted_partial' : 'rejected',
              unitsOffered: units || 0,
              rejectReason: reason
            };
          }
          return m;
        });

        const isAccepted = action === 'accept_full' || action === 'accept_partial';
        const updatedUnitsAllocated = (r.unitsAllocated || 0) + (units || 0);

        const newLogItem = isAccepted ? {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'Responder Confirmed & Dispatched',
          description: `${updatedMatches.find(m => m.facilityId === facilityId)?.facilityName} accepted ${units} units. Rapid cold-chain courier in transit.`,
          temperatureC: 3.9,
          courierLocation: 'Approaching Medical District Green Corridor',
          completed: true
        } : {
          timestamp: new Date().toLocaleTimeString(),
          stage: 'Facility Response Recorded',
          description: `${updatedMatches.find(m => m.facilityId === facilityId)?.facilityName} declined (${reason}).`,
          temperatureC: 4.0,
          courierLocation: 'N/A',
          completed: true
        };

        return {
          ...r,
          matchedFacilities: updatedMatches,
          unitsAllocated: updatedUnitsAllocated,
          status: isAccepted ? 'in_transit' : r.status,
          dispatchLog: [...r.dispatchLog, newLogItem]
        };
      }
      return r;
    }));
  };

  // Trigger pre-stocking order from accident hotspot
  const handleTriggerPreStockOrder = (hotspot: AccidentHotspot) => {
    const receivingFac = facilities.find(f => f.id === hotspot.primaryReceivingHospitalId) || activeFacility || facilities[0];
    
    const items = Object.entries(hotspot.recommendedPreStock || {}).map(([groupComp, qty], idx) => {
      const [bg, comp] = groupComp.split(' ');
      return {
        id: `item-hotspot-${Date.now()}-${idx}`,
        bloodGroup: bg as any,
        component: comp as any || 'PRBC',
        units: qty,
        unitPrice: 190,
        urgency: 'HIGH' as const,
        totalCost: qty * 190
      };
    });

    const targetSupplier = facilities.find(f => f.type === 'blood_bank') || facilities[1] || facilities[0] || { id: 'fac-central-bank', name: 'City Central Blood Center' };

    const preStockOrder: BloodOrder = {
      id: `ord-hotspot-${Date.now()}`,
      orderNumber: `ORD-SURGE-${hotspot.id.slice(-4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      facilityId: receivingFac?.id || 'fac-active',
      facilityName: receivingFac?.name || 'Trauma Center',
      supplierFacilityId: targetSupplier.id,
      supplierFacilityName: targetSupplier.name,
      orderingMode: 'ai_draft',
      items,
      totalUnits: items.reduce((a, b) => a + b.units, 0),
      totalCost: items.reduce((a, b) => a + b.totalCost, 0),
      status: 'pending_approval',
      autoApproved: false,
      aiRationale: `Proactive trauma surge order drafted for ${hotspot.name} before ${(hotspot.peakDays || []).join('/')} peak (${hotspot.peakHours}).`,
      complianceFlags: ['Highway Corridor Safety Buffer', 'Trauma Protocol Verified'],
      createdAt: new Date().toISOString()
    };

    setOrders(prev => [preStockOrder, ...prev]);
    setActiveTab('orders');
    addAuditLog('HOTSPOT_SURGE_PRESTOCK', `Generated proactive pre-stocking order ${preStockOrder.orderNumber} for trauma corridor ${hotspot.name}.`);
  };

  // Gamification Handlers
  const handleLogDonation = (
    component: BloodComponent,
    facilityName: string,
    isEmergency: boolean,
    isSurge: boolean,
    volumeMl: number
  ) => {
    const calcResult = calculateDonationPoints(
      donorProfile.bloodGroup,
      component,
      isEmergency,
      donorProfile.currentStreakMonths,
      isSurge
    );

    const newTotalPoints = donorProfile.totalPoints + calcResult.totalPoints;
    const tierInfo = getTierInfo(newTotalPoints);
    const newStreak = donorProfile.currentStreakMonths + 1;
    const newLongestStreak = Math.max(donorProfile.longestStreakMonths, newStreak);
    const newDonationsCount = donorProfile.donationsCount + 1;
    const newVolume = donorProfile.totalVolumeMl + volumeMl;
    const newLivesSaved = donorProfile.livesSavedEstimated + (component === 'PRBC' || component === 'WholeBlood' ? 3 : 2);

    const newRecord: DonationHistoryRecord = {
      id: `don-${Date.now()}`,
      date: new Date().toISOString(),
      component,
      volumeMl,
      facilityName,
      bloodGroup: donorProfile.bloodGroup,
      pointsEarned: calcResult.totalPoints,
      breakdown: calcResult,
      impactSummary: isEmergency || isSurge 
        ? 'Expedited directly to STAT Emergency Trauma Care unit for immediate transfusion.' 
        : `Assigned to ${component} transfusion inventory for surgical & oncology support.`,
      verifiedByStaff: 'RN Sarah Jenkins, BSN (Phlebotomy Lead)',
      vitalMetrics: {
        hemoglobinGdl: 14.4,
        bloodPressure: '118/76',
        pulseBpm: 68
      }
    };

    // Update badges check
    const updatedBadges = donorProfile.earnedBadges.map(badge => {
      if (badge.unlocked) return badge;
      
      let shouldUnlock = false;
      let newProgress = badge.progress ? { ...badge.progress } : undefined;

      if (badge.id === 'badge_first_drop') {
        shouldUnlock = true;
      } else if (badge.id === 'badge_streak_3' && newStreak >= 3) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_streak_6' && newStreak >= 6) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_streak_12' && newStreak >= 12) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_gallon_1' && newDonationsCount >= 8) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_gallon_5' && newDonationsCount >= 40) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_stat_responder' && (isEmergency || isSurge)) {
        shouldUnlock = true;
      } else if (badge.id === 'badge_platelet_pioneer' && component === 'Platelets') {
        shouldUnlock = true;
      }

      if (newProgress) {
        if (badge.category === 'consistency') newProgress.current = newStreak;
        if (badge.category === 'milestones') newProgress.current = newDonationsCount;
      }

      if (shouldUnlock) {
        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: newProgress
        };
      }
      return { ...badge, progress: newProgress };
    });

    setDonorProfile(prev => ({
      ...prev,
      totalPoints: newTotalPoints,
      tier: tierInfo.tier,
      level: tierInfo.level,
      nextTierPoints: tierInfo.nextTierPoints,
      currentStreakMonths: newStreak,
      longestStreakMonths: newLongestStreak,
      donationsCount: newDonationsCount,
      totalVolumeMl: newVolume,
      livesSavedEstimated: newLivesSaved,
      donationHistory: [newRecord, ...prev.donationHistory],
      earnedBadges: updatedBadges
    }));

    // Update Leaderboard
    setLeaderboard(prev => {
      const updated = prev.map(d => {
        if (d.id === donorProfile.id || d.isCurrentDonor) {
          return {
            ...d,
            totalPoints: newTotalPoints,
            donationsCount: newDonationsCount,
            streakMonths: newStreak,
            tier: tierInfo.tier
          };
        }
        return d;
      });
      return updated.sort((a, b) => b.totalPoints - a.totalPoints);
    });

    addAuditLog(
      'DONOR_DONATION_LOGGED',
      `Recorded ${volumeMl}ml ${component} (${donorProfile.bloodGroup}) donation for ${donorProfile.name} at ${facilityName}. Awarded +${calcResult.totalPoints} XP points.`
    );
  };

  const handleSimulateReferral = (friendName: string, friendBloodGroup: string) => {
    const bonusPoints = 200;
    const newTotalPoints = donorProfile.totalPoints + bonusPoints;
    const tierInfo = getTierInfo(newTotalPoints);
    const newRefCount = donorProfile.referralsCount + 1;

    const referralRecord: DonationHistoryRecord = {
      id: `ref-${Date.now()}`,
      date: new Date().toISOString(),
      component: 'WholeBlood',
      volumeMl: 500,
      facilityName: 'Community Ambassador Hub',
      bloodGroup: (friendBloodGroup as BloodGroup) || 'O+',
      pointsEarned: bonusPoints,
      breakdown: {
        basePoints: 0,
        rareTypeBonus: 0,
        streakBonus: 0,
        emergencySurgeBonus: 0,
        referralBonus: bonusPoints,
        totalPoints: bonusPoints
      },
      impactSummary: `Ambassador referral completed for ${friendName} (${friendBloodGroup}). Welcomed new active donor into regional reserve.`,
      verifiedByStaff: 'Community Engagement Lead'
    };

    const updatedBadges = donorProfile.earnedBadges.map(badge => {
      if (badge.id === 'badge_first_referral' && !badge.unlocked) {
        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      if (badge.id === 'badge_squad_leader' && newRefCount >= 5 && !badge.unlocked) {
        return {
          ...badge,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
      }
      if (badge.progress && badge.category === 'referrals') {
        return {
          ...badge,
          progress: { ...badge.progress, current: newRefCount }
        };
      }
      return badge;
    });

    setDonorProfile(prev => ({
      ...prev,
      totalPoints: newTotalPoints,
      tier: tierInfo.tier,
      level: tierInfo.level,
      nextTierPoints: tierInfo.nextTierPoints,
      referralsCount: newRefCount,
      donationHistory: [referralRecord, ...prev.donationHistory],
      earnedBadges: updatedBadges
    }));

    setLeaderboard(prev => {
      const updated = prev.map(d => {
        if (d.id === donorProfile.id || d.isCurrentDonor) {
          return {
            ...d,
            totalPoints: newTotalPoints,
            referralsCount: newRefCount,
            tier: tierInfo.tier
          };
        }
        return d;
      });
      return updated.sort((a, b) => b.totalPoints - a.totalPoints);
    });

    addAuditLog(
      'DONOR_REFERRAL_CREDITED',
      `Ambassador referral reward (+${bonusPoints} pts) credited to ${donorProfile.name} for referring ${friendName} (${friendBloodGroup}).`
    );
  };

  const handleToggleAnonymity = () => {
    setDonorProfile(prev => ({
      ...prev,
      isAnonymousOnLeaderboard: !prev.isAnonymousOnLeaderboard
    }));
  };

  // Find active emergency if any
  const activeEmergency = emergencyRequests.find(r => r.status === 'in_transit' || r.status === 'broadcasting');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-rose-500 selection:text-white font-sans antialiased">
      
      {/* Universal Top Navigation & Context Switcher */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeRole={activeRole}
        onRoleChange={setActiveRole}
        activeFacility={activeFacility}
        facilities={facilities}
        onFacilityChange={setActiveFacility}
        activeEmergencyCount={emergencyRequests.filter(r => r.status !== 'delivered' && r.status !== 'cancelled').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardOverview
            facility={activeFacility}
            units={inventory}
            surgeries={surgeries}
            activeEmergency={activeEmergency}
            onNavigateTab={setActiveTab}
            onOpenStatModal={() => setActiveTab('emergency')}
            onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
          />
        )}

        {/* Tab: Gamified Donor Rewards & Community Leaderboard */}
        {activeTab === 'rewards' && (
          <DonorRewardsView
            donor={donorProfile}
            leaderboard={leaderboard}
            facilities={facilities}
            onLogDonation={handleLogDonation}
            onSimulateReferral={handleSimulateReferral}
            onToggleAnonymity={handleToggleAnonymity}
            onEmergencyRespondClick={() => setActiveTab('emergency')}
          />
        )}

        {/* Tab 2: Inventory Manager */}
        {activeTab === 'inventory' && (
          <InventoryManager
            facility={activeFacility}
            units={inventory}
            onAddUnit={handleAddUnit}
            onUpdateUnitStatus={handleUpdateUnitStatus}
            onOpenIntakeModal={() => setIsIntakeModalOpen(true)}
          />
        )}

        {/* Tab 3: AI Demand Forecasting */}
        {activeTab === 'forecast' && (
          <AIForecastingView
            facility={activeFacility}
            units={inventory}
            surgeries={surgeries}
            forecasts={forecasts}
            aiSummary={aiSummary}
            isLoadingForecast={isLoadingForecast}
            onRefreshForecast={handleRefreshForecast}
            onGenerateOrderFromForecast={handleGenerateOrderFromForecast}
          />
        )}

        {/* Tab 4: Order Management (Manual, AI Draft, Controlled Auto) */}
        {activeTab === 'orders' && (
          <OrderManagementView
            facility={activeFacility}
            suppliers={facilities.filter(f => f.id !== activeFacility.id)}
            orders={orders}
            autoRules={autoRules}
            onUpdateAutoRules={setAutoRules}
            onCreateOrder={handleCreateOrder}
            onApproveOrder={handleApproveOrder}
            onRejectOrder={handleRejectOrder}
          />
        )}

        {/* Tab 5: Emergency Coordination & Proximity Radar */}
        {activeTab === 'emergency' && (
          <EmergencyCoordinator
            currentFacility={activeFacility}
            allFacilities={facilities}
            requests={emergencyRequests}
            onCreateEmergencyRequest={handleCreateEmergencyRequest}
            onUpdateEmergencyStatus={handleUpdateEmergencyStatus}
            onSimulateResponder={handleSimulateResponder}
          />
        )}

        {/* Tab 6: Accident Hotspots & Surge Prediction */}
        {activeTab === 'hotspots' && (
          <HotspotAnalysisView
            hotspots={hotspots}
            facilities={facilities}
            onTriggerPreStockOrder={handleTriggerPreStockOrder}
          />
        )}

        {/* Tab 7: Connected Verified Facilities Directory */}
        {activeTab === 'facilities' && (
          <NetworkFacilitiesView
            currentFacility={activeFacility}
            facilities={facilities}
            onSelectFacility={(fac) => {
              setActiveFacility(fac);
              setActiveTab('dashboard');
            }}
          />
        )}

        {/* Tab 8: Audit Trail & Regulatory Compliance */}
        {activeTab === 'audit' && (
          <AuditComplianceView
            logs={auditLogs}
            currentFacility={activeFacility}
          />
        )}

      </main>

      {/* Intake New Batch Modal */}
      <IntakeBatchModal
        facility={activeFacility}
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onAddUnit={handleAddUnit}
      />

      {/* Footer with Operational Standards */}
      <footer className="border-t border-slate-200 bg-white py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="font-bold text-slate-700">BloodRUSH Network v4.2</span>
            <span>• Verified Hospital Blood Exchange & Neural Demand Mesh</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Emergency Transit Cold-Chain Monitored (2.0°C – 6.0°C) • Zero Emergency Brokerage Fees
          </div>
        </div>
      </footer>

    </div>
  );
}
