import { Vector3 } from "three";
import parseFunctionInput from "../fields/functions/parser/FunctionParser";
import * as FunctionProcessor from "../common/FunctionProcessor";
import { TYPE_2D_RENDER, TYPE_3D_RENDER, FUNCTION_NAMES } from "../common/Constants";
import { isEmptyOrBlank } from "../common/StringUtils";
import ShapeGenError from "../common/ShapeGenError";

const EPS = 0.00001;

function generateRenderData(functionInputs, parameters) {
    const functions = [];

    let functionName;
    const startTime = Date.now();
    for (const [i, funcInput] of functionInputs.entries()) {
        functionName = FUNCTION_NAMES[i];

        if (isEmptyOrBlank(funcInput)) {
            postMessage([null, new ShapeGenError(`Function ${functionName}: Function cannot be blank`)]);
            return;
        }

        const [func, errorMessage] = parseFunctionInput(parameters, funcInput);
        if (errorMessage) {
            postMessage([null, new ShapeGenError(`Function ${functionName}: ${errorMessage}`)]);
            return;
        }

        if (!func) {
            postMessage([null, new ShapeGenError(`Function ${functionName}: Unknown error while parsing function`)]);
            return;
        }

        functions.push(func);
    }
    console.log("Time taken to parse functions = " + (Date.now() - startTime) + "ms");

    if (parameters.length === 1) {
        postMessage(generate2dShapeData(functions, parameters[0]));
    } else {
        postMessage(generate3dShapeData(functions, parameters));
    }
}

function generate2dShapeData(functions, parameter) {
    const renderData = { type: TYPE_2D_RENDER, points: [] };

    const params = [{ name: parameter.name, value: -1 }];
    for (let u = parameter.start; u <= parameter.end; u += parameter.range / parameter.resolution) {
        params[0].value = u;
        renderData.points.push(new Vector3(
            FunctionProcessor.calculateValue(functions[0], params),
            FunctionProcessor.calculateValue(functions[1], params),
            FunctionProcessor.calculateValue(functions[2], params)
        ));
    }

    return [renderData, null];
}

function generate3dShapeData(functions, parameters) {
    const renderData = { type: TYPE_3D_RENDER, indices: [], vertices: [], normals: [], uvs: [] };

    const params = parameters.map((param) => ({ name: param.name, value: -1 }));

    const startTime = Date.now();
    switch (parameters.length) {
        case 2:
            generate2ParamPoints(
                renderData,
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
            break;
        case 3:
            generate3ParamPoints(
                renderData,
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
            break;
        default:
            return [null, new ShapeGenError(`Unknown number of parameters. ${parameters.length} parameters found`)];
    }
    console.log("Time taken to generate points = " + (Date.now() - startTime) + "ms");

    return [renderData, null];
}

function generate2ParamPoints(renderData, func, paramU, paramV) {
    // Buffers to avoid repeatedly creating Vector3 objects
    const normal = new Vector3();

    const p0 = new Vector3(), p1 = new Vector3();
    const pu = new Vector3(), pv = new Vector3();

    const vCount = paramV.resolution + 1;

    let u, v;
    let a, b, c, d;
    for (let i = 0; i <= paramU.resolution; i++) {
        u = i / paramU.resolution;

        for (let j = 0; j <= paramV.resolution; j++) {
            v = j / paramV.resolution;

            // Calculate vertex
            func(u, v, p0);
            renderData.vertices.push(p0.x, p0.y, p0.z);

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
            renderData.normals.push(normal.x, normal.y, normal.z);

            // Defines how texture should be mapped to surface
            renderData.uvs.push(u, v);

            // Generate indices
            if (i === paramU.resolution || j === paramV.resolution) {
                continue
            }

            a = i * vCount + j;
            b = i * vCount + j + 1;
            c = (i + 1) * vCount + j + 1;
            d = (i + 1) * vCount + j;

            // Triangle 1
            renderData.indices.push(a, b, d);
            // Triangle 2
            renderData.indices.push(b, c, d);
        }
    }
}

function generate3ParamPoints(renderData, func, paramU, paramV, paramW) {
    const normal = new Vector3();

    const p0 = new Vector3(), p1 = new Vector3();
    const pu = new Vector3(), pv = new Vector3();

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
                renderData.vertices.push(p0.x, p0.y, p0.z);

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
                renderData.normals.push(normal.x, normal.y, normal.z);

                // uv
                renderData.uvs.push(u, v);

                // generate indices
                if (i === paramU.resolution || j === paramV.resolution) {
                    continue
                }

                a = i * vCount + j + totalCount;
                b = i * vCount + j + totalCount + 1;
                c = (i + 1) * vCount + j + totalCount + 1;
                d = (i + 1) * vCount + j + totalCount;

                // Inner face
                renderData.indices.push(a, b, d);
                renderData.indices.push(b, c, d);
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
                renderData.vertices.push(p0.x, p0.y, p0.z);

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
                renderData.normals.push(normal.x, normal.y, normal.z);

                // uv
                renderData.uvs.push(u, w);

                // generate indices
                if (i === paramU.resolution || k === paramW.resolution) {
                    continue
                }

                a = i * wCount + k + totalCount;
                b = i * wCount + k + totalCount + 1;
                c = (i + 1) * wCount + k + totalCount + 1;
                d = (i + 1) * wCount + k + totalCount;

                // Inner face
                renderData.indices.push(a, b, d);
                renderData.indices.push(b, c, d);
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
                renderData.vertices.push(p0.x, p0.y, p0.z);

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
                renderData.normals.push(normal.x, normal.y, normal.z);

                // uv
                renderData.uvs.push(v, w);

                // generate indices
                if (j === paramV.resolution || k === paramW.resolution) {
                    continue
                }

                a = j * wCount + k + totalCount;
                b = j * wCount + k + totalCount + 1;
                c = (j + 1) * wCount + k + totalCount + 1;
                d = (j + 1) * wCount + k + totalCount;

                // Inner face
                renderData.indices.push(a, b, d);
                renderData.indices.push(b, c, d);
            }
        }

        totalCount += (vCount * wCount);
    }
}

onmessage = (event) => {
    const {functionInputs, parameters} = event.data;
    generateRenderData(functionInputs, parameters);
};
