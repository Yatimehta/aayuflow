import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Menu, Hospital, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedHospital } = useApp();
  const location = useLocation();

  const isAssistIntakeFlow = location.pathname === '/worker' || location.pathname === '/worker/' || location.pathname.startsWith('/worker/assist');

  // Sidebar-free focused flow for Worker Assist Intake
  if (isAssistIntakeFlow) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-transparent relative z-10 w-full">
        <main className="flex-1 w-full px-4 sm:px-6 py-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-transparent relative z-10">
      {/* Sidebar */}
      <Sidebar
        role="worker"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sub-header on Mobile / Tablet for Worker */}
        <div className="lg:hidden bg-white border-b border-[#DCEAE7] px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-[#DCEAE7] text-[#0D2B3E] hover:bg-[#F4FBF9]"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0D2B3E] truncate max-w-[200px]">
            <Hospital className="w-3.5 h-3.5 text-[#146356] flex-shrink-0" />
            <span className="truncate">{selectedHospital.name}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E4EFEC] text-[#146356] border border-[#146356]/20">
            Assistant Desk
          </span>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
