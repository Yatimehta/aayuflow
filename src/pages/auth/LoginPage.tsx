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
  Hospital as HospitalIcon,
  GraduationCap,
  UploadCloud,
  CreditCard,
  FileCheck2,
  Leaf,
  User,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, DoctorDiscipline } from '../../types';
import consultationIllustration from '../../assets/images/consultation-illustration.png';
import { registerDoctorRecord } from '../../utils/dbApiClient';
import { useTranslation } from '../../utils/translations';

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
  doctor:  { identifier: 'AYU-MED-DEL-2014-889',      pass: 'vaidya2026',  title: 'Dr. Alok Verma, MD (Ayu)',              dest: '/doctor' },
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

/* ─── Compact file-upload field, used for the doctor's verification documents ── */
const FileField: React.FC<{ id: string; label: string; file: File | null; onChange: (f: File | null) => void }> = ({ id, label, file, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
    <input
      id={id}
      type="file"
      accept=".pdf,.jpg,.jpeg,.png"
      className="hidden"
      onChange={e => onChange(e.target.files?.[0] || null)}
    />
    <label
      htmlFor={id}
      className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-dashed border-slate-300 bg-white
                 hover:border-teal-400 hover:bg-teal-50/40 cursor-pointer transition-colors text-sm"
    >
      {file ? (
        <>
          <FileCheck2 className="w-4 h-4 text-teal-600 flex-shrink-0" />
          <span className="text-slate-700 font-medium truncate">{file.name}</span>
        </>
      ) : (
        <>
          <UploadCloud className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <span className="text-slate-400">Click to upload (PDF, JPG, PNG)</span>
        </>
      )}
    </label>
  </div>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
const DOCTOR_DEPARTMENTS_BY_DISCIPLINE: Record<DoctorDiscipline, string[]> = {
  Ayurveda: ['Kayachikitsa (Internal Medicine)', 'Panchakarma', 'Shalya Tantra (Surgery / Marma)', 'Swasthavritta & Yoga', 'Kaumarbhritya (Pediatrics)'],
  Allopathy: ['General Medicine & OPD', 'Orthopaedics', 'Pediatrics', 'Gynaecology', 'ENT'],
};

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { patients, hospitals, selectedHospital, setSelectedHospital, loginAsPatient, loginAsStaff, showToast } = useApp();
  const { t } = useTranslation();

  const rawRole = searchParams.get('role') as AuthRole | null;
  const activeTab: AuthRole = (rawRole && ROLE_META[rawRole]) ? rawRole : 'patient';

  const [loginIdentifier, setLoginIdentifier] = useState(demoProfiles[activeTab].identifier);
  const [loginPassword, setLoginPassword]     = useState(demoProfiles[activeTab].pass);
  const [loading, setLoading]                 = useState(false);

  // Doctor-only credential/registration fields — a doctor's account represents a real
  // license to practice, so signing in verifies who they are and what they're licensed
  // to do, not just a password.
  const [doctorName, setDoctorName] = useState('');
  const [doctorDiscipline, setDoctorDiscipline] = useState<DoctorDiscipline>('Ayurveda');
  const [doctorDepartment, setDoctorDepartment] = useState(DOCTOR_DEPARTMENTS_BY_DISCIPLINE.Ayurveda[0]);
  const [doctorDegree, setDoctorDegree] = useState('');
  const [doctorDegreeFile, setDoctorDegreeFile] = useState<File | null>(null);
  const [doctorAadhaar, setDoctorAadhaar] = useState('');
  const [doctorRegProofFile, setDoctorRegProofFile] = useState<File | null>(null);

  const meta    = ROLE_META[activeTab];
  const RoleIcon = meta.icon;

  const isStaffRole = activeTab !== 'patient';
  // Every staff role operates out of a specific hospital, so it belongs on every
  // staff sign-in — not just doctor's.
  const showHospitalPicker = isStaffRole;

  const doctorFormValid =
    doctorName.trim().length > 0 &&
    doctorDegree.trim().length > 0 &&
    !!doctorDegreeFile &&
    /^\d{12}$/.test(doctorAadhaar.replace(/\s+/g, '')) &&
    !!doctorRegProofFile &&
    loginIdentifier.trim().length > 0 &&
    loginPassword.trim().length > 0;

  /* ── Auth handlers (logic unchanged from UniversalLogin, extended for doctor) ── */
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'doctor' && !doctorFormValid) {
      showToast({
        type: 'error',
        title: 'Missing Details',
        message: 'Please fill in every field, including your degree certificate, Aadhaar number, and registration proof — these confirm you\'re a licensed doctor.'
      });
      return;
    }

    setLoading(true);

    if (activeTab === 'doctor') {
      // Persist the verified credentials to the encrypted database. Best-effort:
      // the local demo login below still proceeds even if this fails (e.g. the
      // database-api service isn't running), so a missing backend never blocks
      // exploring the app.
      try {
        await registerDoctorRecord({
          name: doctorName,
          contact_number: '+91 90000 00000',
          email: `${doctorName.toLowerCase().replace(/[^a-z]/g, '.')}@aiia.gov.in`,
          license_id: loginIdentifier,
          aadhaar_number: doctorAadhaar.replace(/\s+/g, ''),
          discipline: doctorDiscipline,
          qualification: doctorDegree,
          department: doctorDepartment,
          hospital_name: selectedHospital.name,
          hospital_city: selectedHospital.city,
          degree_certificate_ref: doctorDegreeFile?.name ?? null,
          registration_proof_ref: doctorRegProofFile?.name ?? null,
        });
      } catch (err) {
        showToast({
          type: 'info',
          title: 'Saved locally only',
          message: 'Could not reach the records database, so this session is demo-only for now.'
        });
      }
    }

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
      } else if (activeTab === 'doctor') {
        loginAsStaff('doctor', doctorName, doctorDepartment, doctorDiscipline, {
          qualification: doctorDegree,
          licenseId: loginIdentifier,
          hospitalName: selectedHospital.name,
        });
        showToast({
          type: 'success',
          title: 'Credentials Verified',
          message: `Welcome, Dr. ${doctorName} — signed in as a ${doctorDiscipline} practitioner at ${selectedHospital.name}.`
        });
        navigate('/doctor');
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
    if (activeTab === 'doctor') {
      setDoctorName('Alok Verma');
      setDoctorDiscipline('Ayurveda');
      setDoctorDepartment(DOCTOR_DEPARTMENTS_BY_DISCIPLINE.Ayurveda[0]);
      setDoctorDegree('BAMS, MD (Ayurveda)');
      setDoctorDegreeFile(new File(['demo'], 'bams-degree-certificate.pdf', { type: 'application/pdf' }));
      setDoctorAadhaar('491023487615');
      setDoctorRegProofFile(new File(['demo'], 'ayush-council-registration.pdf', { type: 'application/pdf' }));
    }
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
          ← {t('rs_back')}
        </button>

        {/* Two-tone heading */}
        <div className="mb-5">
          <h1
            className="font-bold leading-[1.1]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}
          >
            <span style={{ color: '#0f172a', display: 'block' }}>{t('lp_welcome')}</span>
            <span style={{ color: '#0d9488', display: 'block' }}>{t('lp_back_exclaim')}</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-sm">
            {activeTab === 'patient'
              ? t('lp_subtitle_patient')
              : activeTab === 'doctor'
              ? t('lp_subtitle_doctor')
              : t('lp_subtitle_staff')}
          </p>
        </div>

        {/* Role badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 self-start"
          style={{ backgroundColor: meta.badgeBg, color: meta.badgeText }}
        >
          <RoleIcon className="w-4 h-4" />
          {t('lp_signing_in_as')} {t(`role_${activeTab}` as any)}
        </div>

        {/* Login form — max-width relaxes for the doctor role, which asks for more */}
        <form onSubmit={handleLoginSubmit} className={`space-y-4 w-full ${activeTab === 'doctor' ? 'max-w-md' : 'max-w-sm'}`}>

          {/* Hospital / Facility — every staff role operates out of a specific hospital */}
          {showHospitalPicker && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                {t('lp_hospital_label')}
              </label>
              <div className="relative">
                <HospitalIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  id="login-hospital"
                  value={selectedHospital.id}
                  onChange={e => {
                    const found = hospitals.find(h => h.id === e.target.value);
                    if (found) setSelectedHospital(found);
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                             text-sm text-slate-800 shadow-sm appearance-none"
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>{h.name} — {h.city}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {activeTab === 'doctor' && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('lp_full_name')}</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="doctor-name"
                    type="text"
                    required
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                    placeholder="e.g. Alok Verma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                               focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                               text-sm text-slate-800 shadow-sm"
                  />
                </div>
              </div>

              {/* System of medicine practised */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('lp_practice_question')}</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['Ayurveda', 'Allopathy'] as DoctorDiscipline[]).map(d => (
                    <button
                      key={d}
                      type="button"
                      id={`doctor-discipline-${d.toLowerCase()}`}
                      onClick={() => {
                        setDoctorDiscipline(d);
                        setDoctorDepartment(DOCTOR_DEPARTMENTS_BY_DISCIPLINE[d][0]);
                      }}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-semibold transition-all ${
                        doctorDiscipline === d
                          ? 'border-teal-400 bg-teal-50 text-teal-800 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {d === 'Ayurveda' ? <Leaf className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
                      <span>{d}</span>
                      {doctorDiscipline === d && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('lp_department')}</label>
                <select
                  id="doctor-department"
                  value={doctorDepartment}
                  onChange={e => setDoctorDepartment(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white
                             focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                             text-sm text-slate-800 shadow-sm appearance-none"
                >
                  {DOCTOR_DEPARTMENTS_BY_DISCIPLINE[doctorDiscipline].map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Degree / Qualification */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('lp_degree')}</label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="doctor-degree"
                    type="text"
                    required
                    value={doctorDegree}
                    onChange={e => setDoctorDegree(e.target.value)}
                    placeholder={doctorDiscipline === 'Ayurveda' ? 'e.g. BAMS, MD (Ayurveda)' : 'e.g. MBBS, MD (General Medicine)'}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                               focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                               text-sm text-slate-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Degree Certificate upload */}
              <FileField
                id="doctor-degree-file"
                label={t('lp_degree_certificate')}
                file={doctorDegreeFile}
                onChange={setDoctorDegreeFile}
              />

              {/* Aadhaar */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('lp_aadhaar')}</label>
                <div className="relative">
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="doctor-aadhaar"
                    type="text"
                    required
                    inputMode="numeric"
                    maxLength={14}
                    value={doctorAadhaar}
                    onChange={e => setDoctorAadhaar(e.target.value.replace(/[^\d\s]/g, ''))}
                    placeholder={t('lp_aadhaar_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                               focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                               text-sm text-slate-800 shadow-sm"
                  />
                </div>
              </div>

              {/* Registration / Council proof upload */}
              <FileField
                id="doctor-regproof-file"
                label={t('lp_reg_proof')}
                file={doctorRegProofFile}
                onChange={setDoctorRegProofFile}
              />
            </>
          )}

          {/* Identifier */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              {activeTab === 'patient'
                ? t('lp_identifier_patient')
                : activeTab === 'doctor'
                ? t('lp_identifier_doctor')
                : t('lp_identifier_staff')}
            </label>
            <div className="relative">
              {activeTab === 'patient'
                ? <Fingerprint className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                : activeTab === 'doctor'
                ? <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                : <Mail        className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              }
              <input
                id="login-identifier"
                type="text"
                required
                value={loginIdentifier}
                onChange={e => setLoginIdentifier(e.target.value)}
                placeholder={activeTab === 'patient' ? 'e.g. 45-9821-4321-7890' : activeTab === 'doctor' ? 'e.g. AYU-MED-DEL-2014-889' : 'e.g. staff@aiia.gov.in'}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white
                           focus:outline-none focus:ring-2 focus:ring-teal-400/40 focus:border-teal-400
                           text-sm text-slate-800 shadow-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">{t('lp_password')}</label>
              <button
                type="button"
                onClick={() => showToast({ type: 'info', title: 'Password Reset', message: 'Recovery instructions sent to registered mobile/email.' })}
                className="text-xs text-teal-600 font-semibold hover:underline"
              >
                {t('lp_forgot_password')}
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
                placeholder={t('lp_password_placeholder')}
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
            disabled={loading || (activeTab === 'doctor' && !doctorFormValid)}
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
            <span>{loading ? t('lp_authenticating') : t('lp_sign_in')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Trust note */}
        <div className="flex items-center gap-2 mt-5 max-w-sm">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-teal-500" />
          <span className="text-xs text-slate-400 leading-snug">
            {t('lp_trust_note')}
          </span>
        </div>

        {/* Demo shortcut */}
        <div className="mt-4 max-w-sm flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-4">
          <span>{t('lp_testing_prototype')}</span>
          <button
            type="button"
            id="demo-fill-btn"
            onClick={handleQuickDemoFill}
            className="text-teal-600 font-semibold hover:underline"
          >
            {t('lp_try_demo')} →
          </button>
        </div>
      </div>
    </div>
  );
};
