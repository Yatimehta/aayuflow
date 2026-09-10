import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Lock, User, Hospital as HospitalIcon, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DoctorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { hospitals, selectedHospital, setSelectedHospital, showToast } = useApp();

  const [email, setEmail] = useState('dr.alok.verma@aiia.gov.in');
  const [password, setPassword] = useState('vaidya2026');
  const [department, setDepartment] = useState('Kayachikitsa (Internal Medicine)');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast({
        type: 'success',
        title: 'Physician Authenticated',
        message: `Welcome Dr. Alok Verma, MD (Ayu) • ${department}`
      });
      navigate('/doctor');
    }, 600);
  };

  const handleDemoAccess = () => {
    showToast({
      type: 'success',
      title: 'Demo Access Granted',
      message: `Signed in as Dr. Alok Verma at ${selectedHospital.name}`
    });
    navigate('/doctor');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-brand-border shadow-soft-lg p-6 sm:p-8 space-y-6">
        
        {/* Top Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-mint text-[#2E7D32] flex items-center justify-center mx-auto shadow-soft">
            <Stethoscope className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-brand-heading">Doctor / Vaidya Clinical Portal</h2>
          <p className="text-xs text-brand-muted">
            Clinical AI cockpit for pre-consultation review, Ayurvedic verification & EMR integration.
          </p>
        </div>

        {/* Hospital Facility */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-brand-heading">
            Hospital / Institute
          </label>
          <div className="relative">
            <HospitalIcon className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <select
              value={selectedHospital.id}
              onChange={(e) => {
                const found = hospitals.find(h => h.id === e.target.value);
                if (found) setSelectedHospital(found);
              }}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-medium"
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
              OPD Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-medium"
            >
              <option value="Kayachikitsa (Internal Medicine)">Kayachikitsa (Internal Medicine)</option>
              <option value="Panchakarma">Panchakarma Center</option>
              <option value="Shalya Tantra">Shalya Tantra (Surgery / Marma)</option>
              <option value="Swasthavritta & Yoga">Swasthavritta & Lifestyle</option>
              <option value="Kaumarbhritya">Kaumarbhritya (Pediatrics)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-heading mb-1">
              National Medical / Ayush Registration No.
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-heading mb-1">
              Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-teal hover:bg-brand-teal-dark text-white text-xs font-bold shadow-soft transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Access OPD Consultation Cockpit'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="pt-2 border-t border-brand-border">
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2 px-3 rounded-xl bg-brand-mint text-[#2E7D32] hover:bg-[#cbf0d0] text-xs font-semibold border border-[#A7D7B5]/60 transition-all flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Instant Demo Access as Dr. Alok Verma</span>
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-brand-muted">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>NMC & Ayush Registered Practitioner Security</span>
        </div>

      </div>
    </div>
  );
};
