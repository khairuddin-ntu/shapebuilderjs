/**
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float>, // how far from text outline (including bevelOffset) is bevel
 *  bevelOffset: <float> // how far from text outline does bevel start
 * }
 */

import {
    ExtrudeGeometry,
    ShapePath
} from 'three';

export default class TextGeometry extends ExtrudeGeometry {
    constructor(text, parameters = {}) {
        const fontData = parameters.fontData;
        if (fontData === undefined) {
            super(); // generate default extrude geometry
        } else {
            const shapes = generateShapes(text, parameters.size, fontData);

            // Set defaults if parameters are not set
            if (parameters.depth === undefined) parameters.depth = 50;
            if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10;
            if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
            if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false;

            super(shapes, parameters);
        }

        this.type = 'TextGeometry';
    }
}

function generateShapes(text, size = 100, data) {
    const shapes = [];

    const chars = Array.from(text);
    const scale = size / data.resolution;
    const line_height = (data.boundingBox.yMax - data.boundingBox.yMin + data.underlineThickness) * scale;

    let offsetX = 0, offsetY = 0;
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        if (char === '\n') {
            offsetX = 0;
            offsetY -= line_height;
        } else {
            const ret = createPath(char, scale, offsetX, offsetY, data);
            offsetX += ret.offsetX;
            shapes.push(...ret.path.toShapes());
        }
    }

    return shapes;
}

function createPath(char, scale, offsetX, offsetY, data) {
    const glyph = data.glyphs[char] || data.glyphs['?'];
    if (!glyph) {
        console.error('THREE.Font: character "' + char + '" does not exists in font family ' + data.familyName + '.');
        return;
    }

    const path = new ShapePath();
    let x, y, cpx, cpy, cpx1, cpy1, cpx2, cpy2;
    if (glyph.o) {
        const outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));
        for (let i = 0, l = outline.length; i < l;) {
            const action = outline[i++];
            switch (action) {
                case 'm': // moveTo
                    x = outline[i++] * scale + offsetX;
                    y = outline[i++] * scale + offsetY;

                    path.moveTo(x, y);
                    break;
                case 'l': // lineTo
                    x = outline[i++] * scale + offsetX;
                    y = outline[i++] * scale + offsetY;

                    path.lineTo(x, y);
                    break;
                case 'q': // quadraticCurveTo
                    cpx = outline[i++] * scale + offsetX;
                    cpy = outline[i++] * scale + offsetY;
                    cpx1 = outline[i++] * scale + offsetX;
                    cpy1 = outline[i++] * scale + offsetY;

                    path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
                    break;
                case 'b': // bezierCurveTo
                    cpx = outline[i++] * scale + offsetX;
                    cpy = outline[i++] * scale + offsetY;
                    cpx1 = outline[i++] * scale + offsetX;
                    cpy1 = outline[i++] * scale + offsetY;
                    cpx2 = outline[i++] * scale + offsetX;
                    cpy2 = outline[i++] * scale + offsetY;

                    path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
                    break;
                default:
                    break;
            }
        }
    }

    return { offsetX: glyph.ha * scale, path: path };
}
