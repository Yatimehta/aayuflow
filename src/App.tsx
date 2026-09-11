import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/Toast';

// Auth Pages (new 3-step flow)
import { HomePage } from './pages/auth/HomePage';
import { RoleSelectPage } from './pages/auth/RoleSelectPage';
import { LoginPage } from './pages/auth/LoginPage';

// Legacy full-form login (kept at /login-full)
import { UniversalLogin } from './pages/auth/UniversalLogin';

// Landing Page (Moved to /about)
import { LandingPage } from './pages/LandingPage';

// Patient Portal Pages
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientLanguageSelect } from './pages/patient/PatientLanguageSelect';
import { PatientRegistration } from './pages/patient/PatientRegistration';
import { PatientConsent } from './pages/patient/PatientConsent';
import { PatientIntakePath } from './pages/patient/PatientIntakePath';
import { PatientAyurvedaIntake } from './pages/patient/PatientAyurvedaIntake';
import { PatientIntake } from './pages/patient/PatientIntake';
import { PatientUploadDocument } from './pages/patient/PatientUploadDocument';
import { PatientRecords } from './pages/patient/PatientRecords';
import { PatientTokenConfirmation } from './pages/patient/PatientTokenConfirmation';
import { PatientPortal } from './pages/patient/PatientPortal';

// Worker Portal Pages
import { WorkerLayout } from './pages/worker/WorkerLayout';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { WorkerLogin } from './pages/worker/WorkerLogin';
import { WorkerAssistIntake } from './pages/worker/WorkerAssistIntake';
import { WorkerPatients } from './pages/worker/WorkerPatients';
import { WorkerDocuments } from './pages/worker/WorkerDocuments';
import { WorkerQueue } from './pages/worker/WorkerQueue';
import { WorkerSettings } from './pages/worker/WorkerSettings';

// Doctor Portal Pages
import { DoctorLayout } from './pages/doctor/DoctorLayout';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorLogin } from './pages/doctor/DoctorLogin';
import { DoctorPatientProfile } from './pages/doctor/DoctorPatientProfile';
import { DoctorVerify } from './pages/doctor/DoctorVerify';
import { DoctorConsultation } from './pages/doctor/DoctorConsultation';
import { DoctorSettings } from './pages/doctor/DoctorSettings';
import { AyurvedicDashboard } from './pages/doctor/AyurvedicDashboard';
import { DoctorProfile } from './pages/doctor/DoctorProfile';

// Navbar is hidden on the 3 auth-flow screens — they are full-screen branded layouts
const AUTH_PATHS = ['/', '/role-select', '/login'];

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthScreen = AUTH_PATHS.includes(location.pathname);
  return (
    <div className="min-h-screen bg-[#F4FBF9] text-[#0D2B3E] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#146356] selection:text-white">
      {!isAuthScreen && (
        <>
          {/* Subtle faint ambient DNA/geometric line texture in background (~8% opacity) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
            <svg
              className="absolute -bottom-24 -left-24 w-[650px] h-[650px] stroke-[#146356]"
              fill="none"
              viewBox="0 0 400 400"
            >
              <circle cx="200" cy="200" r="160" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="200" cy="200" r="120" strokeWidth="0.75" />
              <path d="M50 200 Q125 100 200 200 T350 200" strokeWidth="1.2" />
              <path d="M50 200 Q125 300 200 200 T350 200" strokeWidth="1.2" />
            </svg>
            <svg
              className="absolute -top-32 -right-32 w-[750px] h-[750px] stroke-[#146356]"
              fill="none"
              viewBox="0 0 500 500"
            >
              <ellipse cx="250" cy="250" rx="220" ry="140" transform="rotate(-30 250 250)" strokeWidth="1" strokeDasharray="3 5" />
              <ellipse cx="250" cy="250" rx="180" ry="100" transform="rotate(-30 250 250)" strokeWidth="0.8" />
              <path d="M50 250 C150 100, 350 400, 450 250" strokeWidth="1.5" />
              <path d="M50 250 C150 400, 350 100, 450 250" strokeWidth="1.5" />
            </svg>
          </div>
          <Navbar />
        </>
      )}
      <div className={isAuthScreen ? '' : 'flex-1 flex flex-col relative z-10'}>
        {children}
      </div>
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          {/* Main Application Routes */}
          <Routes>
              {/* ── 3-Step Auth Flow ── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/role-select" element={<RoleSelectPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Legacy full-form login (all 5 roles) */}
              <Route path="/login-full" element={<UniversalLogin />} />

              {/* Marketing / Hero */}
              <Route path="/about" element={<LandingPage />} />

              {/* Patient Portal */}
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/language" element={<PatientLanguageSelect />} />
              <Route path="/patient/registration" element={<PatientRegistration />} />
              <Route path="/patient/consent" element={<PatientConsent />} />
              <Route path="/patient/intake-path" element={<PatientIntakePath />} />
              <Route path="/patient/intake-ayurveda" element={<PatientAyurvedaIntake />} />
              <Route path="/patient/dashboard" element={<PatientDashboard />} />
              <Route path="/patient/intake" element={<PatientIntake />} />
              <Route path="/patient/upload" element={<PatientUploadDocument />} />
              <Route path="/patient/records" element={<PatientRecords />} />
              <Route path="/patient/token" element={<PatientTokenConfirmation />} />

              {/* AYUSH Worker Portal */}
              <Route path="/worker" element={<WorkerLayout />}>
                <Route index element={<WorkerAssistIntake />} />
                <Route path="dashboard" element={<WorkerDashboard />} />
                <Route path="login" element={<WorkerLogin />} />
                <Route path="assist" element={<WorkerAssistIntake />} />
                <Route path="patients" element={<WorkerPatients />} />
                <Route path="documents" element={<WorkerDocuments />} />
                <Route path="queue" element={<WorkerQueue />} />
                <Route path="settings" element={<WorkerSettings />} />
              </Route>

              {/* Doctor Portal */}
              <Route path="/doctor" element={<DoctorLayout />}>
                <Route index element={<DoctorDashboard />} />
                <Route path="login" element={<DoctorLogin />} />
                <Route path="queue" element={<DoctorDashboard />} />
                <Route path="patient" element={<DoctorPatientProfile />} />
                <Route path="verify" element={<DoctorVerify />} />
                <Route path="consultation" element={<DoctorConsultation />} />
                <Route path="ayurveda-view" element={<AyurvedicDashboard />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="settings" element={<DoctorSettings />} />
              </Route>

              {/* Role-restricted redirects */}
              <Route path="/lab/*" element={<Navigate to="/doctor" replace />} />
              <Route path="/admin/*" element={<Navigate to="/doctor" replace />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
