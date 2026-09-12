import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  Activity, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';
import { StatCard } from '../../components/StatCard';
import { StaffMember } from '../../types';

export const AdminDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { 
    selectedHospital, 
    adminStats, 
    staff, 
    updateStaffStatus, 
    auditLogs, 
    showToast 
  } = useApp();

  const isStaffView = location.pathname.includes('/admin/staff');
  const isAuditView = location.pathname.includes('/admin/audit');

  const [logFilter, setLogFilter] = useState<'All' | 'ABDM Sync' | 'Triage AI' | 'User Access'>('All');

  const filteredLogs = auditLogs.filter(l => logFilter === 'All' || l.category === logFilter);

  const handleToggleStaffStatus = (member: StaffMember) => {
    const nextStatus = member.status === 'Active' ? 'On Break' : 'Active';
    updateStaffStatus(member.id, nextStatus);
    showToast({
      type: 'info',
      title: 'Rostering Updated',
      message: `${member.name} marked as ${nextStatus}.`
    });
  };

  const handleExportAudit = () => {
    showToast({
      type: 'success',
      title: 'Audit Report Exported',
      message: 'ABDM compliance & triage report generated as CSV.'
    });
  };

  // 1. DEDICATED STAFF & COUNTER VIEW (/admin/staff)
  if (isStaffView) {
    return (
      <div className="space-y-5 relative z-10">
        <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Staff & Counter Rostering
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {staff.filter(s => s.status === 'Active').length} Active On Duty
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage clinical personnel and counter assignments across specialized AYUSH departments at {selectedHospital.name}.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin')}
            className="text-xs text-teal-700 font-bold hover:underline self-start sm:self-auto"
          >
            &larr; Back to Directorate Overview
          </button>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Assigned Counter / Room</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Today's Patients</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Roster Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center border border-teal-200">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.name}</p>
                          <p className="text-[10px] text-slate-500">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{member.counter}</td>
                    <td className="py-3 px-4 text-slate-600">{member.department}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{member.patientsHandledToday}</span>
                      {member.avgHandlingMinutes > 0 && (
                        <span className="text-[10px] text-slate-400 block">~{member.avgHandlingMinutes}m avg</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        member.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleStaffStatus(member)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-800 transition-colors shadow-xs"
                      >
                        Toggle {member.status === 'Active' ? 'Break' : 'Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 2. DEDICATED AUDIT & COMPLIANCE VIEW (/admin/audit)
  if (isAuditView) {
    return (
      <div className="space-y-5 relative z-10">
        <div className="glass-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                ABDM & Clinical Audit Trail
              </h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                100% Tamper Evident
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Immutable logging of all AI inference, ABHA verifications, and clinical sign-offs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportAudit}
              className="btn-brand-primary px-3.5 py-2 text-xs font-semibold"
            >
              Export Audit CSV
            </button>
            <button
              onClick={() => navigate('/admin')}
              className="text-xs text-teal-700 font-bold hover:underline"
            >
              &larr; Overview
            </button>
          </div>
        </div>

        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200/70">
            {(['All', 'ABDM Sync', 'Triage AI', 'User Access'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setLogFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  logFilter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white/80 border border-slate-200 text-slate-700 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200/70">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{log.category}</td>
                    <td className="py-3 px-4 text-slate-700">{log.action}</td>
                    <td className="py-3 px-4 text-slate-500">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // 3. MAIN COCKPIT LANDING (Overview)
  return (
    <div className="space-y-5 relative z-10">
      
      {/* 1. TOP STAT STRIP + CALLOUT BADGE (Exact Reference Pattern) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-8 stat-strip px-5 py-3 flex flex-wrap items-center justify-between gap-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 flex-shrink-0" />
            <span className="text-slate-500">OPD Arrivals</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{selectedHospital.totalPatientsToday}</span>
            <span className="text-slate-400">today</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0" />
            <span className="text-slate-500">Average Wait</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{selectedHospital.currentWaitMinutes}</span>
            <span className="text-slate-500">min</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
            <span className="text-slate-500">AI Concordance</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{adminStats.aiConcordanceRate}%</span>
            <span className="text-emerald-700 font-semibold text-[11px]">verified</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-300" />

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 flex-shrink-0" />
            <span className="text-slate-500">ABDM Sync</span>
            <span className="font-extrabold text-slate-900 text-sm font-sans">{adminStats.abdmSyncRate}%</span>
            <span className="text-teal-700 font-semibold text-[11px]">live</span>
          </div>
        </div>

        <div className="lg:col-span-4 callout-badge px-4 py-2.5 flex items-center justify-between gap-3 text-xs leading-snug">
          <p className="text-slate-700">
            OPD throughput is running <strong className="text-emerald-700 font-bold">+28% faster</strong> with zero bottlenecks.
          </p>
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* 2. GREETING & CONTEXT HEADER */}
      <div className="glass-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Hospital Directorate Cockpit
            </h1>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 border border-slate-200">
              Executive View
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time OPD throughput, counter resource allocation, and clinical triage health at <strong>{selectedHospital.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/admin/staff')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white/90 hover:bg-white text-xs font-semibold text-slate-800 shadow-xs transition-all"
          >
            <Users className="w-4 h-4 text-teal-700" />
            <span>Staff Rostering ({staff.length})</span>
          </button>
          <button
            onClick={() => navigate('/admin/audit')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white/90 hover:bg-white text-xs font-semibold text-slate-800 shadow-xs transition-all"
          >
            <Activity className="w-4 h-4 text-teal-700" />
            <span>ABDM Audit ({auditLogs.length})</span>
          </button>
        </div>
      </div>

      {/* 3. 4 TOP-LINE METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total OPD Patients Today"
          value={selectedHospital.totalPatientsToday}
          subtitle="All AYUSH disciplines"
          icon={Users}
          variant="teal"
          trend="+14% throughput"
        />
        <StatCard
          title="Average Wait Time"
          value={`${selectedHospital.currentWaitMinutes} min`}
          subtitle="Kayachikitsa & Panchakarma"
          icon={Clock}
          variant="blue"
          trend="-65% wait reduction"
        />
        <StatCard
          title="AI Concordance Rate"
          value={`${adminStats.aiConcordanceRate}%`}
          subtitle="Physician verification match"
          icon={Sparkles}
          variant="mint"
        />
        <StatCard
          title="ABDM Sync Success"
          value={`${adminStats.abdmSyncRate}%`}
          subtitle="FHIR / SNOMED CT push"
          icon={ShieldCheck}
          variant="amber"
        />
      </div>

      {/* 4. SINGLE IMPORTANT CHART + NEEDS ATTENTION LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Weekly OPD Throughput Chart (8 Cols) */}
        <div className="lg:col-span-8 glass-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Weekly OPD Patient Volume & Throughput
              </h2>
              <p className="text-xs text-slate-500">
                Daily patient intake counts comparing pre-triage vs post-AI consultation throughput
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +28% Capacity Gain
            </span>
          </div>

          <div className="pt-4 pb-2">
            <div className="grid grid-cols-7 gap-3 items-end h-48">
              {[
                { day: 'Mon', count: 142, height: '70%' },
                { day: 'Tue', count: 168, height: '82%' },
                { day: 'Wed', count: 154, height: '75%' },
                { day: 'Thu', count: 189, height: '92%' },
                { day: 'Fri', count: 176, height: '86%' },
                { day: 'Sat', count: 198, height: '96%' },
                { day: 'Sun (Today)', count: selectedHospital.totalPatientsToday, height: '65%' }
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-bold text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count}
                  </span>
                  <div className="w-full max-w-[36px] bg-white/60 rounded-t-xl overflow-hidden h-full flex items-end shadow-inner">
                    <div
                      className={`w-full transition-all duration-500 rounded-t-xl ${
                        idx === 6 ? 'bg-teal-500 shadow-sm' : 'bg-sky-400/80 group-hover:bg-sky-500'
                      }`}
                      style={{ height: item.height }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold truncate ${idx === 6 ? 'text-teal-800 font-bold' : 'text-slate-500'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Needs Attention Alert List (4 Cols) */}
        <div className="lg:col-span-4 glass-card p-6 space-y-4">
          <div className="border-b border-slate-200/70 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">Needs Attention</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              3 Active
            </span>
          </div>

          <div className="space-y-3">
            <div className="glass-subcard p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Counter Congestion</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Med</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Counter A-2 has 4 walk-ins waiting. Consider opening auxiliary terminal A-3.
              </p>
            </div>

            <div className="glass-subcard p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Priority Triage Flag</span>
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">High</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Token AYU-1052 flagged with acute sandhi swelling. Fast-tracked to Dr. Verma.
              </p>
            </div>

            <div className="glass-subcard p-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Diagnostic Sync</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Optimal</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                18 ABDM FHIR diagnostic records synced with Zero rejections this morning.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
