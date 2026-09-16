import * as THREE from 'three';
import { MaterialCache } from './MaterialCache';
import { SceneModule } from './SurveyorSceneModule';

/**
 * Lazy Module 03: التقارير الهندسية والاعتمادات (Floating Blueprints, Certified Seal, Brass Compass Caliper)
 */
export function createReportsScene(): SceneModule {
  const group = new THREE.Group();
  group.position.set(-2, 2, 0);

  const goldMat = MaterialCache.getGoldMaterial();
  const burgundyMat = MaterialCache.getBurgundyMaterial();

  // Procedural Canvas Blueprint Texture (Shared singleton for blueprint stack)
  const bpCanvas = document.createElement('canvas');
  bpCanvas.width = 512;
  bpCanvas.height = 360;
  const ctx = bpCanvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0a192f';
    ctx.fillRect(0, 0, 512, 360);

    // Architectural Grid
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 360);
      ctx.stroke();
    }
    for (let y = 0; y < 360; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }

    // Floor Plan Lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(60, 50, 390, 260);
    ctx.strokeRect(100, 90, 160, 180);
    ctx.strokeRect(290, 90, 130, 100);
    ctx.strokeRect(290, 210, 130, 60);

    // Title Block
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(300, 275, 120, 25);
    ctx.fillStyle = '#0a192f';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('RAYAN ENG REPORT', 308, 292);
  }

  const bpTexture = new THREE.CanvasTexture(bpCanvas);
  const bpMat = new THREE.MeshStandardMaterial({
    map: bpTexture,
    roughness: 0.4,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  // Layered CAD Blueprints Stack
  const blueprintPlanes: THREE.Mesh[] = [];
  const bpGeo = new THREE.PlaneGeometry(8, 5.5);

  for (let b = 0; b < 3; b++) {
    const bp = new THREE.Mesh(bpGeo, bpMat);
    bp.position.set(b * 0.7 - 0.7, b * 1.2, -b * 0.8);
    bp.rotation.x = -Math.PI / 2.6;
    bp.rotation.z = -0.15 + b * 0.1;
    group.add(bp);
    blueprintPlanes.push(bp);
  }

  // 3D Brass Compass / Drafting Caliper
  const compassGroup = new THREE.Group();
  compassGroup.position.set(2.5, 2.5, 1);
  compassGroup.rotation.z = 0.35;
  group.add(compassGroup);

  const compassLegGeo = new THREE.CylinderGeometry(0.06, 0.02, 4.5, 6);
  const legA = new THREE.Mesh(compassLegGeo, goldMat);
  legA.position.set(-0.6, -1.8, 0);
  legA.rotation.z = 0.25;
  compassGroup.add(legA);

  const legB = new THREE.Mesh(compassLegGeo, goldMat);
  legB.position.set(0.6, -1.8, 0);
  legB.rotation.z = -0.25;
  compassGroup.add(legB);

  const hinge = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), goldMat);
  hinge.position.y = 0.2;
  compassGroup.add(hinge);

  // Holographic 3D Official Certified Seal
  const sealMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.2, 0.15, 24),
    burgundyMat
  );
  sealMesh.position.set(-1.8, 1.5, 1.5);
  sealMesh.rotation.x = Math.PI / 4;
  group.add(sealMesh);

  const sealRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.05, 12, 24),
    goldMat
  );
  sealRing.position.set(-1.8, 1.5, 1.5);
  sealRing.rotation.x = Math.PI / 4;
  group.add(sealRing);

  return {
    group,
    update: (time: number) => {
      sealMesh.rotation.z = time * 0.5;
      sealRing.rotation.z = -time * 0.5;
      blueprintPlanes.forEach((bp, index) => {
        bp.position.y = index * 1.2 + Math.sin(time * 1.2 + index * 1.5) * 0.2;
      });
      compassGroup.rotation.y = Math.sin(time * 0.8) * 0.15;
    },
    setWireframe: (wireframe: boolean) => {
      bpMat.wireframe = wireframe;
    },
    dispose: () => {
      bpGeo.dispose();
      bpTexture.dispose();
      bpMat.dispose();
      compassLegGeo.dispose();
      hinge.geometry.dispose();
      sealMesh.geometry.dispose();
      sealRing.geometry.dispose();
    },
  };
}
