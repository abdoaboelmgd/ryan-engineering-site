import * as THREE from 'three';

export interface SkylineResult {
  group: THREE.Group;
  update: (time: number, delta: number) => void;
  dispose: () => void;
  sunMesh: THREE.Mesh;
  setLightingTheme: (theme: 'morning' | 'day' | 'sunset') => void;
}

export function createSkylineElements(): SkylineResult {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // =========================================================================
  // 1. SKY DOME GRADIENT (سماء الصباح الذهبية)
  // =========================================================================
  const skyGeo = new THREE.SphereGeometry(220, 32, 24);
  disposables.push(skyGeo);

  // Procedural gradient sky canvas texture
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 512;
  skyCanvas.height = 512;
  const skyCtx = skyCanvas.getContext('2d');
  if (skyCtx) {
    const grad = skyCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#1d4ed8');   // Azure blue at zenith
    grad.addColorStop(0.4, '#60a5fa'); // Soft morning sky
    grad.addColorStop(0.7, '#fcd34d'); // Warm amber golden dawn
    grad.addColorStop(0.9, '#f97316'); // Rich sunrise orange
    grad.addColorStop(1.0, '#7c2d12'); // Horizon glow
    skyCtx.fillStyle = grad;
    skyCtx.fillRect(0, 0, 512, 512);
  }
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  disposables.push(skyTex);

  const skyMat = new THREE.MeshBasicMaterial({
    map: skyTex,
    side: THREE.BackSide,
  });
  disposables.push(skyMat);

  const skyDome = new THREE.Mesh(skyGeo, skyMat);
  group.add(skyDome);

  // =========================================================================
  // 2. RADIANT GOLDEN SUN & CORONA (الشمس الذهبية المشرقة في الأعلى إلى اليمين)
  // =========================================================================
  const sunGroup = new THREE.Group();
  sunGroup.position.set(45, 38, -95);
  group.add(sunGroup);

  const sunGeo = new THREE.SphereGeometry(6.5, 24, 24);
  disposables.push(sunGeo);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
  disposables.push(sunMat);
  const sunMesh = new THREE.Mesh(sunGeo, sunMat);
  sunGroup.add(sunMesh);

  // Sun Corona Glow (Halo)
  const coronaGeo = new THREE.PlaneGeometry(36, 36);
  disposables.push(coronaGeo);

  const coronaCanvas = document.createElement('canvas');
  coronaCanvas.width = 256;
  coronaCanvas.height = 256;
  const cCtx = coronaCanvas.getContext('2d');
  if (cCtx) {
    const radial = cCtx.createRadialGradient(128, 128, 15, 128, 128, 128);
    radial.addColorStop(0, 'rgba(255, 245, 200, 0.95)');
    radial.addColorStop(0.3, 'rgba(251, 191, 36, 0.6)');
    radial.addColorStop(0.7, 'rgba(249, 115, 22, 0.2)');
    radial.addColorStop(1, 'rgba(249, 115, 22, 0)');
    cCtx.fillStyle = radial;
    cCtx.fillRect(0, 0, 256, 256);
  }
  const coronaTex = new THREE.CanvasTexture(coronaCanvas);
  disposables.push(coronaTex);

  const coronaMat = new THREE.MeshBasicMaterial({
    map: coronaTex,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  disposables.push(coronaMat);
  const corona = new THREE.Mesh(coronaGeo, coronaMat);
  sunGroup.add(corona);

  // =========================================================================
  // 3. ICONIC RIYADH LANDMARKS: KINGDOM TOWER & AL FAISALIAH
  // =========================================================================
  const skylineGroup = new THREE.Group();
  skylineGroup.position.set(0, 0, -80);
  group.add(skylineGroup);

  // Facade Materials
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x93c5fd,
    roughness: 0.15,
    metalness: 0.85,
  });
  disposables.push(glassMat);

  const goldFacadeMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.2,
    metalness: 0.8,
  });
  disposables.push(goldFacadeMat);

  const sandStoneMat = new THREE.MeshStandardMaterial({
    color: 0xd6c4a8,
    roughness: 0.9,
    metalness: 0.1,
  });
  disposables.push(sandStoneMat);

  // --- A. KINGDOM TOWER (برج المملكة - Landmark on the right) ---
  const kingdomGroup = new THREE.Group();
  kingdomGroup.position.set(38, 0, 0);
  skylineGroup.add(kingdomGroup);

  const ktHeight = 44;
  const ktWidth = 7;
  const ktDepth = 4.5;

  // Lower two-thirds of tower (Tapered shaft)
  const ktBaseGeo = new THREE.BoxGeometry(ktWidth, ktHeight * 0.7, ktDepth);
  disposables.push(ktBaseGeo);
  const ktBase = new THREE.Mesh(ktBaseGeo, glassMat);
  ktBase.position.y = (ktHeight * 0.7) / 2;
  kingdomGroup.add(ktBase);

  // Signature inverted parabolic arch top opening
  // Two side curved arms
  const armHeight = ktHeight * 0.3;
  const armGeo = new THREE.BoxGeometry(1.4, armHeight, ktDepth);
  disposables.push(armGeo);

  const leftArm = new THREE.Mesh(armGeo, glassMat);
  leftArm.position.set(-ktWidth / 2 + 0.7, ktHeight * 0.7 + armHeight / 2, 0);
  kingdomGroup.add(leftArm);

  const rightArm = new THREE.Mesh(armGeo, glassMat);
  rightArm.position.set(ktWidth / 2 - 0.7, ktHeight * 0.7 + armHeight / 2, 0);
  kingdomGroup.add(rightArm);

  // Skybridge spanning the top of the arch
  const bridgeGeo = new THREE.BoxGeometry(ktWidth - 0.5, 1.2, ktDepth * 0.8);
  disposables.push(bridgeGeo);
  const skybridge = new THREE.Mesh(bridgeGeo, glassMat);
  skybridge.position.set(0, ktHeight - 0.6, 0);
  kingdomGroup.add(skybridge);

  // Glowing skybridge observation window light
  const bridgeLightGeo = new THREE.PlaneGeometry(ktWidth - 1.0, 0.6);
  disposables.push(bridgeLightGeo);
  const bridgeLightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  disposables.push(bridgeLightMat);
  const bridgeLight = new THREE.Mesh(bridgeLightGeo, bridgeLightMat);
  bridgeLight.position.set(0, ktHeight - 0.6, ktDepth * 0.41);
  kingdomGroup.add(bridgeLight);

  // --- B. AL FAISALIAH TOWER (برج الفيصلية - Landmark on the left) ---
  const faisaliahGroup = new THREE.Group();
  faisaliahGroup.position.set(-36, 0, 10);
  skylineGroup.add(faisaliahGroup);

  // Tapered 4-sided pyramid tower
  const pfHeight = 36;
  const pfGeo = new THREE.ConeGeometry(5.2, pfHeight, 4);
  pfGeo.rotateY(Math.PI / 4);
  disposables.push(pfGeo);
  const faisaliahBody = new THREE.Mesh(pfGeo, glassMat);
  faisaliahBody.position.y = pfHeight / 2;
  faisaliahGroup.add(faisaliahBody);

  // Golden Observation Sphere near apex
  const sphereGeo = new THREE.SphereGeometry(1.5, 20, 20);
  disposables.push(sphereGeo);
  const goldenSphere = new THREE.Mesh(sphereGeo, goldFacadeMat);
  goldenSphere.position.y = pfHeight * 0.78;
  faisaliahGroup.add(goldenSphere);

  // Needle Spire Antenna on top
  const needleGeo = new THREE.CylinderGeometry(0.06, 0.25, 7, 8);
  disposables.push(needleGeo);
  const needle = new THREE.Mesh(needleGeo, glassMat);
  needle.position.y = pfHeight + 3.5;
  faisaliahGroup.add(needle);

  // --- C. DIVERSE MODERN RIYADH SKYSCRAPER CLUSTERS ---
  const towersData = [
    { x: -26, z: -5, w: 6.5, h: 32, d: 5.5, mat: glassMat },
    { x: -18, z: 5, w: 5.0, h: 28, d: 5.0, mat: sandStoneMat },
    { x: -10, z: -8, w: 7.0, h: 38, d: 6.0, mat: glassMat },
    { x: -4, z: -2, w: 5.5, h: 26, d: 5.5, mat: sandStoneMat },
    { x: 3, z: -10, w: 6.0, h: 35, d: 6.0, mat: glassMat },
    { x: 12, z: -4, w: 7.5, h: 30, d: 6.5, mat: sandStoneMat },
    { x: 20, z: 4, w: 5.8, h: 34, d: 5.8, mat: glassMat },
    { x: 28, z: -6, w: 6.2, h: 31, d: 5.0, mat: sandStoneMat },
    { x: 48, z: -12, w: 8.0, h: 29, d: 7.0, mat: glassMat },
    { x: -48, z: -15, w: 7.0, h: 27, d: 6.0, mat: sandStoneMat },
  ];

  towersData.forEach((t) => {
    const tGeo = new THREE.BoxGeometry(t.w, t.h, t.d);
    disposables.push(tGeo);
    const tMesh = new THREE.Mesh(tGeo, t.mat);
    tMesh.position.set(t.x, t.h / 2, t.z);
    skylineGroup.add(tMesh);

    // Architectural edge highlights
    const tEdges = new THREE.EdgesGeometry(tGeo);
    disposables.push(tEdges);
    const tLines = new THREE.LineSegments(
      tEdges,
      new THREE.LineBasicMaterial({
        color: 0xfde68a,
        transparent: true,
        opacity: 0.25,
      })
    );
    tMesh.add(tLines);
  });

  // --- D. DENSE URBAN CARPET (أحياء الرياض السكنية منخفضة الارتفاع) ---
  const urbanCount = 80;
  const urbanGeo = new THREE.BoxGeometry(2.4, 1.8, 2.4);
  disposables.push(urbanGeo);

  for (let i = 0; i < urbanCount; i++) {
    const ux = (Math.random() - 0.5) * 120;
    const uz = (Math.random() - 0.5) * 40;
    const uh = 1.0 + Math.random() * 2.5;

    const uMesh = new THREE.Mesh(urbanGeo, sandStoneMat);
    uMesh.position.set(ux, uh / 2, uz);
    uMesh.scale.set(1.0 + Math.random() * 0.8, uh, 1.0 + Math.random() * 0.8);
    skylineGroup.add(uMesh);
  }

  // =========================================================================
  // 4. DRIFTING 3D VOLUMETRIC MORNING CLOUDS
  // =========================================================================
  const cloudsGroup = new THREE.Group();
  cloudsGroup.position.set(0, 32, -60);
  group.add(cloudsGroup);

  const cloudMat = new THREE.MeshStandardMaterial({
    color: 0xfffbeb,
    roughness: 0.9,
    transparent: true,
    opacity: 0.75,
  });
  disposables.push(cloudMat);

  const clouds: THREE.Group[] = [];
  for (let c = 0; c < 8; c++) {
    const cloud = new THREE.Group();
    const puffCount = 5 + Math.floor(Math.random() * 4);
    for (let p = 0; p < puffCount; p++) {
      const pRadius = 2.0 + Math.random() * 3.0;
      const pGeo = new THREE.SphereGeometry(pRadius, 12, 12);
      disposables.push(pGeo);
      const pMesh = new THREE.Mesh(pGeo, cloudMat);
      pMesh.position.set(
        (p - puffCount / 2) * 2.8 + Math.random(),
        Math.random() * 1.5,
        (Math.random() - 0.5) * 2.5
      );
      cloud.add(pMesh);
    }
    cloud.position.set((c - 4) * 24 + Math.random() * 10, Math.random() * 8, Math.random() * 30 - 15);
    cloudsGroup.add(cloud);
    clouds.push(cloud);
  }

  // =========================================================================
  // 5. FLOATING GOLDEN SUNLIGHT PARTICLES / DUST MOTES
  // =========================================================================
  const dustCount = 450;
  const dustGeo = new THREE.BufferGeometry();
  disposables.push(dustGeo);

  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const idx = i * 3;
    dustPositions[idx] = (Math.random() - 0.5) * 45;
    dustPositions[idx + 1] = Math.random() * 22;
    dustPositions[idx + 2] = Math.random() * 50 - 10;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

  const dustMat = new THREE.PointsMaterial({
    size: 0.22,
    color: 0xfde047,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending,
  });
  disposables.push(dustMat);

  const dustPoints = new THREE.Points(dustGeo, dustMat);
  group.add(dustPoints);

  return {
    group,
    sunMesh,
    update: (time: number) => {
      // Corona pulsation
      corona.scale.setScalar(1 + Math.sin(time * 2) * 0.05);

      // Clouds gentle slow drift across the sky
      clouds.forEach((cloud, idx) => {
        cloud.position.x += 0.015 * (1 + (idx % 3) * 0.3);
        if (cloud.position.x > 80) cloud.position.x = -80;
      });

      // Dust motes floating in sunbeams
      dustPoints.rotation.y = time * 0.02;
      dustPoints.position.y = Math.sin(time * 0.5) * 0.4;
    },
    setLightingTheme: (theme: 'morning' | 'day' | 'sunset') => {
      if (theme === 'sunset') {
        sunMat.color.setHex(0xf97316);
        dustMat.color.setHex(0xfb923c);
      } else if (theme === 'day') {
        sunMat.color.setHex(0xffffff);
        dustMat.color.setHex(0xffffff);
      } else {
        sunMat.color.setHex(0xfffbeb);
        dustMat.color.setHex(0xfde047);
      }
    },
    dispose: () => {
      disposables.forEach((item) => item.dispose());
    },
  };
}
