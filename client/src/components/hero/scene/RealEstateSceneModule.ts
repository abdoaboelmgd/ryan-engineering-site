import * as THREE from 'three';
import { MaterialCache } from './MaterialCache';
import { SceneModule } from './SurveyorSceneModule';

/**
 * Lazy Module 04: الخدمات العقارية والمخططات الرقمية
 * OPTIMIZATION: Uses THREE.InstancedMesh for the cyber parcels grid!
 * Instead of creating 36-49 individual meshes and 49 line segments (100+ draw calls),
 * an InstancedMesh collapses all parcels into a SINGLE GPU draw call with dynamic transformation matrices!
 */
export function createRealEstateScene(): SceneModule {
  const group = new THREE.Group();
  group.position.set(0, -1, -16);

  const goldMat = MaterialCache.getGoldMaterial();

  const parcelCountX = 7;
  const parcelCountZ = 7;
  const totalInstances = parcelCountX * parcelCountZ;
  const parcelSpacing = 3.2;

  // Unit Box Geometry for InstancedMesh
  const unitBoxGeo = new THREE.BoxGeometry(2.4, 1.0, 2.4);
  const instancedMat = new THREE.MeshStandardMaterial({
    color: 0x181e2b,
    metalness: 0.7,
    roughness: 0.3,
  });

  const instancedParcels = new THREE.InstancedMesh(unitBoxGeo, instancedMat, totalInstances);
  instancedParcels.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

  // Pre-calculate base height scales and positions
  const dummy = new THREE.Object3D();
  const baseData: { x: number; z: number; height: number }[] = [];

  let instanceIdx = 0;
  const colorCyan = new THREE.Color(0x38bdf8);
  const colorBurgundy = new THREE.Color(0x9e1333);
  const colorGold = new THREE.Color(0xd4af37);

  for (let px = -Math.floor(parcelCountX / 2); px <= Math.floor(parcelCountX / 2); px++) {
    for (let pz = -Math.floor(parcelCountZ / 2); pz <= Math.floor(parcelCountZ / 2); pz++) {
      if (instanceIdx >= totalInstances) break;
      const height = 0.8 + Math.abs(Math.sin(px * 1.5) * Math.cos(pz * 1.2)) * 3.5;
      const posX = px * parcelSpacing;
      const posZ = pz * parcelSpacing;

      baseData.push({ x: posX, z: posZ, height });

      dummy.position.set(posX, height / 2, posZ);
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      instancedParcels.setMatrixAt(instanceIdx, dummy.matrix);

      // Distinct parcel tint
      const col = (px + pz) % 3 === 0 ? colorGold : (px + pz) % 2 === 0 ? colorCyan : colorBurgundy;
      instancedParcels.setColorAt(instanceIdx, col);

      instanceIdx++;
    }
  }
  instancedParcels.instanceMatrix.needsUpdate = true;
  if (instancedParcels.instanceColor) instancedParcels.instanceColor.needsUpdate = true;
  group.add(instancedParcels);

  // Holographic digital deed certificate tablet
  const tabletGeo = new THREE.BoxGeometry(5, 3.2, 0.15);
  const tabletMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.9,
    roughness: 0.1,
  });
  const tablet = new THREE.Mesh(tabletGeo, tabletMat);
  tablet.position.set(0, 6, 0);
  tablet.rotation.x = 0.15;
  group.add(tablet);

  // Green approved checkmark ring on digital deed
  const checkRingGeo = new THREE.TorusGeometry(0.7, 0.08, 12, 24);
  const checkRingMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    roughness: 0.2,
  });
  const checkRing = new THREE.Mesh(checkRingGeo, checkRingMat);
  checkRing.position.set(1.4, 6, 0.1);
  group.add(checkRing);

  // Golden perimeter boundary ribbon
  const boundaryGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(24, 0.2, 24));
  const boundaryLines = new THREE.LineSegments(
    boundaryGeo,
    new THREE.LineBasicMaterial({ color: 0xd4af37, transparent: true, opacity: 0.4 })
  );
  boundaryLines.position.y = 0.1;
  group.add(boundaryLines);

  return {
    group,
    update: (time: number) => {
      // Elevate instanced parcels using sinusoidal wave
      for (let i = 0; i < totalInstances; i++) {
        const item = baseData[i];
        if (!item) continue;
        const currentY = item.height / 2 + Math.sin(time * 1.5 + i * 0.3) * 0.35;
        dummy.position.set(item.x, currentY, item.z);
        dummy.scale.set(1, item.height, 1);
        dummy.updateMatrix();
        instancedParcels.setMatrixAt(i, dummy.matrix);
      }
      instancedParcels.instanceMatrix.needsUpdate = true;

      tablet.position.y = 6 + Math.sin(time * 1.2) * 0.2;
      checkRing.position.y = 6 + Math.sin(time * 1.2) * 0.2;
      checkRing.rotation.z = time * 0.3;
    },
    setWireframe: (wireframe: boolean) => {
      instancedMat.wireframe = wireframe;
    },
    dispose: () => {
      unitBoxGeo.dispose();
      instancedMat.dispose();
      tabletGeo.dispose();
      tabletMat.dispose();
      checkRingGeo.dispose();
      checkRingMat.dispose();
      boundaryGeo.dispose();
      (boundaryLines.material as THREE.Material).dispose();
    },
  };
}
