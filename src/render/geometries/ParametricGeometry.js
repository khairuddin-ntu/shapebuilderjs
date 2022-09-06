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
    constructor(func, resolution) {
        super();

        // buffers
        const indices = [];
        const vertices = [];
        const normals = [];
        const uvs = [];

        const normal = new Vector3();

        const p0 = new Vector3(), p1 = new Vector3();
        const pu = new Vector3(), pv = new Vector3();

        // generate vertices, normals and uvs
        const sliceCount = resolution + 1;

        let u, v;
        let a, b, c, d;
        for (let i = 0; i <= resolution; i++) {
            u = i / resolution;

            for (let j = 0; j <= resolution; j++) {
                v = j / resolution;

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
                if (i === resolution || j === resolution) {
                    continue
                }

                a = i * sliceCount + j;
                b = i * sliceCount + j + 1;
                c = (i + 1) * sliceCount + j + 1;
                d = (i + 1) * sliceCount + j;

                // Inner face
                indices.push(a, b, d);
                indices.push(b, c, d);
                // Outer face
                indices.push(d, b, a);
                indices.push(d, c, b);
            }
        }

        // build geometry
        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));
    }
}
