import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createDeskElements, DeskSceneResult } from './scene/DeskElements';
import { createConstructionSiteElements, ConstructionSiteResult } from './scene/ConstructionSiteElements';
import { createSkylineElements, SkylineResult } from './scene/SkylineElements';

export type CameraPreset = 'overview' | 'desk' | 'construction' | 'skyline';
export type LightingTheme = 'morning' | 'day' | 'sunset';

interface ThreeHeroWorldProps {
  cameraPreset?: CameraPreset;
  lightingTheme?: LightingTheme;
  wireframe?: boolean;
  autoTour?: boolean;
  parallaxEnabled?: boolean;
  shadowsEnabled?: boolean;
  onRaycastClick?: (objectName: string) => void;
}

// Camera coordinates for the diverse view presets
const CAMERA_PRESETS: Record<
  CameraPreset,
  { cam: THREE.Vector3; look: THREE.Vector3 }
> = {
  // Exact composition of the user's uploaded image!
  overview: {
    cam: new THREE.Vector3(0.5, 4.2, 12.8),
    look: new THREE.Vector3(0.5, 2.5, 0),
  },
  // Close-up on the desk instruments (Hard hat, blueprint, tablet, pen)
  desk: {
    cam: new THREE.Vector3(0.2, 3.2, 7.8),
    look: new THREE.Vector3(0.2, 1.2, 3.5),
  },
  // Looking out at the concrete tower and yellow cranes
  construction: {
    cam: new THREE.Vector3(-4.0, 5.5, 5.0),
    look: new THREE.Vector3(-10, 8.0, -20),
  },
  // Gazing across the horizon towards Kingdom Tower & Riyadh Skyline
  skyline: {
    cam: new THREE.Vector3(4.0, 6.0, 4.0),
    look: new THREE.Vector3(25, 15, -70),
  },
};

export const ThreeHeroWorld: React.FC<ThreeHeroWorldProps> = ({
  cameraPreset = 'overview',
  lightingTheme = 'morning',
  wireframe = false,
  autoTour = true,
  parallaxEnabled = true,
  shadowsEnabled = true,
  onRaycastClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  // References for live prop changes
  const propsRef = useRef({
    cameraPreset,
    lightingTheme,
    wireframe,
    autoTour,
    parallaxEnabled,
    shadowsEnabled,
  });

  const modulesRef = useRef<{
    desk?: DeskSceneResult;
    construction?: ConstructionSiteResult;
    skyline?: SkylineResult;
  }>({});

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const deskShadowLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Sync props
  useEffect(() => {
    propsRef.current.cameraPreset = cameraPreset;
  }, [cameraPreset]);

  useEffect(() => {
    propsRef.current.parallaxEnabled = parallaxEnabled;
  }, [parallaxEnabled]);

  useEffect(() => {
    propsRef.current.shadowsEnabled = shadowsEnabled;
    if (dirLightRef.current) {
      dirLightRef.current.castShadow = shadowsEnabled;
    }
    if (deskShadowLightRef.current) {
      deskShadowLightRef.current.castShadow = shadowsEnabled;
    }
    if (rendererRef.current) {
      rendererRef.current.shadowMap.enabled = shadowsEnabled;
      rendererRef.current.shadowMap.needsUpdate = true;
    }
  }, [shadowsEnabled]);

  useEffect(() => {
    propsRef.current.autoTour = autoTour;
  }, [autoTour]);

  useEffect(() => {
    propsRef.current.wireframe = wireframe;
    modulesRef.current.desk?.setWireframe(wireframe);
    modulesRef.current.construction?.setWireframe(wireframe);
  }, [wireframe]);

  useEffect(() => {
    propsRef.current.lightingTheme = lightingTheme;
    modulesRef.current.skyline?.setLightingTheme(lightingTheme);

    if (dirLightRef.current && ambientLightRef.current) {
      if (lightingTheme === 'sunset') {
        dirLightRef.current.color.setHex(0xf97316);
        dirLightRef.current.intensity = 2.2;
        ambientLightRef.current.color.setHex(0x7c2d12);
      } else if (lightingTheme === 'day') {
        dirLightRef.current.color.setHex(0xffffff);
        dirLightRef.current.intensity = 1.6;
        ambientLightRef.current.color.setHex(0xe0f2fe);
      } else {
        // Morning Golden Hour (Fixed signature atmosphere)
        dirLightRef.current.color.setHex(0xfff3d6);
        dirLightRef.current.intensity = 2.0;
        ambientLightRef.current.color.setHex(0xfef3c7);
      }
    }
  }, [lightingTheme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Atmospheric Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfef3c7);
    scene.fog = new THREE.FogExp2(0xfef3c7, 0.007);

    // 2. Perspective Camera with high-fidelity depth
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 450);

    const initialPreset = CAMERA_PRESETS[propsRef.current.cameraPreset];
    camera.position.copy(initialPreset.cam);
    const currentLookAt = initialPreset.look.clone();
    camera.lookAt(currentLookAt);

    // 3. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      stencil: false,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = propsRef.current.shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Photorealistic Golden Hour Lighting Rig & High-Resolution Shadow Mapping
    const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.65);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // High-Resolution Golden Sun Directional Light (Streaming from upper right)
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.0);
    sunLight.position.set(42, 36, -26);
    sunLight.castShadow = propsRef.current.shadowsEnabled;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 160;
    sunLight.shadow.camera.left = -34;
    sunLight.shadow.camera.right = 34;
    sunLight.shadow.camera.top = 34;
    sunLight.shadow.camera.bottom = -22;
    sunLight.shadow.bias = -0.00012;
    sunLight.shadow.normalBias = 0.035;
    sunLight.shadow.radius = 2.0;

    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(-2, 2, -4);
    scene.add(sunTarget);
    sunLight.target = sunTarget;
    scene.add(sunLight);
    dirLightRef.current = sunLight;

    // Dedicated Desk Contact Shadow Light (High precision crisp contact shadows on table, helmet, plans)
    const deskShadowLight = new THREE.DirectionalLight(0xffeedb, 0.85);
    deskShadowLight.position.set(10, 16, 12);
    deskShadowLight.castShadow = propsRef.current.shadowsEnabled;
    deskShadowLight.shadow.mapSize.width = 2048;
    deskShadowLight.shadow.mapSize.height = 2048;
    deskShadowLight.shadow.camera.near = 2;
    deskShadowLight.shadow.camera.far = 32;
    deskShadowLight.shadow.camera.left = -11;
    deskShadowLight.shadow.camera.right = 11;
    deskShadowLight.shadow.camera.top = 10;
    deskShadowLight.shadow.camera.bottom = -8;
    deskShadowLight.shadow.bias = -0.0001;
    deskShadowLight.shadow.normalBias = 0.025;
    deskShadowLight.shadow.radius = 1.6;

    const deskTarget = new THREE.Object3D();
    deskTarget.position.set(0, 0, 4);
    scene.add(deskTarget);
    deskShadowLight.target = deskTarget;
    scene.add(deskShadowLight);
    deskShadowLightRef.current = deskShadowLight;

    // Warm table fill bounce light
    const bounceLight = new THREE.PointLight(0xfed7aa, 1.2, 30);
    bounceLight.position.set(0, 3, 6);
    scene.add(bounceLight);

    // Subtle crimson rim light (Rayan Brand Signature)
    const rimLight = new THREE.DirectionalLight(0x8a1834, 0.8);
    rimLight.position.set(-25, 15, 10);
    scene.add(rimLight);

    // 5. Instantiate the 3 Modules
    const deskModule = createDeskElements();
    deskModule.setWireframe(propsRef.current.wireframe);
    scene.add(deskModule.group);

    const constructionModule = createConstructionSiteElements();
    constructionModule.setWireframe(propsRef.current.wireframe);
    scene.add(constructionModule.group);

    const skylineModule = createSkylineElements();
    skylineModule.setLightingTheme(propsRef.current.lightingTheme);
    scene.add(skylineModule.group);

    modulesRef.current = {
      desk: deskModule,
      construction: constructionModule,
      skyline: skylineModule,
    };

    // 6. Mouse Interaction, Parallax, Drag-to-Look, and Scroll-to-Zoom
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let dragOrbitX = 0;
    let dragOrbitY = 0;

    let zoomOffset = 0;
    let targetZoomOffset = 0;

    const onPointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX / innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        dragOrbitX += deltaX * 0.004;
        dragOrbitY = Math.max(-0.6, Math.min(0.6, dragOrbitY + deltaY * 0.003));
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;
      }
    };

    const onPointerLeave = () => {
      if (!isDragging) {
        targetMouseX = 0;
        targetMouseY = 0;
      }
    };

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevPointerX = e.touches[0].clientX;
        prevPointerY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const { innerWidth, innerHeight } = window;
        targetMouseX = (e.touches[0].clientX / innerWidth - 0.5) * 2;
        targetMouseY = (e.touches[0].clientY / innerHeight - 0.5) * 2;

        if (isDragging) {
          const deltaX = e.touches[0].clientX - prevPointerX;
          const deltaY = e.touches[0].clientY - prevPointerY;
          dragOrbitX += deltaX * 0.005;
          dragOrbitY = Math.max(-0.6, Math.min(0.6, dragOrbitY + deltaY * 0.004));
          prevPointerX = e.touches[0].clientX;
          prevPointerY = e.touches[0].clientY;
        }
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    // Scroll to Zoom in/out of depth
    const onWheel = (e: WheelEvent) => {
      targetZoomOffset = Math.max(-4.5, Math.min(8.0, targetZoomOffset + e.deltaY * 0.005));
    };

    // Interactive Raycaster Click on 3D Objects
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      // Ignore click if was dragging
      if (Math.abs(dragOrbitX) > 0.1) return;

      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let currentObj: THREE.Object3D | null = intersects[0].object;
        let detected = '';

        while (currentObj && currentObj !== scene) {
          if (currentObj === deskModule.helmet) {
            detected = 'helmet';
            break;
          }
          if (currentObj === deskModule.tablet) {
            detected = 'tablet';
            break;
          }
          if (currentObj === constructionModule.theodolite) {
            detected = 'theodolite';
            break;
          }
          currentObj = currentObj.parent;
        }

        if (detected === 'theodolite') {
          constructionModule.fireLaserPulse();
          onRaycastClick?.('theodolite');
        } else if (detected === 'tablet') {
          onRaycastClick?.('tablet');
        } else if (detected === 'helmet') {
          onRaycastClick?.('helmet');
        }
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('click', onClick);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Responsive Canvas Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = entry.contentRect.height;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();

    // -------------------------------------------------------------
    // RENDER / ANIMATION LOOP
    // -------------------------------------------------------------
    const destCamPos = new THREE.Vector3();
    const destLookAt = new THREE.Vector3();

    const renderLoop = () => {
      animFrameId.current = requestAnimationFrame(renderLoop);

      const time = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Mouse easing (fluid acceleration & deceleration)
      mouseX += (targetMouseX - mouseX) * 0.065;
      mouseY += (targetMouseY - mouseY) * 0.065;
      zoomOffset += (targetZoomOffset - zoomOffset) * 0.06;

      // 1. Camera target calculations
      const activePreset = CAMERA_PRESETS[propsRef.current.cameraPreset];

      // Subtle breathing / slow auto-tour flight sway
      const tourSwayX = propsRef.current.autoTour ? Math.sin(time * 0.3) * 0.35 : 0;
      const tourSwayY = propsRef.current.autoTour ? Math.cos(time * 0.4) * 0.18 : 0;

      // Interactive Parallax configuration
      const isParallax = propsRef.current.parallaxEnabled !== false;
      const pScale = isParallax ? 1.0 : 0.0;

      // Parallax translation:
      // When cursor moves, camera translates along a dynamic orbital arc,
      // creating rich depth separation between the close desk items and the distant Riyadh skyline!
      const parallaxX = (mouseX * 2.2 * pScale) + (dragOrbitX * 3.5) + tourSwayX;
      const parallaxY = (-mouseY * 1.5 * pScale) - (dragOrbitY * 2.5) + tourSwayY;
      // Spherical depth push (moves camera slightly back when cursor is away from center)
      const parallaxZ = (Math.hypot(mouseX, mouseY) * 0.4 * pScale) + zoomOffset;

      destCamPos.set(
        activePreset.cam.x + parallaxX,
        activePreset.cam.y + parallaxY,
        activePreset.cam.z + parallaxZ
      );

      // Anchored focal target with subtle counter-tracking:
      // By keeping lookAt anchored on the focal plane, the camera physically rotates
      // towards the center, generating authentic orbital rotational parallax!
      destLookAt.set(
        activePreset.look.x + (mouseX * 0.35 * pScale) + (dragOrbitX * 1.2),
        activePreset.look.y - (mouseY * 0.25 * pScale) - (dragOrbitY * 0.8),
        activePreset.look.z
      );

      // Smooth camera interpolation
      camera.position.lerp(destCamPos, 0.05);
      currentLookAt.lerp(destLookAt, 0.05);
      camera.lookAt(currentLookAt);

      // Subtle Rotational Camera Roll & Pitch Tilt (Responsive 3D Parallax feel)
      if (isParallax) {
        camera.rotation.z += -mouseX * 0.028; // cinematic banking roll
        camera.rotation.x += -mouseY * 0.015; // vertical pitch tilt
        camera.rotation.y += -mouseX * 0.020; // horizontal yaw orbit
      }

      // 2. Update Scene Modules (Animations & Interactive Dynamics with cursor tracking)
      deskModule.update(time, delta, isParallax ? mouseX : 0, isParallax ? mouseY : 0);
      constructionModule.update(time, delta, isParallax ? mouseX : 0, isParallax ? mouseY : 0);
      skylineModule.update(time, delta);

      // 3. Crisp Direct Rendering with Tone Mapping and High-Res Shadow Mapping
      renderer.render(scene, camera);
    };

    renderLoop();

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('click', onClick);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();

      deskModule.dispose();
      constructionModule.dispose();
      skylineModule.dispose();

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-hero-world-canvas"
      className="absolute inset-0 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      style={{ zIndex: 0 }}
    />
  );
};
