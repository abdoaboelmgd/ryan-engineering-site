import * as THREE from 'three';

export interface ConstructionSiteResult {
  group: THREE.Group;
  update: (time: number, delta: number, mouseX?: number, mouseY?: number) => void;
  dispose: () => void;
  theodolite: THREE.Object3D;
  fireLaserPulse: () => void;
  setWireframe: (wireframe: boolean) => void;
}

export function createConstructionSiteElements(): ConstructionSiteResult {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // Shared Materials
  const concreteMat = new THREE.MeshStandardMaterial({
    color: 0x8c96a3,
    roughness: 0.8,
    metalness: 0.15,
  });
  disposables.push(concreteMat);

  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x566170,
    roughness: 0.85,
    metalness: 0.1,
  });
  disposables.push(coreMat);

  const craneYellowMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.7,
    roughness: 0.35,
  });
  disposables.push(craneYellowMat);

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x222631,
    metalness: 0.8,
    roughness: 0.3,
  });
  disposables.push(darkSteelMat);

  const rebarMat = new THREE.MeshStandardMaterial({
    color: 0x6b7280,
    metalness: 0.9,
    roughness: 0.4,
  });
  disposables.push(rebarMat);

  // =========================================================================
  // 0. CONCRETE TERRACE FLOOR & CONSTRUCTION SITE GROUND (أرضية الشرفة الهندسية وموقع العمل)
  // =========================================================================
  // Terrace slab directly behind desk where tripod and railing stand
  const terraceGeo = new THREE.BoxGeometry(46, 0.4, 22);
  disposables.push(terraceGeo);
  const terraceMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.82,
    metalness: 0.12,
  });
  disposables.push(terraceMat);
  const terraceFloor = new THREE.Mesh(terraceGeo, terraceMat);
  terraceFloor.position.set(0, -0.2, -5);
  terraceFloor.receiveShadow = true;
  group.add(terraceFloor);

  // Subtle architectural tile expansion grooves on the terrace floor
  const grooveGeo = new THREE.PlaneGeometry(45, 21);
  grooveGeo.rotateX(-Math.PI / 2);
  disposables.push(grooveGeo);
  const grooveCanvas = document.createElement('canvas');
  grooveCanvas.width = 512;
  grooveCanvas.height = 512;
  const gctx = grooveCanvas.getContext('2d');
  if (gctx) {
    gctx.fillStyle = '#64748b';
    gctx.fillRect(0, 0, 512, 512);
    gctx.strokeStyle = '#475569';
    gctx.lineWidth = 4;
    for (let p = 0; p <= 512; p += 64) {
      gctx.beginPath();
      gctx.moveTo(p, 0);
      gctx.lineTo(p, 512);
      gctx.stroke();
      gctx.beginPath();
      gctx.moveTo(0, p);
      gctx.lineTo(512, p);
      gctx.stroke();
    }
  }
  const grooveTex = new THREE.CanvasTexture(grooveCanvas);
  disposables.push(grooveTex);
  const grooveMat = new THREE.MeshStandardMaterial({
    map: grooveTex,
    roughness: 0.88,
    metalness: 0.1,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  disposables.push(grooveMat);
  const grooveMesh = new THREE.Mesh(grooveGeo, grooveMat);
  grooveMesh.position.set(0, 0.01, -5);
  grooveMesh.receiveShadow = true;
  group.add(grooveMesh);

  // Deep Construction Foundation Ground Level below
  const siteGroundGeo = new THREE.BoxGeometry(100, 0.8, 80);
  disposables.push(siteGroundGeo);
  const siteGroundMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.92,
    metalness: 0.05,
  });
  disposables.push(siteGroundMat);
  const siteGround = new THREE.Mesh(siteGroundGeo, siteGroundMat);
  siteGround.position.set(0, -0.7, -42);
  siteGround.receiveShadow = true;
  group.add(siteGround);

  // =========================================================================
  // 1. TERRACE SAFETY RAILING (حاجز الشرفة المعدني خلف المكتب)
  // =========================================================================
  const railingGroup = new THREE.Group();
  railingGroup.position.set(0, 1.2, 0);
  group.add(railingGroup);

  const railMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    metalness: 0.85,
    roughness: 0.25,
  });
  disposables.push(railMat);

  // Top rail tube
  const topRailGeo = new THREE.CylinderGeometry(0.08, 0.08, 38, 16);
  topRailGeo.rotateZ(Math.PI / 2);
  disposables.push(topRailGeo);
  const topRail = new THREE.Mesh(topRailGeo, railMat);
  topRail.castShadow = true;
  topRail.receiveShadow = true;
  railingGroup.add(topRail);

  // Mid rail tube
  const midRail = new THREE.Mesh(topRailGeo, railMat);
  midRail.position.y = -0.55;
  midRail.castShadow = true;
  midRail.receiveShadow = true;
  railingGroup.add(midRail);

  // Vertical stanchion posts
  const postGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.2, 12);
  disposables.push(postGeo);
  for (let x = -18; x <= 18; x += 3.6) {
    const post = new THREE.Mesh(postGeo, railMat);
    post.position.set(x, -0.6, 0);
    post.castShadow = true;
    post.receiveShadow = true;
    railingGroup.add(post);
  }

  // =========================================================================
  // 2. PRIMARY MULTI-STORY CONCRETE TOWER (المبنى الخرساني الرئيسي على اليسار)
  // =========================================================================
  const mainTowerGroup = new THREE.Group();
  mainTowerGroup.position.set(-14, 0, -18);
  group.add(mainTowerGroup);

  const floorCount = 8;
  const slabW = 14;
  const slabD = 12;
  const floorHeight = 2.4;

  const slabGeo = new THREE.BoxGeometry(slabW, 0.4, slabD);
  disposables.push(slabGeo);

  const colGeo = new THREE.BoxGeometry(0.45, floorHeight, 0.45);
  disposables.push(colGeo);

  const coreGeo = new THREE.BoxGeometry(4.5, floorHeight * floorCount, 4.0);
  disposables.push(coreGeo);
  const centralCore = new THREE.Mesh(coreGeo, coreMat);
  centralCore.position.set(0, (floorHeight * floorCount) / 2, 0);
  centralCore.castShadow = true;
  centralCore.receiveShadow = true;
  mainTowerGroup.add(centralCore);

  // Concrete slabs & columns for each floor
  for (let f = 0; f < floorCount; f++) {
    const slabY = f * floorHeight;
    const slab = new THREE.Mesh(slabGeo, concreteMat);
    slab.position.set(0, slabY, 0);
    slab.receiveShadow = true;
    slab.castShadow = true;
    mainTowerGroup.add(slab);

    // Columns grid
    const colsX = [-5.5, -2.5, 2.5, 5.5];
    const colsZ = [-4.5, 0, 4.5];
    colsX.forEach((cx) => {
      colsZ.forEach((cz) => {
        // Skip central core space
        if (Math.abs(cx) < 2.0 && Math.abs(cz) < 2.0) return;
        const col = new THREE.Mesh(colGeo, concreteMat);
        col.position.set(cx, slabY + floorHeight / 2, cz);
        col.castShadow = true;
        col.receiveShadow = true;
        mainTowerGroup.add(col);
      });
    });

    // Safety orange perimeter netting on mid floors
    if (f === 3 || f === 5) {
      const netGeo = new THREE.PlaneGeometry(slabW - 0.2, floorHeight * 0.9);
      disposables.push(netGeo);
      const netMat = new THREE.MeshBasicMaterial({
        color: 0xe11d48,
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      });
      disposables.push(netMat);
      const netFront = new THREE.Mesh(netGeo, netMat);
      netFront.position.set(0, slabY + floorHeight / 2, slabD / 2);
      mainTowerGroup.add(netFront);
    }
  }

  // Steel Rebar Rods sticking out from the top floor columns!
  const rebarGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.4, 6);
  disposables.push(rebarGeo);
  const topY = floorCount * floorHeight;
  const topColsX = [-5.5, -2.5, 2.5, 5.5];
  const topColsZ = [-4.5, 0, 4.5];

  topColsX.forEach((cx) => {
    topColsZ.forEach((cz) => {
      for (let r = 0; r < 4; r++) {
        const ox = (r % 2 === 0 ? 0.12 : -0.12);
        const oz = (r > 1 ? 0.12 : -0.12);
        const rebar = new THREE.Mesh(rebarGeo, rebarMat);
        rebar.position.set(cx + ox, topY + 0.7, cz + oz);
        rebar.castShadow = true;
        mainTowerGroup.add(rebar);
      }
    });
  });

  // =========================================================================
  // 3. SECONDARY MIDGROUND BUILDING (المبنى الثاني في المنتصف)
  // =========================================================================
  const secTowerGroup = new THREE.Group();
  secTowerGroup.position.set(8, 0, -28);
  group.add(secTowerGroup);

  const secFloors = 6;
  const secSlabGeo = new THREE.BoxGeometry(11, 0.35, 9);
  disposables.push(secSlabGeo);

  for (let f = 0; f < secFloors; f++) {
    const sy = f * floorHeight;
    const slab = new THREE.Mesh(secSlabGeo, concreteMat);
    slab.position.set(0, sy, 0);
    slab.castShadow = true;
    slab.receiveShadow = true;
    secTowerGroup.add(slab);

    const offsetsX = [-4.5, 0, 4.5];
    const offsetsZ = [-3.5, 3.5];
    offsetsX.forEach((ox) => {
      offsetsZ.forEach((oz) => {
        const col = new THREE.Mesh(colGeo, concreteMat);
        col.position.set(ox, sy + floorHeight / 2, oz);
        col.castShadow = true;
        col.receiveShadow = true;
        secTowerGroup.add(col);
      });
    });
  }

  // =========================================================================
  // 4. ANIMATED TOWER CRANES (الرافعات البرجية الصفراء)
  // =========================================================================
  // Helper to build a complete architectural yellow tower crane
  function buildCrane(height: number, jibLength: number, counterJibLength: number) {
    const craneRoot = new THREE.Group();

    // 1. Lattice Tower Mast (Vertical)
    const mastGeo = new THREE.BoxGeometry(0.8, height, 0.8);
    disposables.push(mastGeo);
    const mast = new THREE.Mesh(mastGeo, craneYellowMat);
    mast.position.y = height / 2;
    mast.castShadow = true;
    mast.receiveShadow = true;
    craneRoot.add(mast);

    // Diagonal lattice frame lines on mast
    const mastEdges = new THREE.EdgesGeometry(mastGeo);
    disposables.push(mastEdges);
    const mastLines = new THREE.LineSegments(
      mastEdges,
      new THREE.LineBasicMaterial({ color: 0xb45309 })
    );
    mastLines.position.y = height / 2;
    craneRoot.add(mastLines);

    // 2. Rotating Turntable Slewing Unit (Jib Arm Assembly)
    const jibAssembly = new THREE.Group();
    jibAssembly.position.y = height + 0.5;
    craneRoot.add(jibAssembly);

    // Operator Cab
    const cabGeo = new THREE.BoxGeometry(1.2, 1.4, 1.0);
    disposables.push(cabGeo);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
    disposables.push(cabMat);
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.set(0.7, 0.2, 0.6);
    cab.castShadow = true;
    cab.receiveShadow = true;
    jibAssembly.add(cab);

    // Cab glass window
    const glassGeo = new THREE.BoxGeometry(0.9, 0.8, 0.05);
    disposables.push(glassGeo);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.1,
      metalness: 0.9,
    });
    disposables.push(glassMat);
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0.7, 0.3, 1.12);
    glass.castShadow = true;
    jibAssembly.add(glass);

    // A-Frame Tower Top Apex (Peak)
    const apexGeo = new THREE.ConeGeometry(0.7, 3.2, 4);
    disposables.push(apexGeo);
    const apex = new THREE.Mesh(apexGeo, craneYellowMat);
    apex.position.set(0, 1.6, 0);
    apex.castShadow = true;
    apex.receiveShadow = true;
    jibAssembly.add(apex);

    // Horizontal Jib Arm (Extends forward over the building)
    const jibArmGeo = new THREE.BoxGeometry(jibLength, 0.6, 0.6);
    disposables.push(jibArmGeo);
    const jibArm = new THREE.Mesh(jibArmGeo, craneYellowMat);
    jibArm.position.x = jibLength / 2;
    jibArm.castShadow = true;
    jibArm.receiveShadow = true;
    jibAssembly.add(jibArm);

    // Counter-Jib (Extends backward)
    const counterJibGeo = new THREE.BoxGeometry(counterJibLength, 0.6, 0.6);
    disposables.push(counterJibGeo);
    const counterJib = new THREE.Mesh(counterJibGeo, craneYellowMat);
    counterJib.position.x = -counterJibLength / 2;
    counterJib.castShadow = true;
    counterJib.receiveShadow = true;
    jibAssembly.add(counterJib);

    // Concrete Counterweights
    const counterWeightGeo = new THREE.BoxGeometry(1.8, 1.2, 1.2);
    disposables.push(counterWeightGeo);
    const counterWeight = new THREE.Mesh(counterWeightGeo, darkSteelMat);
    counterWeight.position.set(-counterJibLength + 1.0, -0.4, 0);
    counterWeight.castShadow = true;
    counterWeight.receiveShadow = true;
    jibAssembly.add(counterWeight);

    // Flashing Red Aviation Warning Beacon on Crane Apex
    const beaconGeo = new THREE.SphereGeometry(0.22, 12, 12);
    disposables.push(beaconGeo);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0xff1133 });
    disposables.push(beaconMat);
    const apexBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    apexBeacon.position.set(0, 3.3, 0);
    jibAssembly.add(apexBeacon);

    // Tip Warning Beacon at Jib end
    const tipBeacon = new THREE.Mesh(beaconGeo, beaconMat);
    tipBeacon.position.set(jibLength - 0.2, 0.4, 0);
    jibAssembly.add(tipBeacon);

    // Construction Halogen Floodlight on Crane Mast (Pointing down at site)
    const floodlightGeo = new THREE.BoxGeometry(0.4, 0.4, 0.3);
    disposables.push(floodlightGeo);
    const floodlightLensGeo = new THREE.PlaneGeometry(0.35, 0.35);
    disposables.push(floodlightLensGeo);
    const floodlightLensMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
    disposables.push(floodlightLensMat);

    const floodlightHousing = new THREE.Mesh(floodlightGeo, darkSteelMat);
    floodlightHousing.position.set(0.6, height * 0.7, 0);
    floodlightHousing.rotation.z = -0.4;
    craneRoot.add(floodlightHousing);

    const floodlightLens = new THREE.Mesh(floodlightLensGeo, floodlightLensMat);
    floodlightLens.position.set(0.6, height * 0.7 - 0.05, 0.16);
    craneRoot.add(floodlightLens);

    // Hoist Trolley, Cable & Hook Block
    const trolleyGeo = new THREE.BoxGeometry(0.8, 0.3, 0.7);
    disposables.push(trolleyGeo);
    const trolley = new THREE.Mesh(trolleyGeo, darkSteelMat);
    const trolleyPos = jibLength * 0.6;
    trolley.position.set(trolleyPos, -0.35, 0);
    jibAssembly.add(trolley);

    // Cable hanging down
    const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 7.0, 4);
    disposables.push(cableGeo);
    const cable = new THREE.Mesh(cableGeo, darkSteelMat);
    cable.position.set(trolleyPos, -3.85, 0);
    jibAssembly.add(cable);

    // Crane hook block
    const hookGeo = new THREE.BoxGeometry(0.4, 0.5, 0.3);
    disposables.push(hookGeo);
    const hook = new THREE.Mesh(hookGeo, craneYellowMat);
    hook.position.set(trolleyPos, -7.4, 0);
    jibAssembly.add(hook);

    return { craneRoot, jibAssembly, cable, hook, beaconMat, floodlightLensMat };
  }

  // Primary Crane (Prominent on Left as in photo)
  const primaryCrane = buildCrane(28, 22, 7);
  primaryCrane.craneRoot.position.set(-16, 0, -26);
  group.add(primaryCrane.craneRoot);

  // Secondary Crane in Midground
  const midCrane1 = buildCrane(24, 18, 6);
  midCrane1.craneRoot.position.set(6, 0, -32);
  group.add(midCrane1.craneRoot);

  // Distant Crane
  const midCrane2 = buildCrane(26, 16, 5);
  midCrane2.craneRoot.position.set(-2, 0, -42);
  group.add(midCrane2.craneRoot);

  // =========================================================================
  // 5. SURVEYOR TOTAL STATION / THEODOLITE ON TRIPOD (محطة الرصد المساحي على اليمين)
  // =========================================================================
  const theodoliteGroup = new THREE.Group();
  theodoliteGroup.position.set(8.2, 0, 1.2);
  theodoliteGroup.rotation.y = -0.4;
  group.add(theodoliteGroup);

  const theodoliteDisposables: (THREE.BufferGeometry | THREE.Material)[] = [];

  // Aluminum Tripod Legs (Yellow & Black)
  const tripodMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.75,
    roughness: 0.3,
  });
  theodoliteDisposables.push(tripodMat);

  const tripodLegGeo = new THREE.CylinderGeometry(0.07, 0.04, 3.4, 8);
  theodoliteDisposables.push(tripodLegGeo);

  // 3 Splayed Tripod Legs
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(tripodLegGeo, tripodMat);
    leg.position.set(Math.cos(angle) * 0.65, 1.6, Math.sin(angle) * 0.65);
    leg.rotation.z = Math.sin(angle) * 0.22;
    leg.rotation.x = -Math.cos(angle) * 0.22;
    leg.castShadow = true;
    leg.receiveShadow = true;
    theodoliteGroup.add(leg);

    // Black foot clamps
    const footGeo = new THREE.ConeGeometry(0.08, 0.25, 8);
    theodoliteDisposables.push(footGeo);
    const foot = new THREE.Mesh(footGeo, darkSteelMat);
    foot.position.set(Math.cos(angle) * 1.0, 0.1, Math.sin(angle) * 1.0);
    foot.castShadow = true;
    foot.receiveShadow = true;
    theodoliteGroup.add(foot);
  }

  // Tribrach Head mounting plate
  const tribrachGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.25, 8);
  theodoliteDisposables.push(tribrachGeo);
  const tribrach = new THREE.Mesh(tribrachGeo, darkSteelMat);
  tribrach.position.y = 3.25;
  tribrach.castShadow = true;
  tribrach.receiveShadow = true;
  theodoliteGroup.add(tribrach);

  // Rotating Theodolite Alidade / Body
  const theodoliteHead = new THREE.Group();
  theodoliteHead.position.y = 3.4;
  theodoliteGroup.add(theodoliteHead);

  const theodoliteMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.6,
    roughness: 0.3,
  });
  theodoliteDisposables.push(theodoliteMat);

  // Yellow U-shaped frame
  const frameGeo = new THREE.BoxGeometry(0.7, 0.9, 0.6);
  theodoliteDisposables.push(frameGeo);
  const theodoliteBody = new THREE.Mesh(frameGeo, theodoliteMat);
  theodoliteBody.position.y = 0.55;
  theodoliteBody.castShadow = true;
  theodoliteBody.receiveShadow = true;
  theodoliteHead.add(theodoliteBody);

  // LCD display screen (Cyan glow)
  const lcdGeo = new THREE.PlaneGeometry(0.35, 0.25);
  theodoliteDisposables.push(lcdGeo);
  const lcdMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
  theodoliteDisposables.push(lcdMat);
  const lcd = new THREE.Mesh(lcdGeo, lcdMat);
  lcd.position.set(0, 0.55, 0.31);
  theodoliteHead.add(lcd);

  // Optical Scope Telescope (Rotatable elevation)
  const scopeGeo = new THREE.CylinderGeometry(0.14, 0.14, 1.1, 16);
  scopeGeo.rotateX(Math.PI / 2);
  theodoliteDisposables.push(scopeGeo);
  const scopeMesh = new THREE.Mesh(scopeGeo, darkSteelMat);
  scopeMesh.position.set(0, 0.85, 0);
  scopeMesh.castShadow = true;
  scopeMesh.receiveShadow = true;
  theodoliteHead.add(scopeMesh);

  // Red Objective Lens
  const lensGeo = new THREE.CircleGeometry(0.13, 16);
  theodoliteDisposables.push(lensGeo);
  const lensMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
  theodoliteDisposables.push(lensMat);
  const lens = new THREE.Mesh(lensGeo, lensMat);
  lens.position.set(0, 0.85, -0.56);
  lens.rotateY(Math.PI);
  theodoliteHead.add(lens);

  // Active Pulsating Targeting Laser Line shooting across the site!
  // Outer glowing sheath
  const laserGeo = new THREE.CylinderGeometry(0.035, 0.035, 45, 8);
  laserGeo.rotateX(Math.PI / 2);
  theodoliteDisposables.push(laserGeo);
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0xff0044,
    transparent: true,
    opacity: 0.85,
  });
  theodoliteDisposables.push(laserMat);
  const laserBeam = new THREE.Mesh(laserGeo, laserMat);
  laserBeam.position.set(0, 0.85, -22.5);
  theodoliteHead.add(laserBeam);

  // Intense Inner Core (Pure radiant white/pink core that blooms heavily)
  const laserCoreGeo = new THREE.CylinderGeometry(0.012, 0.012, 45, 6);
  laserCoreGeo.rotateX(Math.PI / 2);
  theodoliteDisposables.push(laserCoreGeo);
  const laserCoreMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  theodoliteDisposables.push(laserCoreMat);
  const laserCore = new THREE.Mesh(laserCoreGeo, laserCoreMat);
  laserCore.position.set(0, 0.85, -22.5);
  theodoliteHead.add(laserCore);

  // Laser Target Hit Point Spot on building
  const targetSpotGeo = new THREE.RingGeometry(0.05, 0.25, 16);
  theodoliteDisposables.push(targetSpotGeo);
  const targetSpotMat = new THREE.MeshBasicMaterial({
    color: 0xff1144,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9,
  });
  theodoliteDisposables.push(targetSpotMat);
  const targetSpot = new THREE.Mesh(targetSpotGeo, targetSpotMat);
  targetSpot.position.set(0, 0.85, -45.0);
  theodoliteHead.add(targetSpot);

  let laserPulse = 0;

  // Global shadow pass for construction elements
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child !== laserBeam && child !== laserCore && child !== targetSpot) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    }
  });

  return {
    group,
    theodolite: theodoliteGroup,
    fireLaserPulse: () => {
      laserPulse = 2.5; // High burst of bloom glow!
    },
    update: (time: number, _delta: number, mouseX: number = 0, mouseY: number = 0) => {
      // 1. Slewing rotation of the cranes
      primaryCrane.jibAssembly.rotation.y = Math.sin(time * 0.35) * 0.6 - 0.2;
      midCrane1.jibAssembly.rotation.y = Math.cos(time * 0.28) * 0.7 + 0.4;
      midCrane2.jibAssembly.rotation.y = Math.sin(time * 0.22) * 0.5;

      // Gentle swaying of hoist cables
      primaryCrane.cable.rotation.z = Math.sin(time * 1.5) * 0.04;

      // Flashing Crane Aviation Warning Beacons (Slow distinct pulse)
      const beaconFlash = (Math.sin(time * 4) > 0.2) ? 1.0 : 0.2;
      primaryCrane.beaconMat.color.setRGB(beaconFlash * 2.0, 0, 0.1);
      midCrane1.beaconMat.color.setRGB(beaconFlash * 2.0, 0, 0.1);
      midCrane2.beaconMat.color.setRGB(beaconFlash * 2.0, 0, 0.1);

      // 2. Theodolite scope and surveying laser interactive tracking
      // Follows mouse coordinates with smooth surveying precision + subtle ambient breathing
      const targetAimY = -0.38 + Math.sin(time * 0.4) * 0.06 + mouseX * 0.35;
      const targetAimX = Math.sin(time * 0.6) * 0.03 - mouseY * 0.22;
      theodoliteHead.rotation.y += (targetAimY - theodoliteHead.rotation.y) * 0.08;
      scopeMesh.rotation.x += (targetAimX - scopeMesh.rotation.x) * 0.08;

      // 3. Laser targeting beam breathing & Pulse Glow
      if (laserPulse > 0) {
        laserPulse -= 0.04;
        laserMat.opacity = Math.min(1.0, 0.7 + laserPulse * 0.3);
        laserCore.scale.set(1 + laserPulse * 2.0, 1, 1 + laserPulse * 2.0);
        targetSpot.scale.setScalar(1 + laserPulse * 1.5);
      } else {
        const pulseSine = Math.sin(time * 7);
        laserMat.opacity = 0.65 + pulseSine * 0.25;
        laserCore.scale.set(1 + pulseSine * 0.2, 1, 1 + pulseSine * 0.2);
        targetSpot.scale.setScalar(1 + pulseSine * 0.3);
      }
    },
    setWireframe: (wireframe: boolean) => {
      concreteMat.wireframe = wireframe;
      coreMat.wireframe = wireframe;
      craneYellowMat.wireframe = wireframe;
    },
    dispose: () => {
      disposables.forEach((item) => item.dispose());
      theodoliteDisposables.forEach((item) => item.dispose());
    },
  };
}
