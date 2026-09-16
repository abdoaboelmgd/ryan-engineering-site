import * as THREE from 'three';

/**
 * Procedural texture generators for high-detail architectural & engineering models
 * Without requiring external image files, ensuring instant load time and zero network failures.
 */

// 1. High-resolution Wood Desk Texture
export function createWoodTableTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Rich warm mahogany/oak base
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0, '#543019');
  grad.addColorStop(0.3, '#6a3d20');
  grad.addColorStop(0.5, '#502c16');
  grad.addColorStop(0.7, '#744525');
  grad.addColorStop(1, '#482713');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Wood grain lines
  ctx.strokeStyle = 'rgba(35, 18, 9, 0.35)';
  for (let i = 0; i < 300; i++) {
    const y = Math.random() * 1024;
    ctx.lineWidth = 0.5 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    const cp1x = 300 + Math.random() * 100;
    const cp1y = y + (Math.random() - 0.5) * 30;
    const cp2x = 700 + Math.random() * 100;
    const cp2y = y + (Math.random() - 0.5) * 30;
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, 1024, y + (Math.random() - 0.5) * 15);
    ctx.stroke();
  }

  // Wood pore highlights
  ctx.strokeStyle = 'rgba(255, 220, 180, 0.08)';
  for (let i = 0; i < 150; i++) {
    const y = Math.random() * 1024;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y + (Math.random() - 0.5) * 10);
    ctx.stroke();
  }

  // Vignette / Depth
  const radial = ctx.createRadialGradient(512, 512, 200, 512, 512, 720);
  radial.addColorStop(0, 'rgba(0,0,0,0)');
  radial.addColorStop(1, 'rgba(0,0,0,0.3)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, 1024, 1024);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  return texture;
}

// 2. High-Detail Architectural CAD Floor Plan Blueprint
export function createBlueprintTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Blueprint paper background (technical off-white / blueprint grid)
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 1024, 768);

  // Subtle millimeter drafting grid
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < 1024; x += 16) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }
  for (let y = 0; y < 768; y += 16) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Major grid lines
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  for (let x = 0; x < 1024; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 768);
    ctx.stroke();
  }
  for (let y = 0; y < 768; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(1024, y);
    ctx.stroke();
  }

  // Architectural Drawing: External & Interior Walls
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 4;
  // Main building perimeter
  ctx.strokeRect(80, 70, 680, 520);
  // Central core
  ctx.strokeRect(320, 240, 200, 180);
  // Interior partitions
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(80, 240);
  ctx.lineTo(320, 240);

  ctx.moveTo(80, 420);
  ctx.lineTo(320, 420);

  ctx.moveTo(520, 240);
  ctx.lineTo(760, 240);

  ctx.moveTo(520, 420);
  ctx.lineTo(760, 420);

  ctx.moveTo(200, 70);
  ctx.lineTo(200, 240);

  ctx.moveTo(640, 70);
  ctx.lineTo(640, 240);

  ctx.moveTo(420, 70);
  ctx.lineTo(420, 240);

  ctx.moveTo(420, 420);
  ctx.lineTo(420, 590);
  ctx.stroke();

  // Columns (Square hatch points)
  ctx.fillStyle = '#0f172a';
  const columnPositions = [
    [80, 70], [200, 70], [420, 70], [640, 70], [760, 70],
    [80, 240], [320, 240], [520, 240], [760, 240],
    [80, 420], [320, 420], [520, 420], [760, 420],
    [80, 590], [200, 590], [420, 590], [640, 590], [760, 590],
  ];
  columnPositions.forEach(([cx, cy]) => {
    ctx.fillRect(cx - 6, cy - 6, 12, 12);
  });

  // Door swing arcs (cyan / blue dashed)
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  const doors = [
    [200, 200, 40, 0, Math.PI / 2],
    [320, 280, 35, -Math.PI / 2, 0],
    [520, 300, 35, 0, Math.PI / 2],
    [420, 500, 40, Math.PI / 2, Math.PI],
  ];
  doors.forEach(([dx, dy, r, sa, ea]) => {
    ctx.beginPath();
    ctx.arc(dx, dy, r, sa, ea);
    ctx.stroke();
  });

  // Dimension lines with arrows and numbers
  ctx.strokeStyle = '#94a3b8';
  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 11px monospace';
  ctx.lineWidth = 1;

  // Top dimensions
  ctx.beginPath();
  ctx.moveTo(80, 40);
  ctx.lineTo(760, 40);
  ctx.stroke();
  ctx.fillText('◀── 3,400 mm ──▶    ◀── 5,200 mm ──▶    ◀── 3,400 mm ──▶', 220, 35);

  // Left dimensions
  ctx.beginPath();
  ctx.moveTo(50, 70);
  ctx.lineTo(50, 590);
  ctx.stroke();

  // Technical Title Block (Cartouche) at Bottom-Right
  ctx.strokeStyle = '#8a1834';
  ctx.lineWidth = 2;
  ctx.strokeRect(560, 620, 430, 120);

  // Burgundy & Gold Title Block Banner
  ctx.fillStyle = '#8a1834';
  ctx.fillRect(562, 622, 426, 32);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('RAYAN SURVEYING & ENGINEERING CONSULTANCY', 575, 643);

  // Inner metadata
  ctx.fillStyle = '#1e293b';
  ctx.font = '11px sans-serif';
  ctx.fillText('المشروع: برج الرياض التجاري - القطاع المركزي', 575, 672);
  ctx.fillText('المخطط: المخطط التنفيذي الإنشائي - الدور الأرضي', 575, 692);
  ctx.fillText('المقياس: 1:100   |   التاريخ: 2026   |   الحالة: معتمد', 575, 712);
  ctx.fillText('كود البناء السعودي SBC - رقم الاعتماد: RYN-2026-894', 575, 730);

  // Stamp / Official Approval Seal in Burgundy
  ctx.strokeStyle = '#8a1834';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(880, 530, 45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(880, 530, 38, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#8a1834';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('معتمد هندسياً', 852, 526);
  ctx.fillText('RAYAN ENG', 855, 542);

  // North Arrow Compass
  ctx.strokeStyle = '#0f172a';
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(850, 120);
  ctx.lineTo(840, 150);
  ctx.lineTo(850, 142);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(850, 120);
  ctx.lineTo(860, 150);
  ctx.lineTo(850, 142);
  ctx.closePath();
  ctx.stroke();
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('N', 845, 110);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 3. Safety Helmet Logo Badge (Rayan monogram + typography)
export function createHelmetLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 512, 512);

  // White base badge
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 512, 512);

  // Circular Rayan emblem in burgundy
  const cx = 256;
  const cy = 200;
  ctx.fillStyle = '#8a1834';
  ctx.beginPath();
  ctx.arc(cx, cy, 100, 0, Math.PI * 2);
  ctx.fill();

  // White inner stylized "R" / Theodolite pin
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy - 15, 45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8a1834';
  ctx.beginPath();
  ctx.arc(cx, cy - 15, 25, 0, Math.PI * 2);
  ctx.fill();

  // Pin point downwards
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 5);
  ctx.lineTo(cx, cy + 70);
  ctx.lineTo(cx + 30, cy + 5);
  ctx.closePath();
  ctx.fill();

  // Gold text "RAYAN"
  ctx.fillStyle = '#b4861c';
  ctx.font = 'bold 58px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RAYAN', cx, 360);

  // Arabic subtitle
  ctx.fillStyle = '#8a1834';
  ctx.font = 'bold 28px "Cairo", sans-serif';
  ctx.fillText('ريان للمساحة الأرضية', cx, 415);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 4. Luxury Burgundy Leather Folder Texture with Embossed Gold Logo
export function createLeatherFolderTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep burgundy leather gradient
  const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 360);
  grad.addColorStop(0, '#78152e');
  grad.addColorStop(0.7, '#590e21');
  grad.addColorStop(1, '#3b0614');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Fine leather grain noise
  ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    ctx.fillRect(x, y, 1.5, 1.5);
  }

  // Stitched border (gold/yellow dash)
  ctx.strokeStyle = '#c99833';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.strokeRect(20, 20, 472, 472);
  ctx.setLineDash([]);

  // Embossed Metallic Gold Rayan Logo
  const cx = 256;
  const cy = 230;

  // Gold emblem
  ctx.fillStyle = '#e5b746';
  ctx.beginPath();
  ctx.arc(cx, cy, 55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#590e21';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e5b746';
  ctx.beginPath();
  ctx.arc(cx, cy - 8, 14, 0, Math.PI * 2);
  ctx.fill();

  // Typography
  ctx.fillStyle = '#f0c765';
  ctx.font = 'bold 40px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RAYAN', cx, 330);

  ctx.font = 'bold 22px "Cairo", sans-serif';
  ctx.fillText('ريان للمساحة الأرضية', cx, 370);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 5. Tablet Screen UI Texture (Digital twin app with cadastral map and sidebar)
export function createTabletScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Dark engineering app UI
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 1024, 680);

  // Top navigation header
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 1024, 50);

  // Top header elements
  ctx.fillStyle = '#8a1834';
  ctx.fillRect(15, 10, 130, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('RAYAN BIM 3D', 25, 30);

  // Search input bar
  ctx.fillStyle = '#334155';
  ctx.fillRect(170, 10, 360, 30);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px sans-serif';
  ctx.fillText('🔍 البحث في قطع الأراضي والمخططات التنفيذية...', 185, 30);

  // Status badges
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(880, 25, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '11px sans-serif';
  ctx.fillText('RTK GPS: متصل', 895, 29);

  // Left sidebar (Burgundy Arabic menu as in the image!)
  ctx.fillStyle = '#78152e';
  ctx.fillRect(0, 50, 140, 630);

  const menuItems = [
    { title: 'الاستكشاف 3D', y: 110 },
    { title: 'المشاريع', y: 180 },
    { title: 'المخططات', y: 250 },
    { title: 'المسح الحقلي', y: 320 },
    { title: 'التقارير', y: 390 },
    { title: 'العقارات', y: 460 },
  ];

  menuItems.forEach((item) => {
    ctx.fillStyle = '#a61c3f';
    ctx.beginPath();
    ctx.arc(70, item.y - 25, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.title, 70, item.y + 12);
  });

  // Main Map View (Right area)
  ctx.fillStyle = '#131b2e';
  ctx.fillRect(140, 50, 884, 630);

  // Orthophoto / Satellite site simulation
  const mapGrad = ctx.createLinearGradient(140, 50, 1024, 680);
  mapGrad.addColorStop(0, '#1a2333');
  mapGrad.addColorStop(0.5, '#243046');
  mapGrad.addColorStop(1, '#1b2536');
  ctx.fillStyle = mapGrad;
  ctx.fillRect(140, 50, 884, 630);

  // Road networks
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(140, 380);
  ctx.lineTo(1024, 380);
  ctx.moveTo(600, 50);
  ctx.lineTo(600, 680);
  ctx.stroke();

  // Parcel plots
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 1.5;
  const plots = [
    [200, 100, 160, 110], [380, 100, 180, 110], [640, 100, 170, 110], [830, 100, 150, 110],
    [200, 230, 160, 120], [380, 230, 180, 120], [640, 230, 170, 120], [830, 230, 150, 120],
    [200, 420, 160, 140], [380, 420, 180, 140], [640, 420, 170, 140], [830, 420, 150, 140],
  ];
  plots.forEach(([px, py, pw, ph]) => {
    ctx.strokeRect(px, py, pw, ph);
  });

  // Right sidebar details panel (similar to image)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.fillRect(780, 65, 230, 595);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 13px "Cairo", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('بيانات العقار والقطعة', 995, 95);

  ctx.fillStyle = '#64748b';
  ctx.font = '10px "Cairo", sans-serif';
  ctx.fillText('رقم المخطط: 3450 / ب', 995, 120);
  ctx.fillText('المساحة الإجمالية: 4,850 م²', 995, 140);
  ctx.fillText('الارتفاع عن سطح البحر: 612 م', 995, 160);
  ctx.fillText('رقم الصك: 9283746192', 995, 180);

  ctx.fillStyle = '#10b981';
  ctx.fillRect(800, 200, 195, 30);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px "Cairo", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✓ صك إلكتروني معتمد', 897, 220);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. Metric Tape Measure Markings Texture
export function createTapeMarkingsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Bright construction yellow
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, 0, 1024, 64);

  // Black ticks and numbers
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 14px monospace';

  for (let x = 0; x < 1024; x += 8) {
    const isCm = x % 40 === 0;
    const isHalf = x % 20 === 0;
    const tickHeight = isCm ? 30 : isHalf ? 20 : 12;

    ctx.lineWidth = isCm ? 2 : 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, tickHeight);
    ctx.stroke();

    if (isCm) {
      const cmVal = Math.floor(x / 40) + 120;
      ctx.fillText(`${cmVal}`, x - 12, 50);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}
