import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Fingerprint,
  Mail,
  ShieldCheck,
  HeartHandshake,
  Stethoscope,
  Users,
  ShieldAlert,
  FlaskConical,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import consultationIllustration from '../../assets/images/consultation-illustration.png';

type AuthRole = 'patient' | 'worker' | 'doctor' | 'admin' | 'lab';

const ROLE_META: Record<AuthRole, { label: string; icon: React.FC<{ className?: string }>; badgeBg: string; badgeText: string; iconColor: string }> = {
  patient: { label: 'Patient',      icon: HeartHandshake, badgeBg: '#cef3ed', badgeText: '#0d9488', iconColor: '#0d9488' },
  doctor:  { label: 'Doctor',       icon: Stethoscope,    badgeBg: '#dbeafe', badgeText: '#2563eb', iconColor: '#2563eb' },
  worker:  { label: 'AYUSH Worker', icon: Users,          badgeBg: '#d1fae5', badgeText: '#059669', iconColor: '#059669' },
  admin:   { label: 'Admin',        icon: ShieldAlert,    badgeBg: '#fee2e2', badgeText: '#dc2626', iconColor: '#dc2626' },
  lab:     { label: 'Lab Staff',    icon: FlaskConical,   badgeBg: '#fef3c7', badgeText: '#d97706', iconColor: '#d97706' },
};

const demoProfiles: Record<Exclude<UserRole, 'guest'>, { identifier: string; pass: string; title: string; dest: string }> = {
  patient: { identifier: '45-9821-4321-7890',       pass: 'patient2026',  title: 'Rameshwar Sharma (Patient)',            dest: '/patient/dashboard' },
  worker:  { identifier: 'worker.desk@aiia.gov.in',  pass: 'worker2026',   title: 'Priya Narayanan (OPD Assistant)',       dest: '/worker' },
  doctor:  { identifier: 'dr.alok.verma@aiia.gov.in',pass: 'vaidya2026',  title: 'Dr. Alok Verma, MD (Ayu)',              dest: '/doctor' },
  admin:   { identifier: 'admin.director@aiia.gov.in',pass: 'admin2026',   title: 'Col. Rajesh Bakshi (Medical Sup.)',     dest: '/admin' },
  lab:     { identifier: 'lab.staff@aiia.gov.in',    pass: 'ayushlab2026', title: 'Ananya Deshmukh (Lab Staff)',           dest: '/lab'   },
};

/* ─── Decorative corner leaf cluster (shared with RoleSelectPage) ─────────── */
const LeafCluster = ({ className, flipped = false }: { className?: string; flipped?: boolean }) => (
  <svg
    viewBox="0 0 120 180"
    className={className}
    style={{ transform: flipped ? 'scaleX(-1)' : undefined }}
    fill="none"
    aria-hidden="true"
  >
    <path d="M60 170 Q58 120 55 90" stroke="#5eead4" strokeWidth="3" strokeLinecap="round" />
    <path d="M55 90 C30 70 10 40 35 20 C55 50 60 80 55 90Z" fill="#99f6e4" opacity="0.75" />
    <path d="M55 90 C80 70 100 40 75 20 C55 50 50 80 55 90Z" fill="#5eead4" opacity="0.55" />
    <path d="M57 120 C40 105 25 85 45 68 C58 90 60 110 57 120Z" fill="#99f6e4" opacity="0.6" />
    <path d="M57 120 C74 105 89 85 69 68 C56 90 54 110 57 120Z" fill="#5eead4" opacity="0.45" />
    <path d="M55 65 C48 50 50 35 58 30 C62 45 60 58 55 65Z" fill="#2dd4bf" opacity="0.55" />
  </svg>
);

/* ─── Organic blob (identical to RoleSelectPage) ─────────────────────────── */
const OrganicBlob = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-54%, -52%)',
      width: 620,
      height: 560,
      zIndex: 0,
      pointerEvents: 'none',
    }}
  >
    <svg viewBox="0 0 620 560" width="620" height="560" fill="none">
      <path
        d="M 75,38 C 175,-50 460,-25 558,76 C 632,158 608,385 508,465
           C 408,543 150,558 56,460 C -38,362 -22,126 75,38 Z"
        fill="#9deadc"
        opacity="0.45"
      />
      <path
        d="M 105,68 C 192,-6 440,0 528,97 C 605,184 590,397 496,474
           C 402,548 162,556 84,462 C 10,370 18,143 105,68 Z"
        fill="#f0fdf9"
        opacity="1"
      />
    </svg>
  </div>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients, selectedHospital, loginAsPatient, loginAsStaff, showToast } = useApp();

  const rawRole = searchParams.get('role') as AuthRole | null;
  const activeTab: AuthRole = (rawRole && ROLE_META[rawRole]) ? rawRole : 'patient';

  const [loginIdentifier, setLoginIdentifier] = useState(demoProfiles[activeTab].identifier);
  const [loginPassword, setLoginPassword]     = useState(demoProfiles[activeTab].pass);
  const [loading, setLoading]                 = useState(false);

  const meta    = ROLE_META[activeTab];
  const RoleIcon = meta.icon;

  /* ── Auth handlers (logic unchanged from UniversalLogin) ── */
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
        showToast({ type: 'success', title: 'Welcome Back', message: `Signed in as ${matched.name}.` });
        navigate('/patient/dashboard');
      } else {
        const demo = demoProfiles[activeTab];
        loginAsStaff(activeTab, demo.title, selectedHospital.name);
        showToast({ type: 'success', title: 'Authentication Successful', message: `Signed in as ${demo.title}.` });
        navigate(demo.dest);
      }
    }, 600);
  };

  const handleQuickDemoFill = () => {
    const demo = demoProfiles[activeTab];
    setLoginIdentifier(demo.identifier);
    setLoginPassword(demo.pass);
    showToast({ type: 'info', title: 'Demo Credentials Loaded', message: `Populated demo profile for ${demo.title}.` });
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 18% 55%, #ccf5ed 0%, #e8faf6 42%, #f5fefa 100%)',
      }}
    >
      {/* ── Corner leaf decorations ─────────────────────────────────────── */}
      <LeafCluster className="absolute bottom-0 left-0 w-28 md:w-40 opacity-80 pointer-events-none z-10" />
      <LeafCluster flipped className="absolute bottom-0 right-0 w-28 md:w-40 opacity-60 pointer-events-none z-10" />

      {/* ══════════════════════════════════════════════════════════════
          LEFT — Illustration + organic blob (identical to RoleSelectPage)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative w-full md:w-1/2 flex items-center justify-center
          min-h-[320px] md:min-h-screen
          px-2 py-8 md:py-4
        "
      >
        <OrganicBlob />
        <img
          src={consultationIllustration}
          alt="Doctor consulting with a patient at a desk"
          className="relative z-10 w-full h-auto object-contain"
          style={{
            maxWidth: 520,
            maxHeight: '72vh',
            mixBlendMode: 'multiply',
            WebkitMaskImage: 'linear-gradient(to bottom, black 78%, transparent 100%)',
            maskImage:        'linear-gradient(to bottom, black 78%, transparent 100%)',
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT — Login form
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative z-20 w-full md:w-1/2
          flex flex-col
          px-8 sm:px-12 md:px-14
          py-10 md:py-0
        "
        style={{ justifyContent: 'center', paddingTop: '4vh', paddingBottom: '2vh' }}
      >
        {/* Back link */}
        <button
          id="login-back-btn"
          onClick={() => navigate('/role-select')}
          className="
            self-start text-base font-semibold text-slate-500
            hover:text-slate-800 transition-colors mb-6 tracking-wide
          "
        >
          ← Back
        </button>

        {/* Two-tone heading */}
        <div className="mb-5">
          <h1
            className="font-bold leading-[1.1]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}
          >
            <span style={{ color: '#0f172a', display: 'block' }}>Welcome</span>
            <span style={{ color: '#0d9488', display: 'block' }}>Back!</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-sm">
            {activeTab === 'patient'
              ? 'Sign in with your ABHA Number, Mobile, or Token ID.'
              : 'Sign in with your institutional credentials.'}
          </p>
        </div>

        {/* Role badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 self-start"
          style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
        >
          <RoleIcon className="w-4 h-4" />
          Signing in as {meta.label}
        </div>

        {/* Login form — max-width matches right panel feel */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-sm w-full">

          {/* Identifier */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {activeTab === 'patient' ? 'ABHA Number, Mobile, or Token ID' : 'Official Email / Employee ID'}
            </label>
            <div className="relative">
              {activeTab === 'patient'
                ? <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                : <Mail        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              }
              <input
                id="login-identifier"
                type="text"
                required
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                placeholder={activeTab === 'patient' ? 'e.g. 45-9821-4321-7890' : 'e.g. staff@aiia.gov.in'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                           text-sm text-slate-800 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => showToast({ type: 'info', title: 'Password Reset', message: 'Recovery instructions sent to registered mobile/email.' })}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="login-password"
                type="password"
                required
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                           text-sm text-slate-800 shadow-sm"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm text-white
                       transition-all flex items-center justify-center gap-2 mt-1
                       disabled:opacity-70"
            style={{
              background: loading
                ? '#5eada8'
                : 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
              boxShadow: '0 4px 18px rgba(13,148,136,0.30)',
            }}
          >
            <span>{loading ? 'Authenticating…' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* ABDM trust note */}
        <div className="flex items-center gap-2 mt-5 max-w-sm">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-teal-500" />
          <span className="text-xs text-slate-400 leading-snug">
            Secured by ABDM FHIR Gateway — all data encrypted end-to-end.
          </span>
        </div>

        {/* Demo shortcut */}
        <div className="mt-4 max-w-sm flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
          <span>Testing the prototype?</span>
          <button
            type="button"
            id="demo-fill-btn"
            onClick={handleQuickDemoFill}
            className="text-teal-600 font-semibold hover:underline"
          >
            Try demo account →
          </button>
        </div>
      </div>
    </div>
  );
};
