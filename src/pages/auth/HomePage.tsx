import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Leaf,
  Mic,
  FileText,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import ayucarezLogo from '../../assets/images/logo.png';
import ministryOfAyushEmblem from '../../assets/images/ministry-of-ayush-emblem.jpg';

/* ─── Decorative corner leaf cluster (shared with RoleSelectPage) ─────────── */
const LeafCluster = ({
  className,
  flipped = false,
}: {
  className?: string;
  flipped?: boolean;
}) => (
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

/* ─── Ambient Organic Blobs for Background Depth ──────────────────────────── */
const BackgroundBlobs = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
    {/* Upper-right ambient organic blob */}
    <svg
      className="absolute -top-24 right-[-10%] w-[580px] h-[520px] text-teal-200/40"
      viewBox="0 0 620 560"
      fill="none"
    >
      <path
        d="M 75,38 C 175,-50 460,-25 558,76 C 632,158 608,385 508,465 C 408,543 150,558 56,460 C -38,362 -22,126 75,38 Z"
        fill="currentColor"
      />
    </svg>

    {/* Mid-left organic blob */}
    <svg
      className="absolute top-[42%] -left-36 w-[540px] h-[480px] text-teal-100/60"
      viewBox="0 0 620 560"
      fill="none"
    >
      <path
        d="M 105,68 C 192,-6 440,0 528,97 C 605,184 590,397 496,474 C 402,548 162,556 84,462 C 10,370 18,143 105,68 Z"
        fill="currentColor"
      />
    </svg>

    {/* Bottom-center ambient glow */}
    <svg
      className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[700px] h-[450px] text-teal-200/25"
      viewBox="0 0 620 560"
      fill="none"
    >
      <ellipse cx="310" cy="280" rx="280" ry="180" fill="currentColor" />
    </svg>
  </div>
);

/* ─── Walkthrough Step Card Item ─────────────────────────────────────────── */
interface WalkthroughStep {
  step: string;
  icon: React.FC<{ size?: number; className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}

const STEPS: WalkthroughStep[] = [
  {
    step: '01',
    icon: Mic,
    title: 'Share Your History',
    description: 'Speak or type your symptoms and medical history — no forms to fill.',
  },
  {
    step: '02',
    icon: FileText,
    title: 'Instant Digitization',
    description: 'Upload past prescriptions or reports — we digitize and organize them automatically.',
  },
  {
    step: '03',
    icon: Sparkles,
    title: 'AI-Ready for Your Doctor',
    description: 'Your doctor gets a clear, structured summary before you even walk in.',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden flex flex-col font-sans selection:bg-teal-500 selection:text-white"
      style={{
        background:
          'radial-gradient(ellipse at 18% 45%, #ccf5ed 0%, #e8faf6 40%, #f5fefa 100%)',
      }}
    >
      {/* ── Background Blobs & Leaf Accents ─────────────────────────────── */}
      <BackgroundBlobs />
      <LeafCluster className="absolute bottom-0 left-0 w-28 md:w-44 opacity-80 pointer-events-none z-10" />
      <LeafCluster flipped className="absolute bottom-0 right-0 w-28 md:w-44 opacity-60 pointer-events-none z-10" />
      <LeafCluster flipped className="absolute top-16 right-[-20px] w-24 md:w-32 opacity-35 pointer-events-none z-0" />

      {/* ── Fixed Header Element (Ayucarez Logo Top-Left) ─────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 sm:px-12 py-3.5 sm:py-4 flex items-center justify-between bg-[#f4fbfa]/85 backdrop-blur-md border-b border-teal-100/50">
        <div className="flex items-center gap-3">
          <img
            src={ayucarezLogo}
            alt="Ayucarez"
            className="h-9 sm:h-11 w-auto object-contain cursor-pointer transition-opacity hover:opacity-90"
            style={{
              maxWidth: 180,
              mixBlendMode: 'multiply',
            }}
            onClick={() => navigate('/')}
          />
          <div className="w-px h-6 sm:h-7 bg-teal-900/15" />
          <img
            src={ministryOfAyushEmblem}
            alt="Ministry of Ayush, Government of India"
            className="h-7 sm:h-9 w-auto object-contain"
          />
        </div>

        <button
          id="header-login-btn"
          onClick={() => navigate('/role-select')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-teal-800 hover:text-teal-950 px-4 py-2 rounded-full border border-teal-200/80 bg-white/80 shadow-sm hover:shadow transition-all"
        >
          <span>Portal Login</span>
          <ArrowRight className="w-3.5 h-3.5 text-teal-600" />
        </button>
      </header>

      {/* ── Main Scrollable Content Container ─────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-28 sm:pt-36 pb-20 px-6 sm:px-10">

        {/* ════════════════════════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-3xl flex flex-col items-center text-center animate-[fadeInUp_0.5s_ease_both]">
          {/* Two-tone bold hero heading matching RoleSelectPage typography */}
          <h1
            className="font-bold leading-[1.08] tracking-tight text-center"
            style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)' }}
          >
            <span style={{ color: '#0f172a', display: 'block' }}>Accessible Care</span>
            <span style={{ color: '#0d9488', display: 'block' }}>Made for Everyone</span>
          </h1>

          {/* Subtext */}
          <p className="mt-4 sm:mt-5 text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto font-normal">
            Ayurveda and modern medicine, together in one simple health app.
          </p>

          {/* Primary CTA Button */}
          <div className="mt-8">
            <button
              id="home-login-btn"
              onClick={() => navigate('/role-select')}
              className="group inline-flex items-center gap-3 px-9 sm:px-12 py-4 rounded-2xl font-bold text-base sm:text-lg text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)',
                boxShadow: '0 8px 26px rgba(13,148,136,0.35)',
              }}
            >
              <span>Login to Portal</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>

          {/* Trust badges row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/85 border border-teal-200/70 text-teal-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Works with Ayushman Bharat
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/85 border border-teal-200/70 text-teal-800 shadow-sm">
              <Leaf className="w-3.5 h-3.5 text-teal-600" />
              AYUSH Certified
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/85 border border-teal-200/70 text-teal-800 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Your Data Stays Safe
            </span>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════════════════
            APP WALKTHROUGH SECTION ("How Ayucarez Works")
        ════════════════════════════════════════════════════════════════ */}
        <section className="w-full max-w-5xl mt-20 sm:mt-28 flex flex-col items-center">
          {/* Section heading */}
          <div className="text-center mb-10 sm:mb-14">
            <h2
              className="font-bold tracking-tight text-slate-900"
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
            >
              How Ayucarez Works
            </h2>
            <p className="mt-2 text-slate-500 text-sm sm:text-base max-w-md mx-auto">
              A gentle, streamlined intake designed to make your doctor visits effortless.
            </p>
          </div>

          {/* 3 Step Cards */}
          <div className="relative w-full grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {STEPS.map(({ step, icon: StepIcon, title, description }, index) => (
              <div key={step} className="relative flex flex-col">
                <div
                  className="
                    group flex-1 flex flex-col items-center text-center
                    p-8 sm:p-9 rounded-3xl
                    bg-white/75 backdrop-blur-sm
                    border border-white/90
                    shadow-[0_4px_24px_rgba(13,148,136,0.06)]
                    hover:shadow-[0_12px_32px_rgba(13,148,136,0.12)]
                    hover:-translate-y-1
                    transition-all duration-200
                  "
                >
                  {/* Step indicator tag */}
                  <span className="text-[11px] font-bold tracking-widest text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full mb-5 border border-teal-100 uppercase">
                    Step {step}
                  </span>

                  {/* Pale mint circular icon badge (RoleSelect style, ~76px) */}
                  <div
                    className="
                      flex items-center justify-center rounded-full mb-5
                      transition-all duration-200 ease-out
                      group-hover:scale-105
                    "
                    style={{
                      width: 76,
                      height: 76,
                      backgroundColor: '#cef3ed',
                      boxShadow: '0 4px 16px rgba(13,148,136,0.14)',
                    }}
                  >
                    <StepIcon size={34} className="text-teal-700" strokeWidth={1.75} />
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-slate-900 mb-2">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                    {description}
                  </p>
                </div>

                {/* Subtle desktop connector arrow between cards */}
                {index < STEPS.length - 1 && (
                  <div
                    className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center text-teal-400 pointer-events-none"
                    aria-hidden="true"
                  >
                    <div className="w-8 h-8 rounded-full bg-white/90 border border-teal-100 flex items-center justify-center shadow-sm">
                      <ChevronRight className="w-4 h-4 text-teal-500 stroke-[2.5]" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick secondary CTA below walkthrough */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/role-select')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900 transition-colors"
            >
              <span>Ready to begin? Choose your role</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* ── Footer note ─────────────────────────────────────────────────── */}
        <footer className="mt-20 text-center text-xs text-slate-400">
          <p>© 2026 Ayucarez. Making AYUSH healthcare simple for everyone.</p>
        </footer>
      </main>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
