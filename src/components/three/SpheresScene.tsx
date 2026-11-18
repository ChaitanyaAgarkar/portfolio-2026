import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import * as THREE_WEBGPU from 'three/webgpu';
import * as THREE from 'three';
import * as TSL from 'three/tsl';
import { ssr } from 'three/examples/jsm/tsl/display/SSRNode.js';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { traa } from 'three/examples/jsm/tsl/display/TRAANode.js';
import { ssgi } from 'three/examples/jsm/tsl/display/SSGINode.js';
import { Canvas, extend, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { BallCollider, Physics, RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { easing } from 'maath';
import { sphereSynth } from '@/lib/audio/sphereSynth';
import { SPHERE_ACCENTS, useUIStore } from '@/stores/uiStore';

const SPHERE_GEOMETRY = new THREE.SphereGeometry(1, 32, 32);

interface SphereDescriptor {
  color: string;
  variant: 'dark' | 'white' | 'accent';
  accent?: boolean;
  position: [number, number, number];
}

function buildSpheres(accentColor: string, sphereRadius: number): SphereDescriptor[] {
  const palette: Array<{ color: string; variant: 'dark' | 'white' | 'accent'; accent?: boolean }> =
    [
      { color: '#444444', variant: 'dark' },
      { color: '#444444', variant: 'dark' },
      { color: '#444444', variant: 'dark' },
      { color: '#ffffff', variant: 'white' },
      { color: '#ffffff', variant: 'white' },
      { color: '#ffffff', variant: 'white' },
      { color: accentColor, variant: 'accent', accent: true },
      { color: accentColor, variant: 'accent', accent: true },
      { color: accentColor, variant: 'accent', accent: true },
      { color: '#444444', variant: 'dark' },
      { color: '#444444', variant: 'dark' },
      { color: '#444444', variant: 'dark' },
      { color: '#ffffff', variant: 'white' },
      { color: '#ffffff', variant: 'white' },
      { color: '#ffffff', variant: 'white' },
      { color: accentColor, variant: 'accent', accent: true },
      { color: accentColor, variant: 'accent', accent: true },
      { color: accentColor, variant: 'accent', accent: true },
    ];

  const isSmallScreen = sphereRadius < 0.95;
  const centerX = isSmallScreen ? 0 : 3.2;
  const centerY = isSmallScreen ? -1.05 : 0;

  return palette.map((item, i) => {
    const angle = (i / palette.length) * Math.PI * 2;
    const ring = (1.55 + (i % 3) * 0.72) * sphereRadius;
    const z = ((i % 5) - 2) * 0.85 * sphereRadius;
    return {
      ...item,
      position: [centerX + Math.cos(angle) * ring, centerY + Math.sin(angle) * ring * 0.85, z],
    };
  });
}

interface ScatterPulse {
  ndcX: number;
  ndcY: number;
  seq: number;
}

function ReadyNotifier() {
  const frameCount = useRef(0);
  const notified = useRef(false);

  useFrame(() => {
    if (notified.current) return;
    frameCount.current += 1;
    if (frameCount.current >= 2) {
      notified.current = true;
      useUIStore.getState().setSpheresReady(true);
    }
  });

  return null;
}

function PhysicsSphere({
  index,
  position,
  color = '#ffffff',
  variant,
  accent = false,
  sphereRadius,
  isClickScatterMode,
  scatterPulseRef,
  vec = new THREE.Vector3(),
}: SphereDescriptor & {
  index: number;
  sphereRadius: number;
  isClickScatterMode: boolean;
  scatterPulseRef: MutableRefObject<ScatterPulse>;
  vec?: THREE.Vector3;
}) {
  const api = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const lastPulseSeq = useRef(0);
  const scatterCooldownRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock, viewport }, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    const frameScale = Math.min(clampedDelta * 60, 1.5);
    const isDesktopWide = viewport.width > 9;
    const anchorX = isDesktopWide ? viewport.width * 0.27 : 0;
    const anchorY = isDesktopWide ? -0.15 : -viewport.height * 0.18;

    if (api.current) {
      const pos = api.current.translation();
      const rx = pos.x - anchorX;
      const ry = pos.y - anchorY;
      const rz = pos.z;

      // Apply dramatic radial burst scatter when tapped/clicked on mobile or tablet
      const pulse = scatterPulseRef.current;
      if (pulse.seq !== lastPulseSeq.current) {
        lastPulseSeq.current = pulse.seq;
        scatterCooldownRef.current = 0.78;
        const tapX = (pulse.ndcX * viewport.width) / 2;
        const tapY = (pulse.ndcY * viewport.height) / 2;
        let dx = pos.x - tapX;
        let dy = pos.y - tapY;
        let dist = Math.hypot(dx, dy);
        if (dist < 0.08) {
          dx = Math.cos(index * 1.37);
          dy = Math.sin(index * 1.37);
          dist = 1;
        }
        const nx = dx / dist;
        const ny = dy / dist;
        const massScale = Math.max(0.35, sphereRadius * sphereRadius * sphereRadius);
        const burst = Math.max(8.5, 16.5 - dist * 0.9) * massScale * 1.35;
        api.current.applyImpulse(
          {
            x: nx * burst + (Math.random() - 0.5) * 3.2 * massScale,
            y: ny * burst + (Math.random() - 0.5) * 3.2 * massScale,
            z: (Math.random() - 0.5) * 5.5 * massScale,
          },
          true,
        );
        api.current.applyTorqueImpulse(
          {
            x: (Math.random() - 0.5) * 3.2 * massScale,
            y: (Math.random() - 0.5) * 3.2 * massScale,
            z: (Math.random() - 0.5) * 3.2 * massScale,
          },
          true,
        );
      }

      if (scatterCooldownRef.current > 0) {
        scatterCooldownRef.current = Math.max(0, scatterCooldownRef.current - clampedDelta);
      }
      // Temporarily soften magnetic restoring pull right after tap so spheres scatter freely across stage
      const cooldownProgress = 1 - scatterCooldownRef.current / 0.78;
      const magneticGain = (0.04 + 0.24 * (cooldownProgress * cooldownProgress)) * sphereRadius;

      // Central magnetic pull plus continuous 3D tangential swirl so the constellation revolves endlessly
      vec.set(-rx, -ry, -rz).multiplyScalar(magneticGain);
      vec.x += (-ry * 0.095 + rz * 0.055) * frameScale * sphereRadius;
      vec.y +=
        (rx * 0.095 + Math.cos(clock.elapsedTime * 0.45 + index * 0.5) * 0.012) *
        frameScale *
        sphereRadius;
      vec.z +=
        (-rx * 0.055 + Math.sin(clock.elapsedTime * 0.5 + index * 0.65) * 0.016) *
        frameScale *
        sphereRadius;

      api.current.applyImpulse(vec, true);
      api.current.applyTorqueImpulse(
        {
          x: 0.008 * frameScale * sphereRadius,
          y: 0.014 * frameScale * sphereRadius,
          z: 0.006 * frameScale * sphereRadius,
        },
        true,
      );
    }

    const material = mesh.current?.material as THREE.MeshPhysicalMaterial | undefined;
    if (material) {
      easing.dampC(material.color, color, 0.2, clampedDelta);
      easing.damp(
        material,
        'emissiveIntensity',
        hovered && !isClickScatterMode ? 0.16 : 0,
        0.18,
        clampedDelta,
      );
    }
    if (mesh.current) {
      const targetScale = sphereRadius * (hovered && !isClickScatterMode ? 1.06 : 1);
      easing.damp(mesh.current.scale, 'x', targetScale, 0.16, clampedDelta);
      easing.damp(mesh.current.scale, 'y', targetScale, 0.16, clampedDelta);
      easing.damp(mesh.current.scale, 'z', targetScale, 0.16, clampedDelta);
    }
  });

  const handleCollisionEnter = () => {
    if (!api.current) return;
    const vel = api.current.linvel();
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    if (speed > 0.85) {
      sphereSynth.playCollision(speed * 0.35, variant);
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (isClickScatterMode || e.nativeEvent.pointerType !== 'mouse') return;
    setHovered(true);
    sphereSynth.unlock();
    sphereSynth.playHoverPing(index);
    if (api.current) {
      api.current.applyImpulse({ x: (Math.random() - 0.5) * 1.4, y: 0.7, z: 0.9 }, true);
    }
  };

  return (
    <RigidBody
      canSleep={false}
      linearDamping={isClickScatterMode ? 2.4 : 4}
      angularDamping={1}
      friction={0.1}
      position={position}
      ref={api}
      colliders={false}
      onCollisionEnter={handleCollisionEnter}
    >
      <BallCollider args={[sphereRadius]} />
      <mesh
        ref={mesh}
        scale={sphereRadius}
        geometry={SPHERE_GEOMETRY}
        onPointerOver={handlePointerOver}
        onPointerOut={() => setHovered(false)}
      >
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0}
          roughness={accent ? 0.22 : 0.16}
          metalness={accent ? 0.55 : 0.45}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.6}
        />
      </mesh>
    </RigidBody>
  );
}

function Pointer({
  isClickScatterMode,
  vec = new THREE.Vector3(),
}: {
  isClickScatterMode: boolean;
  vec?: THREE.Vector3;
}) {
  const ref = useRef<RapierRigidBody>(null);
  const { gl, viewport } = useThree();
  const ndc = useRef({ x: 0, y: 0 });
  const prevNdc = useRef({ x: 0, y: 0 });
  const lastWhoosh = useRef(0);

  useEffect(() => {
    if (isClickScatterMode) return;

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ndc.current.x = nx;
      ndc.current.y = ny;

      const deltaDist = Math.hypot(nx - prevNdc.current.x, ny - prevNdc.current.y);
      prevNdc.current.x = nx;
      prevNdc.current.y = ny;

      const now = performance.now();
      if (deltaDist > 0.08 && now - lastWhoosh.current > 180) {
        lastWhoosh.current = now;
        sphereSynth.unlock();
        sphereSynth.playHoverPing(Math.round((nx + 1) * 3));
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [gl, isClickScatterMode]);

  useFrame(() => {
    if (!ref.current) return;
    if (isClickScatterMode) {
      ref.current.setNextKinematicTranslation(vec.set(0, 0, -50));
      return;
    }
    ref.current.setNextKinematicTranslation(
      vec.set((ndc.current.x * viewport.width) / 2, (ndc.current.y * viewport.height) / 2, 0),
    );
  });

  return (
    <RigidBody position={[0, 0, -50]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[1]} />
    </RigidBody>
  );
}

function StudioEnvironment() {
  return (
    <Environment resolution={256}>
      <group rotation={[-Math.PI / 3, 0, 1]}>
        <Lightformer
          form="circle"
          intensity={100}
          rotation-x={Math.PI / 2}
          position={[0, 5, -9]}
          scale={2}
        />
        <Lightformer
          form="circle"
          intensity={0}
          rotation-y={Math.PI / 2}
          position={[-5, 1, -1]}
          scale={2}
        />
        <Lightformer
          form="circle"
          intensity={0}
          rotation-y={Math.PI / 2}
          position={[-5, -1, -1]}
          scale={2}
        />
        <Lightformer
          form="circle"
          intensity={2}
          rotation-y={-Math.PI / 2}
          position={[10, 1, 0]}
          scale={8}
        />
        <Lightformer
          form="ring"
          color="red"
          intensity={80}
          onUpdate={(self) => self.lookAt(0, 0, 0)}
          position={[10, 10, 0]}
          scale={10}
        />
      </group>
    </Environment>
  );
}

function WebGPUEffects() {
  const { gl, scene, camera } = useThree();

  const postProcessing = useMemo(() => {
    const renderer = gl as unknown as THREE_WEBGPU.WebGPURenderer;
    const pp = new THREE_WEBGPU.PostProcessing(renderer);
    const scenePass = TSL.pass(scene, camera);

    scenePass.setMRT(
      TSL.mrt({
        output: TSL.output,
        normal: TSL.directionToColor(TSL.normalView),
        metalrough: TSL.vec2(TSL.metalness, TSL.roughness),
        velocity: TSL.velocity,
      }),
    );

    const scenePassColor = scenePass.getTextureNode('output');
    const scenePassNormal = scenePass.getTextureNode('normal');
    const scenePassDepth = scenePass.getTextureNode('depth');
    const scenePassMetalRough = scenePass.getTextureNode('metalrough');
    const scenePassVelocity = scenePass.getTextureNode('velocity');

    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const giPass = ssgi(scenePassColor, scenePassDepth, scenePassNormal, perspectiveCamera);
    giPass.sliceCount.value = 1;
    giPass.stepCount.value = 6;
    giPass.aoIntensity.value = 1.8;
    giPass.giIntensity.value = 1;

    const gi = giPass.rgb;
    const aoVal = giPass.a;

    const diffuseColor = scenePassColor.rgb;
    const compositePass = TSL.vec4(
      diffuseColor.mul(aoVal).add(diffuseColor.mul(gi)),
      scenePassColor.a,
    );

    const ssrPass = ssr(compositePass, scenePassDepth, scenePassNormal.xyz, {
      metalnessNode: scenePassMetalRough.r,
      roughnessNode: scenePassMetalRough.g,
      camera: perspectiveCamera,
    });
    ssrPass.resolutionScale = 0.5;
    ssrPass.maxDistance.value = 0.5;
    ssrPass.thickness.value = 0.015;

    const bloomPass = bloom(compositePass, 0.25, 0.0001, 0.99);
    const finalColor = TSL.vec4(
      compositePass.rgb.add(ssrPass.rgb).add(bloomPass.rgb),
      scenePassColor.a,
    );

    const traaPass = traa(finalColor, scenePassDepth, scenePassVelocity, camera);
    pp.outputNode = TSL.vec4(traaPass.rgb, scenePassColor.a);
    return pp;
  }, [gl, scene, camera]);

  useFrame(() => {
    postProcessing.render();
  }, 1);

  return null;
}

export default function SpheresScene() {
  const heroAccentIndex = useUIStore((s) => s.heroAccentIndex);
  const cycleHeroAccent = useUIStore((s) => s.cycleHeroAccent);
  const theme = useUIStore((s) => s.theme);
  const [webgpuSupported, setWebgpuSupported] = useState<boolean>(false);
  const [probeDone, setProbeDone] = useState<boolean>(false);
  const [isClickScatterMode, setIsClickScatterMode] = useState<boolean>(false);
  const [sphereRadius, setSphereRadius] = useState<number>(1);
  const scatterPulseRef = useRef<ScatterPulse>({ ndcX: 0, ndcY: 0, seq: 0 });

  const spheres = useMemo(
    () => buildSpheres(SPHERE_ACCENTS[heroAccentIndex], sphereRadius),
    [heroAccentIndex, sphereRadius],
  );

  useEffect(() => {
    const query = window.matchMedia('(hover: none), (pointer: coarse), (max-width: 1023px)');
    const syncResponsive = () => {
      setIsClickScatterMode(query.matches);
      const w = window.innerWidth;
      if (w < 640) {
        setSphereRadius(0.82);
      } else if (w < 1024) {
        setSphereRadius(0.9);
      } else {
        setSphereRadius(1);
      }
    };
    syncResponsive();
    query.addEventListener('change', syncResponsive);
    window.addEventListener('resize', syncResponsive, { passive: true });
    return () => {
      query.removeEventListener('change', syncResponsive);
      window.removeEventListener('resize', syncResponsive);
    };
  }, []);

  useEffect(() => {
    let active = true;
    async function detectWebGPU() {
      try {
        const nav = navigator as Navigator & {
          gpu?: { requestAdapter: () => Promise<unknown | null> };
        };
        if (nav.gpu) {
          const adapter = await nav.gpu.requestAdapter();
          if (active && adapter) {
            setWebgpuSupported(true);
            setProbeDone(true);
            return;
          }
        }
      } catch {
        // Fallback cleanly to transparent WebGL2 pipeline
      }
      if (active) {
        setWebgpuSupported(false);
        setProbeDone(true);
      }
    }
    void detectWebGPU();
    return () => {
      active = false;
    };
  }, []);

  if (!probeDone) {
    return null;
  }

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    sphereSynth.unlock();
    if (isClickScatterMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const ndcX = rect.width ? ((e.clientX - rect.left) / rect.width) * 2 - 1 : 0;
      const ndcY = rect.height ? -((e.clientY - rect.top) / rect.height) * 2 + 1 : 0;
      scatterPulseRef.current = {
        ndcX,
        ndcY,
        seq: scatterPulseRef.current.seq + 1,
      };
      sphereSynth.playScatterPulse();
      return;
    }

    const nextIdx = (heroAccentIndex + 1) % SPHERE_ACCENTS.length;
    sphereSynth.playAccentShift(nextIdx);
    cycleHeroAccent();
  };

  return (
    <div
      onClick={handleStageClick}
      className="h-full w-full cursor-pointer select-none"
      role="region"
      aria-label={
        isClickScatterMode
          ? 'Interactive 3D physics spheres stage — tap anywhere on stage to scatter spheres'
          : 'Interactive 3D physics spheres stage — move cursor to scatter and click to cycle accent palette'
      }
    >
      <Canvas
        dpr={[1, 1.5]}
        gl={
          webgpuSupported
            ? async (canvasProps) => {
                extend(THREE_WEBGPU as unknown as Record<string, never>);
                const renderer = new THREE_WEBGPU.WebGPURenderer({
                  canvas: canvasProps.canvas as HTMLCanvasElement,
                  alpha: true,
                  antialias: false,
                  powerPreference: 'high-performance',
                });
                await renderer.init();
                renderer.setClearColor(0x000000, 0);
                return renderer as unknown as THREE.WebGLRenderer;
              }
            : { alpha: true, antialias: true, powerPreference: 'high-performance' }
        }
        onCreated={({ gl }) => {
          if ('setClearColor' in gl && typeof gl.setClearColor === 'function') {
            gl.setClearColor(0x000000, 0);
          }
        }}
        camera={{ position: [0, 0, 30], fov: 17.5 }}
      >
        <ReadyNotifier />
        <ambientLight intensity={theme === 'dark' ? 2.75 : 2} />
        <Physics key={`physics-${sphereRadius}`} timeStep="vary" gravity={[0, 0, 0]}>
          <Pointer isClickScatterMode={isClickScatterMode} />
          {spheres.map((props, i) => (
            <PhysicsSphere
              key={i}
              index={i}
              sphereRadius={sphereRadius}
              isClickScatterMode={isClickScatterMode}
              scatterPulseRef={scatterPulseRef}
              {...props}
            />
          ))}
        </Physics>
        <StudioEnvironment />
        {webgpuSupported ? <WebGPUEffects /> : null}
      </Canvas>
    </div>
  );
}
