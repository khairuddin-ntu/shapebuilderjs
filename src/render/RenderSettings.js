export class RenderSettings2D {
    #points = [];

    get points() { return this.#points; }

    addPoint(point) {
        this.#points.push(point);
    }

    clear() {
        this.#points = [];
    }
}

export class RenderSettings3D {
    #indices = [];
    #vertices = [];
    #normals = [];
    #uvs = [];

    addIndices(...indices) {
        this.#indices.push(...indices);
    }

    addVertex(vertex) {
        this.#vertices.push(vertex.x, vertex.y, vertex.z);
    }

    addNormal(normal) {
        this.#normals.push(normal.x, normal.y, normal.z);
    }

    addUV(u, v) {
        this.#uvs.push(u, v);
    }

    clear() {
        this.#indices = [];
        this.#vertices = [];
        this.#normals = [];
        this.#uvs = [];
    }
}
