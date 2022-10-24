export class RenderData2D {
    #points = [];

    get points() { return this.#points; }

    addPoint(point) {
        this.#points.push(point);
    }

    clear() {
        this.#points = [];
    }
}

export class RenderData3D {
    #indices = [];
    #vertices = [];
    #normals = [];
    #uvs = [];

    get indices() { return this.#indices; }

    get vertices() { return this.#vertices; }

    get normals() { return this.#normals; }

    get uvs() { return this.#uvs; }

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
