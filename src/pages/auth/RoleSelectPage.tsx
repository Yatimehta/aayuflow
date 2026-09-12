import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake, Stethoscope, Leaf } from 'lucide-react';
import consultationIllustration from '../../assets/images/consultation-illustration.png';
import { useTranslation } from '../../utils/translations';

type SelectableRole = 'patient' | 'doctor' | 'worker';

/* ─── Role data — uses Lucide icons, consistent stroke style ─────────────── */
interface RoleOption {
  role: SelectableRole;
  labelKey: 'role_patient' | 'role_doctor' | 'role_worker';
  pastelbg: string;   // pastel circle background
  iconColor: string;  // saturated icon fill/stroke color
  Icon: React.FC<{ size?: number; color?: string; strokeWidth?: number }>;
}

const ROLES: RoleOption[] = [
  {
    role: 'patient',
    labelKey: 'role_patient',
    pastelbg: '#cef3ed',
    iconColor: '#0d9488',   // teal-600
    Icon: HeartHandshake,
  },
  {
    role: 'doctor',
    labelKey: 'role_doctor',
    pastelbg: '#dbeafe',
    iconColor: '#2563eb',   // blue-600
    Icon: Stethoscope,
  },
  {
    role: 'worker',
    labelKey: 'role_worker',
    pastelbg: '#d1fae5',
    iconColor: '#059669',   // emerald-600
    Icon: Leaf,
  },
];

/* ─── Decorative corner leaf cluster ────────────────────────────────────── */
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

/* ─── Organic blob behind illustration ──────────────────────────────────── */
/*
 * Fix 2: Fully asymmetric, elongated paths — wider than tall, uneven bulges.
 * Fix 3: Smaller overall footprint (460×400) so the blob hugs the illustration
 *        tightly rather than leaving large pale voids around it.
 * The two layers are offset from each other (back layer shifted up-left)
 * so it peeks out unevenly — reads as organic, not concentric.
 * Fixed pixel size prevents browser from squishing paths into a circle.
 */
const OrganicBlob = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      /* Outer blob offset up-left so it peeks unevenly from behind inner blob */
      transform: 'translate(-54%, -52%)',
      /* Scaled up from 500×440 to fill more of the left panel */
      width: 620,
      height: 560,
      zIndex: 0,
      pointerEvents: 'none',
    }}
  >
    <svg viewBox="0 0 620 560" width="620" height="560" fill="none">
      {/* Outer blob — elongated, asymmetric, peeks top-left */}
      <path
        d="
          M 75,38
          C 175,-50  460,-25  558,76
          C 632,158  608,385  508,465
          C 408,543  150,558  56,460
          C -38,362  -22,126  75,38 Z
        "
        fill="#9deadc"
        opacity="0.45"
      />
      {/* Inner blob — offset right/down, different silhouette for depth */}
      <path
        d="
          M 105,68
          C 192,-6  440,0  528,97
          C 605,184  590,397  496,474
          C 402,548  162,556  84,462
          C 10,370  18,143  105,68 Z
        "
        fill="#f0fdf9"
        opacity="1"
      />
    </svg>
  </div>
);

/* ─── Component ─────────────────────────────────────────────────────────── */
export const RoleSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const handleRoleSelect = (role: SelectableRole) => {
    navigate(`/login?role=${role}`);
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 18% 55%, #ccf5ed 0%, #e8faf6 42%, #f5fefa 100%)',
      }}
    >
      {/* ── Corner leaf decorations ──────────────────────────────────────── */}
      <LeafCluster className="absolute bottom-0 left-0 w-28 md:w-40 opacity-80 pointer-events-none z-10" />
      <LeafCluster flipped className="absolute bottom-0 right-0 w-28 md:w-40 opacity-60 pointer-events-none z-10" />

      {/* ══════════════════════════════════════════════════════════════
          LEFT — Illustration floating on organic blob (~50%)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative w-full md:w-1/2 flex items-center justify-center
          min-h-[320px] md:min-h-screen
          px-2 py-8 md:py-4
        "
      >
        {/* Organic blob behind illustration */}
        <OrganicBlob />

        {/*
          mix-blend-mode: multiply removes white PNG background.
          mask-image fades bottom edge to dissolve ground-shadow artifact.
          Illustration enlarged to 520px so it fills the bigger blob confidently.
        */}
        <img
          src={consultationIllustration}
          alt="Doctor consulting with a patient at a desk"
          className="relative z-10 w-full h-auto object-contain"
          style={{
            maxWidth: 520,
            maxHeight: '72vh',
            mixBlendMode: 'multiply',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 78%, transparent 100%)',
            maskImage:
              'linear-gradient(to bottom, black 78%, transparent 100%)',
          }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RIGHT — Heading + role circles (~50%)
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="
          relative z-20 w-full md:w-1/2
          flex flex-col
          px-8 sm:px-12 md:px-14
          py-10 md:py-0
        "
        style={{
          justifyContent: 'center',
          /* Optical centering: push content slightly above mathematical mid */
          paddingTop: '4vh',
          paddingBottom: '2vh',
        }}
      >
        {/* Back link */}
        <button
          id="role-select-back-btn"
          onClick={() => navigate('/')}
          className="
            self-start text-base font-semibold text-slate-500
            hover:text-slate-800 transition-colors mb-6 tracking-wide
          "
        >
          ← {t('rs_back')}
        </button>

        {/* Two-tone heading — larger, bolder hero sizing */}
        <div className="mb-4">
          <h1
            className="font-bold leading-[1.1]"
            style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)' }}
          >
            <span style={{ color: '#0f172a', display: 'block' }}>{t('rs_title_1')}</span>
            <span style={{ color: '#0d9488', display: 'block' }}>{t('rs_title_2')}</span>
          </h1>
          <p className="mt-2 text-slate-500 text-base leading-relaxed max-w-sm">
            {t('rs_subtitle')}
          </p>
        </div>

        {/* ── 3 Pastel circle role buttons ── */}
        <div className="flex flex-row flex-wrap gap-10 sm:gap-14 mt-5">
          {ROLES.map(({ role, labelKey, pastelbg, iconColor, Icon }) => (
            <button
              key={role}
              id={`role-btn-${role}`}
              onClick={() => handleRoleSelect(role)}
              className="group flex flex-col items-center gap-4 cursor-pointer focus:outline-none"
              style={{ background: 'none', border: 'none', padding: 0 }}
            >
              {/* Pastel circle — enlarged to 160px */}
              <div
                className="
                  flex items-center justify-center rounded-full
                  transition-all duration-200 ease-out
                  group-hover:scale-105 group-active:scale-95
                  group-hover:shadow-xl
                "
                style={{
                  width: 160,
                  height: 160,
                  backgroundColor: pastelbg,
                  boxShadow: '0 6px 24px rgba(0,0,0,0.09)',
                }}
              >
                <Icon size={58} color={iconColor} strokeWidth={1.5} />
              </div>

              {/* Label */}
              <span
                className="font-bold text-base tracking-wide transition-opacity group-hover:opacity-75"
                style={{ color: '#0f172a' }}
              >
                {t(labelKey)}
              </span>
            </button>
          ))}
        </div>


      </div>
    </div>
  );
};
