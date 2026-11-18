import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Globe2,
  Layers,
  ShieldCheck,
  Sliders,
} from 'lucide-react';
import { IMPACT_HIGHLIGHTS } from '@/data/enterpriseSystems';
import { ensureGsapRegistered, gsap, prefersReducedMotion } from '@/lib/animations/gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils/cn';

const KPI_METRICS = [
  {
    code: '01 // GOVERNANCE',
    metric: '6-Stage RBAC',
    label: 'Policy state transitions',
    accent: '#2060FF',
  },
  {
    code: '02 // FORM ENGINE',
    metric: '60%+ Saved',
    label: 'Per-policy build effort',
    accent: '#FF4060',
  },
  {
    code: '03 // AI & RPA',
    metric: '60%+ Faster',
    label: 'Automated pre-verification',
    accent: '#2060FF',
  },
  {
    code: '04 // SAAS CORE',
    metric: '4-Tier Core',
    label: 'Multi-tenant isolation',
    accent: '#FF4060',
  },
];

const OUTCOME_ITEMS = [
  {
    id: 'workflow',
    index: '01',
    shortTitle: 'Approval Workflow',
    category: 'GOV-TECH RBAC',
    title: IMPACT_HIGHLIGHTS[0].title,
    summary: IMPACT_HIGHLIGHTS[0].summary,
    metric: '6 Approval Gates',
    icon: ShieldCheck,
  },
  {
    id: 'forms',
    index: '02',
    shortTitle: 'Dynamic Form Engine',
    category: 'NO-CODE SCHEMA',
    title: IMPACT_HIGHLIGHTS[1].title,
    summary: IMPACT_HIGHLIGHTS[1].summary,
    metric: '60%+ Effort Saved',
    icon: Sliders,
  },
  {
    id: 'automation',
    index: '03',
    shortTitle: 'AI / RPA Review',
    category: 'AUTOMATION',
    title: IMPACT_HIGHLIGHTS[2].title,
    summary: IMPACT_HIGHLIGHTS[2].summary,
    metric: '60%+ Less Overhead',
    icon: Cpu,
  },
  {
    id: 'multitenant',
    index: '04',
    shortTitle: 'Multi-Tenant SaaS',
    category: 'ARCHITECTURE',
    title: IMPACT_HIGHLIGHTS[3].title,
    summary: IMPACT_HIGHLIGHTS[3].summary,
    metric: '4 Role Hierarchies',
    icon: Layers,
  },
  {
    id: 'domains',
    index: '05',
    shortTitle: 'Enterprise Domains',
    category: 'INTEGRATIONS',
    title: IMPACT_HIGHLIGHTS[4].title,
    summary: IMPACT_HIGHLIGHTS[4].summary,
    metric: '5+ Core Platforms',
    icon: Globe2,
  },
] as const;

const APPROVAL_NODES = [
  { name: 'L1 Intake', detail: 'Applicant submission & document checksum validation' },
  { name: 'L2 Scoped Check', detail: 'Automated eligibility & duplicate screening' },
  { name: 'L3 Dept Review', detail: 'District officer verification & field remarks' },
  { name: 'L4 Audit Gate', detail: 'Compliance trace & anomaly escalation checkpoint' },
  { name: 'L5 Authority Sign', detail: 'Role-gated final sanctioning approval' },
  { name: 'L6 Disbursal', detail: 'Immutable audit ledger & citizen payout notice' },
];

const TENANT_LAYERS = [
  { role: 'Super Admin', scope: 'Global Platform & Tenant Provisioning', isolation: 'Global Key' },
  { role: 'Tenant Admin', scope: 'Org Courses, SSO & White-Label Branding', isolation: 'Org Scoped' },
  { role: 'Instructors', scope: 'Curriculum authoring & Video Modules', isolation: 'Cohort Scoped' },
  { role: 'Students', scope: 'Enrolled Tracks, Progress & Checkout', isolation: 'User Scoped' },
];

const PRODUCTION_DOMAINS = [
  { name: 'Enterprise HRMS & Payroll', tag: 'Compliance & Attendance' },
  { name: 'Document Management Systems', tag: 'Versioned OCR Vault' },
  { name: 'POS & Inventory Management', tag: 'Real-Time Stock Sync' },
  { name: 'Biometric Attendance Sync', tag: 'Offline Edge Queue' },
  { name: 'QuickBooks & Xero Webhooks', tag: 'Accounting Pipelines' },
];

export function Impact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const reducedMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [activeApprovalStep, setActiveApprovalStep] = useState(3);
  const [automationActive, setAutomationActive] = useState(true);
  const [selectedSchemaField, setSelectedSchemaField] = useState<
    'conditional' | 'bilingual' | 'dependent'
  >('conditional');

  const activeOutcome = OUTCOME_ITEMS[activeIdx];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || prefersReducedMotion()) return;
    ensureGsapRegistered();

    const ctx = gsap.context(() => {
      gsap.from('[data-impact-panel]', {
        y: 24,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const stepOutcome = (delta: number) => {
    setActiveIdx((prev) => (prev + delta + OUTCOME_ITEMS.length) % OUTCOME_ITEMS.length);
  };

  return (
    <section
      id="impact"
      ref={sectionRef}
      aria-labelledby="impact-heading"
      className="relative z-10 border-t border-black/10 bg-[#E4E4E4] py-20 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="impact-heading">
          <SectionHeading
            eyebrow="03 // ARCHITECTURAL OUTCOMES"
            title="ENGINEERING THAT CREATES IMPACT."
            subtitle="Structured interactive blueprints of enterprise workflows, multi-tenant platforms, and automation systems delivered in production."
          />
        </div>

        {/* Structured Executive KPI Summary Strip */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {KPI_METRICS.map((item) => (
            <div
              key={item.code}
              data-impact-panel
              className="studio-card min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-5"
            >
              <p
                className={cn(
                  'font-mono text-[10px] font-semibold tracking-wider uppercase',
                  item.accent === '#2060FF' ? 'text-[#164CE0]' : 'text-[#BE123C]',
                )}
              >
                {item.code}
              </p>
              <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-[#111111] sm:text-2xl">
                {item.metric}
              </p>
              <p className="mt-1 text-xs text-[#555555]">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Structured Split Blueprint Inspector */}
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Selector Rail */}
          <div
            data-impact-panel
            role="tablist"
            aria-label="Architectural outcomes navigator"
            className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {OUTCOME_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={item.id}
                  role="tab"
                  type="button"
                  aria-selected={isSelected}
                  onClick={() => setActiveIdx(idx)}
                  className={cn(
                    'flex min-w-[200px] shrink-0 items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 lg:min-w-0',
                    isSelected
                      ? 'border-[#2060FF]/60 bg-white shadow-sm'
                      : 'border-black/10 bg-white/80 hover:border-black/25 hover:bg-white',
                  )}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold',
                        isSelected
                          ? 'bg-[#2060FF] text-white'
                          : 'bg-[#EEEEEE] text-[#555555]',
                      )}
                    >
                      {item.index}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-sm font-semibold text-[#111111]">
                        {item.shortTitle}
                      </p>
                      <p className="truncate font-mono text-[10px] text-[#555555]">
                        {item.metric}
                      </p>
                    </div>
                  </div>
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0',
                      isSelected ? 'text-[#164CE0]' : 'text-[#555555]/60',
                    )}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          {/* Focused Blueprint Card */}
          <div data-impact-panel className="min-w-0 lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.article
                key={activeOutcome.id}
                role="tabpanel"
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="studio-card rounded-2xl border border-black/10 bg-white p-5 sm:p-8"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/10 pb-5">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-xs font-semibold tracking-[0.16em] text-[#BE123C] uppercase">
                      {activeOutcome.index} // {activeOutcome.category}
                    </span>
                    <h3 className="mt-1.5 font-display text-xl font-bold text-[#111111] sm:text-2xl">
                      {activeOutcome.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => stepOutcome(-1)}
                      aria-label="Previous outcome"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/12 bg-[#EEEEEE] text-[#111111] transition-colors hover:border-[#2060FF]/50"
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <span className="px-1.5 font-mono text-xs text-[#555555]">
                      {activeOutcome.index} / 05
                    </span>
                    <button
                      type="button"
                      onClick={() => stepOutcome(1)}
                      aria-label="Next outcome"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-black/12 bg-[#EEEEEE] text-[#111111] transition-colors hover:border-[#2060FF]/50"
                    >
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <p className="mt-4 hidden text-sm leading-relaxed text-[#555555] sm:text-base md:block">
                  {activeOutcome.summary}
                </p>

                {/* Focused Artifact Visualization per Outcome */}
                {activeOutcome.id === 'workflow' ? (
                  <div className="mt-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {APPROVAL_NODES.map((node, index) => {
                        const isReached = index <= activeApprovalStep;
                        const isCurrent = index === activeApprovalStep;
                        return (
                          <button
                            key={node.name}
                            type="button"
                            onClick={() => setActiveApprovalStep(index)}
                            className={cn(
                              'flex flex-col items-start rounded-xl border p-3.5 text-left transition-all',
                              isCurrent
                                ? 'border-[#FF4060] bg-[#FFF1F2] text-[#111111] shadow-xs'
                                : isReached
                                  ? 'border-[#2060FF]/40 bg-[#F5F3FF] text-[#111111]'
                                  : 'border-black/10 bg-[#EEEEEE] text-[#555555] hover:border-black/25',
                            )}
                          >
                            <div className="flex w-full items-center justify-between">
                              <span className="font-mono text-[10px] font-semibold text-[#164CE0]">
                                NODE 0{index + 1}
                              </span>
                              <span
                                className={cn(
                                  'h-2 w-2 rounded-full',
                                  isCurrent
                                    ? 'bg-[#FF4060]'
                                    : isReached
                                      ? 'bg-[#2060FF]'
                                      : 'bg-black/15',
                                )}
                              />
                            </div>
                            <span className="mt-2 font-display text-sm font-semibold">
                              {node.name}
                            </span>
                            <span className="mt-1 font-mono text-[10px] text-[#555555]">
                              {isCurrent ? 'Active RBAC Gate' : isReached ? 'Approved' : 'Queued'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="rounded-xl border border-black/10 bg-[#EEEEEE] px-4 py-3 font-mono text-xs text-[#111111]">
                      <span className="font-semibold text-[#BE123C]">ACTIVE STAGE:</span>{' '}
                      {APPROVAL_NODES[activeApprovalStep].detail}
                    </div>
                  </div>
                ) : activeOutcome.id === 'forms' ? (
                  <div className="mt-5">
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          ['conditional', 'Conditional Logic'],
                          ['dependent', 'Dependent Dropdowns'],
                          ['bilingual', 'EN / MR Bilingual'],
                        ] as const
                      ).map(([key, label]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedSchemaField(key)}
                          className={cn(
                            'rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors',
                            selectedSchemaField === key
                              ? 'border-[#2060FF] bg-[#F5F3FF] text-[#111111]'
                              : 'border-black/10 bg-[#EEEEEE] text-[#555555] hover:text-[#111111]',
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4 max-w-full overflow-x-auto rounded-xl border border-black/10 bg-[#EEEEEE] p-4 font-mono text-xs">
                      {selectedSchemaField === 'conditional' ? (
                        <pre className="whitespace-pre-wrap break-words text-[#555555]">
                          <code className="font-semibold text-[#BE123C]">rule</code>: when{' '}
                          <span className="font-semibold text-[#111111]">applicantType</span> ==
                          &quot;eligible&quot; →{' '}
                          <span className="font-semibold text-[#164CE0]">
                            mountSection(&quot;schemeDocs&quot;)
                          </span>
                        </pre>
                      ) : selectedSchemaField === 'dependent' ? (
                        <pre className="whitespace-pre-wrap break-words text-[#555555]">
                          <code className="font-semibold text-[#BE123C]">cascade</code>: District →
                          Taluka → Village{' '}
                          <span className="font-semibold text-[#164CE0]">
                            (API-bound options)
                          </span>
                        </pre>
                      ) : (
                        <pre className="whitespace-pre-wrap break-words text-[#555555]">
                          <code className="font-semibold text-[#BE123C]">cms</code>: &#123; en:
                          &quot;Scheme Policy&quot;, mr: &quot;योजना धोरण&quot; &#125;
                        </pre>
                      )}
                    </div>
                  </div>
                ) : activeOutcome.id === 'automation' ? (
                  <div className="mt-5 space-y-3">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setAutomationActive((v) => !v)}
                        className="rounded-md border border-black/12 bg-[#EEEEEE] px-3 py-1.5 font-mono text-xs font-medium text-[#111111] hover:border-[#FF4060]/60"
                      >
                        Mode: {automationActive ? 'AI/RPA Automated' : 'Manual Baseline'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-black/10 bg-[#EEEEEE] px-4 py-3">
                      <span className="font-mono text-xs text-[#555555]">
                        1. Application Payload &amp; Docs
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#BE123C]">
                        INGESTED
                      </span>
                    </div>
                    <div
                      className={cn(
                        'flex flex-wrap items-center justify-between gap-2 rounded-xl border px-4 py-3 transition-colors',
                        automationActive
                          ? 'border-[#FF4060]/50 bg-[#FFF1F2]'
                          : 'border-amber-500/50 bg-amber-500/10',
                      )}
                    >
                      <span className="font-mono text-xs font-medium text-[#111111]">
                        {automationActive
                          ? '2. AI/RPA Pre-Verification & Anomaly Triage'
                          : '2. Manual Line-by-Line Clerk Inspection'}
                      </span>
                      <span
                        className={cn(
                          'font-mono text-[11px] font-semibold',
                          automationActive ? 'text-[#BE123C]' : 'text-amber-600',
                        )}
                      >
                        {automationActive ? '60%+ OVERHEAD REDUCED' : 'HIGH MANUAL LOAD'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 rounded-xl border border-black/10 bg-[#EEEEEE] px-4 py-3">
                      <span className="font-mono text-xs text-[#555555]">
                        3. Officer Final Sign-Off
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#164CE0]">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        RBAC VERIFIED
                      </span>
                    </div>
                  </div>
                ) : activeOutcome.id === 'multitenant' ? (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {TENANT_LAYERS.map((layer, idx) => (
                      <div
                        key={layer.role}
                        className="rounded-xl border border-black/10 bg-[#EEEEEE] p-4"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-semibold text-[#111111]">
                            {layer.role}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-[#BE123C]">
                            TIER 0{idx + 1}
                          </span>
                        </div>
                        <p className="mt-1.5 font-mono text-xs text-[#555555]">{layer.scope}</p>
                        <span className="mt-2 inline-block rounded border border-[#2060FF]/30 bg-white px-2 py-0.5 font-mono text-[10px] font-medium text-[#164CE0]">
                          {layer.isolation}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PRODUCTION_DOMAINS.map((domain) => (
                      <div
                        key={domain.name}
                        className="flex flex-col justify-between rounded-xl border border-black/10 bg-[#EEEEEE] p-4"
                      >
                        <span className="font-display text-sm font-semibold text-[#111111]">
                          {domain.name}
                        </span>
                        <span className="mt-1.5 font-mono text-[11px] font-medium text-[#164CE0]">
                          {domain.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
