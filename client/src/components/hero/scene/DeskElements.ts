import * as THREE from 'three';
import {
  createWoodTableTexture,
  createBlueprintTexture,
  createHelmetLogoTexture,
  createLeatherFolderTexture,
  createTabletScreenTexture,
  createTapeMarkingsTexture,
} from './TextureGenerators';

export interface DeskSceneResult {
  group: THREE.Group;
  update: (time: number, delta: number, mouseX?: number, mouseY?: number) => void;
  dispose: () => void;
  setWireframe: (wireframe: boolean) => void;
  // Interactive click targets
  helmet: THREE.Object3D;
  tablet: THREE.Object3D;
  hologramGrid: THREE.Object3D;
}

export function createDeskElements(): DeskSceneResult {
  const group = new THREE.Group();
  group.position.set(0, 0, 0);

  const disposables: (THREE.BufferGeometry | THREE.Material | THREE.Texture)[] = [];

  // =========================================================================
  // 1. POLISHED WOODEN TABLETOP (سطح الطاولة الخشبية)
  // =========================================================================
  const woodTex = createWoodTableTexture();
  disposables.push(woodTex);

  const tableGeo = new THREE.BoxGeometry(32, 1.2, 14);
  disposables.push(tableGeo);

  const tableMat = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.35,
    metalness: 0.1,
  });
  disposables.push(tableMat);

  const tableMesh = new THREE.Mesh(tableGeo, tableMat);
  tableMesh.position.set(0, -0.6, 2.5);
  tableMesh.receiveShadow = true;
  group.add(tableMesh);

  // Beveled edge trim on front of table
  const tableTrimGeo = new THREE.CylinderGeometry(0.12, 0.12, 32, 16);
  tableTrimGeo.rotateZ(Math.PI / 2);
  disposables.push(tableTrimGeo);
  const tableTrimMat = new THREE.MeshStandardMaterial({ color: 0x3d1c0c, roughness: 0.3 });
  disposables.push(tableTrimMat);
  const tableTrim = new THREE.Mesh(tableTrimGeo, tableTrimMat);
  tableTrim.position.set(0, 0, 9.5);
  group.add(tableTrim);

  // =========================================================================
  // 2. WHITE ENGINEER SAFETY HELMET (خوذة الأمان الهندسية البيضاء مع شعار ريان)
  // =========================================================================
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(-5.5, 0.0, 5.0);
  helmetGroup.rotation.y = 0.35;
  helmetGroup.rotation.z = -0.05;
  group.add(helmetGroup);

  const helmetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.18,
    metalness: 0.08,
  });
  disposables.push(helmetMat);

  // Main dome
  const domeGeo = new THREE.SphereGeometry(1.6, 32, 24, 0, Math.PI * 2, 0, Math.PI / 2);
  domeGeo.scale(1.0, 0.85, 1.2);
  disposables.push(domeGeo);
  const domeMesh = new THREE.Mesh(domeGeo, helmetMat);
  domeMesh.position.y = 0.4;
  domeMesh.castShadow = true;
  helmetGroup.add(domeMesh);

  // Hard hat brim / rim lip
  const brimGeo = new THREE.CylinderGeometry(1.9, 2.05, 0.16, 32, 1, true);
  brimGeo.scale(1.0, 1.0, 1.25);
  disposables.push(brimGeo);
  const brimMesh = new THREE.Mesh(brimGeo, helmetMat);
  brimMesh.position.y = 0.4;
  helmetGroup.add(brimMesh);

  // Extended front visor/peak
  const visorGeo = new THREE.CylinderGeometry(1.95, 2.2, 0.12, 16, 1, false, 0, Math.PI);
  visorGeo.scale(1.0, 1.0, 0.9);
  visorGeo.rotateX(0.12);
  disposables.push(visorGeo);
  const visorMesh = new THREE.Mesh(visorGeo, helmetMat);
  visorMesh.position.set(0, 0.35, 1.25);
  helmetGroup.add(visorMesh);

  // Central reinforcing rib / ridge on top of the helmet
  const ridgeGeo = new THREE.BoxGeometry(0.3, 0.35, 2.6);
  disposables.push(ridgeGeo);
  const ridgeMesh = new THREE.Mesh(ridgeGeo, helmetMat);
  ridgeMesh.position.set(0, 1.7, 0.1);
  helmetGroup.add(ridgeMesh);

  // Rayan Logo Badge on Front of Helmet
  const helmetLogoTex = createHelmetLogoTexture();
  disposables.push(helmetLogoTex);
  const badgeGeo = new THREE.PlaneGeometry(1.0, 0.7);
  disposables.push(badgeGeo);
  const badgeMat = new THREE.MeshStandardMaterial({
    map: helmetLogoTex,
    roughness: 0.2,
    transparent: true,
  });
  disposables.push(badgeMat);
  const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
  badgeMesh.position.set(0, 1.0, 1.85);
  badgeMesh.rotation.x = -0.35;
  helmetGroup.add(badgeMesh);

  // =========================================================================
  // 3. ROLLED BLUEPRINTS (مخططات معمارية ملفوفة)
  // =========================================================================
  const rollsGroup = new THREE.Group();
  rollsGroup.position.set(-6.8, 0.45, 7.2);
  group.add(rollsGroup);

  const rollPaperMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.6,
  });
  disposables.push(rollPaperMat);

  const rollInnerMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.8,
  });
  disposables.push(rollInnerMat);

  const rollGeo = new THREE.CylinderGeometry(0.55, 0.55, 5.0, 24, 1, true);
  rollGeo.rotateX(Math.PI / 2);
  disposables.push(rollGeo);

  // Stack of 3 rolls on the left
  const roll1 = new THREE.Mesh(rollGeo, rollPaperMat);
  roll1.position.set(0, 0, 0);
  roll1.rotation.y = 0.45;
  rollsGroup.add(roll1);

  const roll2 = new THREE.Mesh(rollGeo, rollPaperMat);
  roll2.position.set(0.9, 0.1, -0.3);
  roll2.rotation.y = 0.48;
  rollsGroup.add(roll2);

  const roll3 = new THREE.Mesh(rollGeo, rollPaperMat);
  roll3.position.set(0.45, 0.85, -0.15);
  roll3.rotation.y = 0.43;
  rollsGroup.add(roll3);

  // Hollow inner black circles to look like real rolled blueprints
  const innerCapGeo = new THREE.CircleGeometry(0.52, 24);
  disposables.push(innerCapGeo);
  [roll1, roll2, roll3].forEach((r) => {
    const innerCap = new THREE.Mesh(innerCapGeo, rollInnerMat);
    innerCap.position.set(0, 0, 2.51);
    r.add(innerCap);
  });

  // Single rolled blueprint on the bottom right
  const rightRoll = new THREE.Mesh(rollGeo, rollPaperMat);
  rightRoll.position.set(7.5, 0.45, 7.5);
  rightRoll.rotation.y = -0.35;
  group.add(rightRoll);

  // =========================================================================
  // 4. OPEN ARCHITECTURAL BLUEPRINT ON CLIPBOARD (المخطط المعماري المفتوح)
  // =========================================================================
  const blueprintGroup = new THREE.Group();
  blueprintGroup.position.set(0.3, 0.05, 6.2);
  blueprintGroup.rotation.y = -0.08;
  group.add(blueprintGroup);

  // Clipboard wooden backing board
  const boardGeo = new THREE.BoxGeometry(8.6, 0.12, 6.2);
  disposables.push(boardGeo);
  const boardMat = new THREE.MeshStandardMaterial({
    color: 0x451e11,
    roughness: 0.5,
  });
  disposables.push(boardMat);
  const boardMesh = new THREE.Mesh(boardGeo, boardMat);
  boardMesh.receiveShadow = true;
  blueprintGroup.add(boardMesh);

  // Blueprint sheet with high-resolution CAD drawing
  const bpTex = createBlueprintTexture();
  disposables.push(bpTex);
  const bpSheetGeo = new THREE.PlaneGeometry(8.2, 5.8);
  bpSheetGeo.rotateX(-Math.PI / 2);
  disposables.push(bpSheetGeo);
  const bpSheetMat = new THREE.MeshStandardMaterial({
    map: bpTex,
    roughness: 0.45,
  });
  disposables.push(bpSheetMat);
  const bpSheet = new THREE.Mesh(bpSheetGeo, bpSheetMat);
  bpSheet.position.y = 0.07;
  bpSheet.receiveShadow = true;
  blueprintGroup.add(bpSheet);

  // Metal clip clamp at the top
  const clipGeo = new THREE.BoxGeometry(2.4, 0.22, 0.6);
  disposables.push(clipGeo);
  const clipMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.8,
    roughness: 0.25,
  });
  disposables.push(clipMat);
  const clipMesh = new THREE.Mesh(clipGeo, clipMat);
  clipMesh.position.set(0, 0.15, -2.8);
  blueprintGroup.add(clipMesh);

  // =========================================================================
  // 5. LUXURY EXECUTIVE DRAFTING PEN (قلم الحبر الهندسي الفاخر)
  // =========================================================================
  const penGroup = new THREE.Group();
  penGroup.position.set(0.5, 0.18, 5.8);
  penGroup.rotation.y = -0.65;
  group.add(penGroup);

  const penBlackMat = new THREE.MeshStandardMaterial({
    color: 0x050508,
    roughness: 0.15,
    metalness: 0.2,
  });
  disposables.push(penBlackMat);

  const penGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.2,
    metalness: 0.9,
  });
  disposables.push(penGoldMat);

  // Pen barrel
  const barrelGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.6, 16);
  barrelGeo.rotateZ(Math.PI / 2);
  disposables.push(barrelGeo);
  const barrel = new THREE.Mesh(barrelGeo, penBlackMat);
  penGroup.add(barrel);

  // Gold rings & clip
  const ringGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 16);
  ringGeo.rotateZ(Math.PI / 2);
  disposables.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, penGoldMat);
  ring.position.x = 0.2;
  penGroup.add(ring);

  // Gold tapered nib cone
  const nibGeo = new THREE.ConeGeometry(0.08, 0.35, 16);
  nibGeo.rotateZ(-Math.PI / 2);
  disposables.push(nibGeo);
  const nib = new THREE.Mesh(nibGeo, penGoldMat);
  nib.position.x = -1.45;
  penGroup.add(nib);

  // Gold clip
  const penClipGeo = new THREE.BoxGeometry(0.8, 0.04, 0.06);
  disposables.push(penClipGeo);
  const penClip = new THREE.Mesh(penClipGeo, penGoldMat);
  penClip.position.set(0.8, 0.1, 0);
  penGroup.add(penClip);

  // =========================================================================
  // 6. HEAVY-DUTY MEASURING TAPE (شريط القياس المتري الأصفر والأسود)
  // =========================================================================
  const tapeGroup = new THREE.Group();
  tapeGroup.position.set(-4.0, 0.45, 6.8);
  tapeGroup.rotation.y = 0.25;
  group.add(tapeGroup);

  const tapeYellowMat = new THREE.MeshStandardMaterial({
    color: 0xeab308,
    roughness: 0.3,
  });
  disposables.push(tapeYellowMat);

  const tapeBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.6,
  });
  disposables.push(tapeBlackMat);

  // Main case
  const tapeCaseGeo = new THREE.BoxGeometry(1.2, 1.1, 0.7);
  disposables.push(tapeCaseGeo);
  const tapeCase = new THREE.Mesh(tapeCaseGeo, tapeYellowMat);
  tapeGroup.add(tapeCase);

  // Rubberized grip pads on top/bottom
  const gripGeo = new THREE.BoxGeometry(1.24, 0.3, 0.74);
  disposables.push(gripGeo);
  const gripTop = new THREE.Mesh(gripGeo, tapeBlackMat);
  gripTop.position.y = 0.45;
  tapeGroup.add(gripTop);
  const gripBottom = new THREE.Mesh(gripGeo, tapeBlackMat);
  gripBottom.position.y = -0.45;
  tapeGroup.add(gripBottom);

  // Tape mouth and lock slider
  const sliderGeo = new THREE.BoxGeometry(0.2, 0.25, 0.15);
  disposables.push(sliderGeo);
  const slider = new THREE.Mesh(sliderGeo, tapeBlackMat);
  slider.position.set(0.6, 0.2, 0);
  tapeGroup.add(slider);

  // Extended yellow steel measuring tape pulled out across the blueprint!
  const tapeMarkTex = createTapeMarkingsTexture();
  disposables.push(tapeMarkTex);
  const tapeStripGeo = new THREE.PlaneGeometry(3.5, 0.22);
  tapeStripGeo.rotateX(-Math.PI / 2);
  disposables.push(tapeStripGeo);
  const tapeStripMat = new THREE.MeshStandardMaterial({
    map: tapeMarkTex,
    metalness: 0.6,
    roughness: 0.3,
  });
  disposables.push(tapeStripMat);
  const tapeStrip = new THREE.Mesh(tapeStripGeo, tapeStripMat);
  tapeStrip.position.set(2.35, -0.38, 0);
  tapeGroup.add(tapeStrip);

  // Hook tab at the end of the tape
  const hookGeo = new THREE.BoxGeometry(0.06, 0.18, 0.24);
  disposables.push(hookGeo);
  const hook = new THREE.Mesh(hookGeo, clipMat);
  hook.position.set(4.1, -0.32, 0);
  tapeGroup.add(hook);

  // =========================================================================
  // 7. LUXURY BURGUNDY LEATHER BINDER / FOLDER (المجلد الجلدي العنابي الفاخر)
  // =========================================================================
  const folderGroup = new THREE.Group();
  folderGroup.position.set(6.8, 0.15, 5.6);
  folderGroup.rotation.y = -0.22;
  group.add(folderGroup);

  const leatherTex = createLeatherFolderTexture();
  disposables.push(leatherTex);

  const folderGeo = new THREE.BoxGeometry(4.8, 0.3, 6.2);
  disposables.push(folderGeo);

  // Multi-material for leather cover + gilded gold pages
  const goldEdgeMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.85,
    roughness: 0.25,
  });
  disposables.push(goldEdgeMat);

  const folderMat = new THREE.MeshStandardMaterial({
    map: leatherTex,
    roughness: 0.4,
    metalness: 0.1,
  });
  disposables.push(folderMat);

  // Sides: leather on top/bottom/spine, gilded gold on edges
  const folderMesh = new THREE.Mesh(folderGeo, [
    goldEdgeMat, // right
    folderMat,   // left (spine)
    folderMat,   // top cover (with logo)
    folderMat,   // bottom cover
    goldEdgeMat, // front
    goldEdgeMat, // back
  ]);
  folderMesh.castShadow = true;
  folderGroup.add(folderMesh);

  // Stitched bookmark ribbon
  const ribbonGeo = new THREE.BoxGeometry(0.3, 0.05, 3.5);
  disposables.push(ribbonGeo);
  const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4 });
  disposables.push(ribbonMat);
  const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
  ribbon.position.set(1.2, 0.18, 2.6);
  folderGroup.add(ribbon);

  // =========================================================================
  // 8. INTERACTIVE TABLET WITH 3D HOLOGRAPHIC SITE TWIN (جهاز التابلت في المنتصف)
  // =========================================================================
  const tabletGroup = new THREE.Group();
  tabletGroup.position.set(0.6, 1.85, 2.8);
  tabletGroup.rotation.x = -0.26; // Leaning back on stand as in the photo
  group.add(tabletGroup);

  // Folio stand behind tablet
  const standGeo = new THREE.BoxGeometry(5.8, 4.0, 0.2);
  disposables.push(standGeo);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x4a0a19, roughness: 0.6 });
  disposables.push(standMat);
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.set(0, -0.4, -0.8);
  stand.rotation.x = 0.4;
  tabletGroup.add(stand);

  // Tablet aluminum chassis (Space Gray)
  const chassisGeo = new THREE.BoxGeometry(6.4, 4.4, 0.22);
  disposables.push(chassisGeo);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x1e222d,
    metalness: 0.85,
    roughness: 0.25,
  });
  disposables.push(chassisMat);
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.castShadow = true;
  tabletGroup.add(chassis);

  // Screen Glass with UI Texture
  const screenTex = createTabletScreenTexture();
  disposables.push(screenTex);
  const screenGeo = new THREE.PlaneGeometry(5.9, 3.9);
  disposables.push(screenGeo);
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    roughness: 0.15,
    metalness: 0.05,
    emissive: 0x0f172a,
    emissiveIntensity: 0.4,
  });
  disposables.push(screenMat);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.z = 0.12;
  tabletGroup.add(screen);

  // -------------------------------------------------------------------------
  // 3D HOLOGRAPHIC CADASTRAL PARCEL GRID & RAYAN PIN (المجسم ثلاثي الأبعاد على الشاشة)
  // -------------------------------------------------------------------------
  const hologramGroup = new THREE.Group();
  hologramGroup.position.set(0.4, -0.1, 0.25);
  tabletGroup.add(hologramGroup);

  // 3D Isometric Mini Buildings under construction on the tablet screen
  const miniBuildMat = new THREE.MeshStandardMaterial({
    color: 0x22304d,
    roughness: 0.5,
    metalness: 0.4,
  });
  disposables.push(miniBuildMat);

  const miniBuildingsData = [
    { x: -0.9, y: 0.35, z: 0.15, w: 0.7, h: 0.7, d: 0.7 },
    { x: -0.8, y: 0.8, z: 0.15, w: 0.5, h: 0.4, d: 0.5 },
    { x: 0.6, y: 0.4, z: -0.2, w: 0.8, h: 0.8, d: 0.6 },
    { x: -0.2, y: 0.25, z: -0.5, w: 0.5, h: 0.5, d: 0.5 },
  ];

  miniBuildingsData.forEach((b) => {
    const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    disposables.push(bGeo);
    const bMesh = new THREE.Mesh(bGeo, miniBuildMat);
    bMesh.position.set(b.x, b.y, b.z);
    hologramGroup.add(bMesh);

    // Glowing wireframe outline on mini buildings
    const bEdges = new THREE.EdgesGeometry(bGeo);
    disposables.push(bEdges);
    const bLines = new THREE.LineSegments(
      bEdges,
      new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
    );
    bMesh.add(bLines);
  });

  // Glowing Red Neon Cadastral Parcel Grid (الشبكة العقارية الحمراء المشعة من الصورة!)
  const gridPoints: THREE.Vector3[] = [];
  const gridW = 2.4;
  const gridH = 1.8;
  const steps = 6;

  for (let i = 0; i <= steps; i++) {
    const x = (i / steps - 0.5) * gridW;
    gridPoints.push(new THREE.Vector3(x, -gridH / 2, 0.05));
    gridPoints.push(new THREE.Vector3(x, gridH / 2, 0.05));
  }
  for (let j = 0; j <= steps; j++) {
    const y = (j / steps - 0.5) * gridH;
    gridPoints.push(new THREE.Vector3(-gridW / 2, y, 0.05));
    gridPoints.push(new THREE.Vector3(gridW / 2, y, 0.05));
  }

  const gridGeo = new THREE.BufferGeometry().setFromPoints(gridPoints);
  disposables.push(gridGeo);
  const gridMat = new THREE.LineBasicMaterial({
    color: 0xff1e40,
    transparent: true,
    opacity: 0.85,
    linewidth: 2,
  });
  disposables.push(gridMat);
  const parcelGrid = new THREE.LineSegments(gridGeo, gridMat);
  parcelGrid.position.set(0.1, -0.2, 0.1);
  hologramGroup.add(parcelGrid);

  // Red Ground Boundary Box
  const boundGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.6, 2.0, 0.1));
  disposables.push(boundGeo);
  const boundMat = new THREE.LineBasicMaterial({ color: 0xff0033, linewidth: 2 });
  disposables.push(boundMat);
  const boundLines = new THREE.LineSegments(boundGeo, boundMat);
  boundLines.position.set(0.1, -0.2, 0.1);
  hologramGroup.add(boundLines);

  // 3D Crimson Rayan Location Pin (الدبوس ثلاثي الأبعاد المشع)
  const pinGroup = new THREE.Group();
  pinGroup.position.set(0.1, 0.6, 0.5);
  hologramGroup.add(pinGroup);

  const pinMat = new THREE.MeshStandardMaterial({
    color: 0x9e1333,
    emissive: 0x6e0821,
    roughness: 0.15,
    metalness: 0.8,
  });
  disposables.push(pinMat);

  const pinHeadGeo = new THREE.SphereGeometry(0.28, 20, 20);
  disposables.push(pinHeadGeo);
  const pinHead = new THREE.Mesh(pinHeadGeo, pinMat);
  pinHead.position.y = 0.35;
  pinGroup.add(pinHead);

  const pinConeGeo = new THREE.ConeGeometry(0.28, 0.6, 20);
  pinConeGeo.rotateX(Math.PI);
  disposables.push(pinConeGeo);
  const pinCone = new THREE.Mesh(pinConeGeo, pinMat);
  pinCone.position.y = 0.05;
  pinGroup.add(pinCone);

  // Golden Ring emblem inside the 3D pin
  const pinRingGeo = new THREE.TorusGeometry(0.16, 0.03, 12, 24);
  disposables.push(pinRingGeo);
  const pinRing = new THREE.Mesh(pinRingGeo, clipMat);
  pinRing.position.set(0, 0.35, 0.26);
  pinGroup.add(pinRing);

  // Vertical Laser Beacon Ray coming down from the pin
  const pinBeamGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.2, 8);
  disposables.push(pinBeamGeo);
  const pinBeamMat = new THREE.MeshBasicMaterial({
    color: 0xff1e40,
    transparent: true,
    opacity: 0.7,
  });
  disposables.push(pinBeamMat);
  const pinBeam = new THREE.Mesh(pinBeamGeo, pinBeamMat);
  pinBeam.position.set(0, -0.4, 0);
  pinGroup.add(pinBeam);

  // High-Resolution Shadow Mapping participation for all desk objects
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      if (child !== pinBeam && child !== screen) {
        child.castShadow = true;
      }
      child.receiveShadow = true;
    }
  });

  return {
    group,
    helmet: helmetGroup,
    tablet: tabletGroup,
    hologramGrid: parcelGrid,
    update: (time: number, _delta: number, mouseX: number = 0, mouseY: number = 0) => {
      // Gentle floating/bobbing of the 3D pin on the tablet screen with responsive tilt
      pinGroup.position.y = 0.6 + Math.sin(time * 2.5) * 0.08;
      pinGroup.position.x = mouseX * 0.06;
      pinGroup.position.z = -mouseY * 0.05;
      pinGroup.rotation.y = time * 0.8 + mouseX * 0.3;

      // Pulsing glow of the cadastral parcel grid
      gridMat.opacity = 0.6 + Math.sin(time * 4) * 0.35;

      // Subtle breath of the helmet specular
      helmetGroup.position.y = Math.sin(time * 1.5) * 0.01;
    },
    setWireframe: (wireframe: boolean) => {
      helmetMat.wireframe = wireframe;
      tableMat.wireframe = wireframe;
      bpSheetMat.wireframe = wireframe;
      folderMat.wireframe = wireframe;
    },
    dispose: () => {
      disposables.forEach((item) => {
        item.dispose();
      });
    },
  };
}
