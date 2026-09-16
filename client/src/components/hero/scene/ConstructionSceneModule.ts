import * as THREE from 'three';
import { MaterialCache } from './MaterialCache';
import { SceneModule } from './SurveyorSceneModule';

/**
 * Lazy Module 02: المخططات والإنشاء (الرافعة البرجية، البرج الإنشائي، الدبوس ثلاثي الأبعاد)
 */
export function createConstructionScene(): SceneModule {
  const group = new THREE.Group();
  group.position.set(5, 0, 18);

  const goldMat = MaterialCache.getGoldMaterial();
  const concreteMat = MaterialCache.getConcreteMaterial();

  // Diorama Base
  const platformGeo = new THREE.BoxGeometry(16, 0.6, 16);
  const platformMat = new THREE.MeshStandardMaterial({
    color: 0x3d0c18,
    metalness: 0.4,
    roughness: 0.6,
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.3;
  group.add(platform);

  const platformEdge = new THREE.Mesh(
    new THREE.BoxGeometry(16.2, 0.15, 16.2),
    goldMat
  );
  platformEdge.position.y = 0.05;
  group.add(platformEdge);

  // Tower under construction (6 floors with shared geometries)
  const towerFloors = 7;
  const slabGeo = new THREE.BoxGeometry(4.5, 0.22, 4.5);
  const columnGeo = new THREE.BoxGeometry(0.18, 1.3, 0.18);
  const coreGeo = new THREE.BoxGeometry(2.2, 1.3, 2.2);
  const coreMat = new THREE.MeshStandardMaterial({ color: 0x141822, roughness: 0.5 });

  const towerGroup = new THREE.Group();
  towerGroup.position.set(-1.5, 0, -1.5);
  group.add(towerGroup);

  for (let f = 0; f < towerFloors; f++) {
    const slab = new THREE.Mesh(slabGeo, concreteMat);
    slab.position.y = f * 1.5;
    towerGroup.add(slab);

    if (f < towerFloors - 1) {
      const offsets = [-1.8, 1.8];
      for (const ox of offsets) {
        for (const oz of offsets) {
          const col = new THREE.Mesh(columnGeo, goldMat);
          col.position.set(ox, f * 1.5 + 0.75, oz);
          towerGroup.add(col);
        }
      }

      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.set(0, f * 1.5 + 0.75, 0);
      towerGroup.add(core);
    }
  }

  // Mini diorama buildings
  const miniBuildingsData = [
    { x: 4, z: -4, w: 2.5, h: 4.5, d: 2.5, color: 0x1c212d },
    { x: 4, z: 2, w: 3, h: 3, d: 2.2, color: 0x272e3d },
    { x: -4, z: 4, w: 2.8, h: 5.5, d: 2.8, color: 0x181c25 },
  ];
  miniBuildingsData.forEach((b) => {
    const bGeo = new THREE.BoxGeometry(b.w, b.h, b.d);
    const bMat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.5 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bMesh.position.set(b.x, b.h / 2, b.z);
    group.add(bMesh);

    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(bGeo),
      new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.25 })
    );
    bMesh.add(edges);
  });

  // Animated Tower Crane
  const craneGroup = new THREE.Group();
  craneGroup.position.set(2.5, 0, -2);
  group.add(craneGroup);

  const craneMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    metalness: 0.7,
    roughness: 0.3,
  });

  const mast = new THREE.Mesh(new THREE.BoxGeometry(0.5, 15, 0.5), craneMat);
  mast.position.y = 7.5;
  craneGroup.add(mast);

  const jibArm = new THREE.Group();
  jibArm.position.y = 15.2;
  craneGroup.add(jibArm);

  const jib = new THREE.Mesh(new THREE.BoxGeometry(10, 0.35, 0.35), craneMat);
  jib.position.x = 4;
  jibArm.add(jib);

  const counterBoom = new THREE.Mesh(new THREE.BoxGeometry(3, 0.35, 0.35), craneMat);
  counterBoom.position.x = -1.5;
  jibArm.add(counterBoom);

  const counterWeight = new THREE.Mesh(
    new THREE.BoxGeometry(1, 0.8, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x5a1024 })
  );
  counterWeight.position.set(-2.5, -0.3, 0);
  jibArm.add(counterWeight);

  const cable = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 4.5, 4),
    new THREE.MeshBasicMaterial({ color: 0xd4af37 })
  );
  cable.position.set(5.5, -2.25, 0);
  jibArm.add(cable);

  // Rayan 3D Location Pin
  const pinGroup = new THREE.Group();
  pinGroup.position.set(0, 7.5, 0);
  group.add(pinGroup);

  const pinMat = new THREE.MeshStandardMaterial({
    color: 0x9e1333,
    emissive: 0x4a0515,
    metalness: 0.8,
    roughness: 0.2,
  });
  const pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 16), pinMat);
  pinHead.position.y = 1.3;
  pinGroup.add(pinHead);

  const pinConeGeo = new THREE.ConeGeometry(0.85, 1.7, 16);
  pinConeGeo.rotateX(Math.PI);
  const pinCone = new THREE.Mesh(pinConeGeo, pinMat);
  pinCone.position.y = 0.45;
  pinGroup.add(pinCone);

  const emblemRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.5, 0.07, 12, 24),
    goldMat
  );
  emblemRing.position.set(0, 1.3, 0.8);
  pinGroup.add(emblemRing);

  // Red Ground Boundary Box
  const boundaryEdges = new THREE.EdgesGeometry(new THREE.BoxGeometry(14, 0.05, 14));
  const boundaryLines = new THREE.LineSegments(
    boundaryEdges,
    new THREE.LineBasicMaterial({ color: 0xff1e40 })
  );
  boundaryLines.position.y = 0.1;
  group.add(boundaryLines);

  return {
    group,
    update: (time: number) => {
      jibArm.rotation.y = Math.sin(time * 0.5) * 0.7 + 0.3;
      pinGroup.position.y = 7.5 + Math.sin(time * 2) * 0.35;
      pinGroup.rotation.y = time * 0.8;
    },
    setWireframe: (wireframe: boolean) => {
      concreteMat.wireframe = wireframe;
      platformMat.wireframe = wireframe;
    },
    dispose: () => {
      platformGeo.dispose();
      platformMat.dispose();
      platformEdge.geometry.dispose();
      slabGeo.dispose();
      columnGeo.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      mast.geometry.dispose();
      craneMat.dispose();
      jib.geometry.dispose();
      counterBoom.geometry.dispose();
      counterWeight.geometry.dispose();
      (counterWeight.material as THREE.Material).dispose();
      cable.geometry.dispose();
      (cable.material as THREE.Material).dispose();
      pinHead.geometry.dispose();
      pinConeGeo.dispose();
      pinMat.dispose();
      emblemRing.geometry.dispose();
      boundaryEdges.dispose();
      (boundaryLines.material as THREE.Material).dispose();
    },
  };
}
