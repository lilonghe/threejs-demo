import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const gltfLoader = new GLTFLoader();

const modelPath = './bird.glb';
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}

const handleResize = (camera: THREE.PerspectiveCamera, render: THREE.WebGLRenderer, scene: THREE.Scene) => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    render.setSize(size.width, size.height);
    render.render(scene, camera);
}

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, render: THREE.WebGLRenderer, controls: OrbitControls;

const init = () => {
    // 1. Create Camera
    camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    camera.position.z = 2;

    // 2. Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue')

    // 3. Create obj
    // const geometry = new THREE.BoxGeometry(1,1,1);
    // const cube = new THREE.Mesh(geometry);

    gltfLoader.load(modelPath, (gltf) => {
        scene.add(gltf.scene)
    })
    
    // 4. Add obj to scene
    // scene.add(cube)

    // 5. Create Render
    render = new THREE.WebGLRenderer();
    render.setSize(size.width, size.height);
    render.setPixelRatio(window.devicePixelRatio);
    render.render(scene, camera);

    // 6. Append dom to body
    document.body.appendChild(render.domElement)

    // 7. Auto resize
    addEventListener('resize', () => handleResize(camera, render, scene))

    // 8. Add controls
    controls = new OrbitControls(camera, render.domElement)

    // 9. Add light
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(10, 50, 10);
    scene.add(dirLight)

    animate()
}

const animate = () => {
    render.render(scene, camera)

    requestAnimationFrame(animate)
}

addEventListener('load', init)