import * as THREE from 'three';
import TextGeometry from './geometries/TextGeometry';
import * as FunctionProcessor from '../common/FunctionProcessor';

const SHAPE_2D_MATERIAL = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const SHAPE_3D_MATERIAL = new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
const AXES_MATERIAL = new THREE.MeshMatcapMaterial({ color: 0xffff00 });
const TEXT_MATERIAL = new THREE.MeshMatcapMaterial({ color: 0x000000 });

const EPS = 0.00001;

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

        const params = [{ name: uParameter.name, value: -1 }];

        let points = [];
        for (let u = uParameter.start; u <= uParameter.end; u += uParameter.range / uParameter.resolution) {
            params[0].value = u;
            points.push(new THREE.Vector3(
                FunctionProcessor.calculateValue(functions[0], params),
                FunctionProcessor.calculateValue(functions[1], params),
                FunctionProcessor.calculateValue(functions[2], params)
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.#shape = new THREE.Line(geometry, SHAPE_2D_MATERIAL);
        this.#shapeGroup.add(this.#shape);
    }

    #render3d(functions, parameters) {
        this.#removeExistingShape();

        const params = parameters.map((param) => ({ name: param.name, value: -1 }));

        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        const startTime = Date.now();
        if (parameters.length === 2) {
            this.#generate2ParamPoints(
                indices, vertices, normals, uvs,
                (u, v, target) => {
                    params[0].value = parameters[0].start + (parameters[0].range * u);
                    params[1].value = parameters[1].start + (parameters[1].range * v);

                    target.set(
                        FunctionProcessor.calculateValue(functions[0], params),
                        FunctionProcessor.calculateValue(functions[1], params),
                        FunctionProcessor.calculateValue(functions[2], params),
                    );
                }, parameters[0], parameters[1]
            );
        } else {
            this.#generate3ParamPoints(
                indices, vertices, normals, uvs,
                (u, v, w, target) => {
                    params[0].value = parameters[0].start + (parameters[0].range * u);
                    params[1].value = parameters[1].start + (parameters[1].range * v);
                    params[2].value = parameters[2].start + (parameters[2].range * w);

                    target.set(
                        FunctionProcessor.calculateValue(functions[0], params),
                        FunctionProcessor.calculateValue(functions[1], params),
                        FunctionProcessor.calculateValue(functions[2], params),
                    );
                }, parameters[0], parameters[1], parameters[2]
            );
        }
        console.log("Time taken to generate points = " + (Date.now() - startTime) + "ms");

        console.log(`Number of points = ${vertices.length}`);

        let geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        this.#shape = new THREE.Mesh(geometry, SHAPE_3D_MATERIAL);
        this.#shapeGroup.add(this.#shape);
    }

    #removeExistingShape() {
        if (this.#shape) {
            this.#shape.removeFromParent();
        }
    }

    #generate2ParamPoints(
        indices, vertices, normals, uvs,
        func, paramU, paramV
    ) {
        console.log("+++#generate2ParamPoints+++");

        // Buffers to avoid repeatedly creating Vector3 objects
        const normal = new THREE.Vector3();

        const p0 = new THREE.Vector3(), p1 = new THREE.Vector3();
        const pu = new THREE.Vector3(), pv = new THREE.Vector3();

        const vCount = paramV.resolution + 1;

        let u, v;
        let a, b, c, d;
        for (let i = 0; i <= paramU.resolution; i++) {
            u = i / paramU.resolution;

            for (let j = 0; j <= paramV.resolution; j++) {
                v = j / paramV.resolution;

                // Calculate vertex
                func(u, v, p0);
                vertices.push(p0.x, p0.y, p0.z);

                // Calculate normal
                // Approximate tangent vectors via finite differences
                if (u - EPS >= 0) {
                    func(u - EPS, v, p1);
                    pu.subVectors(p0, p1);
                } else {
                    func(u + EPS, v, p1);
                    pu.subVectors(p1, p0);
                }

                if (v - EPS >= 0) {
                    func(u, v - EPS, p1);
                    pv.subVectors(p0, p1);
                } else {
                    func(u, v + EPS, p1);
                    pv.subVectors(p1, p0);
                }

                // Cross product of tangent vectors returns surface normal
                normal.crossVectors(pu, pv).normalize();
                normals.push(normal.x, normal.y, normal.z);

                // Defines how texture should be mapped to surface
                uvs.push(u, v);

                // Generate indices
                if (i === paramU.resolution || j === paramV.resolution) {
                    continue
                }

                a = i * vCount + j;
                b = i * vCount + j + 1;
                c = (i + 1) * vCount + j + 1;
                d = (i + 1) * vCount + j;

                // Triangle 1
                indices.push(a, b, d);
                // Triangle 2
                indices.push(b, c, d);
            }
        }

        console.log("---#generate2ParamPoints---");
    }

    #generate3ParamPoints(
        indices, vertices, normals, uvs,
        func, paramU, paramV, paramW
    ) {
        const normal = new THREE.Vector3();

        const p0 = new THREE.Vector3(), p1 = new THREE.Vector3();
        const pu = new THREE.Vector3(), pv = new THREE.Vector3();

        // generate vertices, normals and uvs
        const uCount = paramU.resolution + 1;
        const vCount = paramV.resolution + 1;
        const wCount = paramW.resolution + 1;

        let i, j, k;
        let u, v, w;
        let a, b, c, d;
        let totalCount = 0;
        for (k = 0; k <= 1; k++) {
            w = k;

            for (i = 0; i <= paramU.resolution; i++) {
                u = i / paramU.resolution;

                for (j = 0; j <= paramV.resolution; j++) {
                    v = j / paramV.resolution;

                    // vertex
                    func(u, v, w, p0);
                    vertices.push(p0.x, p0.y, p0.z);

                    // normal
                    // approximate tangent vectors via finite differences
                    if (u - EPS >= 0) {
                        func(u - EPS, v, w, p1);
                        pu.subVectors(p0, p1);
                    } else {
                        func(u + EPS, v, w, p1);
                        pu.subVectors(p1, p0);
                    }

                    if (v - EPS >= 0) {
                        func(u, v - EPS, w, p1);
                        pv.subVectors(p0, p1);
                    } else {
                        func(u, v + EPS, w, p1);
                        pv.subVectors(p1, p0);
                    }

                    // cross product of tangent vectors returns surface normal
                    normal.crossVectors(pu, pv).normalize();
                    normals.push(normal.x, normal.y, normal.z);

                    // uv
                    uvs.push(u, v);

                    // generate indices
                    if (i === paramU.resolution || j === paramV.resolution) {
                        continue
                    }

                    a = i * vCount + j + totalCount;
                    b = i * vCount + j + totalCount + 1;
                    c = (i + 1) * vCount + j + totalCount + 1;
                    d = (i + 1) * vCount + j + totalCount;

                    // Inner face
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }

            totalCount += (uCount * vCount);
        }

        for (j = 0; j <= 1; j++) {
            v = j;

            for (i = 0; i <= paramU.resolution; i++) {
                u = i / paramU.resolution;

                for (k = 0; k <= paramW.resolution; k++) {
                    w = k / paramW.resolution;

                    // vertex
                    func(u, v, w, p0);
                    vertices.push(p0.x, p0.y, p0.z);

                    // normal
                    // approximate tangent vectors via finite differences
                    if (u - EPS >= 0) {
                        func(u - EPS, v, w, p1);
                        pu.subVectors(p0, p1);
                    } else {
                        func(u + EPS, v, w, p1);
                        pu.subVectors(p1, p0);
                    }

                    if (w - EPS >= 0) {
                        func(u, v, w - EPS, p1);
                        pv.subVectors(p0, p1);
                    } else {
                        func(u, v, w + EPS, p1);
                        pv.subVectors(p1, p0);
                    }

                    // cross product of tangent vectors returns surface normal
                    normal.crossVectors(pu, pv).normalize();
                    normals.push(normal.x, normal.y, normal.z);

                    // uv
                    uvs.push(u, w);

                    // generate indices
                    if (i === paramU.resolution || k === paramW.resolution) {
                        continue
                    }

                    a = i * wCount + k + totalCount;
                    b = i * wCount + k + totalCount + 1;
                    c = (i + 1) * wCount + k + totalCount + 1;
                    d = (i + 1) * wCount + k + totalCount;

                    // Inner face
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }

            totalCount += (uCount * wCount);
        }

        for (i = 0; i <= 1; i++) {
            u = i;

            for (j = 0; j <= paramV.resolution; j++) {
                v = j / paramV.resolution;

                for (k = 0; k <= paramW.resolution; k++) {
                    w = k / paramW.resolution;

                    // vertex
                    func(u, v, w, p0);
                    vertices.push(p0.x, p0.y, p0.z);

                    // normal
                    // approximate tangent vectors via finite differences
                    if (v - EPS >= 0) {
                        func(u, v - EPS, w, p1);
                        pu.subVectors(p0, p1);
                    } else {
                        func(u, v + EPS, w, p1);
                        pu.subVectors(p1, p0);
                    }

                    if (w - EPS >= 0) {
                        func(u, v, w - EPS, p1);
                        pv.subVectors(p0, p1);
                    } else {
                        func(u, v, w + EPS, p1);
                        pv.subVectors(p1, p0);
                    }

                    // cross product of tangent vectors returns surface normal
                    normal.crossVectors(pu, pv).normalize();
                    normals.push(normal.x, normal.y, normal.z);

                    // uv
                    uvs.push(v, w);

                    // generate indices
                    if (j === paramV.resolution || k === paramW.resolution) {
                        continue
                    }

                    a = j * wCount + k + totalCount;
                    b = j * wCount + k + totalCount + 1;
                    c = (j + 1) * wCount + k + totalCount + 1;
                    d = (j + 1) * wCount + k + totalCount;

                    // Inner face
                    indices.push(a, b, d);
                    indices.push(b, c, d);
                }
            }

            totalCount += (vCount * wCount);
        }
    }
}