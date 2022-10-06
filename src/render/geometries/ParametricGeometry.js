/**
 * Adaptation of the ParametricGeometry class from three.js' example:
 * https://threejs.org/docs/#examples/en/geometries/ParametricGeometry
 */

import {
    BufferGeometry,
    Float32BufferAttribute,
    Vector3
} from 'three';

const EPS = 0.00001;

export default class ParametricGeometry extends BufferGeometry {
    constructor(func, params) {
        super();

        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        const startTime = Date.now();
        if (params.length === 2) {
            this.#generate2ParamPoints(
                indices, vertices, normals, uvs,
                func, params[0], params[1]
            );
        } else {
            this.#generate3ParamPoints(
                indices, vertices, normals, uvs,
                func, params[0], params[1], params[2]
            );
        }

        console.log("Time taken to generate points = " + (Date.now() - startTime) + "ms");

        // build geometry
        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    }

    #generate2ParamPoints(
        indices, vertices, normals, uvs,
        func, paramU, paramV
    ) {
        const normal = new Vector3();

        const p0 = new Vector3(), p1 = new Vector3();
        const pu = new Vector3(), pv = new Vector3();

        // generate vertices, normals and uvs
        const vCount = paramV.resolution + 1;

        let u, v;
        let a, b, c, d;
        for (let i = 0; i <= paramU.resolution; i++) {
            u = i / paramU.resolution;

            for (let j = 0; j <= paramV.resolution; j++) {
                v = j / paramV.resolution;

                // vertex
                func(u, v, p0);
                vertices.push(p0.x, p0.y, p0.z);

                // normal
                // approximate tangent vectors via finite differences
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

                // cross product of tangent vectors returns surface normal
                normal.crossVectors(pu, pv).normalize();
                normals.push(normal.x, normal.y, normal.z);

                // uv
                uvs.push(u, v);

                // generate indices
                if (i === paramU.resolution || j === paramV.resolution) {
                    continue
                }

                a = i * vCount + j;
                b = i * vCount + j + 1;
                c = (i + 1) * vCount + j + 1;
                d = (i + 1) * vCount + j;

                // Inner face
                indices.push(a, b, d);
                indices.push(b, c, d);
                // Outer face
                indices.push(d, b, a);
                indices.push(d, c, b);
            }
        }
    }

    #generate3ParamPoints(
        indices, vertices, normals, uvs,
        func, paramU, paramV, paramW
    ) {
        const normal = new Vector3();

        const p0 = new Vector3(), p1 = new Vector3();
        const pu = new Vector3(), pv = new Vector3(), pw = new Vector3();

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
                    // Outer face
                    indices.push(d, b, a);
                    indices.push(d, c, b);
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
                    // Outer face
                    indices.push(d, b, a);
                    indices.push(d, c, b);
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
                    // Outer face
                    indices.push(d, b, a);
                    indices.push(d, c, b);
                }
            }

            totalCount += (vCount * wCount);
        }
    }
}
