import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Phone,
  Send,
} from 'lucide-react';
import { PROFILE } from '@/data/profile';
import { animateRevealGroup } from '@/lib/animations/gsap';
import {
  ContactFormSchema,
  type ContactFormValues,
  hasConfiguredContactEndpoint,
  submitContactMessage,
} from '@/lib/utils/contactAdapter';
import { MagneticButton } from '@/components/ui/MagneticButton';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const endpointConfigured = hasConfiguredContactEndpoint();

  useEffect(() => {
    const ctx = animateRevealGroup(sectionRef.current, '[data-contact-reveal]', {
      y: 26,
      stagger: 0.1,
    });
    return () => ctx?.revert();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      toast.success('Email copied to clipboard');
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      toast.error('Clipboard permission unavailable; please copy manually.');
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    setSubmissionStatus(null);
    try {
      const result = await submitContactMessage(values);
      if (result.mode === 'api') {
        setSubmissionStatus('Message delivered successfully. Thank you for reaching out.');
        toast.success('Message sent!');
        reset();
      } else {
        setSubmissionStatus(
          'Your email client has been opened with your prefilled message addressed to chaitanyaagarkar11@gmail.com.',
        );
        toast.info('Opened email client with prefilled message.');
      }
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Unable to process message right now.';
      setSubmissionStatus(msg);
      toast.error(msg);
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative z-10 border-t border-black/10 bg-[#EEEEEE] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left editorial CTA & contact channels */}
          <div data-contact-reveal className="min-w-0 lg:col-span-5">
            <p className="typo-eyebrow font-mono text-xs font-semibold tracking-[0.22em] text-[#BE123C] uppercase">
              10 // COLLABORATION NODE
            </p>
            <h2
              id="contact-heading"
              className="typo-heading-hover mt-3 font-display text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl"
            >
              HAVE AN INTERESTING PROBLEM?
            </h2>
            <p className="mt-3 font-display text-xl font-semibold text-[#164CE0] sm:text-2xl">
              LET&apos;S ENGINEER THE SOLUTION.
            </p>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              &ldquo;I&apos;m always interested in meaningful engineering challenges, ambitious
              products, and opportunities to build impactful software.&rdquo;
            </p>

            {/* Direct Channels */}
            <div className="mt-8 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-xs">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex min-w-0 items-center gap-3 text-sm font-medium text-[#111111] hover:text-[#164CE0]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#BE123C]" aria-hidden="true" />
                  <span className="min-w-0 break-all font-mono text-xs sm:text-sm">{PROFILE.email}</span>
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  aria-label="Copy email address"
                  data-cursor-label="COPY"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-[#EEEEEE] px-3 py-1.5 font-mono text-[11px] font-medium text-[#111111] transition-colors hover:border-[#FF4060]/60 hover:text-[#BE123C]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-[#BE123C]" aria-hidden="true" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <a
                href={PROFILE.phoneHref}
                className="group flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 text-sm font-medium text-[#111111] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2060FF]/45 hover:shadow-md"
              >
                <Phone className="h-4 w-4 text-[#164CE0] transition-transform duration-200 group-hover:scale-110" aria-hidden="true" />
                <span className="font-mono text-xs sm:text-sm">{PROFILE.phone}</span>
              </a>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <a
                  href={PROFILE.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-xs font-medium text-[#555555] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF4060]/50 hover:text-[#111111] hover:shadow-md"
                >
                  <span>LinkedIn</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
                <a
                  href={PROFILE.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-xs font-medium text-[#555555] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#2060FF]/50 hover:text-[#111111] hover:shadow-md"
                >
                  <span>GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
                <a
                  href={PROFILE.leetcodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1.5 rounded-xl border border-black/10 bg-white px-3 py-3 font-mono text-xs font-medium text-[#555555] shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#FF4060]/50 hover:text-[#111111] hover:shadow-md"
                >
                  <span>LeetCode</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            data-contact-reveal
            className="studio-card min-w-0 rounded-2xl border border-black/12 bg-white p-5 shadow-sm sm:p-8 lg:col-span-7"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-black/10 pb-4">
              <h3 className="font-display text-xl font-bold text-[#111111]">
                Send an Engineering Inquiry
              </h3>
              <span className="rounded-full border border-black/10 bg-[#FFF1F2] px-3 py-1 font-mono text-[10px] font-semibold text-[#BE123C] uppercase">
                {endpointConfigured ? 'API Endpoint Connected' : 'Prefilled Email Client Mode'}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    {...register('name')}
                    className="mt-2 w-full rounded-lg border border-black/12 bg-[#EEEEEE] px-4 py-3 text-sm text-[#111111] placeholder:text-[#555555]/65 focus:border-[#2060FF] focus:bg-white focus:outline-none"
                  />
                  {errors.name ? (
                    <p id="contact-name-error" role="alert" className="mt-1.5 text-xs text-rose-600">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    {...register('email')}
                    className="mt-2 w-full rounded-lg border border-black/12 bg-[#EEEEEE] px-4 py-3 text-sm text-[#111111] placeholder:text-[#555555]/65 focus:border-[#2060FF] focus:bg-white focus:outline-none"
                  />
                  {errors.email ? (
                    <p
                      id="contact-email-error"
                      role="alert"
                      className="mt-1.5 text-xs text-rose-600"
                    >
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="block font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Role, system architecture, or collaboration topic"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  {...register('subject')}
                  className="mt-2 w-full rounded-lg border border-black/12 bg-[#EEEEEE] px-4 py-3 text-sm text-[#111111] placeholder:text-[#555555]/65 focus:border-[#2060FF] focus:bg-white focus:outline-none"
                />
                {errors.subject ? (
                  <p
                    id="contact-subject-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-600"
                  >
                    {errors.subject.message}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-mono text-xs font-semibold tracking-wider text-[#111111] uppercase"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Share context about the problem, team, or product..."
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  {...register('message')}
                  className="mt-2 w-full resize-y rounded-lg border border-black/12 bg-[#EEEEEE] px-4 py-3 text-sm text-[#111111] placeholder:text-[#555555]/65 focus:border-[#2060FF] focus:bg-white focus:outline-none"
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    role="alert"
                    className="mt-1.5 text-xs text-rose-600"
                  >
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              {!endpointConfigured ? (
                <p className="rounded-lg border border-black/10 bg-[#EEEEEE] px-3.5 py-2.5 font-mono text-[11px] text-[#555555]">
                  Note: No external form backend is configured, so submitting opens your email
                  client with these validated details prefilled for{' '}
                  <span className="font-semibold text-[#111111]">{PROFILE.email}</span>.
                </p>
              ) : null}

              {submissionStatus ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg border border-[#FF4060]/40 bg-[#FFF1F2] px-4 py-3 font-mono text-xs font-medium text-[#BE123C]"
                >
                  {submissionStatus}
                </div>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <MagneticButton
                  type="submit"
                  variant="primary"
                  cursorLabel="SEND"
                  disabled={isSubmitting}
                  className="px-6 py-3.5 font-mono text-xs tracking-[0.14em] uppercase"
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isSubmitting
                      ? 'Preparing...'
                      : endpointConfigured
                        ? 'Send Message'
                        : 'Open Email Client'}
                  </span>
                </MagneticButton>

                <span className="font-mono text-[11px] text-[#555555]">
                  Validated with Zod · React Hook Form
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
