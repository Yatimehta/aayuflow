import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Lock, User, Hospital as HospitalIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WorkerLogin: React.FC = () => {
  const navigate = useNavigate();
  const { hospitals, selectedHospital, setSelectedHospital, showToast } = useApp();

  const [username, setUsername] = useState('assistant.desk@aiia.gov.in');
  const [password, setPassword] = useState('ayushdesk2026');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({
        type: 'success',
        title: 'Logged In Successfully',
        message: `Welcome to ${selectedHospital.name} Assistant Desk.`
      });
      navigate('/worker');
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    showToast({
      type: 'success',
      title: 'Demo Access Granted',
      message: `Switched to AYUSH Worker Desk at ${selectedHospital.name}`
    });
    navigate('/worker');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border shadow-soft-lg p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue-light text-brand-blue-dark flex items-center justify-center mx-auto shadow-soft">
            <Sprout className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-heading">AYUSH Hospital Assistant Desk</h2>
          <p className="text-xs text-brand-muted">
            Authorized portal for OPD registration workers, ASHA / ANM assistants, and intake staff.
          </p>
        </div>

        {/* Hospital Selection */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-brand-heading">
            Select OPD Hospital Facility
          </label>
          <div className="relative">
            <HospitalIcon className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedHospital.id}
              onChange={(e) => {
                const found = hospitals.find(h => h.id === e.target.value);
                if (found) setSelectedHospital(found);
              }}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30 font-medium"
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-heading mb-1">
              Hospital Staff ID / Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-heading mb-1">
              Security PIN / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-blue-dark text-white text-xs font-bold shadow-soft hover:bg-[#5C9FB5] transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to OPD Desk'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Button */}
        <div className="pt-2 border-t border-brand-border">
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 px-3 rounded-xl bg-brand-blue-light text-brand-blue-dark hover:bg-brand-blue/20 text-xs font-semibold border border-brand-blue/30 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Demo Access (Skip Login)</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-brand-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ayush Grid ABDM Compliant Auth</span>
        </div>

      </div>
    </div>
  );
};
