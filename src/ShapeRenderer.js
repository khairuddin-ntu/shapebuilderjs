import * as THREE from 'three';

export default class ShapeRenderer {
    constructor(canvasRef) {
        // Set up scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xffffff);

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: false,
        });
        renderer.setSize(window.innerWidth, window.innerHeight);

        // Create lighting, material & shape
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        const light = new THREE.DirectionalLight();
        light.position.set(-1, 2, 4);

        // Add lighting & shape to scene
        scene.add(light);
        scene.add(cube);

        // Adjust camera position
        cube.rotateY(Math.PI / 4);
        camera.position.z = 2;

        // Add rendering components as class properties
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // Launch render loop
        this.update();
    }

    // ******************* RENDER LOOP ******************* //
    update() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update);
    }
}