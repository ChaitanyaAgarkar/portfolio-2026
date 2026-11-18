import { sphereSynth } from '@/lib/audio/sphereSynth';
import { SPHERE_ACCENTS, useUIStore } from '@/stores/uiStore';

interface SphereDot {
  cx: number;
  cy: number;
  r: number;
  variant: 'dark' | 'white' | 'accent';
}

const CLUSTER_SPHERES: SphereDot[] = [
  { cx: 120, cy: 105, r: 34, variant: 'dark' },
  { cx: 64, cy: 64, r: 30, variant: 'accent' },
  { cx: 196, cy: 174, r: 44, variant: 'dark' },
  { cx: 170, cy: 238, r: 40, variant: 'accent' },
  { cx: 162, cy: 274, r: 42, variant: 'white' },
  { cx: 245, cy: 220, r: 46, variant: 'white' },
  { cx: 298, cy: 184, r: 42, variant: 'dark' },
  { cx: 342, cy: 158, r: 46, variant: 'dark' },
  { cx: 298, cy: 254, r: 46, variant: 'white' },
  { cx: 356, cy: 238, r: 44, variant: 'white' },
  { cx: 382, cy: 288, r: 40, variant: 'white' },
  { cx: 218, cy: 298, r: 46, variant: 'accent' },
  { cx: 272, cy: 320, r: 46, variant: 'accent' },
  { cx: 330, cy: 318, r: 44, variant: 'accent' },
];

/**
 * Transparent static studio sphere cluster rendered during SSR, reduced-motion mode,
 * or environments without hardware 3D acceleration, blending seamlessly over Hero #EEEEEE.
 */
export function SpheresFallback({
  className = '',
  interactive = false,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const heroAccentIndex = useUIStore((s) => s.heroAccentIndex);
  const cycleHeroAccent = useUIStore((s) => s.cycleHeroAccent);
  const accentColor = SPHERE_ACCENTS[heroAccentIndex];

  const handleClick = () => {
    sphereSynth.playAccentShift((heroAccentIndex + 1) % SPHERE_ACCENTS.length);
    cycleHeroAccent();
  };

  return (
    <div
      onClick={interactive ? handleClick : undefined}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      aria-label={interactive ? 'Interactive studio spheres palette switcher' : undefined}
      className={`relative flex h-full w-full items-center justify-end bg-transparent select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <svg
        viewBox="0 0 480 420"
        className="h-[320px] w-auto max-w-[92vw] transition-transform duration-500 ease-out hover:scale-[1.02] sm:h-[420px] lg:mr-[5%] lg:h-[520px]"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sphere-dark" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#525252" />
            <stop offset="55%" stopColor="#261315" />
            <stop offset="88%" stopColor="#1A0C0E" />
            <stop offset="100%" stopColor="#D62828" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id="sphere-white" cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="68%" stopColor="#ECECEC" />
            <stop offset="92%" stopColor="#DCDCDC" />
            <stop offset="100%" stopColor="#D97777" stopOpacity="0.45" />
          </radialGradient>
          <radialGradient id="sphere-accent" cx="36%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
            <stop offset="28%" stopColor={accentColor} />
            <stop offset="88%" stopColor={accentColor} />
            <stop offset="100%" stopColor="#111111" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        {CLUSTER_SPHERES.map((s, idx) => (
          <circle
            key={idx}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            onMouseEnter={interactive ? () => sphereSynth.playHoverPing(idx) : undefined}
            className={
              interactive ? 'transition-transform duration-300 hover:scale-[1.04]' : undefined
            }
            style={{ transformOrigin: `${s.cx}px ${s.cy}px` }}
            fill={
              s.variant === 'dark'
                ? 'url(#sphere-dark)'
                : s.variant === 'white'
                  ? 'url(#sphere-white)'
                  : 'url(#sphere-accent)'
            }
          />
        ))}
      </svg>
    </div>
  );
}
