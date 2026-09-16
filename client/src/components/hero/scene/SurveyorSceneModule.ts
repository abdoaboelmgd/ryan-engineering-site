import * as THREE from 'three';
import { MaterialCache } from './MaterialCache';

export interface SceneModule {
  group: THREE.Group;
  update: (time: number, delta: number) => void;
  setWireframe: (wireframe: boolean) => void;
  dispose: () => void;
}

/**
 * Lazy Module 01: محطة الرصد المساحي Total Station والتضاريس الطبوغرافية
 */
export function createSurveyorScene(): SceneModule {
  const group = new THREE.Group();

  // 1. Optimized Terrain Plane (32x32 segments instead of 48x48 = over 50% fewer vertices)
  const terrainGeo = new THREE.PlaneGeometry(150, 150, 32, 32);
  terrainGeo.rotateX(-Math.PI / 2);
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y =
      Math.sin(x * 0.08) * 1.5 +
      Math.cos(z * 0.06) * 1.8 +
      Math.sin(x * 0.03 + z * 0.04) * 2.2;
    posAttr.setY(i, y - 2);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshStandardMaterial({
    color: 0x11131a,
    roughness: 0.85,
    metalness: 0.2,
  });
  const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
  terrainMesh.receiveShadow = true;
  group.add(terrainMesh);

  // Topographic Isolines wireframe overlay
  const terrainWireMat = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  const terrainWire = new THREE.Mesh(terrainGeo, terrainWireMat);
  terrainWire.position.y += 0.05;
  group.add(terrainWire);

  // 2. Theodolite & Tripod Station
  const surveyorGroup = new THREE.Group();
  surveyorGroup.position.set(-6, 0.5, 38);
  group.add(surveyorGroup);

  const goldMat = MaterialCache.getGoldMaterial();
  const burgundyMat = MaterialCache.getBurgundyMaterial();
  const darkMat = MaterialCache.getDarkMetalMaterial();

  // Tribrach Head
  const tribrachGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.3, 6);
  const tribrach = new THREE.Mesh(tribrachGeo, goldMat);
  tribrach.position.y = 3.5;
  surveyorGroup.add(tribrach);

  // 3 Tripod legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.04, 3.8, 6);
  for (let i = 0; i < 3; i++) {
    const angle = (i * Math.PI * 2) / 3;
    const leg = new THREE.Mesh(legGeo, burgundyMat);
    leg.position.set(Math.cos(angle) * 0.7, 1.8, Math.sin(angle) * 0.7);
    leg.rotation.z = Math.sin(angle) * 0.25;
    leg.rotation.x = -Math.cos(angle) * 0.25;
    surveyorGroup.add(leg);
  }

  // Theodolite Body
  const theodoliteBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 0.9, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xe6e8eb, roughness: 0.4 })
  );
  theodoliteBody.position.y = 4.1;
  surveyorGroup.add(theodoliteBody);

  // Telescope Optical Scope
  const telescopeGeo = new THREE.CylinderGeometry(0.16, 0.16, 1.4, 12);
  telescopeGeo.rotateX(Math.PI / 2);
  const theodoliteScope = new THREE.Mesh(telescopeGeo, darkMat);
  theodoliteScope.position.set(0, 4.3, 0);
  surveyorGroup.add(theodoliteScope);

  // Red Laser Targeting Beam
  const laserGeo = new THREE.CylinderGeometry(0.03, 0.03, 24, 6);
  laserGeo.rotateX(Math.PI / 2);
  const laserMat = new THREE.MeshBasicMaterial({
    color: 0xff1e40,
    transparent: true,
    opacity: 0.85,
  });
  const laserBeam = new THREE.Mesh(laserGeo, laserMat);
  laserBeam.position.set(4, 4.1, -8);
  laserBeam.rotation.y = -0.4;
  surveyorGroup.add(laserBeam);

  // 3. Prism Benchmark Target & Radar Ring
  const prismGroup = new THREE.Group();
  prismGroup.position.set(6, -0.5, 26);
  group.add(prismGroup);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6), goldMat);
  pole.position.y = 1.25;
  prismGroup.add(pole);

  const prismHead = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.35),
    new THREE.MeshStandardMaterial({
      color: 0xff3355,
      metalness: 0.9,
      emissive: 0x880022,
    })
  );
  prismHead.position.y = 2.6;
  prismGroup.add(prismHead);

  const ringGeo = new THREE.RingGeometry(1.2, 1.4, 24);
  ringGeo.rotateX(-Math.PI / 2);
  const ringMat = new THREE.MeshBasicMaterial({
    color: 0xff2244,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.6,
  });
  const radarRing = new THREE.Mesh(ringGeo, ringMat);
  radarRing.position.y = -0.3;
  prismGroup.add(radarRing);

  return {
    group,
    update: (time: number) => {
      theodoliteScope.rotation.y = Math.sin(time * 0.7) * 0.25;
      laserMat.opacity = 0.5 + Math.sin(time * 8) * 0.35;
      radarRing.scale.setScalar(1 + (Math.sin(time * 3) + 1) * 0.3);
      prismHead.rotation.y = time * 1.5;
    },
    setWireframe: (wireframe: boolean) => {
      terrainMat.wireframe = wireframe;
    },
    dispose: () => {
      terrainGeo.dispose();
      terrainMat.dispose();
      terrainWireMat.dispose();
      tribrachGeo.dispose();
      legGeo.dispose();
      theodoliteBody.geometry.dispose();
      (theodoliteBody.material as THREE.Material).dispose();
      telescopeGeo.dispose();
      laserGeo.dispose();
      laserMat.dispose();
      pole.geometry.dispose();
      prismHead.geometry.dispose();
      (prismHead.material as THREE.Material).dispose();
      ringGeo.dispose();
      ringMat.dispose();
    },
  };
}
