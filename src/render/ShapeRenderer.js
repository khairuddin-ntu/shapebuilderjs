import * as THREE from 'three';
import { FileLoader } from 'three';
import ParametricGeometry from './geometries/ParametricGeometry';
import TextGeometry from './geometries/TextGeometry';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const AXES_MATERIAL = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const TEXT_MATERIAL = new THREE.MeshBasicMaterial({ color: 0x000000 });

export default class ShapeRenderer {
    #renderer;
    #scene;
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

    #loadFont(onComplete) {
        new FileLoader().load(
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
        this.#scene.add(axesGroup);
    }

    #drawAxis(axesGroup, axesType) {
        // Create line
        let geometry = new THREE.CylinderGeometry(0.2, 0.2, 10, 20);
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
        geometry = new THREE.ConeGeometry(0.5, 1, 20);
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
                mesh.translateZ(-5);
                mesh.rotateX(Math.PI * 3 / 2);
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
                mesh.translateZ(-6);
                break;
            default:
                break;
        }
        axesGroup.add(mesh);
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