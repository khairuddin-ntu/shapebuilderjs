import * as THREE from 'three';
import ParametricGeometry from './ParametricGeometry';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const ROTATION_SPEED = Math.PI / 256;

export default class ShapeRenderer {
    #renderer;
    #scene;
    #camera;

    constructor(canvasRef) {
        this.#setUpScene(canvasRef);
        //this.#drawGrid();
        this.update();
    }

    render2dShape(xEquation, yEquation, zEquation, uParameter, resolution) {
        this.#removeExistingShape();

        this.#shape = new THREE.Group();

        let prevVector, currentVector;
        let points, geometry, line;

        for (let u = uParameter.start; u <= uParameter.end; u += uParameter.range / resolution) {
            currentVector = new THREE.Vector3(
                xEquation(u),
                yEquation(u),
                zEquation(u)
            );

            if (prevVector != null) {
                // Generate line segment from previous point to current point
                points = [prevVector, currentVector];
                geometry = new THREE.BufferGeometry().setFromPoints(points);
                line = new THREE.Line(geometry, SHAPE_2D_MATERIAL);
                this.#shape.add(line);
            }

            prevVector = currentVector;
        }

        this.#scene.add(this.#shape);
    }

    render3dShape(xEquation, yEquation, zEquation, uParameter, vParameter, resolution) {
        this.#removeExistingShape();

        const geometry = new ParametricGeometry(
            (u, v, target) => {
                u = uParameter.start + (uParameter.range * u);
                v = vParameter.start + (vParameter.range * v);

                target.set(
                    xEquation(u, v),
                    yEquation(u, v),
                    zEquation(u, v)
                );
            },
            resolution
        );
        this.#shape = new THREE.Mesh(geometry, SHAPE_3D_MATERIAL);
        this.#scene.add(this.#shape);
    }

    update = () => {
        this.#renderer.render(this.#scene, this.#camera);
        requestAnimationFrame(this.update);
    }

    rotateShape(x, y) {
        this.#scene.rotateX(y * ROTATION_SPEED);
        this.#scene.rotateY(-x * ROTATION_SPEED);
    }

    #setUpScene(canvasRef) {
        this.#renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: true,
        });
        this.#renderer.setSize(canvasRef.offsetWidth, canvasRef.offsetHeight);

        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color(0xffffff);

        this.#camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.#camera.translateZ(10);

        const light = new THREE.DirectionalLight();
        light.position.set(-1, 2, 4);
        this.#scene.add(light);
    }

    #drawGrid() {
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 });
        const gridGroup = new THREE.Group();

        let points;
        let geometry;
        let line;

        for (let x = -10; x <= 10; x++) {
            for (let y = -10; y <= 10; y++) {
                for (let z = -1; z <= 1; z++) {
                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(x, y, -z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    gridGroup.add(line);

                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(x, -y, z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    gridGroup.add(line);

                    points = [new THREE.Vector3(x, y, z), new THREE.Vector3(-x, y, z)];
                    geometry = new THREE.BufferGeometry().setFromPoints(points);
                    line = new THREE.Line(geometry, gridMaterial);
                    gridGroup.add(line);
                }
            }
        }

        this.#scene.add(gridGroup);
    }

    #removeExistingShape() {
        if (this.#shape != null) {
            this.#shape.removeFromParent();
        }
    }
}