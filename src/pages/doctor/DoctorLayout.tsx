import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Menu, Stethoscope, Hospital } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DoctorLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedHospital } = useApp();
  const location = useLocation();

  const isLoginPage = location.pathname === '/doctor/login';

  if (isLoginPage) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex bg-transparent relative z-10">
      {/* Sidebar for Doctor */}
      <Sidebar
        role="doctor"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-brand-border text-brand-heading hover:bg-brand-bg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-heading truncate max-w-[200px]">
            <Hospital className="w-3.5 h-3.5 text-[#2E7D32] flex-shrink-0" />
            <span className="truncate">{selectedHospital.name}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-mint text-[#2E7D32] border border-[#A7D7B5]/40">
            Physician Suite
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
