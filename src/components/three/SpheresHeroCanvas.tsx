import { Component, Suspense, lazy, useEffect, type ReactNode } from 'react';
import { useHasMounted } from '@/hooks/useHasMounted';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useUIStore } from '@/stores/uiStore';
import { SpheresFallback } from './SpheresFallback';

const LazySpheresScene = lazy(() => import('./SpheresScene'));

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export function SpheresHeroCanvas({ className = '' }: { className?: string }) {
  const mounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const webglDisabled = useUIStore((s) => s.webglDisabled);
  const setSpheresReady = useUIStore((s) => s.setSpheresReady);

  useEffect(() => {
    if (mounted && (reducedMotion || webglDisabled)) {
      setSpheresReady(true);
    }
  }, [mounted, reducedMotion, webglDisabled, setSpheresReady]);

  if (!mounted || reducedMotion || webglDisabled) {
    return <SpheresFallback className={className} interactive />;
  }

  return (
    <div className={`relative h-full w-full ${className}`}>
      <SceneErrorBoundary fallback={<SpheresFallback interactive />}>
        <Suspense fallback={<SpheresFallback interactive />}>
          <LazySpheresScene />
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}

