import * as THREE from 'three';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });

export default class ShapeRenderer {
    #renderer;
    #scene;
    #camera;
    #group;

    constructor(canvasRef) {
        this.#setUpScene(canvasRef);
        this.#drawGrid();
        this.#render();
    }

    render2dShape(xEquation, yEquation, zEquation, tRange, tStep) {
        let xPrev, yPrev, zPrev;
        let x, y, z;
        let points, geometry, line;

        for (let t = tRange.start; t <= tRange.end; t += tStep) {
            x = xEquation(t);
            y = yEquation(t);
            z = zEquation(t);

            if (xPrev !== null) {
                points = [new THREE.Vector3(xPrev, yPrev, zPrev), new THREE.Vector3(x, y, z)];
                geometry = new THREE.BufferGeometry().setFromPoints(points);
                line = new THREE.Line(geometry, SHAPE_2D_MATERIAL);
                this.#group.add(line);
            }

            xPrev = x;
            yPrev = y;
            zPrev = z;
        }

        this.#render();
    }

    #setUpScene(canvasRef) {
        this.#renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: true,
        });
        this.#renderer.setSize(window.innerWidth, window.innerHeight);

        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color(0xffffff);

        this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.#camera.translateZ(10);

        const light = new THREE.DirectionalLight();
        light.position.set(-1, 2, 4);
        this.#scene.add(light);

        this.#group = new THREE.Group();
        this.#scene.add(this.#group);
    }

    #drawGrid() {
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });

        let points;
        let geometry;
        let line;

        for (let x = -10; x <= 10; x++) {
            for (let y = -10; y <= 10; y++) {
                for (let z = -1; z <= 1; z++) {
                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(x, y, -z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    this.#group.add(line);

                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(x, -y, z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    this.#group.add(line);

                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(-x, y, z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    this.#group.add(line);
                }
            }
        }
    }

    #render() {
        this.#renderer.render(this.#scene, this.#camera);
    }
}