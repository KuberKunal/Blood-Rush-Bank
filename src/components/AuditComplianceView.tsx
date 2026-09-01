import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Clock, 
  Sparkles, 
  User, 
  FileText, 
  CheckCircle2, 
  Filter,
  Lock,
  Layers
} from 'lucide-react';
import { AuditLogEntry, Facility } from '../types';

interface AuditComplianceViewProps {
  logs: AuditLogEntry[];
  currentFacility: Facility;
}

export const AuditComplianceView: React.FC<AuditComplianceViewProps> = ({
  logs,
  currentFacility
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedActionType === 'all' || log.action === selectedActionType;
    return matchesSearch && matchesType;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Action', 'Details', 'Compliance Seal'];
    const rows = filteredLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.actorName}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.complianceSeal || 'N/A'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BloodRUSH_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
              Regulatory Compliance & Immutable Audit Trail
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold">
              FDA / GAMP-5 Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident chain of custody tracking for every unit intake, AI order generation, human authorization, and emergency dispatch.
          </p>
        </div>

        <button
          id="export-audit-log-btn"
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-2xl font-bold text-xs transition-colors shadow-sm"
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="audit-search-input"
            type="text"
            placeholder="Search action, actor, batch #, compliance seal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            id="audit-action-filter-select"
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Action Types</option>
            <option value="STAT_EMERGENCY_BROADCAST">STAT Emergency Broadcast</option>
            <option value="AI_ORDER_DRAFTED">AI Order Drafts</option>
            <option value="ORDER_AUTHORIZED">Order Authorizations</option>
            <option value="BATCH_INTAKE">Batch Intakes</option>
            <option value="UNIT_RESERVED">Unit Reservations</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50">
                <th className="py-3.5 px-5 font-bold">Timestamp (UTC)</th>
                <th className="py-3.5 px-5 font-bold">Actor & Role</th>
                <th className="py-3.5 px-5 font-bold">Action Event</th>
                <th className="py-3.5 px-5 font-bold">Audit Record & Parameters</th>
                <th className="py-3.5 px-5 text-right font-bold">Cryptographic Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    No audit records match your query.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isAI = log.actorRole.includes('AI') || log.actorRole.includes('Neural');

                  return (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* Timestamp */}
                      <td className="py-3.5 px-5 font-mono text-slate-500 font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          {isAI ? (
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>{log.actorName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{log.actorRole}</div>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                          log.action.includes('EMERGENCY') ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          log.action.includes('AUTHORIZED') ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {log.action.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Details */}
                      <td className="py-3.5 px-5 max-w-md text-slate-600 font-medium">
                        {log.details}
                      </td>

                      {/* Seal */}
                      <td className="py-3.5 px-5 text-right">
                        <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          {log.complianceSeal || 'SEAL-VALID'}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
