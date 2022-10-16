import * as THREE from 'three'

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

const init = () => {
    // 1. Create Camera
    const camera = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
    camera.position.z = 2;

    // 2. Create Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue')

    // 3. Create obj
    const geometry = new THREE.BoxGeometry(1,1,1);
    const cube = new THREE.Mesh(geometry);
    
    // 4. Add obj to scene
    scene.add(cube)

    // 5. Create Render
    const render = new THREE.WebGLRenderer();
    render.setSize(size.width, size.height);
    render.setPixelRatio(window.devicePixelRatio);
    render.render(scene, camera);

    // 6. Append dom to body
    document.body.appendChild(render.domElement)

    // 7. Auto resize
    addEventListener('resize', () => handleResize(camera, render, scene))
}

addEventListener('load', init)