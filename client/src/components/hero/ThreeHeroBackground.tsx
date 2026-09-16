import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroBackgroundProps {
  /** تفعيل حركة البارالاكس وتتبع حركة الماوس */
  parallaxEnabled?: boolean;
  /** تفعيل الظلال ثلاثية الأبعاد فائقة الدقة */
  shadowsEnabled?: boolean;
  /** جولة كاميرا انسيابية بطيئة */
  autoTour?: boolean;
  /** دالة رد نداء عند النقر على أي عنصر هندسي */
  onItemClick?: (itemName: string) => void;
  /** كلاسات Tailwind إضافية للحاوية */
  className?: string;
}

export const ThreeHeroBackground: React.FC<ThreeHeroBackgroundProps> = ({
  parallaxEnabled = true,
  shadowsEnabled = true,
  autoTour = true,
  onItemClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // 1. Scene & Atmosphere Setup (Fixed Golden Sunrise)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfde68a);
    scene.fog = new THREE.FogExp2(0xfef3c7, 0.009);

    // 2. Camera Setup (Faithful Composition from Reference)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const baseCamPos = new THREE.Vector3(0.5, 4.2, 12.8);
    const baseLookAt = new THREE.Vector3(0.5, 2.5, 0);
    camera.position.copy(baseCamPos);
    camera.lookAt(baseLookAt);

    // 3. WebGL Renderer with ACES Tone Mapping & High-Res PCF Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = shadowsEnabled;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Fixed Golden Sunrise Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfef3c7, 0.7);
    scene.add(ambientLight);

    // Main Golden Sun (Upper-right diagonal casting long architectural shadows)
    const sunLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    sunLight.position.set(22, 28, 16);
    sunLight.castShadow = shadowsEnabled;
    sunLight.shadow.mapSize.width = 4096;
    sunLight.shadow.mapSize.height = 4096;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 130;
    sunLight.shadow.camera.left = -25;
    sunLight.shadow.camera.right = 25;
    sunLight.shadow.camera.top = 25;
    sunLight.shadow.camera.bottom = -25;
    sunLight.shadow.bias = -0.00012;
    sunLight.shadow.normalBias = 0.035;
    scene.add(sunLight);

    // Dedicated Desk Contact Shadow Light
    const deskShadowLight = new THREE.DirectionalLight(0xffedd5, 0.9);
    deskShadowLight.position.set(6, 12, 8);
    deskShadowLight.target.position.set(0.2, 0.9, 4.8);
    deskShadowLight.castShadow = shadowsEnabled;
    deskShadowLight.shadow.mapSize.width = 2048;
    deskShadowLight.shadow.mapSize.height = 2048;
    deskShadowLight.shadow.camera.near = 0.1;
    deskShadowLight.shadow.camera.far = 25;
    deskShadowLight.shadow.camera.left = -3;
    deskShadowLight.shadow.camera.right = 3;
    deskShadowLight.shadow.camera.top = 3;
    deskShadowLight.shadow.camera.bottom = -3;
    deskShadowLight.shadow.bias = -0.0002;
    deskShadowLight.shadow.normalBias = 0.02;
    scene.add(deskShadowLight);
    scene.add(deskShadowLight.target);

    // 5. Materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.88,
      metalness: 0.05,
    });
    const woodDeskMat = new THREE.MeshStandardMaterial({
      color: 0x854d0e,
      roughness: 0.65,
      metalness: 0.08,
    });
    const yellowCraneMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.4,
      metalness: 0.5,
    });
    const tripodAluMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.35,
      metalness: 0.7,
    });
    const darkHardwareMat = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      roughness: 0.45,
      metalness: 0.8,
    });
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.85,
    });

    // 6. Architectural Elements: Terrace Slab & Site Ground
    const terraceGeo = new THREE.BoxGeometry(16, 0.6, 12);
    const terraceMesh = new THREE.Mesh(terraceGeo, concreteMat);
    terraceMesh.position.set(0, 0.5, 3.5);
    terraceMesh.receiveShadow = true;
    scene.add(terraceMesh);

    // Site Foundation Ground
    const groundGeo = new THREE.PlaneGeometry(350, 350);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.95,
      metalness: 0.02,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.set(0, -6, -50);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // 7. Desk Elements (Foreground Desk & Survey Tools)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0.2, 0.85, 4.8);

    // Tabletop
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.16, 3.2), woodDeskMat);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Safety Helmet
    const helmetGroup = new THREE.Group();
    helmetGroup.name = 'helmet';
    helmetGroup.position.set(-1.4, 0.28, 0.3);
    const domeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.25, metalness: 0.15 })
    );
    domeMesh.castShadow = true;
    helmetGroup.add(domeMesh);
    deskGroup.add(helmetGroup);

    // Blueprint Roll & Sheet
    const blueprintMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.6,
      metalness: 0.05,
    });
    const sheetMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.015, 1.6), blueprintMat);
    sheetMesh.position.set(0.3, 0.09, 0.1);
    sheetMesh.rotation.y = -0.06;
    sheetMesh.castShadow = true;
    sheetMesh.receiveShadow = true;
    deskGroup.add(sheetMesh);

    // Tablet
    const tabletGroup = new THREE.Group();
    tabletGroup.name = 'tablet';
    tabletGroup.position.set(1.7, 0.1, 0.25);
    const tabletBody = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.04, 1.2), darkHardwareMat);
    tabletBody.castShadow = true;
    tabletBody.receiveShadow = true;
    tabletGroup.add(tabletBody);
    deskGroup.add(tabletGroup);

    scene.add(deskGroup);

    // 8. Survey Theodolite on Tripod (Surveyor Station)
    const theodoliteGroup = new THREE.Group();
    theodoliteGroup.name = 'theodolite';
    theodoliteGroup.position.set(-2.6, 0.8, 4.2);

    // Tripod Legs
    [-0.55, 0.55, 0].forEach((xOff, idx) => {
      const zOff = idx === 2 ? -0.65 : 0.45;
      const legMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.03, 2.5, 12), tripodAluMat);
      legMesh.position.set(xOff * 0.5, 1.15, zOff * 0.5);
      legMesh.rotation.z = -xOff * 0.35;
      legMesh.rotation.x = zOff * 0.35;
      legMesh.castShadow = true;
      legMesh.receiveShadow = true;
      theodoliteGroup.add(legMesh);
    });

    // Theodolite Body
    const theodoliteHead = new THREE.Group();
    theodoliteHead.position.set(0, 2.35, 0);
    const baseCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.3, 16), darkHardwareMat);
    baseCyl.castShadow = true;
    theodoliteHead.add(baseCyl);

    const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.75, 16), darkHardwareMat);
    telescope.rotation.x = Math.PI / 2 + 0.15;
    telescope.position.set(0, 0.28, 0);
    telescope.castShadow = true;
    theodoliteHead.add(telescope);

    // Surveying Laser Beam
    const laserBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 60, 8), laserMat);
    laserBeam.position.set(0, 0.28, -30);
    laserBeam.rotation.x = Math.PI / 2;
    theodoliteHead.add(laserBeam);

    theodoliteGroup.add(theodoliteHead);
    scene.add(theodoliteGroup);

    // 9. Construction Tower & Golden Cranes
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-7.5, -4, -18);
    for (let floor = 0; floor < 14; floor++) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(11, 0.4, 9), concreteMat);
      slab.position.set(0, floor * 1.55, 0);
      slab.castShadow = true;
      slab.receiveShadow = true;
      towerGroup.add(slab);
    }
    scene.add(towerGroup);

    // Yellow Tower Crane
    const craneGroup = new THREE.Group();
    craneGroup.position.set(-6, -4, -22);
    const craneMast = new THREE.Mesh(new THREE.BoxGeometry(0.9, 32, 0.9), yellowCraneMat);
    craneMast.position.set(0, 16, 0);
    craneMast.castShadow = true;
    craneGroup.add(craneMast);

    const craneJib = new THREE.Mesh(new THREE.BoxGeometry(26, 0.8, 0.8), yellowCraneMat);
    craneJib.position.set(7, 32, 0);
    craneJib.castShadow = true;
    craneGroup.add(craneJib);
    scene.add(craneGroup);

    // 10. Distant Riyadh Horizon Silhouette
    const skylineGroup = new THREE.Group();
    skylineGroup.position.set(18, -4, -65);
    for (let i = 0; i < 18; i++) {
      const bHeight = 12 + Math.random() * 26;
      const bWidth = 4 + Math.random() * 6;
      const bMesh = new THREE.Mesh(
        new THREE.BoxGeometry(bWidth, bHeight, bWidth),
        new THREE.MeshStandardMaterial({
          color: 0xfef08a,
          roughness: 0.95,
          metalness: 0.05,
        })
      );
      bMesh.position.set((i - 9) * 8.5, bHeight / 2, (Math.random() - 0.5) * 20);
      skylineGroup.add(bMesh);
    }
    scene.add(skylineGroup);

    // 11. Mouse & Parallax State
    let mouseX = 0;
    let mouseY = 0;
    let targetCamX = baseCamPos.x;
    let targetCamY = baseCamPos.y;

    const onMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseX = normX;
      mouseY = normY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Interactive Raycaster for Clicks
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);

      const intersects = raycaster.intersectObjects(
        [helmetGroup, tabletGroup, theodoliteGroup],
        true
      );
      if (intersects.length > 0) {
        let rootObj: THREE.Object3D | null = intersects[0].object;
        while (rootObj && !['helmet', 'tablet', 'theodolite'].includes(rootObj.name)) {
          rootObj = rootObj.parent;
        }
        if (rootObj && onItemClick) {
          onItemClick(rootObj.name);
        }
      }
    };
    window.addEventListener('click', onClick);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 12. Main Render Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Crane Rotation
      craneJib.rotation.y = Math.sin(time * 0.18) * 0.45;

      // Parallax & Smooth Camera Movement
      if (parallaxEnabled) {
        targetCamX = baseCamPos.x + mouseX * 1.35;
        targetCamY = baseCamPos.y + mouseY * 0.85;
      } else {
        targetCamX = baseCamPos.x;
        targetCamY = baseCamPos.y;
      }

      if (autoTour) {
        targetCamX += Math.sin(time * 0.35) * 0.4;
        targetCamY += Math.cos(time * 0.25) * 0.18;
      }

      camera.position.x += (targetCamX - camera.position.x) * 0.045;
      camera.position.y += (targetCamY - camera.position.y) * 0.045;
      camera.lookAt(baseLookAt);

      // Render Directly without Bloom
      renderer.render(scene, camera);
    };

    animate();

    // 13. Cleanup on Unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [parallaxEnabled, shadowsEnabled, autoTour, onItemClick]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default ThreeHeroBackground;
