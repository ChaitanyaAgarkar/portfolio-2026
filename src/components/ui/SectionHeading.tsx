import { useEffect, useRef, type ReactNode } from 'react';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  className?: string;
  actions?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  as: HeadingTag = 'h2',
  className,
  actions,
}: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const words = title.trim().split(/\s+/);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof window === 'undefined') return;
    ensureGsapRegistered();

    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const triggerConfig = {
        trigger: el,
        start: 'top 90%',
        once: true,
      };

      const eyebrowNode = el.querySelector<HTMLElement>('[data-typo-eyebrow]');
      const ruleNode = el.querySelector<HTMLElement>('[data-typo-rule]');
      const wordNodes = el.querySelectorAll<HTMLElement>('[data-heading-word]');
      const subtitleNode = el.querySelector<HTMLElement>('[data-typo-subtitle]');

      if (eyebrowNode) {
        gsap.from(eyebrowNode, {
          y: 12,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: triggerConfig,
        });
      }

      if (ruleNode) {
        gsap.from(ruleNode, {
          scaleX: 0,
          transformOrigin: align === 'center' ? 'center center' : 'left center',
          duration: 0.65,
          delay: 0.08,
          ease: 'power3.out',
          clearProps: 'transform',
          scrollTrigger: triggerConfig,
        });
      }

      if (wordNodes.length) {
        gsap.from(wordNodes, {
          yPercent: 105,
          opacity: 0,
          duration: 0.68,
          stagger: 0.05,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: triggerConfig,
        });
      }

      if (subtitleNode) {
        gsap.from(subtitleNode, {
          y: 14,
          opacity: 0,
          duration: 0.62,
          delay: 0.14,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: triggerConfig,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [align, title]);

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex flex-col gap-6',
        actions ? 'lg:flex-row lg:items-end lg:justify-between' : '',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-3xl', align === 'center' && 'mx-auto')}>
        <div
          className={cn(
            'flex items-center gap-3',
            align === 'center' ? 'justify-center' : 'justify-start',
          )}
        >
          <p
            data-typo-eyebrow
            className="typo-eyebrow font-mono text-xs font-semibold tracking-[0.22em] text-[#164CE0] uppercase"
          >
            {eyebrow}
          </p>
          <span
            data-typo-rule
            aria-hidden="true"
            className="hidden h-[1.5px] w-12 rounded-full bg-gradient-to-r from-[#2060FF] to-[#FF4060] sm:inline-block"
          />
        </div>

        <HeadingTag
          aria-label={title}
          className="mt-3 font-display text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
        >
          {words.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className="inline-block overflow-hidden align-bottom">
                <span data-heading-word className="typo-word">
                  {word}
                </span>
              </span>
              {index < words.length - 1 ? ' ' : null}
            </span>
          ))}
        </HeadingTag>

        {subtitle ? (
          <p
            data-typo-subtitle
            className="mt-4 hidden max-w-2xl text-base leading-relaxed text-[#555555] sm:text-lg md:block"
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
