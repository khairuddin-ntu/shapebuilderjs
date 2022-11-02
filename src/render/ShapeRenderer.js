import * as THREE from 'three';
import TextGeometry from './geometries/TextGeometry';
import { TYPE_2D_RENDER, TYPE_3D_RENDER } from '../common/Constants';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
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

    renderShape(settings) {
        switch (settings.type) {
            case TYPE_2D_RENDER:
                this.#renderLine(settings);
                break;
            case TYPE_3D_RENDER:
                this.#render3d(settings);
                break;
            default:
                console.error("Invalid render data type");
                break;
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

    #renderLine(settings) {
        this.#removeExistingShape();

        const geometry = new THREE.BufferGeometry().setFromPoints(settings.points);
        this.#shape = new THREE.Line(geometry, SHAPE_2D_MATERIAL);
        this.#shapeGroup.add(this.#shape);
    }

    #render3d(settings) {
        this.#removeExistingShape();

        let geometry = new THREE.BufferGeometry();
        geometry.setIndex(settings.indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(settings.vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(settings.normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(settings.uvs, 2));

        this.#shape = new THREE.Mesh(geometry, SHAPE_3D_MATERIAL);
        this.#shapeGroup.add(this.#shape);
    }

    #removeExistingShape() {
        if (this.#shape) {
            this.#shape.removeFromParent();
        }
    }
}