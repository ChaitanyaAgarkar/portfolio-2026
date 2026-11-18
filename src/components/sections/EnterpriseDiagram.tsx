import { useState } from 'react';
import {
  ArrowRight,
  Database,
  FileText,
  FolderTree,
  Globe,
  HardDrive,
  Lock,
  MapPin,
  Receipt,
  RefreshCw,
  Server,
  Shield,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react';
import type { EnterpriseDiagramType } from '@/types/enterprise';
import { cn } from '@/lib/utils/cn';

interface EnterpriseDiagramProps {
  type: EnterpriseDiagramType;
}

export function EnterpriseDiagram({ type }: EnterpriseDiagramProps) {
  const [cmsLang, setCmsLang] = useState<'en' | 'mr'>('en');
  const [activeGovStage, setActiveGovStage] = useState(2);
  const [syncOffline, setSyncOffline] = useState(false);
  const [selectedDocVersion, setSelectedDocVersion] = useState<'v1.0' | 'v1.1' | 'v1.2'>('v1.2');
  const [registerState, setRegisterState] = useState<'OPEN' | 'BILLING' | 'RECONCILED'>('BILLING');

  if (type === 'gov-workflow') {
    const stages = [
      '01 Applicant Form',
      '02 AI/RPA Pre-Check',
      '03 Clerk Scrutiny',
      '04 Dept Verifier',
      '05 Nodal Officer',
      '06 Final Sanction',
    ];
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#BE123C] uppercase">
            6-STAGE APPROVAL PIPELINE SIMULATION
          </span>
          <div className="inline-flex rounded-lg border border-black/10 bg-white p-1 font-mono text-[11px]">
            <button
              type="button"
              onClick={() => setCmsLang('en')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                cmsLang === 'en' ? 'bg-[#2060FF] font-semibold text-white' : 'text-[#555555]',
              )}
            >
              EN CMS
            </button>
            <button
              type="button"
              onClick={() => setCmsLang('mr')}
              className={cn(
                'rounded px-2.5 py-1 transition-colors',
                cmsLang === 'mr' ? 'bg-[#FF4060] font-semibold text-white' : 'text-[#555555]',
              )}
            >
              मराठी CMS
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-black/10 bg-white p-4">
          <div className="flex items-center justify-between border-b border-black/10 pb-3">
            <span className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[#111111]">
              <Globe className="h-3.5 w-3.5 text-[#BE123C]" aria-hidden="true" />
              {cmsLang === 'en'
                ? 'Dynamic Scheme Schema · Conditional Fields Active'
                : 'डायनॅमिक योजना फॉर्म · अटींवर आधारित फील्ड सक्रिय'}
            </span>
            <span className="font-mono text-[10px] font-semibold text-[#164CE0]">RBAC ENFORCED</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {stages.map((label, idx) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveGovStage(idx)}
                className={cn(
                  'rounded-lg border px-3 py-2.5 text-left font-mono text-[11px] transition-colors',
                  idx === activeGovStage
                    ? 'border-[#FF4060] bg-[#FFF1F2] text-[#111111]'
                    : idx < activeGovStage
                      ? 'border-[#2060FF]/35 bg-[#F5F3FF] text-[#111111]'
                      : 'border-black/10 bg-[#EEEEEE] text-[#555555]',
                )}
              >
                <span className="block font-semibold">{label}</span>
                <span className="mt-1 block text-[10px] font-medium text-[#BE123C]">
                  {idx === activeGovStage
                    ? 'Active Permission Scope'
                    : idx < activeGovStage
                      ? 'Cleared'
                      : 'Pending Gate'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'multi-tenant-lms') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#164CE0] uppercase">
            MULTI-TENANT ISOLATION &amp; ROLE TOPOLOGY
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#BE123C]">SSO + RBAC ROUTING</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Super Administrator', items: 'Tenant Provisioning · Global Policies' },
            { title: 'Tenant Administrator', items: 'Org Catalog · E-Commerce · SSO Config' },
            { title: 'Instructor Workspace', items: 'Course Builder · Video Streaming Assets' },
            { title: 'Student Portal', items: 'Role-Routed Learning · Progress APIs' },
          ].map((tier, idx) => (
            <div
              key={tier.title}
              className="rounded-xl border border-black/10 bg-white p-3.5"
            >
              <div className="flex items-center justify-between">
                <Users className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
                <span className="font-mono text-[10px] font-semibold text-[#164CE0]">LAYER 0{idx + 1}</span>
              </div>
              <p className="mt-2 font-display text-sm font-semibold text-[#111111]">{tier.title}</p>
              <p className="mt-1 font-mono text-[11px] text-[#555555]">{tier.items}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'payttend-sync') {
    const pipelineSteps = [
      { label: 'BIOMETRIC DEVICE', sub: 'Attendance Logs', icon: Shield },
      { label: 'LOCAL DATABASE', sub: 'Read-Only Access DB', icon: Database },
      { label: 'SYNC AGENT', sub: 'Electron + Express', icon: Server },
      {
        label: 'OFFLINE QUEUE',
        sub: syncOffline ? 'SQLite Buffering Active' : 'SQLite + SHA-256 Dedup',
        icon: HardDrive,
      },
      {
        label: 'CLOUD API',
        sub: syncOffline ? 'Exponential Backoff Retry' : 'JWT / API-Key Synced',
        icon: Server,
      },
    ];

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#BE123C] uppercase">
            PAYTTEND DATA PIPELINE TELEMETRY
          </span>
          <button
            type="button"
            onClick={() => setSyncOffline((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium transition-colors',
              syncOffline
                ? 'border-amber-500/50 bg-amber-50 text-amber-800'
                : 'border-[#FF4060]/50 bg-[#FFF1F2] text-[#BE123C]',
            )}
          >
            {syncOffline ? (
              <>
                <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                Simulate Offline Queue
              </>
            ) : (
              <>
                <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                Cloud Link Online
              </>
            )}
          </button>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-5">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isQueueStep = idx === 3 && syncOffline;
            const isCloudBlocked = idx === 4 && syncOffline;
            return (
              <div
                key={step.label}
                className={cn(
                  'relative flex flex-col justify-between rounded-xl border p-3',
                  isQueueStep
                    ? 'border-amber-500/60 bg-amber-50'
                    : isCloudBlocked
                      ? 'border-black/10 bg-[#EEEEEE] opacity-65'
                      : 'border-black/10 bg-white',
                )}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={cn(
                      'h-4 w-4',
                      isQueueStep ? 'text-amber-700' : 'text-[#BE123C]',
                    )}
                    aria-hidden="true"
                  />
                  {idx < pipelineSteps.length - 1 ? (
                    <ArrowRight
                      className="hidden h-3.5 w-3.5 text-[#164CE0] sm:block"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
                <div className="mt-3">
                  <p className="font-mono text-[10px] font-bold text-[#111111]">
                    {step.label}
                  </p>
                  <p className="mt-1 font-mono text-[10px] leading-snug text-[#555555]">
                    {step.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-black/10 bg-white px-3.5 py-2 font-mono text-[11px] text-[#555555]">
          <span>Dedup: SHA-256 Digest Verified</span>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#BE123C]">
            <RefreshCw className="h-3 w-3" aria-hidden="true" />
            {syncOffline
              ? 'Queued locally in SQLite · Exponential backoff armed'
              : 'Incremental sync checkpoint active'}
          </span>
        </div>
      </div>
    );
  }

  if (type === 'hrms-payroll') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#164CE0] uppercase">
            WORKFORCE &amp; PAYROLL EXECUTION GRAPH
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#BE123C]">RBAC + STATUTORY</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2 text-[#BE123C]">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold">Geolocation Attendance</span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-[#555555]">
              Coordinate boundary check → Punch ledger → Shift reconciliation
            </p>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-4">
            <div className="flex items-center gap-2 text-[#164CE0]">
              <Receipt className="h-4 w-4" aria-hidden="true" />
              <span className="font-mono text-xs font-semibold">Payroll &amp; Statutory Engine</span>
            </div>
            <p className="mt-2 font-mono text-[11px] text-[#555555]">
              Salary structures → Deductions &amp; statutory workflows → Batch run
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'dms-workspace') {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold tracking-wider text-[#BE123C] uppercase">
            SPATIAL VERSIONING &amp; ACCESS GRAPH
          </span>
          <div className="flex gap-1.5 font-mono text-[11px]">
            {(['v1.0', 'v1.1', 'v1.2'] as const).map((ver) => (
              <button
                key={ver}
                type="button"
                onClick={() => setSelectedDocVersion(ver)}
                className={cn(
                  'rounded border px-2 py-0.5 transition-colors',
                  selectedDocVersion === ver
                    ? 'border-[#FF4060] bg-[#FFF1F2] font-semibold text-[#111111]'
                    : 'border-black/10 bg-white text-[#555555]',
                )}
              >
                {ver}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 bg-white p-3.5">
            <FolderTree className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
            <p className="mt-2 font-mono text-xs font-semibold text-[#111111]">Hierarchical Explorer</p>
            <p className="mt-1 font-mono text-[11px] text-[#555555]">Nested folders &amp; multipart upload</p>
          </div>
          <div className="rounded-xl border border-[#FF4060]/50 bg-[#FFF1F2]/75 p-3.5 transition-transform duration-200 hover:-translate-y-0.5">
            <FileText className="h-4 w-4 text-[#BE123C]" aria-hidden="true" />
            <p className="mt-2 font-mono text-xs font-semibold text-[#111111]">
              Active Revision {selectedDocVersion}
            </p>
            <p className="mt-1 font-mono text-[11px] text-[#555555]">
              {selectedDocVersion === 'v1.2'
                ? 'Approved · Audit hash sealed'
                : 'Historical snapshot preserved'}
            </p>
          </div>
          <div className="rounded-xl border border-black/10 bg-white p-3.5">
            <Lock className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
            <p className="mt-2 font-mono text-xs font-semibold text-[#111111]">Scoped Sharing</p>
            <p className="mt-1 font-mono text-[11px] text-[#555555]">Role-based read/write links</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-[#BE123C] uppercase">
          REGISTER LIFECYCLE &amp; INVENTORY SYNC
        </span>
        <div className="flex gap-1.5 font-mono text-[10px]">
          {(['OPEN', 'BILLING', 'RECONCILED'] as const).map((state) => (
            <button
              key={state}
              type="button"
              onClick={() => setRegisterState(state)}
              className={cn(
                'rounded border px-2 py-1 transition-colors',
                registerState === state
                  ? 'border-[#2060FF] bg-[#F5F3FF] font-semibold text-[#111111]'
                  : 'border-black/10 bg-white text-[#555555]',
              )}
            >
              {state}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-black/10 bg-white p-3.5">
          <p className="font-mono text-[10px] font-semibold text-[#164CE0]">STAGE 01</p>
          <p className="mt-1 font-display text-sm font-semibold text-[#111111]">
            Register: {registerState}
          </p>
          <p className="mt-1 font-mono text-[11px] text-[#555555]">Shift opening, cash drawer &amp; close</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-3.5">
          <p className="font-mono text-[10px] font-semibold text-[#BE123C]">STAGE 02</p>
          <p className="mt-1 font-display text-sm font-semibold text-[#111111]">GST Reporting</p>
          <p className="mt-1 font-mono text-[11px] text-[#555555]">Tax slab breakdown &amp; export</p>
        </div>
        <div className="rounded-xl border border-black/10 bg-white p-3.5">
          <p className="font-mono text-[10px] font-semibold text-[#164CE0]">STAGE 03</p>
          <p className="mt-1 font-display text-sm font-semibold text-[#111111]">Stock Ledger</p>
          <p className="mt-1 font-mono text-[11px] text-[#555555]">SKU depletion &amp; operational workflows</p>
        </div>
      </div>
    </div>
  );
}
