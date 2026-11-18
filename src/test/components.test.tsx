import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CodingStats } from '@/components/sections/CodingStats';
import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { EnterpriseShowcase } from '@/components/sections/EnterpriseShowcase';
import { AppRoutes } from '@/app/router';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { useUIStore } from '@/stores/uiStore';

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

describe('Portfolio interactive components', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders CodingStats fallback cleanly when LeetCode API fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network offline')),
    );

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <CodingStats />
      </QueryClientProvider>,
    );

    expect(
      screen.getByRole('heading', { name: 'LEETCODE CODING STATISTICS.' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Syncing\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Live endpoint unreachable/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/548/)).toBeInTheDocument();
  });

  it('renders live LeetCode submissions when API succeeds', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          totalSolved: 560,
          totalQuestions: 4125,
          easySolved: 210,
          totalEasy: 980,
          mediumSolved: 260,
          totalMedium: 2150,
          hardSolved: 90,
          totalHard: 995,
          ranking: 171200,
          contributionPoint: 4100,
          submissionCalendar: {},
          recentSubmissions: [
            {
              title: 'Merge K Sorted Lists',
              titleSlug: 'merge-k-sorted-lists',
              timestamp: String(Math.floor(Date.now() / 1000)),
              statusDisplay: 'Accepted',
              lang: 'java',
            },
          ],
        }),
      }),
    );

    const client = createTestQueryClient();
    render(
      <QueryClientProvider client={client}>
        <CodingStats />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/LIVE API SYNC ACTIVE/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Merge K Sorted Lists')).toBeInTheDocument();
  });

  it('validates Contact form inputs before submission', { timeout: 15000 }, async () => {
    const user = userEvent.setup();
    render(<Contact />);

    await user.click(screen.getByRole('button', { name: /Open Email Client/i }));

    expect(
      await screen.findByText(/Please enter at least 2 characters for your name/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Please provide a valid email address/i)).toBeInTheDocument();
  });

  it('switches roles interactively in Experience timeline', async () => {
    const user = userEvent.setup();
    render(<Experience />);

    expect(
      screen.getByRole('heading', { name: 'Software Developer' }),
    ).toBeInTheDocument();

    const internetFolksTab = screen.getByRole('tab', { name: /Internet Folks Pvt Ltd/i });
    await user.click(internetFolksTab);

    expect(
      await screen.findByRole('heading', { name: 'React Developer Intern' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Turborepo monorepo for Levo CMS/i)).toBeInTheDocument();
  });

  it('switches enterprise systems and toggles Payttend offline simulation', async () => {
    const user = userEvent.setup();
    render(<EnterpriseShowcase />);

    const payttendTab = screen.getByRole('tab', {
      name: /Payttend — Biometric Attendance Sync/i,
    });
    await user.click(payttendTab);

    const toggleBtn = await screen.findByRole('button', { name: /Cloud Link Online/i });
    await user.click(toggleBtn);

    expect(
      screen.getByText(/Queued locally in SQLite · Exponential backoff armed/i),
    ).toBeInTheDocument();
  });

  it('renders dedicated project detail route and 404 route cleanly', () => {
    const client = createTestQueryClient();
    const { unmount } = render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/projects/chatttt']}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'CHATTTT' })).toBeInTheDocument();
    unmount();

    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={['/projects/non-existent']}>
          <AppRoutes />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText(/COORDINATES UNKNOWN/i)).toBeInTheDocument();
  });

  it('renders <Chaieeetanya/> brand without audio controls in Navbar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navbar />
      </MemoryRouter>,
    );

    const homeLink = screen.getByRole('link', { name: /Chaitanya Agarkar Home/i });
    expect(homeLink).toHaveTextContent('<Chaieeetanya/>');
    expect(screen.queryByRole('button', { name: /sound|audio/i })).not.toBeInTheDocument();
  });

  it('renders Hero & Footer without resume downloads or 3D story game and cycles sphere accents', async () => {
    useUIStore.setState({ heroAccentIndex: 0, webglDisabled: false });
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/']}>
        <Hero />
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/Download Resume/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Resume/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/PLAY 3D STORY/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Hover to scatter/i)).toBeInTheDocument();

    const soundBtn = screen.getByRole('button', { name: /Mute sphere physics sound/i });
    expect(soundBtn).toHaveAttribute('aria-pressed', 'true');
    await user.click(soundBtn);
    expect(screen.getByRole('button', { name: /Unmute sphere physics sound/i })).toHaveAttribute(
      'aria-pressed',
      'false',
    );

    const accentBtn = screen.getByRole('button', { name: /Cycle 3D sphere accent color/i });
    expect(accentBtn).toHaveTextContent('Cobalt');
    await user.click(accentBtn);
    expect(accentBtn).toHaveTextContent('Crimson');
    expect(useUIStore.getState().heroAccentIndex).toBe(1);
  });
});
