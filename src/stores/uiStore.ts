import { create } from 'zustand';

export type CursorVariant = 'default' | 'pointer' | 'magnetic';
export type ThemeMode = 'light' | 'dark';

export const SPHERE_ACCENTS = ['#2060ff', '#ff4060', '#ffcc00', '#20ffa0'] as const;

function applyThemeToDom(theme: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#0B0C10' : '#EEEEEE');
  }
  try {
    window.localStorage.setItem('ca_theme', theme);
  } catch {
    // Ignore storage quota / privacy errors
  }
}

interface UIState {
  activeSection: string;
  cursorVariant: CursorVariant;
  cursorLabel: string | null;
  commandOpen: boolean;
  mobileMenuOpen: boolean;
  webglDisabled: boolean;
  introSkipped: boolean;
  spheresReady: boolean;
  heroAccentIndex: number;
  theme: ThemeMode;
  setActiveSection: (section: string) => void;
  setCursor: (variant: CursorVariant, label?: string | null) => void;
  resetCursor: () => void;
  setCommandOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setWebglDisabled: (disabled: boolean) => void;
  setIntroSkipped: (skipped: boolean) => void;
  setSpheresReady: (ready: boolean) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  cycleHeroAccent: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSection: 'home',
  cursorVariant: 'default',
  cursorLabel: null,
  commandOpen: false,
  mobileMenuOpen: false,
  webglDisabled: false,
  introSkipped: false,
  spheresReady: false,
  heroAccentIndex: 0,
  theme: 'light',
  setActiveSection: (activeSection) => set({ activeSection }),
  setCursor: (cursorVariant, cursorLabel = null) => set({ cursorVariant, cursorLabel }),
  resetCursor: () => set({ cursorVariant: 'default', cursorLabel: null }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  setWebglDisabled: (webglDisabled) => set({ webglDisabled }),
  setIntroSkipped: (introSkipped) => set({ introSkipped }),
  setSpheresReady: (spheresReady) => set({ spheresReady }),
  setTheme: (theme) => {
    applyThemeToDom(theme);
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const next: ThemeMode = state.theme === 'light' ? 'dark' : 'light';
      applyThemeToDom(next);
      return { theme: next };
    }),
  cycleHeroAccent: () =>
    set((state) => ({
      heroAccentIndex: (state.heroAccentIndex + 1) % SPHERE_ACCENTS.length,
    })),
}));
