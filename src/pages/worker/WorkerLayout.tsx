import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Menu, Hospital, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkerLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedHospital } = useApp();
  const location = useLocation();

  // If worker login is desired or authenticated
  const isLoginPage = location.pathname === '/worker/login';

  if (isLoginPage) {
    return <Outlet />;
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
        <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg border border-brand-border text-brand-heading hover:bg-brand-bg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-heading truncate max-w-[200px]">
            <Hospital className="w-3.5 h-3.5 text-brand-teal-dark flex-shrink-0" />
            <span className="truncate">{selectedHospital.name}</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-blue-light text-brand-blue-dark border border-brand-blue/30">
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
