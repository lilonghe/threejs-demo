import * as THREE from 'three'
import { Loader } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const gltfLoader = new GLTFLoader();

const modelPath = './butterfly.glb';
const size = {
    width: window.innerWidth,
    height: window.innerHeight
}
const mixers: THREE.AnimationMixer[] = [], clock = new THREE.Clock()

const handleResize = (camera: THREE.PerspectiveCamera, render: THREE.WebGLRenderer, scene: THREE.Scene) => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;

    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();

    render.setSize(size.width, size.height);
    render.render(scene, camera);
}

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, render: THREE.WebGLRenderer, controls: OrbitControls;

const loopCastShadow = (mesh: THREE.Object3D) => {
    mesh.castShadow = true
    for(let k in mesh.children) {
        mesh.children[k].castShadow = true
        if (mesh.children[k].children) {
            loopCastShadow(mesh.children[k])
        }
    }
}

const init = () => {
    // 1. Create Camera
    camera = new THREE.PerspectiveCamera(75, size.width / size.height, 1, 1000);
    camera.position.z = 20;

    // 2. Create Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('skyblue')

    // 3. Create obj
    // const geometry = new THREE.BoxGeometry(1,1,1);
    // const cube = new THREE.Mesh(geometry);

    gltfLoader.loadAsync(modelPath).then(gltf => {
        const mesh = gltf.scene.children[0];
        loopCastShadow(mesh);
        mesh.scale.set(15, 15, 15);

        const clip = gltf.animations[0];
        const mixer = new THREE.AnimationMixer(mesh);
        const action = mixer.clipAction(clip);
        mixers.push(mixer);
        action.play();

        scene.add(mesh)
    })
    
    // 4. Add obj to scene
    // scene.add(cube)

    // 5. Create Render
    render = new THREE.WebGLRenderer();
    render.setSize(size.width, size.height);
    render.setPixelRatio(window.devicePixelRatio);
    render.shadowMap.enabled = true;
    render.render(scene, camera);

    // 6. Append dom to body
    document.body.appendChild(render.domElement)

    // 7. Auto resize
    addEventListener('resize', () => handleResize(camera, render, scene))

    // 8. Add controls
    controls = new OrbitControls(camera, render.domElement)

    // 9. Add light
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 10, 0);
    light.castShadow = true;
    scene.add(light)

    // 10. Add plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100)
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    planeMaterial.color.setHSL( 0.095, 1, 0.75 );
    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.position.y = -10;
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
    scene.add(plane)

    animate()
}

const animate = () => {
    render.render(scene, camera)
    requestAnimationFrame(animate)

    let delta = clock.getDelta();
    mixers.forEach((_, i) => {
        mixers[i].update(delta)
    })
}

addEventListener('load', init)