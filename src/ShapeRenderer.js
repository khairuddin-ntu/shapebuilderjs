import * as THREE from 'three';

const SHAPE_NAME = "user_shape";
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

    render2dShape(xEquation, yEquation, zEquation, uParameter, resolution) {
        // Remove existing shape, if any
        const prevShape = this.#group.getObjectByName(SHAPE_NAME);
        if (prevShape != null) {
            console.log("Previous shape exists");
            prevShape.removeFromParent();
        }

        let prevVector, currentVector;
        let points, geometry, line;

        console.log(uParameter.range);

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
                line.name = SHAPE_NAME;
                this.#group.add(line);
            }

            prevVector = currentVector;
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