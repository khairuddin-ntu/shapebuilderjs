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
        
    }
}
