import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface AntigravityProps {
  count?: number;
  magnetRadius?: number;
  ringRadius?: number;
  waveSpeed?: number;
  waveAmplitude?: number;
  particleSize?: number;
  lerpSpeed?: number;
  color?: string;
  autoAnimate?: boolean;
  particleVariance?: number;
  rotationSpeed?: number;
  depthFactor?: number;
  pulseSpeed?: number;
  particleShape?: 'capsule' | 'sphere' | 'box' | 'tetrahedron';
  fieldStrength?: number;
  externalTarget?: { x: number; y: number } | null;
  activePhaseIndex?: number;
}

interface Particle {
  t: number;
  speed: number;
  mx: number;
  my: number;
  mz: number;
  cz: number;
  cx: number;
  cy: number;
  czVal: number;
  randomRadiusOffset: number;
}

const AntigravityInner: React.FC<Required<Omit<AntigravityProps, 'externalTarget'>> & {
  externalTarget: { x: number; y: number } | null;
}> = React.memo(({
  count,
  magnetRadius,
  ringRadius,
  waveSpeed,
  waveAmplitude,
  particleSize,
  lerpSpeed,
  color,
  autoAnimate,
  particleVariance,
  rotationSpeed,
  depthFactor,
  pulseSpeed,
  particleShape,
  fieldStrength,
  externalTarget,
  activePhaseIndex,
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tinyMeshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastMouseMoveTime = useRef(0);
  const virtualMouse = useRef({ x: 0, y: 0 });
  
  const lastActiveIndex = useRef(activePhaseIndex);
  const transitionAge = useRef(-1.0);

  // Initialize main particles inside viewport limits
  const particles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cz: z,
        cx: x,
        cy: y,
        czVal: z,
        randomRadiusOffset
      });
    }
    return temp;
  }, [count, viewport.width, viewport.height]);

  // Initialize secondary circle of tiny particles (rotating stardust ring)
  const tinyCount = Math.floor(count * 0.9);
  const tinyParticles = useMemo<Particle[]>(() => {
    const temp: Particle[] = [];
    const width = viewport.width || 100;
    const height = viewport.height || 100;

    for (let i = 0; i < tinyCount; i++) {
      const t = Math.random() * 100;
      const speed = 0.008 + Math.random() / 200; // slightly distinct speed range
      const x = (Math.random() - 0.5) * width;
      const y = (Math.random() - 0.5) * height;
      const z = (Math.random() - 0.5) * 20;

      const randomRadiusOffset = (Math.random() - 0.5) * 2;

      temp.push({
        t,
        speed,
        mx: x,
        my: y,
        mz: z,
        cz: z,
        cx: x,
        cy: y,
        czVal: z,
        randomRadiusOffset
      });
    }
    return temp;
  }, [tinyCount, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Track transition pulse envelope when the milestone options switch
    let pulse = 0;
    if (activePhaseIndex !== lastActiveIndex.current) {
      lastActiveIndex.current = activePhaseIndex;
      transitionAge.current = 0.0;
    }

    if (transitionAge.current >= 0) {
      transitionAge.current += delta;
      const t = transitionAge.current;
      const collapseDuration = 0.28; // rapid collapse to center (280ms)
      const disperseDuration = 0.55; // smooth dispersion back to places (550ms)
      
      if (t < collapseDuration) {
        const ratio = t / collapseDuration;
        pulse = Math.sin(ratio * Math.PI / 2); // fast rising curve
      } else if (t < collapseDuration + disperseDuration) {
        const ratio = (t - collapseDuration) / disperseDuration;
        pulse = Math.cos(ratio * Math.PI / 2); // beautifully smooth dispersion
      } else {
        transitionAge.current = -1.0;
        pulse = 0;
      }
    }

    const { viewport: v, pointer: m } = state;

    const mouseDist = Math.sqrt(
      Math.pow(m.x - lastMousePos.current.x, 2) + Math.pow(m.y - lastMousePos.current.y, 2)
    );

    if (mouseDist > 0.001) {
      lastMouseMoveTime.current = Date.now();
      lastMousePos.current = { x: m.x, y: m.y };
    }

    let destX = (m.x * v.width) / 2;
    let destY = (m.y * v.height) / 2;

    // Override with external target tracker if provided
    if (externalTarget) {
      // Map external ratio-based target [-1, 1] window to threejs viewport size
      destX = (externalTarget.x * v.width) / 2;
      destY = (externalTarget.y * v.height) / 2;
      // Keep state alive as active movement
      lastMouseMoveTime.current = Date.now();
    } else if (autoAnimate && Date.now() - lastMouseMoveTime.current > 2000) {
      const time = state.clock.getElapsedTime();
      destX = Math.sin(time * 0.5) * (v.width / 4);
      destY = Math.cos(time * 0.5 * 2) * (v.height / 4);
    }

    const smoothFactor = 0.05;
    virtualMouse.current.x += (destX - virtualMouse.current.x) * smoothFactor;
    virtualMouse.current.y += (destY - virtualMouse.current.y) * smoothFactor;

    const targetX = virtualMouse.current.x;
    const targetY = virtualMouse.current.y;

    const globalRotation = state.clock.getElapsedTime() * rotationSpeed;

    // Accelerate the particle attraction to make the transition exceptionally snappy and responsive
    const currentLerpSpeed = THREE.MathUtils.lerp(lerpSpeed, 0.28, pulse);

    // 1. Process Main Capsule Particles
    particles.forEach((particle, i) => {
      let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

      t = particle.t += speed / 2;

      const projectionFactor = 1 - cz / 50;
      const projectedTargetX = targetX * projectionFactor;
      const projectedTargetY = targetY * projectionFactor;

      const dx = mx - projectedTargetX;
      const dy = my - projectedTargetY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const targetPos = { x: mx, y: my, z: mz * depthFactor };

      // Pull magnetic particles in when switching options
      const currentMagnetRadius = THREE.MathUtils.lerp(magnetRadius, 100.0, pulse);
      const currentRingRadius = THREE.MathUtils.lerp(ringRadius, 0.0, pulse);

      if (dist < currentMagnetRadius) {
        const angle = Math.atan2(dy, dx) + globalRotation;

        const wave = Math.sin(t * waveSpeed + angle) * (0.5 * waveAmplitude);
        const deviation = randomRadiusOffset * (5 / (fieldStrength + 0.1));

        const computedRingRadius = currentRingRadius + (wave + deviation) * (1 - pulse);

        targetPos.x = projectedTargetX + computedRingRadius * Math.cos(angle);
        targetPos.y = projectedTargetY + computedRingRadius * Math.sin(angle);
        targetPos.z = mz * depthFactor + Math.sin(t) * (1 * waveAmplitude * depthFactor);
      }

      // Smoothly suck particles into absolute screen center (0, 0, 0) during the peak of the pulse
      targetPos.x = THREE.MathUtils.lerp(targetPos.x, 0, pulse * 0.98);
      targetPos.y = THREE.MathUtils.lerp(targetPos.y, 0, pulse * 0.98);
      targetPos.z = THREE.MathUtils.lerp(targetPos.z, -12 * pulse, pulse);

      particle.cx += (targetPos.x - particle.cx) * currentLerpSpeed;
      particle.cy += (targetPos.y - particle.cy) * currentLerpSpeed;
      particle.czVal += (targetPos.z - particle.czVal) * currentLerpSpeed;

      dummy.position.set(particle.cx, particle.cy, particle.czVal);

      dummy.lookAt(projectedTargetX, projectedTargetY, particle.czVal);
      dummy.rotateX(Math.PI / 2);

      const currentDistToMouse = Math.sqrt(
        Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
      );

      const distFromRing = Math.abs(currentDistToMouse - ringRadius);
      let scaleFactor = 1 - distFromRing / 10;

      scaleFactor = Math.max(0, Math.min(1, scaleFactor));

      const finalScale = scaleFactor * (0.8 + Math.sin(t * pulseSpeed) * 0.2 * particleVariance) * particleSize;
      dummy.scale.set(finalScale, finalScale, finalScale);

      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;

    // 2. Process Tiny Secondary Dots Circle (Outer Orbit Orbiting with Capsules!)
    const tinyMesh = tinyMeshRef.current;
    if (tinyMesh) {
      // Rotate at slightly distinct rate or sync with main
      const tinyRotation = globalRotation * 1.05; 
      const tinyRingRadiusOffset = 1.45; // Outer circle around capsules

      tinyParticles.forEach((particle, i) => {
        let { t, speed, mx, my, mz, cz, randomRadiusOffset } = particle;

        t = particle.t += speed / 2;

        const projectionFactor = 1 - cz / 50;
        const projectedTargetX = targetX * projectionFactor;
        const projectedTargetY = targetY * projectionFactor;

        const dx = mx - projectedTargetX;
        const dy = my - projectedTargetY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const targetPos = { x: mx, y: my, z: mz * depthFactor };

        // Pull magnetic particles in when switching options with slightly wider radius
        const currentMagnetRadius = THREE.MathUtils.lerp(magnetRadius * 1.5, 100.0, pulse);
        const currentRingRadius = THREE.MathUtils.lerp(ringRadius * tinyRingRadiusOffset, 0.0, pulse);

        if (dist < currentMagnetRadius) {
          const angle = Math.atan2(dy, dx) + tinyRotation;

          const wave = Math.sin(t * waveSpeed + angle) * (0.35 * waveAmplitude);
          const deviation = randomRadiusOffset * (3 / (fieldStrength + 0.1));

          const computedRingRadius = currentRingRadius + (wave + deviation) * (1 - pulse);

          targetPos.x = projectedTargetX + computedRingRadius * Math.cos(angle);
          targetPos.y = projectedTargetY + computedRingRadius * Math.sin(angle);
          targetPos.z = mz * depthFactor + Math.sin(t) * (0.8 * waveAmplitude * depthFactor);
        }

        // Smoothly suck particles into absolute screen center (0, 0, 0) during the peak of the pulse
        targetPos.x = THREE.MathUtils.lerp(targetPos.x, 0, pulse * 0.98);
        targetPos.y = THREE.MathUtils.lerp(targetPos.y, 0, pulse * 0.98);
        targetPos.z = THREE.MathUtils.lerp(targetPos.z, -12 * pulse, pulse);

        particle.cx += (targetPos.x - particle.cx) * currentLerpSpeed;
        particle.cy += (targetPos.y - particle.cy) * currentLerpSpeed;
        particle.czVal += (targetPos.z - particle.czVal) * currentLerpSpeed;

        dummy.position.set(particle.cx, particle.cy, particle.czVal);

        dummy.lookAt(projectedTargetX, projectedTargetY, particle.czVal);
        dummy.rotateX(Math.PI / 2);

        const currentDistToMouse = Math.sqrt(
          Math.pow(particle.cx - projectedTargetX, 2) + Math.pow(particle.cy - projectedTargetY, 2)
        );

        const distFromRing = Math.abs(currentDistToMouse - (ringRadius * tinyRingRadiusOffset));
        let scaleFactor = 1 - distFromRing / 12;

        scaleFactor = Math.max(0, Math.min(1, scaleFactor));

        // Extremely small sparkling stardust scale (approx 0.3x of primary particles)
        const finalScale = scaleFactor * (0.55 + Math.sin(t * pulseSpeed) * 0.25 * particleVariance) * (particleSize * 0.28);
        dummy.scale.set(finalScale, finalScale, finalScale);

        dummy.updateMatrix();

        tinyMesh.setMatrixAt(i, dummy.matrix);
      });

      tinyMesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
        {particleShape === 'capsule' && <capsuleGeometry args={[0.08, 0.35, 4, 8]} />}
        {particleShape === 'sphere' && <sphereGeometry args={[0.15, 12, 12]} />}
        {particleShape === 'box' && <boxGeometry args={[0.22, 0.22, 0.22]} />}
        {particleShape === 'tetrahedron' && <tetrahedronGeometry args={[0.22]} />}
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </instancedMesh>

      <instancedMesh ref={tinyMeshRef} args={[null as any, null as any, tinyCount]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </instancedMesh>
    </>
  );
});

const Antigravity: React.FC<AntigravityProps> = ({
  count = 250,
  magnetRadius = 12,
  ringRadius = 9,
  waveSpeed = 0.5,
  waveAmplitude = 1.2,
  particleSize = 1.6,
  lerpSpeed = 0.08,
  color = '#6366F1',
  autoAnimate = true,
  particleVariance = 0.8,
  rotationSpeed = 0.1,
  depthFactor = 0.6,
  pulseSpeed = 2.5,
  particleShape = 'capsule',
  fieldStrength = 12,
  externalTarget = null,
  activePhaseIndex = 0,
}) => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 50], fov: 40 }} dpr={[1, 2]}>
        <AntigravityInner
          count={count}
          magnetRadius={magnetRadius}
          ringRadius={ringRadius}
          waveSpeed={waveSpeed}
          waveAmplitude={waveAmplitude}
          particleSize={particleSize}
          lerpSpeed={lerpSpeed}
          color={color}
          autoAnimate={autoAnimate}
          particleVariance={particleVariance}
          rotationSpeed={rotationSpeed}
          depthFactor={depthFactor}
          pulseSpeed={pulseSpeed}
          particleShape={particleShape}
          fieldStrength={fieldStrength}
          externalTarget={externalTarget}
          activePhaseIndex={activePhaseIndex}
        />
      </Canvas>
    </div>
  );
};

export default Antigravity;
