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
let currentFile = null;

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
    document.querySelector('[data-action="wireframe"]')?.classList.toggle('active', isWireframe);
}

function toggleAxes() {
    isAxesVisible = !isAxesVisible;
    if (axesHelper) axesHelper.visible = isAxesVisible;
    document.querySelector('[data-action="axes"]')?.classList.toggle('active', isAxesVisible);
}

function showLoading(show) {
    document.getElementById('loading-overlay').classList.toggle('hidden', !show);
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
    currentFile = null;
    showStats('');
}

function loadFile(file) {
    currentFile = file;
    document.getElementById('upload-area').style.display = 'none';
    document.getElementById('viewport').style.display = '';
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-details').textContent = '';
    showStats('Carregando...');
    showLoading(true);

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
        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
        modelGroup.add(mesh);
        const verts = geo.attributes.position.count;
        const faces = verts / 3;
        document.getElementById('file-details').textContent = `${faces.toLocaleString()} triângulos`;
        showStats('OK');
        showLoading(false);
        resetView();
    } catch (e) {
        showStats('Erro: ' + e.message);
        showLoading(false);
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
            if (child.isMesh) child.material = mat;
        });
        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
        modelGroup.add(obj);
        let faceCount = 0;
        obj.traverse(c => { if (c.isMesh && c.geometry.attributes.position) faceCount += c.geometry.attributes.position.count / 3; });
        document.getElementById('file-details').textContent = `${faceCount.toLocaleString()} triângulos`;
        showStats('OK');
        showLoading(false);
        resetView();
    } catch (e) {
        showStats('Erro: ' + e.message);
        showLoading(false);
    }
}

async function loadGLTF(file) {
    try {
        const buffer = await file.arrayBuffer();
        const loader = new GLTFLoader();
        const gltf = await new Promise((resolve, reject) => {
            loader.parse(buffer, '', resolve, reject);
        });
        const mat = new THREE.MeshStandardMaterial({
            color: 0x8b5cf6, metalness: 0.3, roughness: 0.6, side: THREE.DoubleSide
        });
        gltf.scene.traverse(child => {
            if (child.isMesh) child.material = mat;
        });
        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
        modelGroup.add(gltf.scene);
        let faceCount = 0;
        gltf.scene.traverse(c => { if (c.isMesh && c.geometry.attributes.position) faceCount += c.geometry.attributes.position.count / 3; });
        document.getElementById('file-details').textContent = `${faceCount.toLocaleString()} triângulos`;
        showStats('OK');
        showLoading(false);
        resetView();
    } catch (e) {
        showStats('Erro: ' + e.message);
        showLoading(false);
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
        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
        modelGroup.add(mesh);
        const verts = geo.attributes.position ? geo.attributes.position.count : 0;
        const faces = verts / 3;
        document.getElementById('file-details').textContent = `${faces.toLocaleString()} triângulos`;
        showStats('OK');
        showLoading(false);
        resetView();
    } catch (e) {
        showStats('Erro: ' + e.message);
        showLoading(false);
    }
}

async function loadDXF(file) {
    try {
        const text = await file.text();
        const entities = parseDXF(text);
        if (entities.length === 0) { showStats('Nenhuma entidade encontrada'); showLoading(false); return; }

        const group = new THREE.Group();
        const matLine = new THREE.LineBasicMaterial({ color: 0x8b5cf6 });
        const matPoint = new THREE.PointsMaterial({ color: 0x8b5cf6, size: 3 });

        const allPoints = [];

        for (const ent of entities) {
            if (ent.type === 'LINE') {
                const geo = new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(ent.x1, ent.z1 || 0, ent.y1),
                    new THREE.Vector3(ent.x2, ent.z2 || 0, ent.y2)
                ]);
                group.add(new THREE.Line(geo, matLine));
            } else if (ent.type === 'CIRCLE') {
                const segs = 48;
                const pts = [];
                for (let i = 0; i <= segs; i++) {
                    const a = (i / segs) * Math.PI * 2;
                    pts.push(new THREE.Vector3(
                        ent.cx + ent.r * Math.cos(a), ent.cz || 0, ent.cy + ent.r * Math.sin(a)
                    ));
                }
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine));
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
                group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine));
            } else if (ent.type === 'LWPOLYLINE' || ent.type === 'POLYLINE') {
                if (ent.vertices && ent.vertices.length > 1) {
                    const pts = ent.vertices.map(v =>
                        new THREE.Vector3(v.x, v.z || 0, v.y)
                    );
                    if (ent.closed) pts.push(pts[0].clone());
                    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), matLine));
                }
            } else if (ent.type === 'POINT') {
                allPoints.push(new THREE.Vector3(ent.x, ent.z || 0, ent.y));
            }
        }

        if (allPoints.length > 0) {
            const geo = new THREE.BufferGeometry().setFromPoints(allPoints);
            group.add(new THREE.Points(geo, matPoint));
        }

        while (modelGroup.children.length) modelGroup.remove(modelGroup.children[0]);
        modelGroup.add(group);
        document.getElementById('file-details').textContent = `${entities.length} entidades`;
        showStats('OK');
        showLoading(false);
        resetView();
    } catch (e) {
        showStats('Erro: ' + e.message);
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
        if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) loadFile(fileInput.files[0]);
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'f' || e.key === 'F') resetView();
        if (e.key === 'w' || e.key === 'W') toggleWireframe();
        if (e.key === 'x' || e.key === 'X') toggleAxes();
    });
});

window.closeFile = closeFile;
window.resetView = resetView;
window.toggleWireframe = toggleWireframe;
window.toggleAxes = toggleAxes;
