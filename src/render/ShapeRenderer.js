import * as THREE from 'three';
import ParametricGeometry from './geometries/ParametricGeometry';
import TextGeometry from './geometries/TextGeometry';
import * as FunctionProcessor from '../common/FunctionProcessor';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const AXES_MATERIAL = new THREE.MeshMatcapMaterial({ color: 0xffff00 });
const TEXT_MATERIAL = new THREE.MeshMatcapMaterial({ color: 0x000000 });

export default class ShapeRenderer {
    #renderer;
    #scene;
    #shapeGroup;
    #shape;
    #camera;
    #fontData;

    constructor(canvasRef) {
        this.#setUpScene(canvasRef);
        this.#loadFont(() => {
            this.#drawAxes();
            this.update();
        });
    }

    renderShape({ functions, parameters }) {
        if (parameters.length === 1) {
            this.#renderLine(functions, parameters[0]);
        } else {
            this.#render3d(functions, parameters);
        }
    }

    zoomBy(zoomAmount) {
        this.#camera.position.z += zoomAmount * 0.01;
    }

    update = () => {
        this.#renderer.render(this.#scene, this.#camera);
        requestAnimationFrame(this.update);
    }

    rotateShape(x, y) {
        // rotateX() & rotateY() are not meant to be used for animation
        this.#shapeGroup.rotation.x += y / 100;
        this.#shapeGroup.rotation.y += x / 100;
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
        light.intensity = 0.9;
        light.position.set(5, -7, -10);
        this.#scene.add(light);

        this.#shapeGroup = new THREE.Group();
        this.#scene.add(this.#shapeGroup);
    }

    #loadFont(onComplete) {
        new THREE.FileLoader().load(
            "./fonts/nunito_regular.json",
            (fileData) => {
                this.#fontData = JSON.parse(fileData);
                onComplete();
            }
        );
    }

    #drawAxes() {
        const axesGroup = new THREE.Group();

        this.#drawAxis(axesGroup, "x");
        this.#drawAxis(axesGroup, "y");
        this.#drawAxis(axesGroup, "z");

        this.#shapeGroup.add(axesGroup);
    }

    #drawAxis(axesGroup, axesType) {
        // Create line
        let geometry = new THREE.CylinderGeometry(0.1, 0.1, 10, 20);
        let mesh = new THREE.Mesh(geometry, AXES_MATERIAL);
        switch (axesType) {
            case "x":
                mesh.rotateZ(Math.PI / 2);
                break;
            case "z":
                mesh.rotateX(Math.PI / 2);
                break;
            default:
                break;
        }
        axesGroup.add(mesh);

        // Create arrow head
        geometry = new THREE.ConeGeometry(0.25, 0.5, 20);
        mesh = new THREE.Mesh(geometry, AXES_MATERIAL);
        switch (axesType) {
            case "x":
                mesh.translateX(5);
                mesh.rotateZ(Math.PI * 3 / 2);
                break;
            case "y":
                mesh.translateY(5);
                break;
            case "z":
                mesh.translateZ(5);
                mesh.rotateX(Math.PI / 2);
                break;
            default:
                break;
        }
        axesGroup.add(mesh);

        // Create text
        geometry = new TextGeometry(axesType, {
            fontData: this.#fontData,
            size: 0.5,
            depth: 0.1
        });
        mesh = new THREE.Mesh(geometry, TEXT_MATERIAL);
        switch (axesType) {
            case "x":
                mesh.translateX(6);
                mesh.translateY(-0.15);
                break;
            case "y":
                mesh.translateX(-0.15);
                mesh.translateY(6);
                break;
            case "z":
                mesh.translateX(-0.15);
                mesh.translateY(-0.15);
                mesh.translateZ(6);
                break;
            default:
                break;
        }
        axesGroup.add(mesh);
    }

    #renderLine(functions, uParameter) {
        this.#removeExistingShape();

        this.#shape = new THREE.Group();

        let prevVector, currentVector;
        let points, geometry, line;

        const params = [{ name: uParameter.name, value: -1 }];
        for (let u = uParameter.start; u <= uParameter.end; u += uParameter.range / uParameter.resolution) {
            params[0].value = u;
            currentVector = new THREE.Vector3(
                FunctionProcessor.calculateValue(functions[0], params),
                FunctionProcessor.calculateValue(functions[1], params),
                FunctionProcessor.calculateValue(functions[2], params)
            );

            if (prevVector) {
                // Generate line segment from previous point to current point
                points = [prevVector, currentVector];
                geometry = new THREE.BufferGeometry().setFromPoints(points);
                line = new THREE.Line(geometry, SHAPE_2D_MATERIAL);
                this.#shape.add(line);
            }

            prevVector = currentVector;
        }

        this.#shapeGroup.add(this.#shape);
    }

    #render3d(functions, parameters) {
        this.#removeExistingShape();

        const params = parameters.map((param) => ({ name: param.name, value: -1 }));

        let geometry;
        if (parameters.length === 2) {
            geometry = new ParametricGeometry(
                (u, v, target) => {
                    params[0].value = parameters[0].start + (parameters[0].range * u);
                    params[1].value = parameters[1].start + (parameters[1].range * v);

                    target.set(
                        FunctionProcessor.calculateValue(functions[0], params),
                        FunctionProcessor.calculateValue(functions[1], params),
                        FunctionProcessor.calculateValue(functions[2], params),
                    );
                }, parameters
            );
        } else {
            geometry = new ParametricGeometry(
                (u, v, w, target) => {
                    params[0].value = parameters[0].start + (parameters[0].range * u);
                    params[1].value = parameters[1].start + (parameters[1].range * v);
                    params[2].value = parameters[2].start + (parameters[2].range * w);

                    target.set(
                        FunctionProcessor.calculateValue(functions[0], params),
                        FunctionProcessor.calculateValue(functions[1], params),
                        FunctionProcessor.calculateValue(functions[2], params),
                    );
                }, parameters
            );
        }

        this.#shape = new THREE.Mesh(geometry, SHAPE_3D_MATERIAL);
        this.#shapeGroup.add(this.#shape);
    }

    #removeExistingShape() {
        if (this.#shape) {
            this.#shape.removeFromParent();
        }
    }
}