import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export type DeviceTier = 'desktop' | 'tablet' | 'mobile' | 'low-power';

export interface DeviceCapabilities {
  webglSupported: boolean;
  tier: DeviceTier;
  isTouch: boolean;
  particleCount: number;
  dpr: [number, number];
  shouldRender3D: boolean;
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function useDeviceCapabilities(): DeviceCapabilities {
  const reducedMotion = useReducedMotion();
  const [caps, setCaps] = useState<Omit<DeviceCapabilities, 'shouldRender3D'>>({
    webglSupported: false,
    tier: 'desktop',
    isTouch: false,
    particleCount: 0,
    dpr: [1, 1.5],
  });

  useEffect(() => {
    const evaluate = () => {
      const width = window.innerWidth;
      const isTouch = window.matchMedia('(pointer: coarse)').matches;
      const webglSupported = detectWebGLSupport();

      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: { saveData?: boolean };
      };
      const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 2;
      const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 2;
      const saveData = Boolean(nav.connection?.saveData);

      let tier: DeviceTier = 'desktop';
      if (lowCores || lowMemory || saveData) {
        tier = 'low-power';
      } else if (width < 768) {
        tier = 'mobile';
      } else if (width < 1024) {
        tier = 'tablet';
      }

      const particleCount =
        tier === 'desktop' ? 280 : tier === 'tablet' ? 140 : tier === 'mobile' ? 75 : 0;

      const dpr: [number, number] =
        tier === 'desktop' ? [1, 1.75] : tier === 'tablet' ? [1, 1.5] : [1, 1.25];

      setCaps({
        webglSupported,
        tier,
        isTouch,
        particleCount,
        dpr,
      });
    };

    evaluate();
    window.addEventListener('resize', evaluate, { passive: true });
    return () => window.removeEventListener('resize', evaluate);
  }, []);

  return {
    ...caps,
    shouldRender3D: caps.webglSupported && caps.tier !== 'low-power' && !reducedMotion,
  };
}

