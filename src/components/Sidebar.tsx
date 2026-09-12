import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Settings,
  Stethoscope,
  FileCheck2,
  FileSpreadsheet,
  X,
  Hospital,
  ShieldAlert,
  BarChart3,
  Activity,
  Layers,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../utils/translations';

interface SidebarProps {
  role: 'worker' | 'doctor' | 'admin';
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, isOpen = true, onClose }) => {
  const { selectedHospital, patients, staff, auditLogs, currentUser, activePatient } = useApp();
  const { t } = useTranslation();

  const isAyurvedaDoctor = (currentUser?.discipline || 'Ayurveda') === 'Ayurveda';
  const isAyushPatient = (activePatient?.careSystem || 'AYURVEDA') === 'AYURVEDA';

  const workerNavItems = [
    { label: t('nav_dashboard'), path: '/worker', icon: LayoutDashboard, exact: true },
    { label: t('nav_patients'), path: '/worker/patients', icon: Users, badge: patients.length },
    { label: t('step7_title'), path: '/worker/assist', icon: FileSpreadsheet },
    { label: t('step4_title'), path: '/worker/documents', icon: FileText },
    { label: t('nav_queue'), path: '/worker/queue', icon: Clock, badge: patients.filter(p => p.status === 'Pending').length },
    { label: t('nav_settings'), path: '/worker/settings', icon: Settings }
  ];

  const doctorNavItems = [
    { label: t('nav_queue'), path: '/doctor', icon: Users, badge: patients.filter(p => p.status !== 'Verified').length || patients.length, exact: true },
    { label: t('nav_consultation'), path: '/doctor/consultation', icon: FileSpreadsheet },
    { label: t('nav_profile'), path: '/doctor/profile', icon: User }
  ];


  const adminNavItems = [
    { label: t('nav_dashboard'), path: '/admin', icon: LayoutDashboard, exact: true },
    { label: t('admin_title'), path: '/admin/staff', icon: Users, badge: staff.length },
    { label: t('admin_abdm_sync'), path: '/admin/audit', icon: Activity, badge: auditLogs.length },
    { label: t('nav_settings'), path: '/admin/settings', icon: Settings }
  ];

  const items = role === 'worker' ? workerNavItems : role === 'doctor' ? doctorNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 z-30 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#DCEAE7] shadow-sm flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Header on mobile */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-brand-border">
            <span className="text-xs font-bold text-brand-heading uppercase tracking-wider">
              {role === 'worker' ? 'Hospital Assistant' : role === 'doctor' ? 'Doctor Portal' : 'Admin Directorate'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-brand-muted hover:bg-brand-bg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Active OPD Badge */}
          <div className="p-3 rounded-xl bg-brand-bg border border-brand-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-heading">
              <Hospital className="w-3.5 h-3.5 text-brand-teal-dark flex-shrink-0" />
              <span className="truncate text-[#0D2B3E]">{selectedHospital.name}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11px] text-[#4A5D63]">
              <span>
                {role === 'worker' 
                  ? 'Desk: AYUSH-A1' 
                  : (currentUser?.discipline === 'Allopathy' ? 'OPD: General Med' : 'OPD: Kayachikitsa')}
              </span>
              <span className="text-[#146356] font-medium">{selectedHospital.currentWaitMinutes}m wait</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-brand-muted">
              Navigation
            </p>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#146356] text-white shadow-sm font-semibold'
                        : 'text-[#0D2B3E] hover:bg-[#E4EFEC] hover:text-[#146356]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                        // adjust badge styling based on active or inactive
                        'bg-white/20 text-current'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info strip */}
        <div className="p-4 border-t border-[#DCEAE7] bg-[#F4FBF9]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-medium text-brand-body">HIS / ABDM Connected</span>
          </div>
          <p className="text-[10px] text-brand-muted mt-0.5">AyuFlow v2.4 (Clinical AI Build)</p>
        </div>
      </aside>
    </>
  );
};
