// Visualizador 3D/2D — lógica do viewer (Three.js)
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

let scene, camera, renderer, controls;
let modelGroup, axesHelper, gridHelper;
let isWireframe = false;
let isAxesVisible = true;
let isGridVisible = true;
let isAutoRotate = false;
let isFullscreen = false;
let currentFile = null;

// Variáveis para novas ferramentas industriais
let originalPositions = new Map();
let globalCenter = new THREE.Vector3();
let clipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 200);
let isMeasuring = false;
let measurePoints = [];
let measureLine = null;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function initScene() {
    const container = document.getElementById('three-container');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0f0f');

    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 10000);
    camera.position.set(200, 150, 200);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.localClippingEnabled = true; // Habilita o plano de corte
    container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;

    const ambientLight = new THREE.AmbientLight(0x404060);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(200, 300, 200);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight2.position.set(-200, -100, -200);
    scene.add(dirLight2);

    gridHelper = new THREE.GridHelper(500, 20);
    scene.add(gridHelper);
    axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);

    modelGroup = new THREE.Group();
    scene.add(modelGroup);

    window.addEventListener('resize', onResize);
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

function onResize() {
    const container = document.getElementById('three-container');
    if (!container || !camera || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}

function resetView() {
    if (!modelGroup || modelGroup.children.length === 0) return;
    const box = new THREE.Box3().setFromObject(modelGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim < 0.01) return;
    const dist = maxDim * 1.8;
    const dir = camera.position.clone().sub(center).normalize();
    if (dir.length() < 0.01) dir.set(1, 0.7, 1);
    camera.position.copy(center).add(dir.multiplyScalar(dist));
    controls.target.copy(center);
    controls.update();
}

function toggleWireframe() {
    isWireframe = !isWireframe;
    modelGroup.traverse(child => {
        if (child.isMesh) child.material.wireframe = isWireframe;
    });
    document.querySelectorAll('[data-action="wireframe"]').forEach(el => el.classList.toggle('active', isWireframe));
}

function toggleAxes() {
    isAxesVisible = !isAxesVisible;
    if (axesHelper) axesHelper.visible = isAxesVisible;
    document.querySelectorAll('[data-action="axes"]').forEach(el => el.classList.toggle('active', isAxesVisible));
}

function toggleGrid() {
    isGridVisible = !isGridVisible;
    if (gridHelper) gridHelper.visible = isGridVisible;
    document.querySelectorAll('[data-action="grid"]').forEach(el => el.classList.toggle('active', isGridVisible));
}

function toggleAutoRotate() {
    isAutoRotate = !isAutoRotate;
    controls.autoRotate = isAutoRotate;
    controls.autoRotateSpeed = 4;
    document.querySelectorAll('[data-action="autorotate"]').forEach(el => el.classList.toggle('active', isAutoRotate));
}

function takeScreenshot() {
    renderer.render(scene, camera);
    const link = document.createElement('a');
    link.download = 'visualizacao-3d.png';
    link.href = renderer.domElement.toDataURL('image/png');
    link.click();
}

function toggleFullscreen() {
    const container = document.getElementById('three-container');
    if (!document.fullscreenElement) {
        container.requestFullscreen().catch(() => {});
    } else {
        document.exitFullscreen().catch(() => {});
    }
}

function clearMeasurement() {
    if (measureLine) { scene.remove(measureLine); measureLine = null; }
    measurePoints = [];
    isMeasuring = false;
    const btn = document.getElementById('btn-measure');
    if (btn) btn.classList.remove('active');
    document.getElementById('measure-result').textContent = '';
    showStats('');
    document.getElementById('btn-clear-measure').style.display = 'none';
}

function changeBackground(colorHex) {
    if (scene) scene.background = new THREE.Color(colorHex);
}

function showLoading(show) {
    document.getElementById('loading-overlay').classList.toggle('hidden', !show);
}

function formatBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0, val = bytes;
    while (val >= 1024 && i < units.length - 1) { val /= 1024; i++; }
    return `${val.toFixed(i > 0 && val < 10 ? 1 : 0)} ${units[i]}`;
}

// Soma vértices/triângulos e estima volume (teorema da divergência) e área de superfície
function getGeometryStats(group) {
    let vertexCount = 0, triangleCount = 0, volume = 0, area = 0, hasMesh = false;
    group.updateMatrixWorld(true);
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    group.traverse(obj => {
        if (obj.isMesh && obj.geometry && obj.geometry.attributes.position) {
            hasMesh = true;
            const geo = obj.geometry;
            const pos = geo.attributes.position;
            const index = geo.index;
            vertexCount += pos.count;
            const triCount = Math.floor((index ? index.count : pos.count) / 3);
            triangleCount += triCount;
            const m = obj.matrixWorld;
            const getVertex = (i) => {
                const idx = index ? index.getX(i) : i;
                return new THREE.Vector3().fromBufferAttribute(pos, idx).applyMatrix4(m);
            };
            for (let i = 0; i < triCount; i++) {
                a.copy(getVertex(i * 3));
                b.copy(getVertex(i * 3 + 1));
                c.copy(getVertex(i * 3 + 2));
                volume += a.dot(b.clone().cross(c)) / 6;
                area += 0.5 * b.clone().sub(a).cross(c.clone().sub(a)).length();
            }
        }
    });
    return { vertexCount, triangleCount, volume: Math.abs(volume), area, hasMesh };
}

function buildDetailChips(chips) {
    const section = document.getElementById('sidebar-stats-section');
    const container = document.getElementById('sidebar-stats');
    if (!section || !container) return;
    container.innerHTML = '';
    if (!chips.length) { section.style.display = 'none'; return; }
    section.style.display = '';
    chips.forEach(c => {
        const div = document.createElement('div');
        div.className = 'stat-chip';
        const label = document.createElement('span');
        label.className = 'label';
        label.textContent = c.label;
        const value = document.createElement('span');
        value.className = 'value';
        value.textContent = c.value;
        div.appendChild(label);
        div.appendChild(value);
        container.appendChild(div);
    });
}

function fmtNum(n) { return Math.round(n).toLocaleString('pt-BR'); }
function fmtDec(n, d = 1) { return n.toLocaleString('pt-BR', { maximumFractionDigits: d, minimumFractionDigits: 0 }); }

// 1. Árvore de Componentes e Isolamento
function buildComponentTree() {
    const tree = document.getElementById('component-tree');
    if (!tree) return;
    
    tree.innerHTML = '';
    originalPositions.clear();
    
    // Atualiza centro global para a vista explodida
    const box = new THREE.Box3().setFromObject(modelGroup);
    box.getCenter(globalCenter);
    
    let partCount = 0;
    document.querySelector('.viewport-container').classList.add('show-sidebar');

    // No mobile o painel inicia recolhido; no desktop, expandido
    const sidebar = document.getElementById('industrial-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (sidebar) {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            if (backdrop) backdrop.classList.add('backdrop-visible');
        }
    }
    modelGroup.traverse(child => {
        if (child.isMesh || child.isLine) {
            partCount++;
            originalPositions.set(child, child.position.clone());
            
            // Aplica plano de corte no material
            if (child.material) {
                child.material.clippingPlanes = [clipPlane];
                child.material.clipShadows = true;
                child.material.needsUpdate = true;
            }

            const item = document.createElement('div');
            item.className = 'tree-item';
            item.innerHTML = `<span>${child.name || child.userData.layer || 'Peça ' + partCount}</span> <i class="fa-solid fa-eye"></i>`;
            
            item.addEventListener('click', () => {
                child.visible = !child.visible;
                item.classList.toggle('hidden-part', !child.visible);
            });
            tree.appendChild(item);
        }
    });

    // Habilita/Desabilita Vista Explodida dependendo da quantidade de partes
    const explodeSlider = document.getElementById('explode-slider');
    if (explodeSlider) {
        explodeSlider.disabled = (partCount <= 1);
    }
}

// Reúne as estatísticas de uma malha (STL/OBJ/GLTF/PLY) e atualiza a barra + painel
function finalizeMeshModel(file) {
    const box = new THREE.Box3().setFromObject(modelGroup);
    const dims = box.getSize(new THREE.Vector3());
    const stats = getGeometryStats(modelGroup);

    document.getElementById('file-quick-info').textContent = `${fmtNum(stats.triangleCount)} tri`;

    const chips = [
        { label: 'Dimensões (mm)', value: `${fmtDec(dims.x)} × ${fmtDec(dims.y)} × ${fmtDec(dims.z)}` },
        { label: 'Triângulos', value: fmtNum(stats.triangleCount) },
        { label: 'Vértices', value: fmtNum(stats.vertexCount) },
    ];
    if (stats.volume > 0) chips.push({ label: 'Volume', value: `${fmtDec(stats.volume / 1000, 2)} cm³` });
    if (stats.area > 0) chips.push({ label: 'Área de superfície', value: `${fmtDec(stats.area / 100, 2)} cm²` });
    chips.push({ label: 'Tamanho do arquivo', value: formatBytes(file.size) });

    buildDetailChips(chips);
    showStats('OK');
    showLoading(false);
    buildComponentTree();
    onResize();
    resetView();
}

function finalizeDXFModel(file, entities) {
    const box = new THREE.Box3().setFromObject(modelGroup);
    const dims = box.getSize(new THREE.Vector3());

    document.getElementById('file-quick-info').textContent = `${fmtNum(entities.length)} entidades`;

    const chips = [
        { label: 'Dimensões (mm)', value: `${fmtDec(dims.x)} × ${fmtDec(dims.y)} × ${fmtDec(dims.z)}` },
        { label: 'Entidades', value: fmtNum(entities.length) },
        { label: 'Tamanho do arquivo', value: formatBytes(file.size) },
    ];
    buildDetailChips(chips);
    showStats('OK');
    showLoading(false);
    buildComponentTree();
    onResize();
    resetView();
}

function clearDetails() {
    document.getElementById('file-quick-info').textContent = '';
    buildDetailChips([]);
}

function handleLoadError(e) {
    showStats('Erro: ' + e.message);
    showLoading(false);
    clearDetails();
}

function showStats(text) {
    const el = document.getElementById('stats-overlay');
    el.textContent = text;
    el.classList.toggle('visible', !!text);
}

function closeFile() {
    while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
    document.getElementById('viewport').style.display = 'none';
    document.getElementById('upload-area').style.display = '';
    document.querySelector('.viewport-container').classList.remove('show-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.classList.remove('backdrop-visible');
    currentFile = null;
    showStats('');
    clearDetails();
    
    // Desliga auto-rotação
    if (isAutoRotate) toggleAutoRotate();
    
    // Limpa ferramentas de medição
    if (measureLine) { scene.remove(measureLine); measureLine = null; }
    measurePoints = [];
    isMeasuring = false;
    const btnMeasure = document.getElementById('btn-measure');
    if (btnMeasure) btnMeasure.classList.remove('active');
    const measureResult = document.getElementById('measure-result');
    if (measureResult) measureResult.textContent = '';
    document.getElementById('btn-clear-measure').style.display = 'none';
}

function loadFile(file) {
    currentFile = file;
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('viewport').style.display = '';
    
    // Se já tiver arquivo carregado, altera a label para indicar montagem
    const nameEl = document.getElementById('file-name');
    if (modelGroup.children.length > 0) {
        nameEl.textContent = nameEl.textContent + ' + ' + file.name;
    } else {
        nameEl.textContent = file.name;
    }
    
    clearDetails();
    showStats('Carregando...');
    showLoading(true);
    onResize();

    const ext = file.name.split('.').pop().toLowerCase();
    document.getElementById('file-badge').textContent = ext.toUpperCase();

    if (ext === 'stl') loadSTL(file);
    else if (ext === 'obj') loadOBJ(file);
    else if (ext === 'dxf') loadDXF(file);
    else if (ext === 'gltf' || ext === 'glb') loadGLTF(file);
    else if (ext === 'ply') loadPLY(file);
    else if (ext === 'sldprt' || ext === 'sldasm' || ext === 'slddrw') {
        showStats('Exporte como STL ou OBJ no SolidWorks');
        showLoading(false);
    } else {
        showStats('Formato não suportado');
        showLoading(false);
    }
}

async function loadSTL(file) {
    try {
        const buffer = await file.arrayBuffer();
        const loader = new STLLoader();
        const geo = loader.parse(buffer);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6, metalness: 0.3, roughness: 0.6,
            flatShading: true, side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = file.name;
        modelGroup.add(mesh);
        finalizeMeshModel(file);
    } catch (e) {
        handleLoadError(e);
    }
}

async function loadOBJ(file) {
    try {
        const text = await file.text();
        const loader = new OBJLoader();
        const obj = loader.parse(text);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6, metalness: 0.3, roughness: 0.6, side: THREE.DoubleSide
        });
        obj.traverse(child => {
            if (child.isMesh) {
                child.material = mat;
                if (!child.name) child.name = file.name;
            }
        });
        modelGroup.add(obj);
        finalizeMeshModel(file);
    } catch (e) {
        handleLoadError(e);
    }
}

async function loadGLTF(file) {
    try {
        const buffer = await file.arrayBuffer();
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.parse(buffer, '', resolve, reject);
        });
        
        // Mantém o material original, forçando apenas o DoubleSide
        gltf.scene.traverse(child => {
            if (child.isMesh && child.material) {
                child.material.side = THREE.DoubleSide;
            }
        });
        
        modelGroup.add(gltf.scene);
        finalizeMeshModel(file);
    } catch (e) {
        handleLoadError(e);
    }
}

async function loadPLY(file) {
    try {
        const buffer = await file.arrayBuffer();
        const loader = new PLYLoader();
        const geo = loader.parse(buffer);
        const mat = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6, metalness: 0.3, roughness: 0.6,
            flatShading: true, side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.name = file.name;
        modelGroup.add(mesh);
        finalizeMeshModel(file);
    } catch (e) {
        handleLoadError(e);
    }
}

async function loadDXF(file) {
    try {
        const text = await file.text();
        const entities = parseDXF(text);
        if (entities.length === 0) { showStats('Nenhuma entidade encontrada'); showLoading(false); return; }

        const group = new THREE.Group();
        group.name = file.name;
        const matLine = new THREE.LineBasicMaterial({ color: 0x8b5cf6 });
        const matPoint = new THREE.PointsMaterial({ color: 0x8b5cf6, size: 3 });

        const allPoints = [];

        for (const ent of entities) {
            let meshEnt = null;
            if (ent.type === 'LINE') {
                const geo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(ent.x1, ent.z1 || 0, ent.y1),
                    new THREE.Vector3(ent.x2, ent.z2 || 0, ent.y2)
                ]);
                meshEnt = new THREE.Line(geo, matLine);
            } else if (ent.type === 'CIRCLE') {
                const segs = 48;
                const pts = [];
                for (let i = 0; i <= segs; i++) {
                    const a = (i / segs) * Math.PI * 2;
                    pts.push(new THREE.Vector3(
                        ent.cx + ent.r * Math.cos(a), ent.cz || 0, ent.cy + ent.r * Math.sin(a)
                    ));
                }
                meshEnt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine);
            } else if (ent.type === 'ARC') {
                const segs = 48;
                const pts = [];
                const sa = ent.sa * Math.PI / 180;
                const ea = ent.ea * Math.PI / 180;
                const steps = Math.max(12, Math.floor(segs * Math.abs(ea - sa) / (Math.PI * 2)));
                for (let i = 0; i <= steps; i++) {
                    const a = sa + (ea - sa) * (i / steps);
                    pts.push(new THREE.Vector3(
                        ent.cx + ent.r * Math.cos(a), ent.cz || 0, ent.cy + ent.r * Math.sin(a)
                    ));
                }
                meshEnt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine);
            } else if (ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') {
                if (ent.vertices && ent.vertices.length > 1) {
                    const pts = ent.vertices.map(v =>
                        new THREE.Vector3(v.x, v.z || 0, v.y)
                    );
                    if (ent.closed) pts.push(pts[0].clone());
                    meshEnt = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine);
                }
            } else if (ent.type === 'POINT') {
                allPoints.push(new THREE.Vector3(ent.x, ent.z || 0, ent.y));
            }
            
            if (meshEnt) {
                meshEnt.userData = { layer: ent.layer };
                group.add(meshEnt);
            }
        }

        if (allPoints.length > 0) {
            const geo = new THREE.BufferGeometry().setFromPoints(allPoints);
            const pointsMesh = new THREE.Points(geo, matPoint);
            pointsMesh.userData = { layer: 'Pontos' };
            group.add(pointsMesh);
        }

        modelGroup.add(group);
        finalizeDXFModel(file, entities);
    } catch (e) {
        handleLoadError(e);
        showLoading(false);
    }
}

function parseDXF(text) {
    const lines = text.split(/\r?\n/);
    const pairs = [];
    for (let i = 0; i < lines.length - 1; i += 2) {
        const code = parseInt(lines[i].trim());
        const val = lines[i + 1].trim();
        if (!isNaN(code)) pairs.push({ code, val });
    }

    let inEntities = false, inBlock = false;
    const entities = [];

    for (let i = 0; i < pairs.length; i++) {
        const p = pairs[i];
        if (p.code === 0 && p.val === 'SECTION') {
            const next = pairs[i + 1];
            if (next && next.code === 2) {
                if (next.val === 'ENTITIES') inEntities = true;
                else if (next.val === 'BLOCKS') inBlock = true;
            }
            continue;
        }
        if (p.code === 0 && p.val === 'ENDSEC') { inEntities = false; inBlock = false; continue; }

        if (inEntities && p.code === 0 && p.val !== 'ENDBLK') {
            const ent = { type: p.val };
            entities.push(ent);
            let j = i + 1;
            while (j < pairs.length && !(pairs[j].code === 0 && ['LINE','CIRCLE','ARC','LWPOLYLINE','POLYLINE','POINT','TEXT','MTEXT','INSERT','SOLID','TRACE','3DFACE','VERTEX','SEQEND','ENDBLK','ELLIPSE','SPLINE','HATCH','DIMENSION','ATTRIB','ATTDEF','SHAPE','BODY','REGION','3DSOLID','SURFACE','MESH','LIGHT','CAMERA'].includes(pairs[j].val))) {
                const c = pairs[j].code;
                const v = pairs[j].val;
                if (c === 10) ent.x1 = parseFloat(v);
                else if (c === 20) ent.y1 = parseFloat(v);
                else if (c === 30) ent.z1 = parseFloat(v);
                else if (c === 11) ent.x2 = parseFloat(v);
                else if (c === 21) ent.y2 = parseFloat(v);
                else if (c === 31) ent.z2 = parseFloat(v);
                else if (c === 40) ent.r = parseFloat(v);
                else if (c === 50) ent.sa = parseFloat(v);
                else if (c === 51) ent.ea = parseFloat(v);
                else if (c === 70) ent.flags = parseInt(v);
                else if (c === 90) ent.count = parseInt(v);
                else if (c === 1) ent.text = v;
                else if (c === 8) ent.layer = v;
                j++;
            }
            if (ent.type === 'LWPOLYLINE') {
                ent.vertices = [];
                ent.closed = (ent.flags & 1) === 1;
                let k = i + 1;
                while (k < pairs.length && pairs[k].code !== 0) {
                    if (pairs[k].code === 10) {
                        const vx = parseFloat(pairs[k].val);
                        const vy = parseFloat(pairs[k + 1]?.val || '0');
                        if (pairs[k + 1]?.code === 20) {
                            ent.vertices.push({ x: vx, y: vy, z: 0 });
                            k += 2;
                            continue;
                        }
                    }
                    k++;
                }
            }
            if (ent.type === 'POLYLINE') {
                ent.vertices = [];
                ent.closed = (ent.flags & 1) === 1;
            }
            if (ent.type === 'VERTEX') {
                for (let k = entities.length - 2; k >= 0; k--) {
                    if (entities[k].type === 'POLYLINE') {
                        if (!entities[k].vertices) entities[k].vertices = [];
                        entities[k].vertices.push({ x: ent.x1 || 0, y: ent.y1 || 0, z: ent.z1 || 0 });
                        break;
                    }
                }
            }
        }
    }

    const filtered = [];
    for (const e of entities) {
        if (e.type === 'LINE' || e.type === 'CIRCLE' || e.type === 'ARC' || e.type === 'POINT') {
            filtered.push(e);
        } else if (e.type === 'LWPOLYLINE' && e.vertices && e.vertices.length > 0) {
            filtered.push(e);
        } else if (e.type === 'POLYLINE' && e.vertices && e.vertices.length > 0) {
            filtered.push(e);
        }
    }
    return filtered;
}

document.addEventListener('DOMContentLoaded', () => {
    if (typeof i18n !== 'undefined') i18n.translatePage();
    const t = document.getElementById('theme-toggle');
    if (localStorage.getItem('theme') === 'dark') { document.body.classList.add('dark-theme'); t.checked = true; }
    t.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        if (scene) scene.background = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0f0f');
    });

    initScene();
    const upload = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');

    upload.addEventListener('click', e => { if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'I') fileInput.click(); });
    upload.addEventListener('dragover', e => { e.preventDefault(); upload.classList.add('dragover'); });
    upload.addEventListener('dragleave', () => upload.classList.remove('dragover'));
    upload.addEventListener('drop', e => {
        e.preventDefault(); upload.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            Array.from(e.dataTransfer.files).forEach(file => loadFile(file));
        }
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            Array.from(fileInput.files).forEach(file => loadFile(file));
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'f' || e.key === 'F') resetView();
        if (e.key === 'w' || e.key === 'W') toggleWireframe();
        if (e.key === 'x' || e.key === 'X') toggleAxes();
        if (e.key === 'g' || e.key === 'G') toggleGrid();
        if (e.key === 'r' || e.key === 'R') toggleAutoRotate();
        if (e.key === 'c' || e.key === 'C') takeScreenshot();
    });

    // Evento: Abrir/Fechar painel industrial
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const industrialSidebar = document.getElementById('industrial-sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    
    function updateToggleBtn() {
        if (!sidebarToggleBtn || !industrialSidebar) return;
        const isDesktop = window.innerWidth > 768;
        const show = isDesktop && industrialSidebar.classList.contains('collapsed');
        sidebarToggleBtn.classList.toggle('visible', show);
    }
    
    function expandSidebar() {
        if (!industrialSidebar) return;
        industrialSidebar.classList.remove('collapsed');
        if (sidebarBackdrop && window.innerWidth > 768) {
            sidebarBackdrop.classList.add('backdrop-visible');
        }
        updateToggleBtn();
    }
    
    function collapseSidebar() {
        if (!industrialSidebar) return;
        industrialSidebar.classList.add('collapsed');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('backdrop-visible');
        updateToggleBtn();
    }
    
    if (sidebarToggle && industrialSidebar) {
        sidebarToggle.addEventListener('click', () => {
            const wasCollapsed = industrialSidebar.classList.toggle('collapsed');
            if (sidebarBackdrop && window.innerWidth > 768) {
                sidebarBackdrop.classList.toggle('backdrop-visible', !wasCollapsed);
            }
            updateToggleBtn();
        });
    }
    // Botão flutuante para reabrir
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', expandSidebar);
    }
    // Fechar sidebar ao clicar no backdrop (apenas desktop)
    if (sidebarBackdrop) {
        sidebarBackdrop.addEventListener('click', collapseSidebar);
    }
    // Fechar ao pressionar Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && industrialSidebar && !industrialSidebar.classList.contains('collapsed') && window.innerWidth > 768) {
            collapseSidebar();
        }
    });
    
    // Atualiza botão ao redimensionar
    window.addEventListener('resize', updateToggleBtn);
    
    // Atualiza botão após carregar modelo
    updateToggleBtn();

    // Evento: Vista Explodida
    const explodeSlider = document.getElementById('explode-slider');
    if (explodeSlider) {
        explodeSlider.addEventListener('input', (e) => {
            const factor = parseFloat(e.target.value);
            modelGroup.traverse(child => {
                if (originalPositions.has(child)) {
                    const orig = originalPositions.get(child);
                    const childBox = new THREE.Box3().setFromObject(child);
                    const childCenter = childBox.getCenter(new THREE.Vector3());
                    
                    const dir = childCenter.clone().sub(globalCenter).normalize();
                    if (dir.lengthSq() === 0) dir.set(0, 1, 0);
                    
                    const maxDim = new THREE.Box3().setFromObject(modelGroup).getSize(new THREE.Vector3()).length();
                    child.position.copy(orig).add(dir.multiplyScalar(maxDim * factor * 0.5));
                }
            });
        });
    }

    // Evento: Plano de Corte (Eixo X)
    const clipSlider = document.getElementById('clip-slider');
    if (clipSlider) {
        clipSlider.addEventListener('input', (e) => {
            clipPlane.constant = parseFloat(e.target.value);
        });
    }

    // Evento: Ferramenta de Medição
    const btnMeasure = document.getElementById('btn-measure');
    const threeContainer = document.getElementById('three-container');
    
    if (btnMeasure && threeContainer) {
        btnMeasure.addEventListener('click', () => {
            isMeasuring = !isMeasuring;
            btnMeasure.classList.toggle('active', isMeasuring);
            measurePoints = [];
            if (measureLine) { scene.remove(measureLine); measureLine = null; }
            
            const msg = isMeasuring ? 'Clique no 1º ponto...' : '';
            document.getElementById('measure-result').textContent = msg;
            
            if (isMeasuring) {
                showStats(msg);
                // Recolhe a barra no mobile para liberar o canvas para o clique
                if (window.innerWidth <= 768) {
                    document.getElementById('industrial-sidebar').classList.add('collapsed');
                }
            } else {
                showStats('');
            }
        });

        threeContainer.addEventListener('pointerdown', (e) => {
            if (!isMeasuring) return;
            
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(modelGroup, true);
            
            if (intersects.length > 0) {
                measurePoints.push(intersects[0].point);
                
                // depthTest: false faz o marcador aparecer SOBRE a peça, não escondido nela
                const markerMat = new THREE.MeshBasicMaterial({color: 0xff0000, depthTest: false});
                const marker = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), markerMat);
                marker.renderOrder = 999;
                marker.position.copy(intersects[0].point);
                scene.add(marker);

                if (measurePoints.length === 1) {
                    showStats('1º ponto marcado. Clique no 2º ponto...');
                } else if (measurePoints.length === 2) {
                    const dist = measurePoints[0].distanceTo(measurePoints[1]);
                    const resultText = `Distância: ${fmtDec(dist, 2)} mm`;
                    
                    document.getElementById('measure-result').textContent = resultText;
                    document.getElementById('btn-clear-measure').style.display = 'inline-flex';
                    showStats(resultText); // Mostra o resultado visível na tela
                    
                    // Linha visível através da malha
                    const matLine = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2, depthTest: false });
                    const geoLine = new THREE.BufferGeometry().setFromPoints(measurePoints);
                    measureLine = new THREE.Line(geoLine, matLine);
                    measureLine.renderOrder = 999;
                    scene.add(measureLine);
                    
                    isMeasuring = false;
                    btnMeasure.classList.remove('active');
                }
            }
        });
    }

    // Evento: Cor de Fundo
    const bgPicker = document.getElementById('bg-color-picker');
    if (bgPicker) {
        bgPicker.addEventListener('input', (e) => {
            changeBackground(e.target.value);
        });
    }
    const resetBg = document.getElementById('btn-reset-bg');
    if (resetBg) {
        resetBg.addEventListener('click', () => {
            const defaultBg = getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#0f0f0f';
            document.getElementById('bg-color-picker').value = defaultBg;
            changeBackground(defaultBg);
        });
    }

    // Evento: Limpar Medição
    const clearMeasureBtn = document.getElementById('btn-clear-measure');
    if (clearMeasureBtn) {
        clearMeasureBtn.addEventListener('click', clearMeasurement);
    }

    // Sincroniza ícone de fullscreen
    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
    });
});

window.closeFile = closeFile;
window.resetView = resetView;
window.toggleWireframe = toggleWireframe;
window.toggleAxes = toggleAxes;
window.toggleGrid = toggleGrid;
window.toggleAutoRotate = toggleAutoRotate;
window.takeScreenshot = takeScreenshot;
window.toggleFullscreen = toggleFullscreen;
window.clearMeasurement = clearMeasurement;
window.changeBackground = changeBackground;
