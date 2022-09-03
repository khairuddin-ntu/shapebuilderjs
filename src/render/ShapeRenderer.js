import * as THREE from 'three';
import ParametricGeometry from './ParametricGeometry';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

export default class ShapeRenderer {
    #renderer;
    #scene;
    #shape;
    #camera;

    constructor(canvasRef) {
        this.#setUpScene(canvasRef);
        //this.#drawGrid();
        this.update();
    }

    renderShape(xEquation, yEquation, zEquation, parameters, resolution) {
        switch (parameters.length) {
            case 1:
                this.#render2dShape(xEquation, yEquation, zEquation, parameters[0], resolution);
                return;
            case 2:
                this.#render3dShape(xEquation, yEquation, zEquation, parameters[0], parameters[1], resolution);
                return;
            default:
                console.log("renderShape: Invalid parameter count [" + parameters.length + "]. Not rendering shape");
                return;

        }
    }

    update = () => {
        this.#renderer.render(this.#scene, this.#camera);
        requestAnimationFrame(this.update);
    }

    rotateShape(x, y) {
        // rotateX() & rotateY() are not meant to be used for animation
        this.#scene.rotation.x += y / 100;
        this.#scene.rotation.y += x / 100;
    }

    #setUpScene(canvasRef) {
        this.#renderer = new THREE.WebGLRenderer({
            canvas: canvasRef,
            antialias: true,
        });
        this.#renderer.setSize(canvasRef.offsetWidth, canvasRef.offsetHeight);

        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color(0xffffff);

        this.#camera = new THREE.PerspectiveCamera(75, canvasRef.offsetWidth / canvasRef.offsetHeight, 0.1, 1000);
        this.#camera.translateZ(14);

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

    #render2dShape(xEquation, yEquation, zEquation, uParameter, resolution) {
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

    #render3dShape(xEquation, yEquation, zEquation, uParameter, vParameter, resolution) {
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

    #removeExistingShape() {
        if (this.#shape != null) {
            this.#shape.removeFromParent();
        }
    }
}