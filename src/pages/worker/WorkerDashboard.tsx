import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  CheckCircle2, 
  Phone, 
  FileText, 
  Clock, 
  ArrowRight,
  User,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../utils/translations';
import { Patient } from '../../types';

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { patients, selectedHospital, setActivePatientId, showToast } = useApp();

  // Search state for finding existing patients
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState<Patient | null>(null);
  const [searched, setSearched] = useState(false);

  // Assisted count (today's non-analytical counter)
  const assistedCount = patients.filter(
    p => p.status === 'Processing' || p.status === 'Verified'
  ).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = searchPhone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      showToast({
        type: 'info',
        title: 'Enter Phone Number',
        message: 'Please enter a 10-digit phone number to search.'
      });
      return;
    }

    const match = patients.find(p => {
      const pDigits = p.phone.replace(/\D/g, '');
      return pDigits.includes(cleanPhone) || cleanPhone.includes(pDigits);
    });

    setSearchResult(match || null);
    setSearched(true);
  };

  const handleStartNewPatient = () => {
    // Clear active patient and navigate to Step 1 of assisted intake
    setActivePatientId(null);
    navigate('/worker/assist');
  };

  const handleAssistFoundPatient = (p: Patient) => {
    setActivePatientId(p.id);
    navigate('/worker/assist');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* 1. TOP HEADER & WORKER GREETING */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAE7] shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#E4EFEC] text-[#146356]">
              AYUSH Field & Kiosk Assistant • सहायक पोर्टल
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {selectedHospital.name}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D2B3E] tracking-tight">
            Welcome, Sunita Devi
          </h1>
          <p className="text-sm text-slate-600">
            AIIA OPD Desk • Assisting patients with registration, document photos, and queue tokens.
          </p>
        </div>

        {/* Daily Helper Counter (Encouraging, Non-analytical) */}
        <div className="self-start md:self-auto bg-[#E4EFEC] border border-[#146356]/20 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#146356] text-white flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#146356]">
              ✓ {assistedCount || 6} patients assisted today
            </p>
            <p className="text-[11px] text-slate-600">
              Counter desk running smoothly
            </p>
          </div>
        </div>
      </div>

      {/* 2. TWO BIG OBVIOUS ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Register New Patient */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCEAE7] shadow-sm flex flex-col justify-between hover:border-[#146356] transition-all group">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#E4EFEC] text-[#146356] flex items-center justify-center group-hover:scale-105 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0D2B3E]">
                Register New Patient
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                For patients visiting the OPD for the first time. Walk them through basic details and take photos of their doctor papers.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={handleStartNewPatient}
              className="w-full bg-[#146356] hover:bg-[#0f4d43] text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors text-sm sm:text-base"
            >
              <UserPlus className="w-5 h-5" />
              <span>Start New Patient Intake</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        {/* Card 2: Find Existing Patient */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCEAE7] shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#CEF3ED] text-[#146356] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0D2B3E]">
                Find Existing Patient
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Look up a returning patient by their mobile number to issue a fresh visit token or add new doctor papers.
              </p>
            </div>
          </div>

          {/* Quick Search Input */}
          <form onSubmit={handleSearch} className="pt-4 space-y-3">
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => {
                  setSearchPhone(e.target.value);
                  if (searched) setSearched(false);
                }}
                placeholder="Enter patient phone number..."
                className="w-full pl-10 pr-24 py-3 bg-[#F4FBF9] border border-[#DCEAE7] rounded-xl text-sm text-[#0D2B3E] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#146356] focus:bg-white"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-white border border-[#DCEAE7] hover:bg-[#E4EFEC] text-[#146356] font-bold text-xs rounded-lg transition-colors"
              >
                Find
              </button>
            </div>

            {/* Search Match Result Display */}
            {searched && (
              <div className="p-3.5 rounded-2xl border transition-all animate-fadeIn">
                {searchResult ? (
                  <div className="flex items-center justify-between gap-3 bg-[#E4EFEC]/60 border-[#146356]/30 p-2.5 rounded-xl">
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-[#0D2B3E] truncate">
                        {searchResult.name} ({searchResult.age}y, {searchResult.gender})
                      </p>
                      <p className="text-[11px] text-slate-600 truncate">
                        Phone: {searchResult.phone} • Last Token: {searchResult.tokenNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAssistFoundPatient(searchResult)}
                      className="px-3 py-1.5 bg-[#146356] text-white font-bold text-xs rounded-lg hover:bg-[#0f4d43] flex-shrink-0"
                    >
                      Assist Patient
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-600 text-xs py-1">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>No patient found with this phone number. Click <strong>Start New Patient</strong> above to register them.</span>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* 3. TODAY'S ASSISTED PATIENT LIST (Simple & Plain) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DCEAE7] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DCEAE7]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#0D2B3E]">
              Today's Patients at Kiosk Desk
            </h3>
            <p className="text-xs text-slate-500">
              Patients assisted with token generation and doctor queue forwarding today.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E4EFEC] text-[#146356]">
            {patients.length} Registered
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {patients.slice(0, 5).map((p) => (
            <div
              key={p.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F4FBF9] px-2 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#E4EFEC] text-[#146356] font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-[#0D2B3E]">{p.name}</p>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Token #{p.tokenNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {p.age} yrs • {p.gender} • Phone: {p.phone} • Language: {p.preferredLanguage || 'Hindi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-[#CEF3ED] text-[#146356]">
                  {p.status === 'Verified' ? 'Sent to Doctor' : 'Waiting in OPD'}
                </span>
                <button
                  onClick={() => handleAssistFoundPatient(p)}
                  className="px-3 py-1.5 text-xs font-bold text-[#146356] hover:bg-[#E4EFEC] rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
