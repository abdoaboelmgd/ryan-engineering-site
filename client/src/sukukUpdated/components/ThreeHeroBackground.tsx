import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface ThreeHeroBackgroundProps {
  parallaxEnabled?: boolean;
  shadowsEnabled?: boolean;
  autoTour?: boolean;
  wireframe?: boolean;
  onObjectClick?: (objectName: 'theodolite' | 'tablet' | 'helmet') => void;
  className?: string;
}

export const ThreeHeroBackground: React.FC<ThreeHeroBackgroundProps> = ({
  parallaxEnabled = true,
  shadowsEnabled = true,
  autoTour = true,
  wireframe = false,
  onObjectClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const mobileReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ==========================================
    // 1. تدرج ألوان السماء وعمق الأفق الجوي (Sky Gradient & Atmospheric Depth)
    // ==========================================
    const scene = new THREE.Scene();

    // إنشاء تدرج لوني عميق لسماء شروق الشمس (Zenith to Horizon Gradient)
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 16;
    skyCanvas.height = 512;
    const skyCtx = skyCanvas.getContext('2d');
    if (skyCtx) {
      const grad = skyCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0.0, '#fde68a'); // قبة السماء العلوية: ذهبي دافئ ناعم
      grad.addColorStop(0.35, '#fef08a'); // منتصف السماء: ضوء الصباح الباكر
      grad.addColorStop(0.70, '#fed7aa'); // فوق خط الأفق: توهج الشروق المشمشي
      grad.addColorStop(1.0, '#fef3c7'); // خط الأفق وقاعدة المشهد: متناسق تماماً مع الضباب
      skyCtx.fillStyle = grad;
      skyCtx.fillRect(0, 0, 16, 512);
    }
    const skyTexture = new THREE.CanvasTexture(skyCanvas);
    scene.background = skyTexture;

    // ضباب جوي صباحي مدروس العمق يدمج الأبراج البعيدة مع الأفق بنعومة دون طمسها
    scene.fog = new THREE.FogExp2(0xfef3c7, 0.0024);

    // ==========================================
    // 2. الكاميرا البانورامية فائقة الاتساع (Ultra-Wide Panorama Camera)
    // ==========================================
    // A wider mobile FOV keeps the full architectural composition visible in portrait screens.
    const camera = new THREE.PerspectiveCamera(isMobile ? 68 : 54, width / height, 0.1, 750);
    const baseCamPos = new THREE.Vector3(0.5, isMobile ? 5.9 : 5.6, isMobile ? 25.5 : 21.0);
    const baseLookAt = new THREE.Vector3(-0.3, isMobile ? 3.2 : 2.7, -10.0);
    camera.position.copy(baseCamPos);
    camera.lookAt(baseLookAt);

    // ==========================================
    // 3. محرك التصيير عالي الأداء مع معالجة التباين اللوني
    // ==========================================
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    // Cap mobile pixel density to keep scrolling and form interaction smooth.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = shadowsEnabled && !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // ==========================================
    // 4. منظومة الإضاءة متعددة الطبقات لتعزيز عمق المشهد (Depth Lighting Rig)
    // ==========================================
    // إضاءة نصف كروية (Hemisphere Light) تمنح قمم المجسمات دفء السماء وقواعدها انعكاس الأرض
    const hemiLight = new THREE.HemisphereLight(0xfffaea, 0x64748b, 0.85);
    scene.add(hemiLight);

    // ضوء الشمس المنسدل بزاوية علوية مائلة من اليمين مع خريطة ظلال فائقة الدقة 4096
    const sunLight = new THREE.DirectionalLight(0xfffae8, 2.2);
    sunLight.position.set(45, 42, -20);
    sunLight.castShadow = shadowsEnabled && !isMobile;
    sunLight.shadow.mapSize.width = isMobile ? 1024 : 4096;
    sunLight.shadow.mapSize.height = isMobile ? 1024 : 4096;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 200;
    sunLight.shadow.camera.left = -45;
    sunLight.shadow.camera.right = 45;
    sunLight.shadow.camera.top = 45;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.bias = -0.00012;
    sunLight.shadow.normalBias = 0.035;
    sunLight.shadow.radius = 2.0;

    const sunTarget = new THREE.Object3D();
    sunTarget.position.set(-1, 2, -6);
    scene.add(sunTarget);
    sunLight.target = sunTarget;
    scene.add(sunLight);

    // إضاءة مخصصة ومركزة لمكتب المهندس وعناصره في المقدمة لإبراز التباين والعمق
    const deskFill = new THREE.DirectionalLight(0xffedd5, 1.15);
    deskFill.position.set(2, 14, 16);
    deskFill.castShadow = !isMobile;
    deskFill.shadow.mapSize.width = isMobile ? 512 : 2048;
    deskFill.shadow.mapSize.height = isMobile ? 512 : 2048;
    deskFill.shadow.camera.near = 1;
    deskFill.shadow.camera.far = 35;
    deskFill.shadow.camera.left = -16;
    deskFill.shadow.camera.right = 16;
    deskFill.shadow.camera.top = 12;
    deskFill.shadow.camera.bottom = -10;
    deskFill.shadow.bias = -0.0001;
    scene.add(deskFill);

    // إضاءة خلفية ناعمة (Rim Light) تبرز حواف الرافعات وأبراج الأفق
    const rimLight = new THREE.DirectionalLight(0xfde68a, 0.6);
    rimLight.position.set(-20, 25, -60);
    scene.add(rimLight);

    // ==========================================
    // 5. الخامات الأساسية مع تباين لوني مدروس (Materials Palette)
    // ==========================================
    // خرسانة إنشائية بلون أردوازي واقعي وعميق
    const concreteMat = new THREE.MeshStandardMaterial({
      color: 0x3b4758,
      roughness: 0.85,
      metalness: 0.12,
      wireframe,
    });
    // حديد التسليح الداكن
    const rebarMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.5,
      metalness: 0.9,
      wireframe,
    });
    // أصفر الرافعات البرجية الإنشائية المشبع
    const yellowCraneMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.32,
      metalness: 0.35,
      wireframe,
    });
    // حديد كتل الاتزان والمحركات
    const blackCraneMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.45,
      metalness: 0.8,
      wireframe,
    });
    // خشب مكتب المهندس المصقول الغني بالدفء
    const woodDeskMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.28,
      metalness: 0.08,
      wireframe,
    });
    // حافة المكتب الأمامية الداكنة
    const darkWoodFrontMat = new THREE.MeshStandardMaterial({
      color: 0x270f03,
      roughness: 0.45,
      wireframe,
    });
    // أرضية الشرفة الخرسانية الفاتحة
    const groundPlatformMat = new THREE.MeshStandardMaterial({
      color: 0xd6d3d1,
      roughness: 0.85,
      wireframe,
    });
    const groundEdgeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.9,
      wireframe,
    });
    const railingMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.35,
      metalness: 0.85,
      wireframe,
    });
    // ليزر المسح المساحي عالي السطوع
    const redLaserMat = new THREE.LineBasicMaterial({
      color: 0xff1e56,
      linewidth: 2,
    });

    // ==========================================
    // 6. تشكيل السحب الركامية العضوية الواقعية (Organic Volumetric Cumulus Clouds)
    // تم استبدال الكرات البسيطة بتكوينات سحابية طبقية ممتدة أفقياً بقواعد مسطحة
    // وقمم قطنية ركامية متراكبة بتدرج ضوئي ناعم بين ضوء الشمس وظلال السحاب
    // ==========================================
    const cloudsMasterGroup = new THREE.Group();

    // خامة قمم السحاب المتوهجة بضوء الشمس المباشر
    const cloudSunlitMat = new THREE.MeshStandardMaterial({
      color: 0xfffdf5,
      roughness: 0.9,
      metalness: 0.02,
      flatShading: false,
    });
    // خامة قاعدة وباطن السحاب المظلل بنعومة الصباح
    const cloudShadowMat = new THREE.MeshStandardMaterial({
      color: 0xdfd4c4,
      roughness: 0.95,
      metalness: 0.0,
      flatShading: false,
    });

    const smoothPuffGeom = new THREE.SphereGeometry(1, 24, 18);

    // دالة بناء تشكيل سحابي ركامي عضوي ممتد بقاعدة أفقية وتلال متراكبة
    const createOrganicCumulusCloud = (
      widthSpan: number,
      heightSpan: number,
      depthSpan: number,
      puffCount: number
    ) => {
      const cloud = new THREE.Group();

      // 1. قاعدة السحابة المسطحة الممتدة أفقياً (Flat condensation base deck)
      const baseDeck = new THREE.Mesh(smoothPuffGeom, cloudShadowMat);
      baseDeck.scale.set(widthSpan * 0.9, heightSpan * 0.32, depthSpan * 0.7);
      baseDeck.position.set(0, -heightSpan * 0.25, 0);
      cloud.add(baseDeck);

      // 2. تلال وتكتلات السحب الركامية المتراكبة والمتفاوتة في الحجم والارتفاع
      for (let i = 0; i < puffCount; i++) {
        const ratio = (i / (puffCount - 1) - 0.5) * 2; // من -1 إلى +1 عبر العرض
        const posX = ratio * (widthSpan * 0.42) + (Math.random() - 0.5) * (widthSpan * 0.15);
        const centerProximity = 1.0 - Math.pow(Math.abs(ratio), 1.6);
        const posY = centerProximity * heightSpan * 0.45 + (Math.random() - 0.5) * (heightSpan * 0.2);
        const posZ = (Math.random() - 0.5) * (depthSpan * 0.5);

        const rx = (1.1 + centerProximity * 0.9 + Math.random() * 0.5) * (widthSpan * 0.22);
        const ry = (0.6 + centerProximity * 0.7 + Math.random() * 0.4) * (heightSpan * 0.55);
        const rz = (0.9 + centerProximity * 0.6 + Math.random() * 0.4) * (depthSpan * 0.35);

        // قمة السحابة بضوء الشمس الأبيض المائل للدفء
        const puff = new THREE.Mesh(smoothPuffGeom, cloudSunlitMat);
        puff.position.set(posX, posY, posZ);
        puff.scale.set(rx, ry, rz);
        cloud.add(puff);

        // لمسة ظل خفيفة أسفل التكتل لتعميق الإحساس بالحجم
        if (i % 2 === 0) {
          const underPuff = new THREE.Mesh(smoothPuffGeom, cloudShadowMat);
          underPuff.position.set(posX, posY - ry * 0.35, posZ);
          underPuff.scale.set(rx * 0.95, ry * 0.6, rz * 0.95);
          cloud.add(underPuff);
        }
      }

      return cloud;
    };

    // بنوك السحب الممتدة في الأفق عبر أعماق مختلفة لإعطاء عمق بصري رائع
    interface CloudAnchor {
      mesh: THREE.Group;
      baseX: number;
      speed: number;
      minX: number;
      maxX: number;
    }
    const animatedClouds: CloudAnchor[] = [];

    const cloudConfigs = [
      { x: -38, y: 19, z: -46, w: 18, h: 4.8, d: 9, puffs: 9, speed: 0.18 },
      { x: -18, y: 21, z: -52, w: 22, h: 5.4, d: 11, puffs: 11, speed: 0.14 },
      { x: 4, y: 20, z: -48, w: 19, h: 5.0, d: 10, puffs: 10, speed: 0.16 },
      { x: 26, y: 18, z: -50, w: 24, h: 5.2, d: 11, puffs: 12, speed: 0.15 },
      { x: 46, y: 19, z: -45, w: 17, h: 4.6, d: 8, puffs: 8, speed: 0.20 },
      // طبقة سحب عليا أكثر بعداً وهدوءاً
      { x: -44, y: 24, z: -62, w: 26, h: 6.0, d: 12, puffs: 12, speed: 0.10 },
      { x: -6, y: 25, z: -66, w: 30, h: 6.5, d: 14, puffs: 14, speed: 0.09 },
      { x: 32, y: 23, z: -64, w: 28, h: 6.2, d: 13, puffs: 13, speed: 0.11 },
    ];

    cloudConfigs.forEach((cfg) => {
      const cloud = createOrganicCumulusCloud(cfg.w, cfg.h, cfg.d, cfg.puffs);
      cloud.position.set(cfg.x, cfg.y, cfg.z);
      cloudsMasterGroup.add(cloud);
      animatedClouds.push({
        mesh: cloud,
        baseX: cfg.x,
        speed: cfg.speed,
        minX: -65,
        maxX: 65,
      });
    });
    scene.add(cloudsMasterGroup);

    // ==========================================
    // 7. قرص الشمس وأشعة الشروق الذهبي في الأفق العلوي الأيمن
    // ==========================================
    const sunGroup = new THREE.Group();
    sunGroup.position.set(24, 18, -60);
    for (let r = 1; r <= 3; r++) {
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(6.0 + r * 2.5, 6.0 + r * 3.5, 32),
        new THREE.MeshBasicMaterial({
          color: 0xfffbeb,
          transparent: true,
          opacity: 0.48 - r * 0.11,
          side: THREE.DoubleSide,
        })
      );
      ringMesh.lookAt(camera.position);
      sunGroup.add(ringMesh);
    }
    const sunCore = new THREE.Mesh(
      new THREE.SphereGeometry(5.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    sunGroup.add(sunCore);
    scene.add(sunGroup);

    // ==========================================
    // 8. أفق مدينة الرياض البانورامي مع برج المملكة وبرج الفيصلية وناطحات السحاب
    // تم ضبط ألوان الأبراج البعيدة بتدرج جوي (Atmospheric Perspective)
    // ==========================================
    const skylineGroup = new THREE.Group();
    skylineGroup.position.set(0, 0, -55);

    // 8.A: برج المملكة الأيقوني (Kingdom Centre Tower)
    const kingdomTower = new THREE.Group();
    kingdomTower.position.set(20, 0, 0);

    const ktHeight = 30;
    const ktBody = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, ktHeight, 3.6),
      new THREE.MeshStandardMaterial({ color: 0x2d3a4d, roughness: 0.75, metalness: 0.2 })
    );
    ktBody.position.y = ktHeight / 2;
    kingdomTower.add(ktBody);

    // الفتحة المقوسة الشهيرة لبرج المملكة
    const ktArch = new THREE.Mesh(
      new THREE.CylinderGeometry(1.4, 1.4, 5.8, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    ktArch.rotation.z = Math.PI / 2;
    ktArch.position.set(0, ktHeight - 3.8, 0);
    kingdomTower.add(ktArch);

    skylineGroup.add(kingdomTower);

    // 8.B: برج الفيصلية الهرمي الأيقوني (Al Faisaliah Tower with Globe)
    const faisaliahTower = new THREE.Group();
    faisaliahTower.position.set(13, 0, 4);

    const ftHeight = 24;
    const ftBase = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, ftHeight, 4),
      new THREE.MeshStandardMaterial({ color: 0x37475d, roughness: 0.75, metalness: 0.25 })
    );
    ftBase.position.y = ftHeight / 2;
    ftBase.rotation.y = Math.PI / 4;
    faisaliahTower.add(ftBase);

    // الكرة الذهبية لبرج الفيصلية
    const ftGlobe = new THREE.Mesh(
      new THREE.SphereGeometry(0.85, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 })
    );
    ftGlobe.position.y = ftHeight - 2.5;
    faisaliahTower.add(ftGlobe);

    // قمة البرج المدببة
    const ftSpire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.25, 4.5, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 })
    );
    ftSpire.position.y = ftHeight + 1.2;
    faisaliahTower.add(ftSpire);

    skylineGroup.add(faisaliahTower);

    // ناطحات سحاب متفرقة لمدينة الرياض بتدرج لوني يعزز العمق
    const towersData = [
      { x: 5, h: 22, w: 3.6, d: 3.6, color: 0x475569 },
      { x: 9, h: 25, w: 4.0, d: 3.8, color: 0x56687a },
      { x: -1, h: 21, w: 3.5, d: 3.4, color: 0x5b6d7f },
      { x: -5, h: 19, w: 3.2, d: 3.2, color: 0xc49b72 },
      { x: 26, h: 18, w: 3.8, d: 3.6, color: 0x3b4c60 },
      { x: 32, h: 15, w: 3.2, d: 3.0, color: 0xb88e63 },
      { x: -22, h: 15, w: 4.2, d: 3.6, color: 0xc49b72 },
      { x: -28, h: 13, w: 3.6, d: 3.4, color: 0xa87d55 },
      { x: -35, h: 11, w: 3.8, d: 3.5, color: 0x8896a6 },
    ];

    towersData.forEach(({ x, h, w, d, color }) => {
      const bMesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color, roughness: 0.85 })
      );
      bMesh.position.set(x, h / 2, (Math.random() - 0.5) * 6);
      skylineGroup.add(bMesh);
    });

    // كتل المباني الحضرية في خط الأفق
    for (let c = -38; c <= 38; c += 3.0) {
      if (Math.abs(c - 20) < 4 || Math.abs(c - 13) < 3) continue;
      const sh = 2.0 + Math.random() * 3.5;
      const smallBlock = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, sh, 2.4),
        new THREE.MeshStandardMaterial({ color: 0xc49b72, roughness: 0.9 })
      );
      smallBlock.position.set(c, sh / 2, 8 + Math.random() * 6);
      skylineGroup.add(smallBlock);
    }
    scene.add(skylineGroup);

    // ==========================================
    // 9. برج الخرسانة الإنشائي متعدد الطوابق وخطوط المسح (Center-Left)
    // ==========================================
    const createUnderConstructionBuilding = (
      floors: number,
      width: number,
      depth: number,
      floorHeight: number
    ) => {
      const bGroup = new THREE.Group();
      const colRadius = 0.22;

      for (let f = 0; f < floors; f++) {
        const fy = f * floorHeight;

        // بلاطة السقف الخرسانية
        const slab = new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.32, depth),
          concreteMat
        );
        slab.position.y = fy;
        slab.castShadow = true;
        slab.receiveShadow = true;
        bGroup.add(slab);

        // الأعمدة الخرسانية للطابق
        if (f < floors - 1) {
          const colXOffsets = [-width / 2 + 0.45, 0, width / 2 - 0.45];
          const colZOffsets = [-depth / 2 + 0.45, 0, depth / 2 - 0.45];

          colXOffsets.forEach((cx) => {
            colZOffsets.forEach((cz) => {
              const col = new THREE.Mesh(
                new THREE.BoxGeometry(colRadius * 2, floorHeight - 0.32, colRadius * 2),
                concreteMat
              );
              col.position.set(cx, fy + (floorHeight - 0.32) / 2 + 0.16, cz);
              col.castShadow = true;
              bGroup.add(col);
            });
          });
        }
      }

      // أسياخ حديد التسليح البارزة في الطابق الأخير
      const topFloorY = (floors - 1) * floorHeight + 0.16;
      const rebarXOffsets = [-width / 2 + 0.45, 0, width / 2 - 0.45];
      const rebarZOffsets = [-depth / 2 + 0.45, 0, depth / 2 - 0.45];

      rebarXOffsets.forEach((rx) => {
        rebarZOffsets.forEach((rz) => {
          for (let r = 0; r < 4; r++) {
            const rebar = new THREE.Mesh(
              new THREE.CylinderGeometry(0.03, 0.03, 1.4, 6),
              rebarMat
            );
            rebar.position.set(
              rx + (Math.random() - 0.5) * 0.25,
              topFloorY + 0.7,
              rz + (Math.random() - 0.5) * 0.25
            );
            bGroup.add(rebar);
          }
        });
      });

      return bGroup;
    };

    // المبنى الرئيسي على اليسار (7 طوابق)
    const leftBuilding = createUnderConstructionBuilding(7, 9.5, 8.5, 1.8);
    leftBuilding.position.set(-10.0, 0.4, -14);
    scene.add(leftBuilding);

    // إطارات المسح المساحي الحمراء المحيطة بالطوابق
    const redBox1 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(9.8, 1.7, 8.8)),
      new THREE.LineBasicMaterial({ color: 0xff1e56, linewidth: 2 })
    );
    redBox1.position.set(-10.0, 5.4, -14);
    redBox1.rotation.z = 0.04;
    scene.add(redBox1);

    const redBox2 = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(9.8, 1.7, 8.8)),
      new THREE.LineBasicMaterial({ color: 0xff1e56, linewidth: 2 })
    );
    redBox2.position.set(-10.0, 8.8, -14);
    redBox2.rotation.z = -0.03;
    scene.add(redBox2);

    // مبنى ثانٍ قيد الإنشاء في المنتصف (5 طوابق)
    const rightBuilding = createUnderConstructionBuilding(5, 6.2, 6.2, 1.8);
    rightBuilding.position.set(3.5, 0.4, -17);
    scene.add(rightBuilding);

    // ==========================================
    // 10. رافعات البناء البرجية الصفراء بكامل أذرعها وحبالها المتحركة
    // ==========================================
    const createCrane = (mastHeight: number, jibLength: number, counterJibLength: number) => {
      const crane = new THREE.Group();

      const mast = new THREE.Mesh(new THREE.BoxGeometry(0.75, mastHeight, 0.75), yellowCraneMat);
      mast.position.y = mastHeight / 2;
      mast.castShadow = true;
      crane.add(mast);

      const apex = new THREE.Mesh(new THREE.ConeGeometry(0.55, 2.5, 4), yellowCraneMat);
      apex.position.y = mastHeight + 1.25;
      apex.rotation.y = Math.PI / 4;
      crane.add(apex);

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.0, 0.9), yellowCraneMat);
      cabin.position.set(0.7, mastHeight - 0.5, 0);
      crane.add(cabin);

      const boom = new THREE.Group();
      boom.position.y = mastHeight;

      const jib = new THREE.Mesh(new THREE.BoxGeometry(jibLength, 0.5, 0.5), yellowCraneMat);
      jib.position.set(jibLength / 2, 0, 0);
      jib.castShadow = true;
      boom.add(jib);

      const counterJib = new THREE.Mesh(new THREE.BoxGeometry(counterJibLength, 0.5, 0.5), yellowCraneMat);
      counterJib.position.set(-counterJibLength / 2, 0, 0);
      boom.add(counterJib);

      const counterWeight = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.8), blackCraneMat);
      counterWeight.position.set(-counterJibLength + 0.7, -0.2, 0);
      boom.add(counterWeight);

      const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.8, 6), rebarMat);
      cable.position.set(jibLength * 0.6, -1.9, 0);
      boom.add(cable);

      const hookBlock = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.4, 0.35), yellowCraneMat);
      hookBlock.position.set(jibLength * 0.6, -3.8, 0);
      boom.add(hookBlock);

      const warningLight = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff1e56 })
      );
      warningLight.position.set(jibLength, 0.35, 0);
      boom.add(warningLight);

      crane.add(boom);

      return { crane, boom };
    };

    const crane1 = createCrane(17, 14.5, 5.0);
    crane1.crane.position.set(-9.2, 0.4, -14);
    scene.add(crane1.crane);

    const crane2 = createCrane(18.5, 15.5, 4.5);
    crane2.crane.position.set(-0.5, 0.4, -16);
    crane2.boom.rotation.y = 0.2;
    scene.add(crane2.crane);

    const crane3 = createCrane(15.5, 13.0, 4.2);
    crane3.crane.position.set(2.8, 0.4, -17);
    crane3.boom.rotation.y = -0.15;
    scene.add(crane3.crane);

    // ==========================================
    // 11. أرضية الشرفة الهندسية وحاجز الأمان (Terrace Platform & Railing)
    // ==========================================
    const terrace = new THREE.Mesh(
      new THREE.BoxGeometry(32, 0.4, 13),
      groundPlatformMat
    );
    terrace.position.set(0, 0.2, -2.5);
    terrace.receiveShadow = true;
    scene.add(terrace);

    const terraceBorder = new THREE.Mesh(
      new THREE.BoxGeometry(32.8, 0.35, 13.8),
      groundEdgeMat
    );
    terraceBorder.position.set(0, 0.15, -2.5);
    terraceBorder.receiveShadow = true;
    scene.add(terraceBorder);

    // حاجز الأمان المعدني عبر الشرفة
    const railingGroup = new THREE.Group();
    railingGroup.position.set(0, 0.4, 1.2);

    [-0.05, 0.35, 0.75].forEach((ry) => {
      const rBar = new THREE.Mesh(new THREE.BoxGeometry(28, 0.05, 0.05), railingMat);
      rBar.position.y = ry + 0.35;
      railingGroup.add(rBar);
    });

    for (let p = -13; p <= 13; p += 2.6) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.85, 0.08), railingMat);
      post.position.set(p, 0.72, 0);
      railingGroup.add(post);
    }
    scene.add(railingGroup);

    // ==========================================
    // 12. محطة جهاز المحطة الشاملة (Theodolite) على الجانب الأيسر بكامل حامله وقاعدته
    // ==========================================
    const theodoliteGroup = new THREE.Group();
    theodoliteGroup.name = 'theodolite';
    theodoliteGroup.position.set(-6.5, 0.4, 0.8);

    // أرجل الحامل الثلاثي الخشبي كاملة الارتفاع
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3 + 0.35;
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.035, 2.0, 8),
        woodDeskMat
      );
      leg.position.set(Math.cos(angle) * 0.55, 1.0, Math.sin(angle) * 0.55);
      leg.rotation.z = Math.sin(angle) * 0.24;
      leg.rotation.x = -Math.cos(angle) * 0.24;
      leg.castShadow = true;
      theodoliteGroup.add(leg);
    }

    // رأس المحطة الشاملة الأصفر والأسود
    const theodoliteHead = new THREE.Group();
    theodoliteHead.position.y = 2.1;

    const baseDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.12, 16), blackCraneMat);
    theodoliteHead.add(baseDisk);

    const theoBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.42), yellowCraneMat);
    theoBody.position.y = 0.35;
    theoBody.castShadow = true;
    theodoliteHead.add(theoBody);

    const telescope = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 12), blackCraneMat);
    telescope.position.set(0, 0.45, 0);
    telescope.rotation.x = Math.PI / 2 + 0.08;
    theodoliteHead.add(telescope);

    theodoliteGroup.add(theodoliteHead);
    scene.add(theodoliteGroup);

    // خطوط شعاع الليزر المساحي الأحمر
    const laserPoints = [
      new THREE.Vector3(-6.5, 2.55, 0.8),
      new THREE.Vector3(12.0, 3.8, -14),
    ];
    const laserGeom = new THREE.BufferGeometry().setFromPoints(laserPoints);
    const laserLine = new THREE.Line(laserGeom, redLaserMat);
    scene.add(laserLine);

    const targetDot = new THREE.Mesh(
      new THREE.SphereGeometry(0.14, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff1e56 })
    );
    targetDot.position.set(12.0, 3.8, -14);
    scene.add(targetDot);

    const laserPoints2 = [
      new THREE.Vector3(-6.5, 2.55, 0.8),
      new THREE.Vector3(-8.5, 5.4, -14),
    ];
    const laserGeom2 = new THREE.BufferGeometry().setFromPoints(laserPoints2);
    const laserLine2 = new THREE.Line(laserGeom2, redLaserMat);
    scene.add(laserLine2);

    // ==========================================
    // 13. المقدمة السفلية: كامل مكتب المهندس الخشبي مع خوذة الأمان، المخطط العقاري الأزرق، جهاز التابلت، ومسطرة القياس
    // تم تعزيز تباين الخامات لإعطاء بروز وعمق بصري فوري أمام الخلفية
    // ==========================================
    const deskGroup = new THREE.Group();
    deskGroup.position.set(0, 0.95, 10.5);

    // سطح المكتب الخشبي العريض
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(18.0, 0.55, 4.8),
      woodDeskMat
    );
    deskTop.position.set(0, 0, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // الواجهة الأمامية الداكنة للمكتب
    const deskFront = new THREE.Mesh(
      new THREE.BoxGeometry(18.05, 0.56, 0.12),
      darkWoodFrontMat
    );
    deskFront.position.set(0, 0, 2.4);
    deskGroup.add(deskFront);

    // 13.A: المخططات الهندسية الملفوفة (Rolled Blueprints)
    const rollsGroup = new THREE.Group();
    rollsGroup.position.set(-4.5, 0.55, 0.4);

    const rollGeom = new THREE.CylinderGeometry(0.32, 0.32, 2.2, 16);
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.65 });
    const innerRollMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    const roll1 = new THREE.Mesh(rollGeom, paperMat);
    roll1.rotation.x = Math.PI / 2;
    roll1.position.set(0, 0, 0);
    rollsGroup.add(roll1);

    const roll2 = new THREE.Mesh(rollGeom, paperMat);
    roll2.rotation.x = Math.PI / 2;
    roll2.position.set(0.65, 0, 0);
    rollsGroup.add(roll2);

    const roll3 = new THREE.Mesh(rollGeom, paperMat);
    roll3.rotation.x = Math.PI / 2;
    roll3.position.set(0.32, 0.55, 0);
    rollsGroup.add(roll3);

    [-0.32, 0.32, 0.65].forEach((rx, idx) => {
      const innerCore = new THREE.Mesh(new THREE.CircleGeometry(0.2, 16), innerRollMat);
      innerCore.position.set(rx, idx === 2 ? 0.55 : 0, 1.11);
      rollsGroup.add(innerCore);
    });

    deskGroup.add(rollsGroup);

    // 13.B: خوذة الأمان الهندسية البيضاء الناصعة
    const helmetGroup = new THREE.Group();
    helmetGroup.name = 'helmet';
    helmetGroup.position.set(-3.2, 0.5, -0.6);

    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.12 })
    );
    dome.scale.set(1.0, 0.75, 1.25);
    dome.castShadow = true;
    helmetGroup.add(dome);

    const brim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.78, 0.06, 24),
      new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
    );
    brim.scale.set(1.0, 1.0, 1.25);
    helmetGroup.add(brim);

    // جهاز قياس المسافات بالليزر
    const distMeter = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.25, 0.65),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 })
    );
    distMeter.position.set(0.7, 0.13, 0.5);
    helmetGroup.add(distMeter);

    deskGroup.add(helmetGroup);

    // 13.C: المخطط العقاري الأزرق الملكي البارز (Blue Blueprint / Plan Sheet)
    const blueprint = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 0.03, 2.8),
      new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.65 })
    );
    blueprint.position.set(-0.2, 0.29, 0.2);
    blueprint.receiveShadow = true;
    deskGroup.add(blueprint);

    // خطوط الشبكة المعمارية على المخطط
    const planGrid = new THREE.GridHelper(2.5, 8, 0x38bdf8, 0x0ea5e9);
    planGrid.position.set(-0.2, 0.31, 0.2);
    deskGroup.add(planGrid);

    // مسطرة القياس الهندسية المثلثية (Scale Ruler)
    const scaleRuler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 2.6, 3),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35, metalness: 0.15 })
    );
    scaleRuler.rotation.z = Math.PI / 2;
    scaleRuler.rotation.y = -0.15;
    scaleRuler.position.set(-0.2, 0.35, 1.2);
    deskGroup.add(scaleRuler);

    // قلم تحديد المساح
    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.9, 8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.25, metalness: 0.85 })
    );
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.3;
    pen.position.set(-0.15, 0.33, 0.45);
    deskGroup.add(pen);

    // 13.D: جهاز التابلت الهندسي وشاشة الـ CAD (Engineering Tablet)
    const tabletGroup = new THREE.Group();
    tabletGroup.name = 'tablet';
    tabletGroup.position.set(-0.2, 1.35, -0.8);

    const tabletFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 1.85, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.85 })
    );
    tabletFrame.castShadow = true;
    tabletGroup.add(tabletFrame);

    const screenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 1.68),
      new THREE.MeshBasicMaterial({ color: 0x18181f })
    );
    screenMesh.position.z = 0.055;
    tabletGroup.add(screenMesh);

    const sideBar = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 1.68),
      new THREE.MeshBasicMaterial({ color: 0x9f1239 })
    );
    sideBar.position.set(-1.1, 0, 0.056);
    tabletGroup.add(sideBar);

    const gridHelper = new THREE.GridHelper(1.1, 10, 0xff1e56, 0xf43f5e);
    gridHelper.rotation.x = Math.PI / 2;
    gridHelper.position.set(0.12, -0.1, 0.057);
    tabletGroup.add(gridHelper);

    const cadPin = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xff1e56 })
    );
    cadPin.position.set(0.12, 0.18, 0.07);
    tabletGroup.add(cadPin);

    deskGroup.add(tabletGroup);

    // 13.E: مجلد الصك العقاري الفاخر (Deed Folder) بلون أحمر قرمزي وشعار ذهبي براق
    const deedFolderGroup = new THREE.Group();
    deedFolderGroup.position.set(2.8, 0.38, 0.2);

    const folderCover = new THREE.Mesh(
      new THREE.BoxGeometry(2.3, 0.18, 2.7),
      new THREE.MeshStandardMaterial({ color: 0x701a33, roughness: 0.35 })
    );
    folderCover.castShadow = true;
    deedFolderGroup.add(folderCover);

    const goldEmblem = new THREE.Mesh(
      new THREE.CircleGeometry(0.32, 24),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.2, metalness: 0.85 })
    );
    goldEmblem.rotation.x = -Math.PI / 2;
    goldEmblem.position.set(0, 0.1, 0);
    deedFolderGroup.add(goldEmblem);

    const curledPage = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.26, 2.1, 16, 1, true, 0, Math.PI * 1.3),
      new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.65, side: THREE.DoubleSide })
    );
    curledPage.rotation.z = Math.PI / 2;
    curledPage.position.set(0.55, 0.3, 0);
    deedFolderGroup.add(curledPage);

    deskGroup.add(deedFolderGroup);

    scene.add(deskGroup);

    // ==========================================
    // 14. ذرات الغبار والأتربة الذهبية الطافية (Floating Atmospheric Particles)
    // ==========================================
    const particleCount = 160;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 36;
      particlePositions[p * 3 + 1] = 0.5 + Math.random() * 18;
      particlePositions[p * 3 + 2] = -25 + Math.random() * 45;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfffbeb,
      size: 0.16,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // ==========================================
    // 15. فيزياء النوابض والتفاعل بالماوس (Spring Physics & Parallax)
    // ==========================================
    let mouseX = 0;
    let mouseY = 0;
    let mouseVelX = 0;
    let mouseVelY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      if (isMobile) return;
      const rawX = (e.clientX / window.innerWidth - 0.5) * 2;
      const rawY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetMouseX = Math.sign(rawX) * Math.pow(Math.abs(rawX), 0.95);
      targetMouseY = Math.sign(rawY) * Math.pow(Math.abs(rawY), 0.95);
    };

    const onPointerLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      mouseVec.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVec.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);

      const intersects = raycaster.intersectObjects(
        [theodoliteGroup, helmetGroup, tabletGroup, deedFolderGroup],
        true
      );
      if (intersects.length > 0 && onObjectClick) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !['theodolite', 'helmet', 'tablet'].includes(obj.name)) {
          obj = obj.parent;
        }
        if (obj) {
          onObjectClick(obj.name as 'theodolite' | 'tablet' | 'helmet');
        }
      }
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('mouseleave', onPointerLeave);
    container.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nw = entry.contentRect.width;
        const nh = entry.contentRect.height;
        if (nw > 0 && nh > 0) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    let isVisible = true;
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]) isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // ==========================================
    // 16. حلقة التصيير مع البارالاكس وانسياب السحب الركامية عبر الأفق
    // ==========================================
    const clock = new THREE.Clock();
    const destCamPos = new THREE.Vector3();
    const destLookAt = new THREE.Vector3();
    const currentLookAt = baseLookAt.clone();

    const renderLoop = () => {
      animFrameId.current = requestAnimationFrame(renderLoop);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // حركة النوابض الفيزيائية
      const springK = isMobile ? 0.025 : 0.045;
      const springDamping = 0.85;
      const fx = (targetMouseX - mouseX) * springK;
      const fy = (targetMouseY - mouseY) * springK;
      mouseVelX = (mouseVelX + fx) * springDamping;
      mouseVelY = (mouseVelY + fy) * springDamping;
      mouseX += mouseVelX;
      mouseY += mouseVelY;

      // حركة انسيابية هادئة للسحب عبر الأفق تجعل السماء حية وعميقة
      for (let c = 0; c < animatedClouds.length; c++) {
        const cloud = animatedClouds[c];
        cloud.mesh.position.x -= cloud.speed * delta * 4.5;
        if (cloud.mesh.position.x < cloud.minX) {
          cloud.mesh.position.x = cloud.maxX;
        }
      }

      // حركة الرافعات
      crane1.boom.rotation.y = Math.sin(time * 0.22) * 0.35 + 0.1;
      crane2.boom.rotation.y = Math.cos(time * 0.18) * 0.28 - 0.1;
      crane3.boom.rotation.y = Math.sin(time * 0.25) * 0.2 + 0.15;

      // تتبع جهاز الرصد للماوس
      theodoliteHead.rotation.y += (mouseX * 0.35 - theodoliteHead.rotation.y) * 0.08;

      const tourSwayX = autoTour && !mobileReducedMotion ? Math.sin(time * (isMobile ? 0.16 : 0.25)) * (isMobile ? 0.12 : 0.28) : 0;
      const tourSwayY = autoTour && !mobileReducedMotion ? Math.cos(time * (isMobile ? 0.22 : 0.35)) * (isMobile ? 0.07 : 0.15) : 0;
      const pScale = parallaxEnabled && !isMobile ? 1.0 : 0.0;

      const px = mouseX * 2.8 * pScale + tourSwayX;
      const py = -mouseY * 1.6 * pScale + tourSwayY;
      const pz = Math.hypot(mouseX, mouseY) * 0.6 * pScale;

      destCamPos.set(baseCamPos.x + px, baseCamPos.y + py, baseCamPos.z + pz);
      destLookAt.set(
        baseLookAt.x + mouseX * 0.6 * pScale,
        baseLookAt.y - mouseY * 0.35 * pScale,
        baseLookAt.z
      );

      camera.position.lerp(destCamPos, 0.055);
      currentLookAt.lerp(destLookAt, 0.055);
      camera.lookAt(currentLookAt);

      if (parallaxEnabled) {
        camera.rotation.z += -mouseX * (isMobile ? 0.008 : 0.024);
      }

      const posAttr = particleGeom.attributes.position as THREE.BufferAttribute;
      for (let p = 0; p < particleCount; p++) {
        let py = posAttr.getY(p) + Math.sin(time + p) * 0.005;
        if (py > 18) py = 0.5;
        posAttr.setY(p, py);
      }
      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseleave', onPointerLeave);
      container.removeEventListener('click', onClick);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      skyTexture.dispose();
      renderer.dispose();
      if (renderer.domElement?.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [parallaxEnabled, shadowsEnabled, autoTour, wireframe, onObjectClick]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full overflow-hidden pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default ThreeHeroBackground;
