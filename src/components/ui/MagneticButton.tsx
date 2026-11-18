import { forwardRef, useEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils/cn';

type MagneticVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface BaseProps {
  children: ReactNode;
  variant?: MagneticVariant;
  cursorLabel?: string;
  className?: string;
  strength?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

type ButtonProps = BaseProps & {
  href?: undefined;
  to?: undefined;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
};

type AnchorProps = BaseProps & {
  href: string;
  to?: undefined;
  download?: string | boolean;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

type RouterLinkProps = BaseProps & {
  to: string;
  href?: undefined;
  onClick?: () => void;
};

export type MagneticButtonProps = ButtonProps | AnchorProps | RouterLinkProps;

const VARIANT_CLASSES: Record<MagneticVariant, string> = {
  primary:
    'group relative overflow-hidden bg-[#2060FF] text-white font-semibold hover:bg-[#164CE0] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2060FF]/25 border border-[#2060FF] shadow-md shadow-[#2060FF]/20',
  secondary:
    'group relative overflow-hidden bg-white text-[#111111] border border-black/12 shadow-xs hover:-translate-y-0.5 hover:border-[#2060FF]/60 hover:text-[#164CE0] hover:shadow-md',
  outline:
    'group relative overflow-hidden bg-white/80 text-[#111111] border border-black/15 hover:-translate-y-0.5 hover:border-[#2060FF]/60 hover:bg-white hover:shadow-sm',
  ghost:
    'group relative overflow-hidden bg-transparent text-[#555555] hover:text-[#111111] border border-transparent hover:border-black/12 hover:bg-white/60',
};

export const MagneticButton = forwardRef<HTMLElement, MagneticButtonProps>(
  function MagneticButton(props, forwardedRef) {
    const {
      children,
      variant = 'primary',
      cursorLabel = 'OPEN',
      className,
      strength = 0.24,
      disabled = false,
      'aria-label': ariaLabel,
    } = props;

    const innerRef = useRef<HTMLElement | null>(null);
    const reducedMotion = useReducedMotion();
    const setCursor = useUIStore((s) => s.setCursor);
    const resetCursor = useUIStore((s) => s.resetCursor);

    const assignRef = (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    useEffect(() => {
      const el = innerRef.current;
      if (!el || reducedMotion || disabled || typeof window === 'undefined') return;
      if (!window.matchMedia('(pointer: fine)').matches) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });

      const onMove = (event: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = event.clientX - (rect.left + rect.width / 2);
        const relY = event.clientY - (rect.top + rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
      };

      const onEnter = () => {
        setCursor('magnetic', cursorLabel);
      };

      const onLeave = () => {
        xTo(0);
        yTo(0);
        resetCursor();
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);

      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
        gsap.set(el, { x: 0, y: 0 });
      };
    }, [reducedMotion, disabled, strength, cursorLabel, setCursor, resetCursor]);

    const sharedClasses = cn(
      'inline-flex items-center justify-center gap-2.5 rounded-lg px-5 py-3 text-sm tracking-wide transition-colors duration-200 select-none disabled:pointer-events-none disabled:opacity-50',
      VARIANT_CLASSES[variant],
      className,
    );

    if ('to' in props && props.to !== undefined) {
      return (
        <Link
          ref={assignRef as (node: HTMLAnchorElement | null) => void}
          to={props.to}
          onClick={props.onClick}
          aria-label={ariaLabel}
          className={sharedClasses}
          data-cursor-label={cursorLabel}
        >
          {children}
        </Link>
      );
    }

    if ('href' in props && props.href !== undefined) {
      return (
        <a
          ref={assignRef as (node: HTMLAnchorElement | null) => void}
          href={props.href}
          download={props.download}
          target={props.target}
          rel={props.target === '_blank' ? (props.rel ?? 'noopener noreferrer') : props.rel}
          onClick={props.onClick}
          aria-label={ariaLabel}
          className={sharedClasses}
          data-cursor-label={cursorLabel}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={assignRef as (node: HTMLButtonElement | null) => void}
        type={props.type ?? 'button'}
        onClick={props.onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={sharedClasses}
        data-cursor-label={cursorLabel}
      >
        {children}
      </button>
    );
  },
);

