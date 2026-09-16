import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { StoryboardId, ViewSettings } from './types';
import { SceneModule, createSurveyorScene } from './scene/SurveyorSceneModule';
import { createConstructionScene } from './scene/ConstructionSceneModule';
import { createReportsScene } from './scene/ReportsSceneModule';
import { createRealEstateScene } from './scene/RealEstateSceneModule';
import { MaterialCache } from './scene/MaterialCache';

interface ThreeHeroBackgroundProps {
  activeScene: StoryboardId;
  viewSettings: ViewSettings;
  onSceneTargetReached?: () => void;
  onPerformanceStats?: (stats: { fps: number; drawCalls: number; activeObjects: number }) => void;
}

// Map scene camera coordinates along the Z-Depth Corridor
const SCENE_TARGETS: Record<
  StoryboardId,
  {
    camX: number;
    camY: number;
    camZ: number;
    lookX: number;
    lookY: number;
    lookZ: number;
  }
> = {
  '01': { camX: 0, camY: 7, camZ: 48, lookX: 0, lookY: 3.5, lookZ: 30 },
  '02': { camX: 8, camY: 10, camZ: 28, lookX: 5, lookY: 6, lookZ: 14 },
  '03': { camX: -3, camY: 5.5, camZ: 9, lookX: -2, lookY: 2.5, lookZ: -4 },
  '04': { camX: 0, camY: 12, camZ: -6, lookX: 0, lookY: 3, lookZ: -20 },
};

export const ThreeHeroBackground: React.FC<ThreeHeroBackgroundProps> = ({
  activeScene,
  viewSettings,
  onPerformanceStats,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // Lazy Loaded Scene Modules Storage
  const sceneModulesRef = useRef<Map<StoryboardId, SceneModule>>(new Map());
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Mouse Parallax & Dynamic State
  const stateRef = useRef({
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    activeScene,
    settings: viewSettings,
    clock: new THREE.Clock(),
    frameCount: 0,
    lastFpsTime: performance.now(),
  });

  // Keep stateRef in sync with React props without triggering canvas recreation
  useEffect(() => {
    stateRef.current.activeScene = activeScene;
  }, [activeScene]);

  useEffect(() => {
    stateRef.current.settings = viewSettings;
    // Broadcast wireframe changes to all active modules
    sceneModulesRef.current.forEach((mod) => {
      mod.setWireframe(viewSettings.wireframe);
    });
  }, [viewSettings]);

  // -------------------------------------------------------------
  // LAZY LOADING MANAGER FOR STORYBOARD SCENES
  // -------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Load active scene module if not already loaded (Lazy Instantiation)
    if (!sceneModulesRef.current.has(activeScene)) {
      let newModule: SceneModule | null = null;
      switch (activeScene) {
        case '01':
          newModule = createSurveyorScene();
          break;
        case '02':
          newModule = createConstructionScene();
          break;
        case '03':
          newModule = createReportsScene();
          break;
        case '04':
          newModule = createRealEstateScene();
          break;
      }

      if (newModule) {
        newModule.setWireframe(stateRef.current.settings.wireframe);
        scene.add(newModule.group);
        sceneModulesRef.current.set(activeScene, newModule);
      }
    }

    // Unload distant scenes to conserve GPU memory and keep draw calls minimal
    // Keep active scene plus immediate neighbor for smooth transitions
    const sceneKeys: StoryboardId[] = Array.from(sceneModulesRef.current.keys());
    const scenesToRetain = new Set<StoryboardId>([activeScene]);

    // If on scene 01, can keep 02 loaded; if 04, keep 03
    if (activeScene === '01') scenesToRetain.add('02');
    if (activeScene === '02') {
      scenesToRetain.add('01');
      scenesToRetain.add('03');
    }
    if (activeScene === '03') {
      scenesToRetain.add('02');
      scenesToRetain.add('04');
    }
    if (activeScene === '04') scenesToRetain.add('03');

    sceneKeys.forEach((key) => {
      if (!scenesToRetain.has(key)) {
        const mod = sceneModulesRef.current.get(key);
        if (mod) {
          scene.remove(mod.group);
          mod.dispose();
          sceneModulesRef.current.delete(key);
        }
      }
    });
  }, [activeScene]);

  // -------------------------------------------------------------
  // CORE THREE.JS INITIALIZATION (Run once)
  // -------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Atmosphere Fog
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x06070a);
    scene.fog = new THREE.FogExp2(0x06070a, 0.016);

    // 2. Camera setup with standard FOV
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 350);

    const initialPos = SCENE_TARGETS[stateRef.current.activeScene];
    camera.position.set(initialPos.camX, initialPos.camY, initialPos.camZ);
    camera.lookAt(initialPos.lookX, initialPos.lookY, initialPos.lookZ);

    // 3. High Performance Renderer (capped pixel ratio 1.5, powerPreference)
    const renderer = new THREE.WebGLRenderer({
      antialias: window.devicePixelRatio <= 1.5,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff3d6, 1.4);
    mainKeyLight.position.set(30, 45, 40);
    scene.add(mainKeyLight);

    const crimsonRimLight = new THREE.DirectionalLight(0x9e1333, 2.0);
    crimsonRimLight.position.set(-30, 20, -10);
    scene.add(crimsonRimLight);

    const goldFillLight = new THREE.PointLight(0xd4af37, 1.8, 60);
    goldFillLight.position.set(5, 12, 20);
    scene.add(goldFillLight);

    // 5. Shared Depth Particles (Budgeted to 700 particles for high 60fps performance)
    const particleCount = 700;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cBurgundy = new THREE.Color(0x9e1333);
    const cGold = new THREE.Color(0xd4af37);
    const cCyan = new THREE.Color(0x38bdf8);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * 80;
      particlePositions[idx + 1] = Math.random() * 26 - 2;
      particlePositions[idx + 2] = Math.random() * 90 - 30;

      const choice = Math.random();
      const col = choice < 0.4 ? cBurgundy : choice < 0.75 ? cGold : cCyan;
      particleColors[idx] = col.r;
      particleColors[idx + 1] = col.g;
      particleColors[idx + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const depthParticleField = new THREE.Points(particleGeo, particleMat);
    scene.add(depthParticleField);

    // 6. Laser Scan Plane
    const scanGeo = new THREE.PlaneGeometry(80, 24);
    scanGeo.rotateX(-Math.PI / 2);
    const scanMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const scanPlane = new THREE.Mesh(scanGeo, scanMat);
    scanPlane.position.y = 1.2;
    scene.add(scanPlane);

    // 7. Initial load of the starting active scene
    const initialModule = createSurveyorScene();
    initialModule.setWireframe(stateRef.current.settings.wireframe);
    scene.add(initialModule.group);
    sceneModulesRef.current.set(stateRef.current.activeScene, initialModule);

    // Mouse Move listener with throttled smooth interpolation
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      stateRef.current.targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      stateRef.current.targetMouseY = (e.clientY / innerHeight - 0.5) * 2;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const { innerWidth, innerHeight } = window;
        stateRef.current.targetMouseX =
          (e.touches[0].clientX / innerWidth - 0.5) * 2;
        stateRef.current.targetMouseY =
          (e.touches[0].clientY / innerHeight - 0.5) * 2;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Resize Observer for responsive canvas
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Current camera motion smoothers
    const camLookAt = new THREE.Vector3(
      initialPos.lookX,
      initialPos.lookY,
      initialPos.lookZ
    );
    const currentCamTarget = new THREE.Vector3();

    // -------------------------------------------------------------
    // RENDER / ANIMATION LOOP
    // -------------------------------------------------------------
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const t = stateRef.current.clock.getElapsedTime();
      const delta = stateRef.current.clock.getDelta();
      const { settings, activeScene: currScene } = stateRef.current;

      // Mouse smoothing
      stateRef.current.mouseX +=
        (stateRef.current.targetMouseX - stateRef.current.mouseX) * 0.05;
      stateRef.current.mouseY +=
        (stateRef.current.targetMouseY - stateRef.current.mouseY) * 0.05;

      // 1. Update Camera Position and LookAt
      const targetPos = SCENE_TARGETS[currScene];
      const depthOffset = (settings.depthZ / 100) * 12;
      const flySwayX = settings.autoFly ? Math.sin(t * 0.4) * 0.8 : 0;
      const flySwayY = settings.autoFly ? Math.cos(t * 0.5) * 0.4 : 0;

      const destCamX =
        targetPos.camX + stateRef.current.mouseX * 2.5 + flySwayX;
      const destCamY =
        targetPos.camY - stateRef.current.mouseY * 1.5 + flySwayY;
      const destCamZ = targetPos.camZ - depthOffset;

      const lerpFactor = 0.045;
      camera.position.x += (destCamX - camera.position.x) * lerpFactor;
      camera.position.y += (destCamY - camera.position.y) * lerpFactor;
      camera.position.z += (destCamZ - camera.position.z) * lerpFactor;

      currentCamTarget.set(
        targetPos.lookX + stateRef.current.mouseX * 0.8,
        targetPos.lookY - stateRef.current.mouseY * 0.5,
        targetPos.lookZ
      );
      camLookAt.lerp(currentCamTarget, lerpFactor);
      camera.lookAt(camLookAt);

      // 2. Animate Only Currently Loaded Scene Modules
      sceneModulesRef.current.forEach((mod) => {
        mod.update(t, delta);
      });

      // 3. Animate Depth Particles (slow drift)
      depthParticleField.rotation.y = t * 0.02;

      // 4. Laser Scan Plane sweep
      if (settings.laserScan) {
        scanPlane.visible = true;
        scanPlane.position.z = 45 - ((t * 8) % 75);
      } else {
        scanPlane.visible = false;
      }

      // 5. Calculate Performance Telemetry
      stateRef.current.frameCount++;
      const now = performance.now();
      if (now - stateRef.current.lastFpsTime >= 500) {
        const fps = Math.round(
          (stateRef.current.frameCount * 1000) / (now - stateRef.current.lastFpsTime)
        );
        stateRef.current.frameCount = 0;
        stateRef.current.lastFpsTime = now;

        if (onPerformanceStats) {
          onPerformanceStats({
            fps,
            drawCalls: renderer.info.render.calls,
            activeObjects: renderer.info.render.triangles,
          });
        }
      }

      // Render Scene
      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      resizeObserver.disconnect();

      // Dispose all active modules
      sceneModulesRef.current.forEach((mod) => {
        mod.dispose();
      });
      sceneModulesRef.current.clear();

      MaterialCache.disposeAll();

      // Dispose scene elements
      particleGeo.dispose();
      particleMat.dispose();
      scanGeo.dispose();
      scanMat.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-hero-canvas-container"
      className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
