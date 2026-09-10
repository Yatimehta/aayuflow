import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  HeartHandshake, 
  Users, 
  Stethoscope, 
  ShieldAlert, 
  Smartphone, 
  KeyRound, 
  Hospital as HospitalIcon, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Lock,
  User,
  ShieldCheck,
  ChevronRight,
  FlaskConical,
  Fingerprint,
  Mail,
  Building,
  BadgeAlert
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, Patient } from '../../types';

type AuthRole = 'patient' | 'worker' | 'doctor' | 'admin' | 'lab';

export const UniversalLogin: React.FC = () => {
  const navigate = useNavigate();
  const { 
    hospitals, 
    selectedHospital, 
    setSelectedHospital, 
    patients, 
    addPatient,
    loginAsPatient, 
    loginAsStaff,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<AuthRole>('patient');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('45-9821-4321-7890');
  const [loginPassword, setLoginPassword] = useState('ayuflow@2026');

  // Patient Sign Up States
  const [patientSignup, setPatientSignup] = useState({
    name: '',
    phone: '',
    age: '32',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    abhaId: '',
    password: ''
  });

  // Staff Request Access / Sign Up States
  const [staffSignup, setStaffSignup] = useState({
    name: '',
    email: '',
    hospitalId: selectedHospital.id,
    staffId: '',
    department: 'Kayachikitsa',
    password: ''
  });

  // Demo Credentials Map for Quick Fill
  const demoProfiles: Record<Exclude<UserRole, 'guest'>, { identifier: string; pass: string; title: string; dest: string }> = {
    patient: {
      identifier: '45-9821-4321-7890',
      pass: 'patient2026',
      title: 'Rameshwar Sharma (Patient)',
      dest: '/patient/dashboard'
    },
    worker: {
      identifier: 'worker.desk@aiia.gov.in',
      pass: 'worker2026',
      title: 'Priya Narayanan (OPD Assistant)',
      dest: '/worker'
    },
    doctor: {
      identifier: 'dr.alok.verma@aiia.gov.in',
      pass: 'vaidya2026',
      title: 'Dr. Alok Verma, MD (Ayu)',
      dest: '/doctor'
    },
    admin: {
      identifier: 'admin.director@aiia.gov.in',
      pass: 'admin2026',
      title: 'Col. Rajesh Bakshi (Medical Sup.)',
      dest: '/admin'
    },
    lab: {
      identifier: 'lab.staff@aiia.gov.in',
      pass: 'ayushlab2026',
      title: 'Ananya Deshmukh (Lab Staff)',
      dest: '/lab'
    }
  };

  const handleRoleChange = (role: AuthRole) => {
    setActiveTab(role);
    setLoginIdentifier(demoProfiles[role].identifier);
    setLoginPassword(demoProfiles[role].pass);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (activeTab === 'patient') {
        const cleanId = loginIdentifier.replace(/\s+/g, '');
        let matched = patients.find(p => 
          (p.abhaId && p.abhaId.includes(cleanId)) || 
          p.phone.includes(cleanId) ||
          p.tokenNumber.toLowerCase() === cleanId.toLowerCase()
        );
        if (!matched) matched = patients[0];

        loginAsPatient(matched);
        showToast({
          type: 'success',
          title: 'Welcome Back',
          message: `Signed in as ${matched.name}. Navigating to Patient Dashboard.`
        });
        navigate('/patient/dashboard');
      } else {
        const demo = demoProfiles[activeTab];
        loginAsStaff(activeTab, demo.title, selectedHospital.name);
        showToast({
          type: 'success',
          title: 'Authentication Successful',
          message: `Signed in as ${demo.title}. Redirecting to Dashboard.`
        });
        navigate(demo.dest);
      }
    }, 600);
  };

  const handlePatientSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientSignup.name || !patientSignup.phone) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Name and Mobile are required.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const newPat = addPatient({
        name: patientSignup.name,
        phone: patientSignup.phone,
        age: parseInt(patientSignup.age, 10) || 30,
        gender: patientSignup.gender,
        abhaId: patientSignup.abhaId || undefined,
        hospitalId: selectedHospital.id,
        hospitalName: selectedHospital.name,
        careSystem: 'AYURVEDA'
      });

      loginAsPatient(newPat);
      showToast({
        type: 'success',
        title: 'Account Created',
        message: `Welcome, ${newPat.name}! Your patient profile is ready.`
      });
      navigate('/patient/dashboard');
    }, 700);
  };

  const handleStaffSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffSignup.name || !staffSignup.email) {
      showToast({ type: 'error', title: 'Missing Info', message: 'Name and Official Email are required.' });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const hosp = hospitals.find(h => h.id === staffSignup.hospitalId) || selectedHospital;
      loginAsStaff(activeTab, `${staffSignup.name} (${activeTab.toUpperCase()})`, hosp.name);

      showToast({
        type: 'success',
        title: 'Institutional Access Granted',
        message: `Welcome to AyuFlow, ${staffSignup.name}. Access confirmed for ${hosp.city} center.`
      });

      const dest = demoProfiles[activeTab].dest;
      navigate(dest);
    }, 700);
  };

  const handleQuickDemoFill = () => {
    const demo = demoProfiles[activeTab];
    setLoginIdentifier(demo.identifier);
    setLoginPassword(demo.pass);
    showToast({
      type: 'info',
      title: 'Demo Credentials Loaded',
      message: `Populated active demo profile for ${demo.title}.`
    });
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 py-8 relative z-10">
      <div className="max-w-lg w-full glass-card p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">AyuFlow Health Network</h1>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            AYUSH Integrated Clinical Portal & ABDM EHR Gateway
          </p>
        </div>

        {/* 5-Role Segmented Control */}
        <div className="grid grid-cols-5 rounded-2xl bg-white/70 backdrop-blur-md p-1 border border-slate-200/80 gap-1">
          {[
            { role: 'patient' as AuthRole, label: 'Patient', icon: HeartHandshake },
            { role: 'worker' as AuthRole, label: 'Worker', icon: Users },
            { role: 'doctor' as AuthRole, label: 'Doctor', icon: Stethoscope },
            { role: 'admin' as AuthRole, label: 'Admin', icon: ShieldAlert },
            { role: 'lab' as AuthRole, label: 'Lab', icon: FlaskConical }
          ].map(({ role, label, icon: Icon }) => {
            const isActive = activeTab === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-white/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </div>

        {/* Auth Mode Toggle (Login vs Sign Up) */}
        <div className="flex rounded-xl bg-slate-100/90 p-1 border border-slate-200/70">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              authMode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              authMode === 'signup'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {activeTab === 'patient' ? 'Create Account' : 'Request Access'}
          </button>
        </div>

        {/* VIEW 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                {activeTab === 'patient' 
                  ? 'ABHA Number, Mobile, or Token ID' 
                  : 'Official Staff Email / Employee ID'}
              </label>
              <div className="relative">
                {activeTab === 'patient' ? (
                  <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                ) : (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                )}
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={activeTab === 'patient' ? 'e.g. 45-9821-4321-7890 or 9811234567' : 'e.g. staff.id@aiia.gov.in'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 font-medium text-slate-900 shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-800">Password</label>
                <button
                  type="button"
                  onClick={() => showToast({ type: 'info', title: 'Password Reset', message: 'Password recovery instructions sent to registered mobile/email.' })}
                  className="text-[11px] text-teal-700 font-semibold hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/40 text-slate-900 shadow-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl btn-brand-primary font-bold transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Authenticating...' : `Sign In to ${activeTab.toUpperCase()} Dashboard`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* VIEW 2: PATIENT SIGNUP FORM */}
        {authMode === 'signup' && activeTab === 'patient' && (
          <form onSubmit={handlePatientSignupSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-brand-heading mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Yashwardhan Mehta"
                value={patientSignup.name}
                onChange={(e) => setPatientSignup({ ...patientSignup, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-brand-heading mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={patientSignup.phone}
                  onChange={(e) => setPatientSignup({ ...patientSignup, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-heading mb-1">Gender *</label>
                <select
                  value={patientSignup.gender}
                  onChange={(e) => setPatientSignup({ ...patientSignup, gender: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-brand-heading mb-1">Age *</label>
                <input
                  type="number"
                  required
                  placeholder="Age in years"
                  value={patientSignup.age}
                  onChange={(e) => setPatientSignup({ ...patientSignup, age: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
                />
              </div>
              <div>
                <label className="block font-semibold text-brand-heading mb-1">ABHA ID (Optional)</label>
                <input
                  type="text"
                  placeholder="14-digit ID or Address"
                  value={patientSignup.abhaId}
                  onChange={(e) => setPatientSignup({ ...patientSignup, abhaId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30 font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-heading mb-1">Create Password *</label>
              <input
                type="password"
                required
                placeholder="Choose account password"
                value={patientSignup.password}
                onChange={(e) => setPatientSignup({ ...patientSignup, password: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-brand-bg focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-teal/30"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl btn-brand-primary font-bold shadow-soft transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account & Open Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* VIEW 3: STAFF REQUEST ACCESS / SIGNUP FORM */}
        {authMode === 'signup' && activeTab !== 'patient' && (
          <form onSubmit={handleStaffSignupSubmit} className="space-y-3.5 text-xs">
            <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 flex items-center gap-2 text-[11px] text-teal-800 font-medium">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-teal-600" />
              <span>Registering institutional credentials for role: <strong>{activeTab.toUpperCase()}</strong></span>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Staff Member Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Kavita Sundaram, BAMS"
                value={staffSignup.name}
                onChange={(e) => setStaffSignup({ ...staffSignup, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Official Hospital Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@hospital.gov.in"
                  value={staffSignup.email}
                  onChange={(e) => setStaffSignup({ ...staffSignup, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Hospital Assignment</label>
                <select
                  value={staffSignup.hospitalId}
                  onChange={(e) => setStaffSignup({ ...staffSignup, hospitalId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 truncate text-slate-900"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.city} - {h.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Staff / Registration ID</label>
                <input
                  type="text"
                  placeholder="e.g. AYU-EMP-2041"
                  value={staffSignup.staffId}
                  onChange={(e) => setStaffSignup({ ...staffSignup, staffId: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 font-mono text-[11px] text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. Kayachikitsa / Central Lab"
                  value={staffSignup.department}
                  onChange={(e) => setStaffSignup({ ...staffSignup, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">Access Password *</label>
              <input
                type="password"
                required
                placeholder="Set institutional login password"
                value={staffSignup.password}
                onChange={(e) => setStaffSignup({ ...staffSignup, password: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white/95 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30 text-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl btn-brand-primary font-bold shadow-soft transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{loading ? 'Submitting Registration...' : 'Submit Institutional Access Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Subtle, Secondary Demo Shortcut at Bottom */}
        <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <span>Testing the prototype?</span>
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-teal-700 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Try demo account for {activeTab} &rarr;</span>
          </button>
        </div>

      </div>
    </div>
  );
};
