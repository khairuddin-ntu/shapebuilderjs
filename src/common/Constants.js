import Template from "./Template";
import Parameter from "./Parameter";

export const DEFAULT_RESOLUTION = 100;
export const FUNCTION_NAMES = ["x", "y", "z"];
export const BLANK_REGEX = /^\s*$/;
export const PRECENDENCE_MUL_DIV = 12;
export const PRECENDENCE_ADD_SUB = 11;
export const TYPE_2D_RENDER = "2d-render";
export const TYPE_3D_RENDER = "3d-render";

export const DEFAULT_FUNCTIONS = [
    "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
    "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
    "2.5sin(-pi/2+u*pi)"
];

export const TEMPLATES = [
    new Template(
        "Sine Wave",
        "sine_wave.png",
        [
            "8(2u-1)",
            "2sin(10u*pi)",
            "0"
        ],
        [
            new Parameter("u", 100)
        ]
    ),
    new Template(
        "Plane",
        "plane.png",
        [
            "3(2u-1)",
            "0",
            "3(2v-1)"
        ],
        [
            new Parameter("u", 10),
            new Parameter("v", 10)
        ]
    ),
    new Template(
        "Sphere (Surface)",
        "sphere.png",
        [
            "2.5cos(-pi/2+u*pi)cos(-pi+2v*pi)",
            "2.5cos(-pi/2+u*pi)sin(-pi+2v*pi)",
            "2.5sin(-pi/2+u*pi)"
        ],
        [
            new Parameter("u"),
            new Parameter("v")
        ]
    ),
    new Template(
        "Cube (Solid)",
        "cube.png",
        [
            "1.5(2u-1)",
            "1.5(2w-1)",
            "1.5(2v-1)"
        ],
        [
            new Parameter("u", 3),
            new Parameter("v", 3),
            new Parameter("w", 3)
        ]
    ),
];
