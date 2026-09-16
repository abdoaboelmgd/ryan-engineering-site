export type StoryboardId = '01' | '02' | '03' | '04';

export interface StoryboardScene {
  id: StoryboardId;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  description: string;
  keyFeatures: string[];
  specs: {
    label: string;
    value: string;
    unit?: string;
  }[];
  badgeColor: string;
  cameraTargetZ: number;
  cameraRotationY: number;
  coordinates: {
    lat: string;
    lng: string;
    elevation: string;
    city: string;
  };
}

export interface ViewSettings {
  wireframe: boolean;
  laserScan: boolean;
  autoFly: boolean;
  flySpeed: number;
  depthZ: number; // -100 to 100
  rotationSpeed: number;
  lightingIntensity: number;
  colorTheme: 'burgundy-gold' | 'cyber-blueprint' | 'monochrome';
}
