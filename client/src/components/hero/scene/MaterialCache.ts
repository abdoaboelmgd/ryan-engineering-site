import * as THREE from 'three';

// Global shared materials cache to avoid re-allocating shaders and textures
export class MaterialCache {
  private static materials: Map<string, THREE.Material> = new Map();

  public static getGoldMaterial(): THREE.MeshStandardMaterial {
    if (!this.materials.has('gold')) {
      this.materials.set(
        'gold',
        new THREE.MeshStandardMaterial({
          color: 0xd4af37,
          metalness: 0.85,
          roughness: 0.25,
        })
      );
    }
    return this.materials.get('gold') as THREE.MeshStandardMaterial;
  }

  public static getBurgundyMaterial(): THREE.MeshStandardMaterial {
    if (!this.materials.has('burgundy')) {
      this.materials.set(
        'burgundy',
        new THREE.MeshStandardMaterial({
          color: 0x8a1834,
          metalness: 0.7,
          roughness: 0.35,
        })
      );
    }
    return this.materials.get('burgundy') as THREE.MeshStandardMaterial;
  }

  public static getDarkMetalMaterial(): THREE.MeshStandardMaterial {
    if (!this.materials.has('darkMetal')) {
      this.materials.set(
        'darkMetal',
        new THREE.MeshStandardMaterial({
          color: 0x1a1c23,
          metalness: 0.8,
          roughness: 0.3,
        })
      );
    }
    return this.materials.get('darkMetal') as THREE.MeshStandardMaterial;
  }

  public static getConcreteMaterial(): THREE.MeshStandardMaterial {
    if (!this.materials.has('concrete')) {
      this.materials.set(
        'concrete',
        new THREE.MeshStandardMaterial({
          color: 0x222631,
          roughness: 0.7,
          metalness: 0.15,
        })
      );
    }
    return this.materials.get('concrete') as THREE.MeshStandardMaterial;
  }

  public static disposeAll() {
    this.materials.forEach((mat) => mat.dispose());
    this.materials.clear();
  }
}
